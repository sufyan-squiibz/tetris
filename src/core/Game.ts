import { TetrisPiece } from './Piece';
import { PieceFactory } from './PieceFactory';
import { Board, GameStats } from '../types';
import { GAME_CONFIG, SCORING } from '../config/constants';

export class TetrisGame {
  public board: Board;
  public currentPiece: TetrisPiece | null = null;
  public nextPieces: TetrisPiece[] = [];
  public holdPiece: TetrisPiece | null = null;
  public canHold: boolean = true;

  public gameOver: boolean = false;
  public paused: boolean = false;
  public started: boolean = false;

  public stats: GameStats = {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    tetrisCount: 0,
    piecesPlaced: 0,
    elapsedTime: 0,
  };

  private backToBack: boolean = false;
  private dropInterval: number = GAME_CONFIG.initialDropInterval;
  private dropCounter: number = 0;
  private startTime: number = 0;
  private pieceFactory: PieceFactory;

  // Callbacks pour les événements
  public onLinesClear?: (lines: number, rows: number[]) => void;
  public onPieceLock?: () => void;
  public onLevelUp?: (newLevel: number) => void;
  public onGameOver?: (stats: GameStats) => void;
  public onScoreUpdate?: (stats: GameStats) => void;

  constructor() {
    this.board = this.createEmptyBoard();
    this.pieceFactory = new PieceFactory();
    this.init();
  }

  private createEmptyBoard(): Board {
    return Array(GAME_CONFIG.rows).fill(null).map(() => 
      Array(GAME_CONFIG.cols).fill(0)
    );
  }

  public init(): void {
    this.board = this.createEmptyBoard();
    
    // Initialiser les pièces
    this.nextPieces = [
      this.pieceFactory.getRandomPiece(),
      this.pieceFactory.getRandomPiece(),
      this.pieceFactory.getRandomPiece(),
    ];
    this.currentPiece = this.pieceFactory.getRandomPiece();
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
    this.dropInterval = GAME_CONFIG.initialDropInterval;
    this.startTime = Date.now();
  }

  public start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
    }
  }

  public update(deltaTime: number): void {
    if (!this.started || this.paused || this.gameOver) return;

    // Mettre à jour le temps écoulé
    this.stats.elapsedTime = Date.now() - this.startTime;

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }
  }

  public dropPiece(_isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      this.onPieceLock?.();
      return true;
    }
    return false;
  }

  public movePiece(dx: number): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.x += dx;
    if (this.checkCollision()) {
      this.currentPiece.x -= dx;
      return false;
    }
    return true;
  }

  public rotatePiece(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotate();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    return true;
  }

  public rotatePieceReverse(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotateReverse();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    return true;
  }

  public hardDrop(): void {
    if (!this.currentPiece) return;

    let dropDistance = 0;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
      dropDistance++;
    }
    this.currentPiece.y--;
    dropDistance--;
    
    // Bonus pour hard drop
    this.stats.score += dropDistance * SCORING.HARD_DROP_BONUS;
    
    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    this.onPieceLock?.();
  }

  public holdCurrentPiece(): void {
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

  public checkCollision(piece?: TetrisPiece): boolean {
    const checkPiece = piece || this.currentPiece;
    if (!checkPiece) return true;

    const shape = checkPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = checkPiece.x + x;
          const boardY = checkPiece.y + y;

          if (
            boardX < 0 || 
            boardX >= GAME_CONFIG.cols || 
            boardY >= GAME_CONFIG.rows || 
            (boardY >= 0 && this.board[boardY][boardX] !== 0)
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
    
    for (let y = GAME_CONFIG.rows - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(GAME_CONFIG.cols).fill(0));
        linesCleared++;
        y++; // Re-check the same row
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);
      this.onLinesClear?.(linesCleared, clearedRows);
    } else {
      // Réinitialiser le combo si aucune ligne n'est effacée
      this.stats.combo = 0;
      this.backToBack = false;
    }
    
    return linesCleared;
  }

  private updateScore(linesCleared: number): void {
    let points = SCORING.LINES[linesCleared] * this.stats.level;
    
    // Bonus Tetris (4 lignes)
    if (linesCleared === 4) {
      this.stats.tetrisCount++;
      if (this.backToBack) {
        points *= SCORING.BACK_TO_BACK_MULTIPLIER;
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }
    
    // Bonus combo
    if (linesCleared > 0) {
      this.stats.combo++;
      points += (this.stats.combo - 1) * SCORING.COMBO_BONUS * this.stats.level;
      
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    }
    
    this.stats.score += points;
    this.stats.lines += linesCleared;
    
    // Level up
    const previousLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.lines / SCORING.LINES_PER_LEVEL) + 1;
    this.dropInterval = Math.max(
      GAME_CONFIG.minDropInterval, 
      GAME_CONFIG.initialDropInterval - (this.stats.level - 1) * GAME_CONFIG.levelSpeedIncrease
    );
    
    this.onScoreUpdate?.(this.stats);
    
    if (this.stats.level > previousLevel) {
      this.onLevelUp?.(this.stats.level);
    }
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(this.pieceFactory.getRandomPiece());
    
    if (this.checkCollision()) {
      this.gameOver = true;
      this.onGameOver?.(this.stats);
    }
  }

  public togglePause(): void {
    this.paused = !this.paused;
  }

  public getGhostPiece(): TetrisPiece | null {
    if (!this.currentPiece) return null;

    const ghost = this.currentPiece.clone();
    while (!this.checkCollision(ghost)) {
      ghost.y++;
    }
    ghost.y--;
    
    return ghost;
  }

  public getPPS(): number {
    if (this.stats.elapsedTime === 0) return 0;
    return this.stats.piecesPlaced / (this.stats.elapsedTime / 1000);
  }

  public updatePieceColors(colors: Record<string, number>): void {
    this.pieceFactory.updateColors(colors);
  }
}
