import { TetrisPiece } from './pieces';
export declare class GameRenderer {
    private app;
    private boardContainer;
    private pieceContainer;
    private ghostContainer;
    private blockGraphics;
    private gridGraphics;
    private board;
    constructor(canvas: HTMLCanvasElement, board: (string | number)[][]);
    private drawGrid;
    private createBlock;
    private hexToNumber;
    drawBoard(board: (string | number)[][]): void;
    drawCurrentPiece(piece: TetrisPiece): void;
    private drawGhostPiece;
    private checkCollision;
    updateBackground(color: string): void;
    resize(width: number, height: number): void;
    destroy(): void;
}
//# sourceMappingURL=renderer.d.ts.map