// Point d'entrée principal du jeu Tetris
import { TetrisGame } from './game';
import { initControls, initSensitivityControl } from './controls';
import { audioManager, addAudioControls, registerAudioUnlock } from './audio';
import { ThemeManager, showNotification } from './themes';
import { ParticleSystem } from './particles';

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire de thèmes
  const themeManager = new ThemeManager();
  (window as any).themeManager = themeManager;

  // Initialiser le système de particules
  const particleSystem = new ParticleSystem();
  (window as any).particleSystem = particleSystem;

  // Initialiser le gestionnaire audio
  (window as any).audioManager = audioManager;
  addAudioControls();
  registerAudioUnlock();

  // Initialiser le jeu
  const game = new TetrisGame();
  (window as any).game = game;

  // Événements de contrôle
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const saveScoreBtn = document.getElementById('save-score-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const closeTutorialBtn = document.getElementById('close-tutorial-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  const themeBtn = document.getElementById('theme-btn');

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

  // Initialiser les contrôles clavier
  initControls(game);

  // Événement pour sauvegarder le score
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const playerNameEl = document.getElementById('player-name') as HTMLInputElement;
      if (!playerNameEl) return;

      const name = playerNameEl.value.trim();

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      if (game.isHighScore(game.score)) {
        game.saveScore(name, game.score, game.level, game.lines);
      } else {
        showNotification('Votre score n\'est pas assez élevé pour le classement');
      }

      const gameOverEl = document.getElementById('game-over');
      if (gameOverEl) {
        gameOverEl.style.display = 'none';
      }
    });
  }

  // Plein écran
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
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'flex';
      }
    });
  }

  if (closeTutorialBtn) {
    closeTutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
      }
    });
  }

  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
      }
      game.start();
    });
  }

  // Afficher le tutoriel au premier lancement
  if (!localStorage.getItem('tetris-tutorial-seen')) {
    if (tutorialOverlay) {
      tutorialOverlay.style.display = 'flex';
    }
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Bouton de changement de thème
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();

      // Animation de changement
      const container = document.querySelector('.game-container');
      if (container) {
        container.setAttribute('style', 'transition: background 0.5s ease;');
      }

      // Notification
      showNotification(`Thème: ${themeName}`);
    });
  }

  // Initialiser le contrôle de sensibilité
  initSensitivityControl();

  // Rendu initial
  game.draw();
});
