// Types et interfaces pour le jeu Tetris

export interface ITheme {
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

export interface IHighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

export interface ITetrisShape {
  shape: number[][][];
  color: string;
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
