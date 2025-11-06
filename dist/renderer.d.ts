import { TetrisPiece } from './pieces';
export declare const COLS = 10;
export declare const ROWS = 20;
export declare const BLOCK_SIZE = 30;
export declare class GameRenderer {
    private app;
    private boardContainer;
    private currentPieceContainer;
    private ghostPieceContainer;
    private gridGraphics;
    private blockSprites;
    constructor(canvas: HTMLCanvasElement);
    private drawGrid;
    private createBlockSprite;
    private hexToNumber;
    drawBoard(board: number[][]): void;
    private numberToHex;
    drawCurrentPiece(piece: TetrisPiece, board: number[][]): void;
    private drawGhostPiece;
    private copyPieceForGhost;
    private checkCollision;
    updateTheme(backgroundColor: number, gridColor: number): void;
    resize(width: number, height: number): void;
    destroy(): void;
}
//# sourceMappingURL=renderer.d.ts.map