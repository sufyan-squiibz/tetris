import { IControls } from '../types';
import { TetrisGame } from '../game/TetrisGame';

const CONTROLS: IControls = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp',
  ROTATE_REVERSE: 'KeyZ',
  HARD_DROP: 'Space',
  HOLD: 'KeyC',
  PAUSE: 'KeyP',
};

const CONTROL_KEY_SET = new Set([
  CONTROLS.LEFT,
  CONTROLS.RIGHT,
  CONTROLS.DOWN,
  CONTROLS.ROTATE,
  CONTROLS.ROTATE_REVERSE,
  CONTROLS.HARD_DROP,
  CONTROLS.HOLD,
  CONTROLS.PAUSE,
  'Enter',
]);

export class ControlsManager {
  private keys: Record<string, boolean> = {};
  private lastMoveTime = { left: 0, right: 0, down: 0 };
  private moveDelay: number = 30;
  private game: TetrisGame;
  private animationFrameId: number | null = null;

  constructor(game: TetrisGame) {
    this.game = game;
    this.init();
  }

  private init(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    // Boucle de répétition pour les mouvements continus
    this.continuousLoop();

    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
      this.moveDelay = parseInt(savedSensitivity);
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (CONTROL_KEY_SET.has(event.code)) {
      event.preventDefault();
    }

    if (!this.keys[event.code]) {
      this.keys[event.code] = true;
    }

    this.handleInput(event.code);
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys[event.code] = false;
  };

  private handleInput(key: string): void {
    if (this.game.isPaused() || this.game.isGameOver()) return;

    switch (key) {
      case CONTROLS.LEFT:
      case CONTROLS.RIGHT:
      case CONTROLS.DOWN:
        // Ces touches sont gérées par handleContinuousInput
        break;
      case CONTROLS.ROTATE:
        this.game.rotatePiece();
        break;
      case CONTROLS.ROTATE_REVERSE:
        this.game.rotatePieceReverse();
        break;
      case CONTROLS.HARD_DROP:
      case 'Enter':
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

  private handleContinuousInput(): void {
    if (this.game.isPaused() || this.game.isGameOver() || !this.game.isStarted()) return;

    const now = Date.now();

    if (this.keys[CONTROLS.LEFT]) {
      if (now - this.lastMoveTime.left >= this.moveDelay) {
        this.game.movePiece(-1);
        this.lastMoveTime.left = now;
      }
    }

    if (this.keys[CONTROLS.RIGHT]) {
      if (now - this.lastMoveTime.right >= this.moveDelay) {
        this.game.movePiece(1);
        this.lastMoveTime.right = now;
      }
    }

    if (this.keys[CONTROLS.DOWN]) {
      if (now - this.lastMoveTime.down >= this.moveDelay) {
        this.game.dropPiece(true);
        this.lastMoveTime.down = now;
      }
    }
  }

  private continuousLoop = (): void => {
    this.handleContinuousInput();
    this.animationFrameId = requestAnimationFrame(this.continuousLoop);
  };

  setSensitivity(value: number): void {
    this.moveDelay = value;
    localStorage.setItem('tetris-sensitivity', value.toString());
  }

  getSensitivity(): number {
    return this.moveDelay;
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
