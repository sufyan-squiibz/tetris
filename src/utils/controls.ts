// Système de contrôles avec TypeScript
import type { TetrisGame } from '../game/tetris';
import type { Controls } from '../types';

const CONTROLS: Controls = {
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

const CONTROL_KEY_SET = new Set<string>([
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
  private animationFrameId: number | null = null;

  constructor(game: TetrisGame) {
    this.game = game;
    this.init();
  }

  private init(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.continuousLoop();
    this.initSensitivityControl();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (CONTROL_KEY_SET.has(event.code)) {
      event.preventDefault();
    }

    if (!keys[event.code]) {
      keys[event.code] = true;
    }

    this.handleInput(event.code);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    keys[event.code] = false;
  }

  private handleInput(key: string): void {
    if (this.game.paused || this.game.gameOver) return;

    switch (key) {
      case CONTROLS.LEFT:
      case CONTROLS.RIGHT:
      case CONTROLS.DOWN:
        // Gérés par handleContinuousInput
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
    if (this.game.paused || this.game.gameOver || !this.game.started) return;

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

  private continuousLoop(): void {
    this.handleContinuousInput();
    this.animationFrameId = requestAnimationFrame(() => this.continuousLoop());
  }

  private initSensitivityControl(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
      MOVE_DELAY = parseInt(savedSensitivity);
      if (slider) slider.value = savedSensitivity;
      if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
    }

    if (slider) {
      slider.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.setSensitivity(parseInt(value));
        if (valueDisplay) {
          valueDisplay.textContent = `${value}ms`;
        }

        presetButtons.forEach(btn => {
          btn.classList.remove('active');
          if ((btn as HTMLElement).dataset.value === value) {
            btn.classList.add('active');
          }
        });
      });
    }

    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = (btn as HTMLElement).dataset.value;
        if (!value) return;

        this.setSensitivity(parseInt(value));

        if (slider) slider.value = value;
        if (valueDisplay) valueDisplay.textContent = `${value}ms`;

        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.showNotification(`Sensibilité: ${btn.textContent}`);
      });
    });

    // Mettre à jour l'état actif initial
    presetButtons.forEach(btn => {
      if ((btn as HTMLElement).dataset.value === String(MOVE_DELAY)) {
        btn.classList.add('active');
      }
    });
  }

  private setSensitivity(value: number): void {
    MOVE_DELAY = value;
    localStorage.setItem('tetris-sensitivity', value.toString());
  }

  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
