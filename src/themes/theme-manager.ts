// Gestionnaire de thèmes avec TypeScript
import type { Theme, PieceType } from '../types';

const THEMES: Record<string, Theme> = {
  classic: {
    name: 'Classique',
    background: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
    boardBg: 0x1a1a2e,
    gridColor: 0x34495e,
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
    boardBg: 0x0a0a1a,
    gridColor: 0x1a1a3a,
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
    boardBg: 0x0f380f,
    gridColor: 0x1a5f1a,
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
    boardBg: 0x0a0a0a,
    gridColor: 0x222222,
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
  private currentTheme: string;
  private themeKeys: string[];
  private themeIndex: number;

  constructor() {
    this.themeKeys = Object.keys(THEMES);
    this.themeIndex = 0;
    this.currentTheme = 'classic';

    // Charger le thème sauvegardé
    const saved = localStorage.getItem('tetris-theme');
    if (saved && THEMES[saved]) {
      this.currentTheme = saved;
      this.themeIndex = this.themeKeys.indexOf(saved);
    }

    this.applyTheme();
    this.setupThemeButton();
  }

  nextTheme(): string {
    this.themeIndex = (this.themeIndex + 1) % this.themeKeys.length;
    this.currentTheme = this.themeKeys[this.themeIndex];
    this.applyTheme();
    localStorage.setItem('tetris-theme', this.currentTheme);
    return THEMES[this.currentTheme].name;
  }

  private applyTheme(): void {
    const theme = THEMES[this.currentTheme];
    const root = document.documentElement;
    const container = document.querySelector('.game-container') as HTMLElement;

    if (container) {
      container.style.background = theme.background;
    }

    // Appliquer les variables CSS
    root.style.setProperty('--theme-bg', theme.background);
    root.style.setProperty('--board-bg', `#${theme.boardBg.toString(16).padStart(6, '0')}`);
    root.style.setProperty('--grid-color', `#${theme.gridColor.toString(16).padStart(6, '0')}`);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--accent-color', theme.accentColor);

    // Appliquer les couleurs des pièces
    Object.keys(theme.pieces).forEach(piece => {
      const color = theme.pieces[piece as PieceType];
      root.style.setProperty(`--piece-${piece}`, `#${color.toString(16).padStart(6, '0')}`);
    });

    // Effets spéciaux
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

  private setupThemeButton(): void {
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const themeName = this.nextTheme();

        // Animation de changement
        const container = document.querySelector('.game-container') as HTMLElement;
        if (container) {
          container.style.transition = 'background 0.5s ease';
        }

        // Notification
        this.showNotification(`Thème: ${themeName}`);
      });
    }
  }

  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  getPieceColor(pieceType: PieceType): number {
    return THEMES[this.currentTheme].pieces[pieceType];
  }

  getTheme(): Theme {
    return THEMES[this.currentTheme];
  }
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes comboPopup {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
