// Logique principale du jeu Tetris en TypeScript

import { TetrisPiece, getRandomPiece } from './pieces';
import { PixiRenderer } from './renderer';
import { COLS, ROWS, INITIAL_DROP_INTERVAL, MIN_DROP_INTERVAL, DROP_INTERVAL_DECREASE, SCORE_VALUES, LINES_PER_LEVEL } from './constants';
import type { Board, GameStats, HighScore } from './types';

export class TetrisGame {
  // État du plateau
  private board: Board;
  private currentPiece: TetrisPiece | null;
  private nextPieces: TetrisPiece[];
  private holdPiece: TetrisPiece | null;
  private canHold: boolean;

  // État du jeu
  private gameOver: boolean;
  private paused: boolean;
  private started: boolean;

  // Statistiques
  private stats: GameStats;
  private backToBack: boolean;

  // Timing
  private dropInterval: number;
  private dropCounter: number;
  private lastTime: number;
  private startTime: number;

  // Scores élevés
  private highScores: HighScore[];

  // Renderer
  private renderer: PixiRenderer;

  // Callbacks
  private onStatsUpdate?: (stats: GameStats) => void;
  private onGameOver?: (stats: GameStats) => void;
  private onLevelUp?: (level: number) => void;
  private onLinesClear?: (lines: number, combo: number) => void;

  constructor(renderer: PixiRenderer) {
    this.renderer = renderer;
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    this.currentPiece = null;
    this.nextPieces = [];
    this.holdPiece = null;
    this.canHold = true;

    this.gameOver = false;
    this.paused = false;
    this.started = false;

    this.stats = {
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      maxCombo: 0,
      tetrisCount: 0,
      piecesPlaced: 0,
      elapsedTime: 0
    };

    this.backToBack = false;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.dropCounter = 0;
    this.lastTime = 0;
    this.startTime = 0;

    this.highScores = [];

    this.init();
  }

  private init(): void {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    
    // Initialiser les pièces
    this.nextPieces = [getRandomPiece(), getRandomPiece(), getRandomPiece()];
    this.currentPiece = getRandomPiece();
    this.holdPiece = null;
    this.canHold = true;
    
    // Réinitialiser les stats
    this.gameOver = false;
    this.paused = false;
    this.started = false;
    this.stats = {
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      maxCombo: 0,
      tetrisCount: 0,
      piecesPlaced: 0,
      elapsedTime: 0
    };
    this.backToBack = false;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.startTime = Date.now();

    this.notifyStatsUpdate();
  }

