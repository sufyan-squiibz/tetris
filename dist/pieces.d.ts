export declare class TetrisPiece {
    shape: number[][][];
    color: string;
    x: number;
    y: number;
    rotation: number;
    constructor(shape: number[][][], color: string);
    rotate(): number[][];
    rotateReverse(): number[][];
    getShape(): number[][];
    reset(): void;
}
export declare const TETRIS_PIECES: {
    [key: string]: TetrisPiece;
};
export declare function getRandomPiece(): TetrisPiece;
export declare function copyPiece(piece: TetrisPiece): TetrisPiece;
//# sourceMappingURL=pieces.d.ts.map