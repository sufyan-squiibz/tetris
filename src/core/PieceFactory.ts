import { TetrisPiece } from './Piece';
import { PieceType } from '../types';

// Couleurs des pièces par défaut (format hexadécimal converti en nombre)
const DEFAULT_COLORS: Record<PieceType, number> = {
  I: 0x00ffff, // Cyan
  J: 0x0000ff, // Bleu
  L: 0xff7f00, // Orange
  O: 0xffff00, // Jaune
  S: 0x00ff00, // Vert
  T: 0x800080, // Violet
  Z: 0xff0000, // Rouge
};

// Définitions des formes des pièces
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

export class PieceFactory {
  private pieceBag: PieceType[] = [];
  private colors: Record<PieceType, number> = { ...DEFAULT_COLORS };

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private fillBag(): void {
    const types: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    this.pieceBag = this.shuffle(types);
  }

  public getRandomPiece(): TetrisPiece {
    if (this.pieceBag.length === 0) {
      this.fillBag();
    }

    const type = this.pieceBag.pop()!;
    const shape = PIECE_SHAPES[type];
    const color = this.colors[type];
    
    return new TetrisPiece(shape, color, type);
  }

  public updateColors(newColors: Partial<Record<PieceType, number>>): void {
    this.colors = { ...this.colors, ...newColors };
  }

  public getColor(type: PieceType): number {
    return this.colors[type];
  }
}
