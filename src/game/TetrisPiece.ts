import { IPiece, PieceType } from '../types';

export class TetrisPiece implements IPiece {
  public shape: number[][][];
  public color: string;
  public x: number = 3;
  public y: number = 0;
  public rotation: number = 0;
  public type: PieceType;

  constructor(shape: number[][][], color: string, type: PieceType) {
    this.shape = shape;
    this.color = color;
    this.type = type;
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
}

// Définition des formes de pièces Tetris classiques
const PIECE_SHAPES: Record<PieceType, number[][][]> = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
  ],
  J: [
    [[1,0,0], [1,1,1], [0,0,0]],
    [[0,1,1], [0,1,0], [0,1,0]],
    [[0,0,0], [1,1,1], [0,0,1]],
    [[0,1,0], [0,1,0], [1,1,0]]
  ],
  L: [
    [[0,0,1], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,0], [0,1,1]],
    [[0,0,0], [1,1,1], [1,0,0]],
    [[1,1,0], [0,1,0], [0,1,0]]
  ],
  O: [
    [[1,1], [1,1]],
    [[1,1], [1,1]],
    [[1,1], [1,1]],
    [[1,1], [1,1]]
  ],
  S: [
    [[0,1,1], [1,1,0], [0,0,0]],
    [[0,1,0], [0,1,1], [0,0,1]],
    [[0,0,0], [0,1,1], [1,1,0]],
    [[1,0,0], [1,1,0], [0,1,0]]
  ],
  T: [
    [[0,1,0], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,1], [0,1,0]],
    [[0,0,0], [1,1,1], [0,1,0]],
    [[0,1,0], [1,1,0], [0,1,0]]
  ],
  Z: [
    [[1,1,0], [0,1,1], [0,0,0]],
    [[0,0,1], [0,1,1], [0,1,0]],
    [[0,0,0], [1,1,0], [0,1,1]],
    [[0,1,0], [1,1,0], [1,0,0]]
  ]
};

const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00ffff',
  J: '#0000ff',
  L: '#ff7f00',
  O: '#ffff00',
  S: '#00ff00',
  T: '#800080',
  Z: '#ff0000'
};

// Système de bag pour génération aléatoire équitable
const PIECE_TYPES: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
let pieceBag: PieceType[] = [];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomPiece(): TetrisPiece {
  if (pieceBag.length === 0) {
    pieceBag = shuffle(PIECE_TYPES);
  }

  const nextType = pieceBag.pop()!;
  const piece = new TetrisPiece(
    PIECE_SHAPES[nextType],
    PIECE_COLORS[nextType],
    nextType
  );
  piece.reset();
  return piece;
}

export function copyPiece(piece: TetrisPiece): TetrisPiece {
  const newPiece = new TetrisPiece(piece.shape, piece.color, piece.type);
  newPiece.x = piece.x;
  newPiece.y = piece.y;
  newPiece.rotation = piece.rotation;
  return newPiece;
}

export function updatePieceColors(colors: Record<PieceType, string>): void {
  Object.assign(PIECE_COLORS, colors);
}
