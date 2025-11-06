export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export interface PieceShape {
    [key: number]: number[][];
}
export declare class TetrisPiece {
    shape: PieceShape;
    color: string;
    x: number;
    y: number;
    rotation: number;
    constructor(shape: PieceShape, color: string);
    rotate(): number[][];
    rotateReverse(): number[][];
    getShape(): number[][];
    reset(): void;
}
export declare const TETRIS_PIECES: Record<PieceType, TetrisPiece>;
export declare const PIECE_TYPES: PieceType[];
export declare function getRandomPiece(): TetrisPiece;
export declare function copyPiece(piece: TetrisPiece): TetrisPiece;
//# sourceMappingURL=pieces.d.ts.map