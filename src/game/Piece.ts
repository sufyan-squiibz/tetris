// Définition des pièces Tetris classiques

import type { PieceType } from './types';

export class TetrisPiece {
  public x: number = 3;
  public y: number = 0;
  public rotation: number = 0;

  constructor(
    public readonly shape: number[][][],
    public color: string
  ) {}

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
}

// Pièces Tetris avec formes correctes
const TETRIS_PIECES_DATA: Record<PieceType, { shape: number[][][]; color: string }> = {
  I: {
    shape: [
      [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    ],
    color: '#00ffff'
  },
  J: {
    shape: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
    ],
    color: '#0000ff'
  },
  L: {
    shape: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
    ],
    color: '#ff7f00'
  },
  O: {
    shape: [
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]]
    ],
    color: '#ffff00'
  },
  S: {
    shape: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
      [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
    ],
    color: '#00ff00'
  },
  T: {
    shape: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
    ],
    color: '#800080'
  },
  Z: {
    shape: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
    ],
    color: '#ff0000'
  }
};

export const TETRIS_PIECES: Record<PieceType, TetrisPiece> = {
  I: new TetrisPiece(TETRIS_PIECES_DATA.I.shape, TETRIS_PIECES_DATA.I.color),
  J: new TetrisPiece(TETRIS_PIECES_DATA.J.shape, TETRIS_PIECES_DATA.J.color),
  L: new TetrisPiece(TETRIS_PIECES_DATA.L.shape, TETRIS_PIECES_DATA.L.color),
  O: new TetrisPiece(TETRIS_PIECES_DATA.O.shape, TETRIS_PIECES_DATA.O.color),
  S: new TetrisPiece(TETRIS_PIECES_DATA.S.shape, TETRIS_PIECES_DATA.S.color),
  T: new TetrisPiece(TETRIS_PIECES_DATA.T.shape, TETRIS_PIECES_DATA.T.color),
  Z: new TetrisPiece(TETRIS_PIECES_DATA.Z.shape, TETRIS_PIECES_DATA.Z.color)
};

const PIECE_TYPES: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
let pieceBag: PieceType[] = [];

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getRandomPiece(): TetrisPiece {
  if (pieceBag.length === 0) {
    pieceBag = shuffle([...PIECE_TYPES]);
  }

  const nextType = pieceBag.pop()!;
  const piece = TETRIS_PIECES[nextType];
  const newPiece = new TetrisPiece(piece.shape, piece.color);
  newPiece.reset();
  return newPiece;
}

export function copyPiece(piece: TetrisPiece): TetrisPiece {
  const newPiece = new TetrisPiece(piece.shape, piece.color);
  newPiece.x = piece.x;
  newPiece.y = piece.y;
  newPiece.rotation = piece.rotation;
  return newPiece;
}
