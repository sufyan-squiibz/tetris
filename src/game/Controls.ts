// Configuration des contrôles

import type { TetrisGame } from './TetrisGame';

const CONTROLS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp',
  ROTATE_REVERSE: 'KeyZ',
  HARD_DROP: 'Space',
  HOLD: 'KeyC',
  PAUSE: 'KeyP'
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
  'Enter'
]);

export class ControlsManager {
  private keys: Record<string, boolean> = {};
  private lastMoveTime = { left: 0, right: 0, down: 0 };
  private moveDelay: number = 30; // Délai minimum entre deux mouvements (ms) - ajustable
  private game: TetrisGame;
  private animationFrameId: number | null = null;

  constructor(game: TetrisGame) {
    this.game = game;
    this.init();
  }

  private init(): void {
    // Événements clavier
    document.addEventListener('keydown', (event) => {
      if (CONTROL_KEY_SET.has(event.code)) {
        event.preventDefault();
      }

      // Marquer la touche comme pressée
      if (!this.keys[event.code]) {
        this.keys[event.code] = true;
      }

      // Gérer l'input immédiatement
      this.handleInput(event.code);
    });

    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });

    // Boucle de répétition ultra-rapide pour les mouvements continus
    const continuousLoop = (): void => {
      this.handleContinuousInput();
      this.animationFrameId = requestAnimationFrame(continuousLoop);
    };
    continuousLoop();

    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
      this.moveDelay = parseInt(savedSensitivity);
    }
  }

  private handleInput(key: string): void {
    if (this.game.isPaused() || this.game.isGameOver()) return;

    switch (key) {
      case CONTROLS.LEFT:
      case CONTROLS.RIGHT:
      case CONTROLS.DOWN:
        // Ces touches sont gérées par handleContinuousInput pour éviter la duplication
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

    // Gauche - répétition continue si maintenu
    if (this.keys[CONTROLS.LEFT]) {
      if (now - this.lastMoveTime.left >= this.moveDelay) {
        this.game.movePiece(-1);
        this.lastMoveTime.left = now;
      }
    }

    // Droite - répétition continue si maintenu
    if (this.keys[CONTROLS.RIGHT]) {
      if (now - this.lastMoveTime.right >= this.moveDelay) {
        this.game.movePiece(1);
        this.lastMoveTime.right = now;
      }
    }

    // Bas - répétition continue si maintenu
    if (this.keys[CONTROLS.DOWN]) {
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

  public getMoveDelay(): number {
    return this.moveDelay;
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
