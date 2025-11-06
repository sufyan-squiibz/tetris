// Gestion des contrôles clavier pour Tetris
import { CONTROLS, CONTROL_KEY_SET } from './constants';
import type { TetrisGame } from './game';

const keys: Record<string, boolean> = {};
const lastMoveTime = { left: 0, right: 0, down: 0 };
let MOVE_DELAY = 30;

export function initControls(game: TetrisGame): void {
  document.addEventListener('keydown', (event) => {
    if (CONTROL_KEY_SET.has(event.code)) {
      event.preventDefault();
    }
    
    if (!keys[event.code]) {
      keys[event.code] = true;
    }
    
    handleInput(game, event.code);
  });

  document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
  });

  const continuousLoop = () => {
    handleContinuousInput(game);
    requestAnimationFrame(continuousLoop);
  };
  continuousLoop();
}

function handleInput(game: TetrisGame, key: string): void {
  if (game.paused || game.gameOver) return;

  switch (key) {
    case CONTROLS.LEFT:
    case CONTROLS.RIGHT:
    case CONTROLS.DOWN:
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

  if (keys[CONTROLS.LEFT]) {
    if (now - lastMoveTime.left >= MOVE_DELAY) {
      game.movePiece(-1);
      lastMoveTime.left = now;
    }
  }

  if (keys[CONTROLS.RIGHT]) {
    if (now - lastMoveTime.right >= MOVE_DELAY) {
      game.movePiece(1);
      lastMoveTime.right = now;
    }
  }

  if (keys[CONTROLS.DOWN]) {
    if (now - lastMoveTime.down >= MOVE_DELAY) {
      game.dropPiece(true);
      lastMoveTime.down = now;
    }
  }
}

export function setSensitivity(value: number): void {
  MOVE_DELAY = value;
  localStorage.setItem('tetris-sensitivity', value.toString());
  console.log(`Sensibilité ajustée à ${MOVE_DELAY}ms`);
}

export function initSensitivityControl(): void {
  const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
  const valueDisplay = document.getElementById('sensitivity-value');
  const presetButtons = document.querySelectorAll('.preset-btn');
  
  const savedSensitivity = localStorage.getItem('tetris-sensitivity');
  if (savedSensitivity) {
    MOVE_DELAY = parseInt(savedSensitivity);
    if (slider) slider.value = savedSensitivity;
    if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
  }
  
  if (slider) {
    slider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      setSensitivity(value);
      if (valueDisplay) {
        valueDisplay.textContent = `${value}ms`;
      }
      
      presetButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((btn as HTMLElement).dataset.value === value.toString()) {
          btn.classList.add('active');
        }
      });
    });
  }
  
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = parseInt((btn as HTMLElement).dataset.value || '30');
      setSensitivity(value);
      
      if (slider) slider.value = value.toString();
      if (valueDisplay) valueDisplay.textContent = `${value}ms`;
      
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      (window as any).showNotification(`Sensibilité: ${btn.textContent}`);
    });
  });
  
  presetButtons.forEach(btn => {
    if ((btn as HTMLElement).dataset.value === String(MOVE_DELAY)) {
      btn.classList.add('active');
    }
  });
}
