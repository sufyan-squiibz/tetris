// Point d'entrée principal de l'application Tetris en TypeScript
import { TetrisGame } from './game/tetris';
import { ControlsManager } from './utils/controls';
import { AudioManager } from './audio/audio-manager';
import { ParticleSystem } from './particles/particle-system';
import { ThemeManager } from './themes/theme-manager';

// Fonction pour afficher les notifications
function showNotification(message: string): void {
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

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initialisation de Tetris Pro (TypeScript + PixiJS)...');

  // Récupérer les éléments du DOM
  const gameElement = document.getElementById('game-canvas');
  const particlesElement = document.getElementById('particles-canvas');
  const holdElement = document.getElementById('hold-canvas');
  const nextElements = [
    document.getElementById('next-canvas-1'),
    document.getElementById('next-canvas-2'),
    document.getElementById('next-canvas-3')
  ];

  if (!gameElement || !particlesElement || !holdElement || nextElements.some(el => !el)) {
    console.error('❌ Éléments DOM manquants');
    return;
  }

  // Initialiser les systèmes
  const audioManager = new AudioManager();
  const particleSystem = new ParticleSystem(particlesElement);
  const themeManager = new ThemeManager();

  // Initialiser le jeu
  const game = new TetrisGame(gameElement, audioManager, particleSystem);
  game.setupHoldAndNext(holdElement, nextElements as HTMLElement[]);

  // Initialiser les contrôles
  new ControlsManager(game);

  // Exposer globalement pour le débogage (optionnel)
  (window as any).game = game;
  (window as any).audioManager = audioManager;
  (window as any).themeManager = themeManager;

  // Événements des boutons
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const closeTutorialBtn = document.getElementById('close-tutorial-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  const saveScoreBtn = document.getElementById('save-score-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      game.start();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      game.togglePause();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      game.resetGame();
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (!container) return;

      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error('Erreur plein écran:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Tutoriel
  const tutorialOverlay = document.getElementById('tutorial-overlay');

  if (tutorialBtn && tutorialOverlay) {
    tutorialBtn.addEventListener('click', () => {
      tutorialOverlay.style.display = 'flex';
    });
  }

  if (closeTutorialBtn && tutorialOverlay) {
    closeTutorialBtn.addEventListener('click', () => {
      tutorialOverlay.style.display = 'none';
    });
  }

  if (startTutorialBtn && tutorialOverlay) {
    startTutorialBtn.addEventListener('click', () => {
      tutorialOverlay.style.display = 'none';
      game.start();
    });
  }

  // Afficher le tutoriel au premier lancement
  if (!localStorage.getItem('tetris-tutorial-seen') && tutorialOverlay) {
    tutorialOverlay.style.display = 'flex';
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Événement pour sauvegarder le score
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
      const name = playerNameInput?.value.trim();

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      const stats = game.getStats();
      if (game.isHighScore(stats.score)) {
        game.saveScore(name);
      } else {
        showNotification('Votre score n\'est pas assez élevé pour le classement');
      }

      const gameOverEl = document.getElementById('game-over');
      if (gameOverEl) {
        gameOverEl.style.display = 'none';
      }
    });
  }

  console.log('✅ Tetris Pro initialisé avec succès !');
  console.log('🎨 Renderer: PixiJS (WebGL)');
  console.log('📦 Langage: TypeScript');
});
