import { PieceType } from '../types';

export class TetrisPiece {
  public x: number;
  public y: number;
  public rotation: number;
  public readonly shape: number[][][];
  public readonly color: string;
  public readonly type: PieceType;

  constructor(type: PieceType, shape: number[][][], color: string) {
    this.type = type;
    this.shape = shape;
    this.color = color;
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

  clone(): TetrisPiece {
    const clone = new TetrisPiece(this.type, this.shape, this.color);
    clone.x = this.x;
    clone.y = this.y;
    clone.rotation = this.rotation;
    return clone;
  }
}
