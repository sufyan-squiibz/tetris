// Types pour le jeu Tetris

export interface PieceShape {
  shape: number[][][];
  color: string;
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
  date?: string;
}

export interface Theme {
  name: string;
  background: string;
  boardBg: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  pieces: {
    I: string;
    J: string;
    L: string;
    O: string;
    S: string;
    T: string;
    Z: string;
  };
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

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Sound {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}
