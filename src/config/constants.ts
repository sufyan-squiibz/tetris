import { GameConfig } from '../types';

export const GAME_CONFIG: GameConfig = {
  cols: 10,
  rows: 20,
  blockSize: 30,
  initialDropInterval: 1000,
  levelSpeedIncrease: 100,
  minDropInterval: 100,
};

export const SCORING = {
  LINES: [0, 100, 300, 500, 800],
  COMBO_BONUS: 50,
  HARD_DROP_BONUS: 2,
  BACK_TO_BACK_MULTIPLIER: 1.5,
  LINES_PER_LEVEL: 10,
};

export const CONTROLS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  ROTATE: 'ArrowUp',
  ROTATE_REVERSE: 'KeyZ',
  HARD_DROP: 'Space',
  HOLD: 'KeyC',
  PAUSE: 'KeyP',
  ENTER: 'Enter',
} as const;
