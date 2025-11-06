export type ControlCallback = () => void;

interface ControlCallbacks {
  moveLeft: ControlCallback;
  moveRight: ControlCallback;
  moveDown: ControlCallback;
  rotate: ControlCallback;
  rotateReverse: ControlCallback;
  hardDrop: ControlCallback;
  hold: ControlCallback;
  pause: ControlCallback;
}

export class ControlsManager {
  private keys: Record<string, boolean> = {};
  private lastMoveTime = { left: 0, right: 0, down: 0 };
  private moveDelay: number = 30;
  private callbacks: ControlCallbacks;
  private enabled: boolean = false;
  private animationId: number = 0;

  private readonly CONTROLS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE: 'ArrowUp',
    ROTATE_REVERSE: 'KeyZ',
    HARD_DROP: 'Space',
    HOLD: 'KeyC',
    PAUSE: 'KeyP',
  };

  private readonly CONTROL_KEY_SET = new Set([
    this.CONTROLS.LEFT,
    this.CONTROLS.RIGHT,
    this.CONTROLS.DOWN,
    this.CONTROLS.ROTATE,
    this.CONTROLS.ROTATE_REVERSE,
    this.CONTROLS.HARD_DROP,
    this.CONTROLS.HOLD,
    this.CONTROLS.PAUSE,
    'Enter',
  ]);

  constructor(callbacks: ControlCallbacks) {
    this.callbacks = callbacks;
    this.init();
    this.loadSensitivity();
  }

  private init(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.startContinuousLoop();
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.CONTROL_KEY_SET.has(event.code)) {
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
    if (!this.enabled) return;

    switch (key) {
      case this.CONTROLS.ROTATE:
        this.callbacks.rotate();
        break;
      case this.CONTROLS.ROTATE_REVERSE:
        this.callbacks.rotateReverse();
        break;
      case this.CONTROLS.HARD_DROP:
      case 'Enter':
        this.callbacks.hardDrop();
        break;
      case this.CONTROLS.HOLD:
        this.callbacks.hold();
        break;
      case this.CONTROLS.PAUSE:
        this.callbacks.pause();
        break;
    }
  }

  private handleContinuousInput = (): void => {
    if (!this.enabled) return;

    const now = Date.now();

    if (this.keys[this.CONTROLS.LEFT]) {
      if (now - this.lastMoveTime.left >= this.moveDelay) {
        this.callbacks.moveLeft();
        this.lastMoveTime.left = now;
      }
    }

    if (this.keys[this.CONTROLS.RIGHT]) {
      if (now - this.lastMoveTime.right >= this.moveDelay) {
        this.callbacks.moveRight();
        this.lastMoveTime.right = now;
      }
    }

    if (this.keys[this.CONTROLS.DOWN]) {
      if (now - this.lastMoveTime.down >= this.moveDelay) {
        this.callbacks.moveDown();
        this.lastMoveTime.down = now;
      }
    }
  };

  private startContinuousLoop(): void {
    const loop = () => {
      this.handleContinuousInput();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  setSensitivity(value: number): void {
    this.moveDelay = value;
    localStorage.setItem('tetris-sensitivity', value.toString());
  }

  private loadSensitivity(): void {
    const saved = localStorage.getItem('tetris-sensitivity');
    if (saved) {
      this.moveDelay = parseInt(saved);
    }
  }

  getSensitivity(): number {
    return this.moveDelay;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    cancelAnimationFrame(this.animationId);
  }
}
