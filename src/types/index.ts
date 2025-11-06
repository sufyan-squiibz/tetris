// Types et interfaces pour le jeu Tetris

export interface IPosition {
  x: number;
  y: number;
}

export interface IPiece {
  shape: number[][][];
  color: string;
  x: number;
  y: number;
  rotation: number;
  type: PieceType;
}

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface IGameStats {
  score: number;
  level: number;
  lines: number;
  combo: number;
  maxCombo: number;
  tetrisCount: number;
  piecesPlaced: number;
  elapsedTime: number;
}

export interface IHighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

export interface ITheme {
  name: string;
  background: string;
  boardBg: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  pieces: Record<PieceType, string>;
  glow?: boolean;
  pixelated?: boolean;
}

export interface IControls {
  LEFT: string;
  RIGHT: string;
  DOWN: string;
  ROTATE: string;
  ROTATE_REVERSE: string;
  HARD_DROP: string;
  HOLD: string;
  PAUSE: string;
}

export interface IParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  life: number;
  size: number;
  gravity: number;
}

export const GAME_CONFIG = {
  COLS: 10,
  ROWS: 20,
  BLOCK_SIZE: 30,
  INITIAL_DROP_INTERVAL: 1000,
  MIN_DROP_INTERVAL: 100,
  DROP_SPEED_INCREASE: 100,
  LINES_PER_LEVEL: 10,
} as const;
