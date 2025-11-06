import { PieceType } from './types';
export declare class TetrisPiece {
    readonly shape: number[][][];
    color: string;
    x: number;
    y: number;
    rotation: number;
    constructor(shape: number[][][], color: string);
    rotate(): number[][];
    rotateReverse(): number[][];
    getShape(): number[][];
    reset(): void;
    clone(): TetrisPiece;
}
export declare const TETRIS_PIECES: Record<PieceType, TetrisPiece>;
export declare const PIECE_TYPES: PieceType[];
export declare function getRandomPiece(): TetrisPiece;
export declare function copyPiece(piece: TetrisPiece): TetrisPiece;
//# sourceMappingURL=pieces.d.ts.map