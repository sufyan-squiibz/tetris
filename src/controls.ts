// Gestion des contrôles clavier pour Tetris

import { TetrisGame } from './game';
import type { Controls } from './types';

export const CONTROLS: Controls = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp',
  ROTATE_REVERSE: 'KeyZ',
  HARD_DROP: 'Space',
  HOLD: 'KeyC',
  PAUSE: 'KeyP'
};

const keys: Record<string, boolean> = {};
const lastMoveTime = { left: 0, right: 0, down: 0 };
let MOVE_DELAY = 30;

const CONTROL_KEY_SET = new Set([
  CONTROLS.LEFT,
  CONTROLS.RIGHT,
  CONTROLS.DOWN,
  CONTROLS.ROTATE,
  CONTROLS.ROTATE_REVERSE,
  CONTROLS.HARD_DROP,
  CONTROLS.HOLD,
  CONTROLS.PAUSE,
  'Enter'
]);

export class ControlsManager {
  private game: TetrisGame;
  private continuousLoopId?: number;

  constructor(game: TetrisGame) {
    this.game = game;
    this.init();
  }

  private init(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    this.startContinuousLoop();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (CONTROL_KEY_SET.has(event.code)) {
      event.preventDefault();
    }
    
    if (!keys[event.code]) {
      keys[event.code] = true;
    }
    
    this.handleInput(event.code);
  }

  private onKeyUp(event: KeyboardEvent): void {
    keys[event.code] = false;
  }

  private handleInput(key: string): void {
    if (this.game.isPaused() || this.game.isGameOver()) return;

    switch (key) {
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

    if (keys[CONTROLS.LEFT]) {
      if (now - lastMoveTime.left >= MOVE_DELAY) {
        this.game.movePiece(-1);
        lastMoveTime.left = now;
      }
    }

    if (keys[CONTROLS.RIGHT]) {
      if (now - lastMoveTime.right >= MOVE_DELAY) {
        this.game.movePiece(1);
        lastMoveTime.right = now;
      }
    }

    if (keys[CONTROLS.DOWN]) {
      if (now - lastMoveTime.down >= MOVE_DELAY) {
        this.game.dropPiece(true);
        lastMoveTime.down = now;
      }
    }
  }

  private startContinuousLoop(): void {
    const loop = () => {
      this.handleContinuousInput();
      this.continuousLoopId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy(): void {
    if (this.continuousLoopId !== undefined) {
      cancelAnimationFrame(this.continuousLoopId);
    }
  }

  static setSensitivity(value: number): void {
    MOVE_DELAY = value;
    localStorage.setItem('tetris-sensitivity', value.toString());
  }

  static getSensitivity(): number {
    const saved = localStorage.getItem('tetris-sensitivity');
    return saved ? parseInt(saved, 10) : 30;
  }
}
