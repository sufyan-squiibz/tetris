import { Theme, PieceType } from '../types';

export const THEMES: Record<string, Theme> = {
  classic: {
    name: 'Classique',
    background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
    boardBg: '#1a1a2e',
    gridColor: '#34495e',
    textColor: '#ecf0f1',
    accentColor: '#e74c3c',
    pieces: {
      I: 0x00ffff,
      J: 0x0000ff,
      L: 0xff7f00,
      O: 0xffff00,
      S: 0x00ff00,
      T: 0x800080,
      Z: 0xff0000
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
      I: 0x00ffff,
      J: 0x0080ff,
      L: 0xff8000,
      O: 0xffff00,
      S: 0x00ff80,
      T: 0xff00ff,
      Z: 0xff0080
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
      I: 0x9bbc0f,
      J: 0x8bac0f,
      L: 0x9bbc0f,
      O: 0x8bac0f,
      S: 0x9bbc0f,
      T: 0x8bac0f,
      Z: 0x9bbc0f
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
      I: 0x4ecdc4,
      J: 0x45b7d1,
      L: 0xf7b731,
      O: 0xfed330,
      S: 0x26de81,
      T: 0xa55eea,
      Z: 0xfc5c65
    }
  }
};

export class ThemeManager {
  private currentTheme: string = 'classic';
  private themeKeys: string[];
  private themeIndex: number = 0;

  constructor() {
    this.themeKeys = Object.keys(THEMES);
    this.loadTheme();
  }

  private loadTheme(): void {
    const saved = localStorage.getItem('tetris-theme');
    if (saved && THEMES[saved]) {
      this.currentTheme = saved;
      this.themeIndex = this.themeKeys.indexOf(saved);
    }
  }

  public nextTheme(): string {
    this.themeIndex = (this.themeIndex + 1) % this.themeKeys.length;
    this.currentTheme = this.themeKeys[this.themeIndex];
    this.applyTheme();
    localStorage.setItem('tetris-theme', this.currentTheme);
    return THEMES[this.currentTheme].name;
  }

  public applyTheme(): void {
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
      const hex = theme.pieces[piece as PieceType].toString(16).padStart(6, '0');
      root.style.setProperty(`--piece-${piece}`, `#${hex}`);
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
  }

  public getTheme(): Theme {
    return THEMES[this.currentTheme];
  }

  public getPieceColors(): Record<string, number> {
    return THEMES[this.currentTheme].pieces;
  }
}
