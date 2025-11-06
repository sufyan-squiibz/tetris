import { TetrisPiece } from './pieces';
export declare const COLS = 10;
export declare const ROWS = 20;
export declare const BLOCK_SIZE = 30;
export declare class Renderer {
    private app;
    private boardContainer;
    private pieceContainer;
    private ghostContainer;
    private gridGraphics;
    constructor(canvasId: string);
    private drawGrid;
    private createBlockSprite;
    drawBoard(board: number[][]): void;
    drawCurrentPiece(piece: TetrisPiece, board: number[][]): void;
    private drawGhostPiece;
    private checkCollision;
    private numberToColor;
    updateBackground(color: string): void;
    resize(width: number, height: number): void;
    destroy(): void;
}
//# sourceMappingURL=render.d.ts.map