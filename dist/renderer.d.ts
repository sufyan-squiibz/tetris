import { Board } from './types';
import { TetrisPiece } from './pieces';
export declare class TetrisRenderer {
    private app;
    private boardContainer;
    private ghostContainer;
    private currentPieceContainer;
    private gridGraphics;
    constructor(canvasElement: HTMLCanvasElement);
    private drawGrid;
    private createBlock;
    private createGhostBlock;
    drawBoard(board: Board): void;
    drawCurrentPiece(piece: TetrisPiece): void;
    drawGhostPiece(ghostPiece: TetrisPiece): void;
    clear(): void;
    destroy(): void;
    renderNextPiece(canvasId: string, piece: TetrisPiece, size?: number): void;
    renderHoldPiece(piece: TetrisPiece | null): void;
}
//# sourceMappingURL=renderer.d.ts.map