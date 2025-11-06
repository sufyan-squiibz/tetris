// Définition des pièces Tetris classiques

export class TetrisPiece {
  shape: number[][][];
  color: string;
  x: number;
  y: number;
  rotation: number;

  constructor(shape: number[][][], color: string) {
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
}

// Pièces Tetris avec formes correctes
export const TETRIS_PIECES: Record<string, TetrisPiece> = {
  I: new TetrisPiece([
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
  ], '#00ffff'),

  J: new TetrisPiece([
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
  ], '#0000ff'),

  L: new TetrisPiece([
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
  ], '#ff7f00'),

  O: new TetrisPiece([
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]]
  ], '#ffff00'),

  S: new TetrisPiece([
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
  ], '#00ff00'),

  T: new TetrisPiece([
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
  ], '#800080'),

  Z: new TetrisPiece([
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
  ], '#ff0000')
};

const PIECE_TYPES = Object.keys(TETRIS_PIECES);
let pieceBag: string[] = [];

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
