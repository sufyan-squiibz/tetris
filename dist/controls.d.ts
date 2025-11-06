export declare const CONTROLS: {
    LEFT: string;
    RIGHT: string;
    DOWN: string;
    ROTATE: string;
    ROTATE_REVERSE: string;
    HARD_DROP: string;
    HOLD: string;
    PAUSE: string;
};
export declare let MOVE_DELAY: number;
export interface GameControls {
    paused: boolean;
    gameOver: boolean;
    started: boolean;
    movePiece(dx: number): boolean;
    dropPiece(isManual: boolean): boolean;
    rotatePiece(): boolean;
    rotatePieceReverse(): boolean;
    hardDrop(): void;
    holdCurrentPiece(): void;
    togglePause(): void;
}
export declare function initControls(game: GameControls): void;
export declare function setSensitivity(value: number): void;
export declare function initSensitivityControl(): void;
//# sourceMappingURL=controls.d.ts.map