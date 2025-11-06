// Types pour le jeu Tetris

export interface GameConfig {
  cols: number;
  rows: number;
  blockSize: number;
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date?: string;
}

export interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

export interface MusicNote {
  freq: number;
  duration: number;
  type: OscillatorType;
}

export interface Theme {
  name: string;
  background: string;
  boardBg: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  pieces: Record<string, string>;
  glow?: boolean;
  pixelated?: boolean;
}

export interface ParticleConfig {
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  opacity: number;
}