  start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.update(performance.now());
    }
  }

  update(time: number): void {
    if (!this.started) return;
    
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) {
      if (!this.gameOver && this.started) {
        requestAnimationFrame(this.update.bind(this));
      }
      return;
    }

    // Mettre à jour le temps écoulé
    this.stats.elapsedTime = Date.now() - this.startTime;

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  dropPiece(_isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      return true;
    }
    return false;
  }

  movePiece(dx: number): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.x += dx;
    if (this.checkCollision()) {
      this.currentPiece.x -= dx;
      return false;
    }
    return true;
  }

  rotatePiece(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotate();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    return true;
  }

  rotatePieceReverse(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotateReverse();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    return true;
  }

  hardDrop(): void {
    if (!this.currentPiece) return;

    let dropDistance = 0;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
      dropDistance++;
    }
    this.currentPiece.y--;
    dropDistance--;
    
    // Bonus pour hard drop
    this.stats.score += dropDistance * SCORE_VALUES.HARD_DROP;
    
    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
  }

  holdCurrentPiece(): void {
    if (!this.canHold || !this.currentPiece) return;
    
    if (this.holdPiece === null) {
      this.holdPiece = this.currentPiece;
      this.spawnPiece();
    } else {
      const temp = this.holdPiece;
      this.holdPiece = this.currentPiece;
      this.currentPiece = temp;
      this.currentPiece.reset();
    }
    
    this.canHold = false;
  }

  private checkCollision(): boolean {
    if (!this.currentPiece) return false;

    const shape = this.currentPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = this.currentPiece.x + x;
          const boardY = this.currentPiece.y + y;

          if (boardX < 0 || boardX >= COLS || 
              boardY >= ROWS || 
              (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private lockPiece(): void {
    if (!this.currentPiece) return;

    const shape = this.currentPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;
          
          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color as any;
          }
        }
      }
    }
    
    this.stats.piecesPlaced++;
    this.canHold = true;
  }

  private clearLines(): number {
    let linesCleared = 0;
    const clearedRows: number[] = [];
    
    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);
      this.onLinesClear?.(linesCleared, this.stats.combo);
    } else {
      this.stats.combo = 0;
      this.backToBack = false;
    }
    
    return linesCleared;
  }

  private updateScore(linesCleared: number): void {
    const basePoints = [0, SCORE_VALUES.SINGLE, SCORE_VALUES.DOUBLE, SCORE_VALUES.TRIPLE, SCORE_VALUES.TETRIS];
    let points = basePoints[linesCleared] * this.stats.level;
    
    // Bonus Tetris
    if (linesCleared === 4) {
      this.stats.tetrisCount++;
      if (this.backToBack) {
        points *= SCORE_VALUES.BACK_TO_BACK_MULTIPLIER;
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }
    
    // Bonus combo
    if (linesCleared > 0) {
      this.stats.combo++;
      points += (this.stats.combo - 1) * SCORE_VALUES.COMBO_BONUS * this.stats.level;
      
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    }
    
    this.stats.score += points;
    this.stats.lines += linesCleared;
    
    // Level up
    const previousLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.lines / LINES_PER_LEVEL) + 1;
    this.dropInterval = Math.max(MIN_DROP_INTERVAL, INITIAL_DROP_INTERVAL - (this.stats.level - 1) * DROP_INTERVAL_DECREASE);
    
    if (this.stats.level > previousLevel) {
      this.onLevelUp?.(this.stats.level);
    }

    this.notifyStatsUpdate();
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(getRandomPiece());
    
    if (this.checkCollision()) {
      this.gameOver = true;
      this.onGameOver?.(this.stats);
    }
  }

  private draw(): void {
    this.renderer.render(this.board, this.currentPiece);
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  resetGame(): void {
    this.init();
  }

  // Getters
  getBoard(): Board {
    return this.board;
  }

  getCurrentPiece(): TetrisPiece | null {
    return this.currentPiece;
  }

  getNextPieces(): TetrisPiece[] {
    return this.nextPieces;
  }

  getHoldPiece(): TetrisPiece | null {
    return this.holdPiece;
  }

  getStats(): GameStats {
    return { ...this.stats };
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  isPaused(): boolean {
    return this.paused;
  }

  isStarted(): boolean {
    return this.started;
  }

  // Setters pour les callbacks
  setOnStatsUpdate(callback: (stats: GameStats) => void): void {
    this.onStatsUpdate = callback;
  }

  setOnGameOver(callback: (stats: GameStats) => void): void {
    this.onGameOver = callback;
  }

  setOnLevelUp(callback: (level: number) => void): void {
    this.onLevelUp = callback;
  }

  setOnLinesClear(callback: (lines: number, combo: number) => void): void {
    this.onLinesClear = callback;
  }

  private notifyStatsUpdate(): void {
    this.onStatsUpdate?.(this.getStats());
  }

  // High scores
  async loadHighScores(): Promise<void> {
    try {
      const response = await fetch('/api/scores');
      this.highScores = await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.highScores = [];
    }
  }

  async saveScore(name: string): Promise<boolean> {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          score: this.stats.score,
          level: this.stats.level,
          lines: this.stats.lines
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.highScores = result.highScores;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }

  getHighScores(): HighScore[] {
    return this.highScores;
  }

  isHighScore(score: number): boolean {
    return this.highScores.length < 10 || score > (this.highScores[this.highScores.length - 1]?.score ?? 0);
  }
}
