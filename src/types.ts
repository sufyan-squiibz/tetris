// Types pour le jeu Tetris

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

export interface ParticleConfig {
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  opacity: number;
}
