import { GAME_CONFIG, IGameStats, IHighScore } from '../types';
import { TetrisPiece, getRandomPiece } from './TetrisPiece';
import { PixiRenderer } from '../renderer/PixiRenderer';
import { PreviewRenderer } from '../renderer/PreviewRenderer';

const { COLS, ROWS, INITIAL_DROP_INTERVAL, MIN_DROP_INTERVAL, DROP_SPEED_INCREASE, LINES_PER_LEVEL } = GAME_CONFIG;

export class TetrisGame {
  // État du jeu
  private board: string[][];
  private currentPiece: TetrisPiece | null = null;
  private nextPieces: TetrisPiece[] = [];
  private holdPiece: TetrisPiece | null = null;
  private canHold: boolean = true;

  // État de jeu
  private gameOver: boolean = false;
  private paused: boolean = false;
  private started: boolean = false;

  // Stats
  private stats: IGameStats = {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    tetrisCount: 0,
    piecesPlaced: 0,
    elapsedTime: 0,
  };

  // Timing
  private dropInterval: number = INITIAL_DROP_INTERVAL;
  private dropCounter: number = 0;
  private lastTime: number = 0;
  private startTime: number = 0;
  private backToBack: boolean = false;

  // Renderers
  private mainRenderer: PixiRenderer;
  private nextRenderers: PreviewRenderer[] = [];
  private holdRenderer: PreviewRenderer | null = null;

  // High scores
  private highScores: IHighScore[] = [];

  // Callbacks
  private onStatsUpdate?: (stats: IGameStats) => void;
  private onGameOver?: (stats: IGameStats) => void;
  private onAudioEvent?: (event: string) => void;
  private onParticleEvent?: (event: string, data: any) => void;

  constructor(gameCanvas: HTMLCanvasElement) {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill('0'));
    this.mainRenderer = new PixiRenderer(gameCanvas);
    this.init();
  }

  init(): void {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill('0'));
    
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
      elapsedTime: 0,
    };
    this.backToBack = false;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.startTime = Date.now();

    this.updateStats();
  }

  start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.update();
    }
  }

  update(time: number = 0): void {
    if (!this.started) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) return;

    // Mettre à jour le temps écoulé
    this.stats.elapsedTime = Date.now() - this.startTime;
    this.updateStats();

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  dropPiece(isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      this.onAudioEvent?.('drop');
      return true;
    }
    if (isManual) {
      this.onAudioEvent?.('move');
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
    this.onAudioEvent?.('move');
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
    this.onAudioEvent?.('rotate');
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
    this.onAudioEvent?.('rotate');
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
    this.stats.score += dropDistance * 2;

    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    this.onAudioEvent?.('drop');
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
    this.updateHoldDisplay();
    this.onAudioEvent?.('move');
  }

  private checkCollision(): boolean {
    if (!this.currentPiece) return false;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = this.currentPiece.x + x;
          const boardY = this.currentPiece.y + y;

          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && this.board[boardY][boardX] !== '0')
          ) {
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
            this.board[boardY][boardX] = this.currentPiece.color;
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
      if (this.board[y].every((cell) => cell !== '0')) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill('0'));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);

      // Effets visuels
      this.onParticleEvent?.('lineExplosion', { rows: clearedRows, color: this.currentPiece?.color });

      if (linesCleared === 4) {
        this.onParticleEvent?.('tetrisExplosion', { rows: clearedRows, color: '#FFD700' });
      }

      // Afficher le combo
      if (this.stats.combo > 1) {
        this.onParticleEvent?.('combo', { combo: this.stats.combo });
      }
    } else {
      this.stats.combo = 0;
      this.backToBack = false;
    }

    return linesCleared;
  }

  private updateScore(linesCleared: number): void {
    const basePoints = [0, 100, 300, 500, 800];
    let points = basePoints[linesCleared] * this.stats.level;

    // Bonus Tetris (4 lignes)
    if (linesCleared === 4) {
      this.stats.tetrisCount++;
      if (this.backToBack) {
        points *= 1.5;
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }

    // Bonus combo
    if (linesCleared > 0) {
      this.stats.combo++;
      points += (this.stats.combo - 1) * 50 * this.stats.level;

      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    }

    this.stats.score += points;
    this.stats.lines += linesCleared;

    // Level up
    const previousLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.lines / LINES_PER_LEVEL) + 1;
    this.dropInterval = Math.max(MIN_DROP_INTERVAL, INITIAL_DROP_INTERVAL - (this.stats.level - 1) * DROP_SPEED_INCREASE);

    this.updateStats();

    if (this.stats.level > previousLevel) {
      this.onAudioEvent?.('levelup');
      this.onParticleEvent?.('levelUp', {});
    } else if (linesCleared > 0) {
      this.onAudioEvent?.('clear');
    }
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(getRandomPiece());
    this.updateNextPieces();

    if (this.checkCollision()) {
      this.gameOver = true;
      this.onGameOver?.(this.stats);
      this.onAudioEvent?.('gameover');
    }
  }

  private updateStats(): void {
    this.onStatsUpdate?.(this.stats);
  }

  private updateNextPieces(): void {
    this.nextRenderers.forEach((renderer, i) => {
      renderer.renderPiece(this.nextPieces[i], i === 0 ? 25 : 20);
    });
  }

  private updateHoldDisplay(): void {
    this.holdRenderer?.renderPiece(this.holdPiece);
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  resetGame(): void {
    this.init();
    this.started = false;
  }

  draw(): void {
    this.mainRenderer.render(this.board, this.currentPiece, this.gameOver);
  }

  // Setters pour callbacks
  setOnStatsUpdate(callback: (stats: IGameStats) => void): void {
    this.onStatsUpdate = callback;
  }

  setOnGameOver(callback: (stats: IGameStats) => void): void {
    this.onGameOver = callback;
  }

  setOnAudioEvent(callback: (event: string) => void): void {
    this.onAudioEvent = callback;
  }

  setOnParticleEvent(callback: (event: string, data: any) => void): void {
    this.onParticleEvent = callback;
  }

  setNextRenderers(renderers: PreviewRenderer[]): void {
    this.nextRenderers = renderers;
    this.updateNextPieces();
  }

  setHoldRenderer(renderer: PreviewRenderer): void {
    this.holdRenderer = renderer;
    this.updateHoldDisplay();
  }

  // Getters
  isPaused(): boolean {
    return this.paused;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  isStarted(): boolean {
    return this.started;
  }

  getStats(): IGameStats {
    return { ...this.stats };
  }

  // API pour les high scores
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          score: this.stats.score,
          level: this.stats.level,
          lines: this.stats.lines,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        this.highScores = result.highScores;
        localStorage.setItem('tetris-player-name', name);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }

  getHighScores(): IHighScore[] {
    return [...this.highScores];
  }

  isHighScore(score: number): boolean {
    return this.highScores.length < 10 || score > (this.highScores[this.highScores.length - 1]?.score ?? 0);
  }

  destroy(): void {
    this.mainRenderer.destroy();
    this.nextRenderers.forEach(r => r.destroy());
    this.holdRenderer?.destroy();
  }
}
