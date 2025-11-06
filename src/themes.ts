// Système de thèmes visuels pour Tetris
import type { Theme } from './types';
import { TETRIS_PIECES } from './pieces';

export const THEMES: Record<string, Theme> = {
  classic: {
    name: 'Classique',
    background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
    boardBg: '#1a1a2e',
    gridColor: '#34495e',
    textColor: '#ecf0f1',
    accentColor: '#e74c3c',
    pieces: {
      I: '#00ffff',
      J: '#0000ff',
      L: '#ff7f00',
      O: '#ffff00',
      S: '#00ff00',
      T: '#800080',
      Z: '#ff0000'
    }
  },
  neon: {
    name: 'Néon',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    boardBg: '#0a0a1a',
    gridColor: '#1a1a3a',
    textColor: '#00ffff',
    accentColor: '#ff00ff',
    pieces: {
      I: '#00ffff',
      J: '#0080ff',
      L: '#ff8000',
      O: '#ffff00',
      S: '#00ff80',
      T: '#ff00ff',
      Z: '#ff0080'
    },
    glow: true
  },
  retro: {
    name: 'Rétro',
    background: 'linear-gradient(135deg, #1a5f1a, #0d3d0d)',
    boardBg: '#0f380f',
    gridColor: '#1a5f1a',
    textColor: '#9bbc0f',
    accentColor: '#8bac0f',
    pieces: {
      I: '#9bbc0f',
      J: '#8bac0f',
      L: '#9bbc0f',
      O: '#8bac0f',
      S: '#9bbc0f',
      T: '#8bac0f',
      Z: '#9bbc0f'
    },
    pixelated: true
  },
  dark: {
    name: 'Sombre',
    background: 'linear-gradient(135deg, #000000, #1a1a1a)',
    boardBg: '#0a0a0a',
    gridColor: '#222222',
    textColor: '#ffffff',
    accentColor: '#ff6b6b',
    pieces: {
      I: '#4ecdc4',
      J: '#45b7d1',
      L: '#f7b731',
      O: '#fed330',
      S: '#26de81',
      T: '#a55eea',
      Z: '#fc5c65'
    }
  }
};

export class ThemeManager {
  private currentTheme: string;
  private themeKeys: string[];
  private themeIndex: number;

  constructor() {
    this.currentTheme = 'classic';
    this.themeKeys = Object.keys(THEMES);
    this.themeIndex = 0;
    
    const saved = localStorage.getItem('tetris-theme');
    if (saved && THEMES[saved]) {
      this.currentTheme = saved;
      this.themeIndex = this.themeKeys.indexOf(saved);
    }
    
    this.applyTheme();
  }

  nextTheme(): string {
    this.themeIndex = (this.themeIndex + 1) % this.themeKeys.length;
    this.currentTheme = this.themeKeys[this.themeIndex];
    this.applyTheme();
    localStorage.setItem('tetris-theme', this.currentTheme);
    return THEMES[this.currentTheme].name;
  }

  applyTheme(): void {
    const theme = THEMES[this.currentTheme];
    const root = document.documentElement;
    const container = document.querySelector('.game-container') as HTMLElement;
    
    if (container) {
      container.style.background = theme.background;
    }
    
    root.style.setProperty('--theme-bg', theme.background);
    root.style.setProperty('--board-bg', theme.boardBg);
    root.style.setProperty('--grid-color', theme.gridColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    Object.keys(theme.pieces).forEach(piece => {
      root.style.setProperty(`--piece-${piece}`, theme.pieces[piece as keyof typeof theme.pieces]);
    });
    
    if (theme.glow) {
      root.style.setProperty('--glow-effect', '0 0 10px currentColor');
    } else {
      root.style.setProperty('--glow-effect', 'none');
    }
    
    if (theme.pixelated) {
      root.style.setProperty('--pixel-effect', 'pixelated');
    } else {
      root.style.setProperty('--pixel-effect', 'auto');
    }
    
    TETRIS_PIECES.I.color = theme.pieces.I;
    TETRIS_PIECES.J.color = theme.pieces.J;
    TETRIS_PIECES.L.color = theme.pieces.L;
    TETRIS_PIECES.O.color = theme.pieces.O;
    TETRIS_PIECES.S.color = theme.pieces.S;
    TETRIS_PIECES.T.color = theme.pieces.T;
    TETRIS_PIECES.Z.color = theme.pieces.Z;
  }

  getPieceColor(pieceType: string): string {
    return THEMES[this.currentTheme].pieces[pieceType as keyof typeof THEMES[typeof this.currentTheme]['pieces']];
  }

  getTheme(): Theme {
    return THEMES[this.currentTheme];
  }
}
