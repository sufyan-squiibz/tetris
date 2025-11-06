// Types et interfaces pour le jeu Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface PieceShape {
  shape: number[][][];
  color: string;
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
  boardBg: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  pieces: Record<PieceType, string>;
  glow?: boolean;
  pixelated?: boolean;
}

export interface AudioConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameConfig {
  cols: number;
  rows: number;
  blockSize: number;
}
