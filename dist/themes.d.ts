import { ThemeConfig, PieceType } from './types';
export declare class ThemeManager {
    private currentTheme;
    private themeKeys;
    private themeIndex;
    constructor();
    nextTheme(): string;
    private applyTheme;
    getPieceColor(pieceType: PieceType): string;
    getTheme(): ThemeConfig;
}
export declare function initThemeManager(): ThemeManager;
//# sourceMappingURL=themes.d.ts.map