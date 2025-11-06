import { TetrisGame } from './game';
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
export declare function initControls(game: TetrisGame): void;
export declare function setSensitivity(value: string): void;
export declare function initSensitivityControl(): void;
//# sourceMappingURL=controls.d.ts.map