import { Theme } from './types';
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
}
export declare function showNotification(message: string): void;
//# sourceMappingURL=themes.d.ts.map