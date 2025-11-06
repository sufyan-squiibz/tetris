export interface Theme {
    name: string;
    background: string;
    boardBg: string;
    gridColor: string;
    textColor: string;
    accentColor: string;
    pieces: {
        I: string;
        J: string;
        L: string;
        O: string;
        S: string;
        T: string;
        Z: string;
    };
    glow?: boolean;
    pixelated?: boolean;
}
export declare const THEMES: {
    [key: string]: Theme;
};
export declare class ThemeManager {
    private currentTheme;
    private themeKeys;
    private themeIndex;
    constructor();
    nextTheme(): string;
    applyTheme(): void;
    getPieceColor(pieceType: string): string;
    getTheme(): Theme;
    getCurrentThemeName(): string;
}
export declare function showNotification(message: string): void;
//# sourceMappingURL=themes.d.ts.map