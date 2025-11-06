import { PieceType } from '../types';

export class TetrisPiece {
  public x: number;
  public y: number;
  public rotation: number;

  constructor(
    public readonly shape: number[][][],
    public color: number,
    public readonly type: PieceType
  ) {
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
    const newPiece = new TetrisPiece(this.shape, this.color, this.type);
    newPiece.x = this.x;
    newPiece.y = this.y;
    newPiece.rotation = this.rotation;
    return newPiece;
  }
}
