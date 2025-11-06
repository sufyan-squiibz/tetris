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
export interface GameControls {
    paused: boolean;
    gameOver: boolean;
    started: boolean;
    movePiece(dx: number): boolean;
    rotatePiece(): boolean;
    rotatePieceReverse(): boolean;
    hardDrop(): void;
    holdCurrentPiece(): void;
    togglePause(): void;
    dropPiece(isManual?: boolean): boolean;
}
export declare function initControls(game: GameControls): void;
export declare function setSensitivity(value: number): void;
export declare function initSensitivityControl(): void;
//# sourceMappingURL=controls.d.ts.map