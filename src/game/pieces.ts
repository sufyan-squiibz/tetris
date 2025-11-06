// Définition des pièces Tetris en TypeScript
import type { PieceType, PieceShape } from '../types';

export class TetrisPiece {
  public x: number;
  public y: number;
  public rotation: number;
  public readonly shape: number[][][];
  public readonly color: number;
  public readonly type: PieceType;

  constructor(shape: number[][][], color: number, type: PieceType) {
    this.shape = shape;
    this.color = color;
    this.type = type;
    this.x = 3;
    this.y = 0;
    this.rotation = 0;
  }

  rotate(): number[][] {
    this.rotation = (this.rotation + 1) % this.shape.length;
    return this.getShape();
  }

  rotateReverse(): number[][] {
    this.rotation = (this.rotation - 1 + this.shape.length) % this.shape.length;
    return this.getShape();
  }

  getShape(): number[][] {
    return this.shape[this.rotation];
  }

  reset(): void {
    this.x = 3;
    this.y = 0;
    this.rotation = 0;
  }

  copy(): TetrisPiece {
    const newPiece = new TetrisPiece(this.shape, this.color, this.type);
    newPiece.x = this.x;
    newPiece.y = this.y;
    newPiece.rotation = this.rotation;
    return newPiece;
  }
}

// Pièces Tetris avec formes correctes et couleurs en hexadécimal
export const TETRIS_PIECES: Record<PieceType, PieceShape> = {
  I: {
    shape: [
      [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    ],
    color: 0x00ffff
  },

  J: {
    shape: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
    ],
    color: 0x0000ff
  },

  L: {
    shape: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
    ],
    color: 0xff7f00
  },

  O: {
    shape: [
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]]
    ],
    color: 0xffff00
  },

  S: {
    shape: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
      [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
    ],
    color: 0x00ff00
  },

  T: {
    shape: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
    ],
    color: 0x800080
  },

  Z: {
    shape: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
    ],
    color: 0xff0000
  }
};

const PIECE_TYPES: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
let pieceBag: PieceType[] = [];

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomPiece(): TetrisPiece {
  if (pieceBag.length === 0) {
    pieceBag = shuffle([...PIECE_TYPES]);
  }

  const nextType = pieceBag.pop()!;
  const pieceData = TETRIS_PIECES[nextType];
  const newPiece = new TetrisPiece(pieceData.shape, pieceData.color, nextType);
  newPiece.reset();
  return newPiece;
}
