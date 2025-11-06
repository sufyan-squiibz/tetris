import { TetrisPiece } from './TetrisPiece';
import { PieceType } from '../types';

// Définition des formes des pièces Tetris
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

// Couleurs par défaut des pièces
const DEFAULT_COLORS: Record<PieceType, string> = {
  I: '#00ffff',
  J: '#0000ff',
  L: '#ff7f00',
  O: '#ffff00',
  S: '#00ff00',
  T: '#800080',
  Z: '#ff0000'
};

export class PieceFactory {
  private pieceBag: PieceType[] = [];
  private colors: Record<PieceType, string>;

  constructor(colors?: Record<PieceType, string>) {
    this.colors = colors || DEFAULT_COLORS;
  }

  updateColors(colors: Record<PieceType, string>): void {
    this.colors = colors;
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getRandomPiece(): TetrisPiece {
    if (this.pieceBag.length === 0) {
      const pieceTypes: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      this.pieceBag = this.shuffle(pieceTypes);
    }

    const nextType = this.pieceBag.pop()!;
    const piece = new TetrisPiece(
      nextType,
      PIECE_SHAPES[nextType],
      this.colors[nextType]
    );
    piece.reset();
    return piece;
  }
}
