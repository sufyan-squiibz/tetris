// Types communs pour le jeu Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface PieceShape {
  [key: number]: number[][];
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

export interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
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

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
