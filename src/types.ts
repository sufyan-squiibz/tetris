// Types globaux pour Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Board = number[][];

export interface Shape {
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
  date: string;
}

export interface ThemeConfig {
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

export interface AudioSound {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
