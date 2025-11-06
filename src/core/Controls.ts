import { TetrisGame } from './Game';
import { CONTROLS } from '../config/constants';

export class ControlsManager {
  private keys: Map<string, boolean> = new Map();
  private lastMoveTime = { left: 0, right: 0, down: 0 };
  private moveDelay: number = 30;
  private animationFrameId: number | null = null;

  constructor(private game: TetrisGame) {
    this.loadSensitivity();
  }

  public init(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.startContinuousLoop();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const code = event.code;
    
    if (this.isControlKey(code)) {
      event.preventDefault();
    }
    
    if (!this.keys.get(code)) {
      this.keys.set(code, true);
      this.handleSingleInput(code);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.code, false);
  }

  private isControlKey(code: string): boolean {
    return Object.values(CONTROLS).includes(code as any);
  }

  private handleSingleInput(key: string): void {
    if (this.game.paused || this.game.gameOver) {
      if (key === CONTROLS.PAUSE && this.game.started) {
        this.game.togglePause();
      }
      return;
    }

    if (!this.game.started) return;

    switch (key) {
      case CONTROLS.ROTATE:
        this.game.rotatePiece();
        break;
      case CONTROLS.ROTATE_REVERSE:
        this.game.rotatePieceReverse();
        break;
      case CONTROLS.HARD_DROP:
      case CONTROLS.ENTER:
        this.game.hardDrop();
        break;
      case CONTROLS.HOLD:
        this.game.holdCurrentPiece();
        break;
      case CONTROLS.PAUSE:
        this.game.togglePause();
        break;
    }
  }

  private startContinuousLoop(): void {
    const loop = () => {
      this.handleContinuousInput();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  private handleContinuousInput(): void {
    if (this.game.paused || this.game.gameOver || !this.game.started) return;

    const now = Date.now();

    if (this.keys.get(CONTROLS.LEFT)) {
      if (now - this.lastMoveTime.left >= this.moveDelay) {
        this.game.movePiece(-1);
        this.lastMoveTime.left = now;
      }
    }

    if (this.keys.get(CONTROLS.RIGHT)) {
      if (now - this.lastMoveTime.right >= this.moveDelay) {
        this.game.movePiece(1);
        this.lastMoveTime.right = now;
      }
    }

    if (this.keys.get(CONTROLS.DOWN)) {
      if (now - this.lastMoveTime.down >= this.moveDelay) {
        this.game.dropPiece(true);
        this.lastMoveTime.down = now;
      }
    }
  }

  public setSensitivity(value: number): void {
    this.moveDelay = value;
    localStorage.setItem('tetris-sensitivity', value.toString());
  }

  private loadSensitivity(): void {
    const saved = localStorage.getItem('tetris-sensitivity');
    if (saved) {
      this.moveDelay = parseInt(saved, 10);
    }
  }

  public getSensitivity(): number {
    return this.moveDelay;
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
