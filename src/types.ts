// Types pour le jeu Tetris

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Shape = number[][];

export interface PieceShape {
  [key: number]: Shape;
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

export interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

export interface ParticleConfig {
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  opacity: number;
}
