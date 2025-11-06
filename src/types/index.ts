// Types et interfaces pour le jeu Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface PieceShape {
  shape: number[][][];
  color: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameStats {
  score: number;
  level: number;
  lines: number;
  combo: number;
  maxCombo: number;
  tetrisCount: number;
  piecesPlaced: number;
  elapsedTime: number;
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

export interface Theme {
  name: string;
  background: string;
  boardBg: number;
  gridColor: number;
  textColor: string;
  accentColor: string;
  pieces: Record<PieceType, number>;
  glow?: boolean;
  pixelated?: boolean;
}

export interface Controls {
  LEFT: string;
  RIGHT: string;
  DOWN: string;
  ROTATE: string;
  ROTATE_REVERSE: string;
  HARD_DROP: string;
  HOLD: string;
  PAUSE: string;
}

export const GAME_CONFIG = {
  COLS: 10,
  ROWS: 20,
  BLOCK_SIZE: 30,
  INITIAL_DROP_INTERVAL: 1000,
  MIN_DROP_INTERVAL: 100,
  DROP_INTERVAL_DECREASE: 100,
} as const;
