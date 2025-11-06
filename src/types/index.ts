// Types et interfaces du jeu Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Board = number[][];

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
  pieces: Record<PieceType, number>;
  glow?: boolean;
  pixelated?: boolean;
}

export interface GameConfig {
  cols: number;
  rows: number;
  blockSize: number;
  initialDropInterval: number;
  levelSpeedIncrease: number;
  minDropInterval: number;
}
