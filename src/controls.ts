import { TetrisGame } from './game';
import { showNotification } from './utils';

const CONTROLS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp',
  ROTATE_REVERSE: 'KeyZ',
  HARD_DROP: 'Space',
  HOLD: 'KeyC',
  PAUSE: 'KeyP',
} as const;

// État des touches
const keys: Record<string, boolean> = {};
const lastMoveTime = { left: 0, right: 0, down: 0 };
let MOVE_DELAY = 30; // Délai minimum entre deux mouvements (ms)

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

export function initControls(game: TetrisGame): void {
  // Événements clavier
  document.addEventListener('keydown', (event) => {
    if (CONTROL_KEY_SET.has(event.code as any)) {
      event.preventDefault();
    }

    // Marquer la touche comme pressée
    if (!keys[event.code]) {
      keys[event.code] = true;
    }

    // Gérer l'input immédiatement
    handleInput(game, event.code);
  });

  document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
  });

  // Boucle de répétition pour les mouvements continus
  const continuousLoop = (): void => {
    handleContinuousInput(game);
    requestAnimationFrame(continuousLoop);
  };
  continuousLoop();

  // Initialiser le contrôle de sensibilité
  initSensitivityControl();
}

function handleInput(game: TetrisGame, key: string): void {
  if (game.paused || game.gameOver) {
    if (key === CONTROLS.PAUSE && !game.gameOver) {
      game.togglePause();
    }
    return;
  }

  switch (key) {
    case CONTROLS.LEFT:
    case CONTROLS.RIGHT:
    case CONTROLS.DOWN:
      // Ces touches sont gérées par handleContinuousInput
      break;
    case CONTROLS.ROTATE:
      game.rotatePiece();
      break;
    case CONTROLS.ROTATE_REVERSE:
      game.rotatePieceReverse();
      break;
    case CONTROLS.HARD_DROP:
    case 'Enter':
      game.hardDrop();
      break;
    case CONTROLS.HOLD:
      game.holdCurrentPiece();
      break;
    case CONTROLS.PAUSE:
      game.togglePause();
      break;
  }
}

function handleContinuousInput(game: TetrisGame): void {
  if (game.paused || game.gameOver || !game.started) return;

  const now = Date.now();

  // Gauche
  if (keys[CONTROLS.LEFT]) {
    if (now - lastMoveTime.left >= MOVE_DELAY) {
      game.movePiece(-1);
      lastMoveTime.left = now;
    }
  }

  // Droite
  if (keys[CONTROLS.RIGHT]) {
    if (now - lastMoveTime.right >= MOVE_DELAY) {
      game.movePiece(1);
      lastMoveTime.right = now;
    }
  }

  // Bas
  if (keys[CONTROLS.DOWN]) {
    if (now - lastMoveTime.down >= MOVE_DELAY) {
      game.dropPiece(true);
      lastMoveTime.down = now;
    }
  }
}

function setSensitivity(value: number): void {
  MOVE_DELAY = value;
  localStorage.setItem('tetris-sensitivity', value.toString());
}

function initSensitivityControl(): void {
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

  // Événement du slider
  if (slider) {
    slider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      setSensitivity(value);
      if (valueDisplay) {
        valueDisplay.textContent = `${value}ms`;
      }

      // Mettre à jour les boutons presets
      presetButtons.forEach((btn) => {
        btn.classList.remove('active');
        if ((btn as HTMLElement).dataset.value === value.toString()) {
          btn.classList.add('active');
        }
      });
    });
  }

  // Événements des boutons presets
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = parseInt((btn as HTMLElement).dataset.value || '30');
      setSensitivity(value);

      if (slider) slider.value = value.toString();
      if (valueDisplay) valueDisplay.textContent = `${value}ms`;

      // Mettre à jour l'état actif
      presetButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Notification visuelle
      showNotification(`Sensibilité: ${(btn as HTMLElement).textContent}`);
    });
  });

  // Mettre à jour l'état actif initial
  presetButtons.forEach((btn) => {
    if ((btn as HTMLElement).dataset.value === MOVE_DELAY.toString()) {
      btn.classList.add('active');
    }
  });
}
