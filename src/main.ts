import { TetrisGame } from './game';
import { initControls, initSensitivityControl } from './controls';
import { audioManager, addAudioControls, registerAudioUnlock } from './audio';
import { ParticleSystem } from './particles';
import { ThemeManager, showNotification } from './themes';

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!gameCanvas) {
    console.error('Canvas de jeu non trouvé!');
    return;
  }

  // Initialiser le jeu
  const game = new TetrisGame(gameCanvas);
  (window as any).game = game;
  
  // Initialiser l'audio
  (window as any).audioManager = audioManager;
  addAudioControls();
  registerAudioUnlock();
  
  // Initialiser les particules
  const particleSystem = new ParticleSystem();
  (window as any).particleSystem = particleSystem;
  
  // Initialiser les thèmes
  const themeManager = new ThemeManager();
  (window as any).themeManager = themeManager;
  
  // Événements de contrôle
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  
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
  initSensitivityControl();

  // Événement pour sauvegarder le score
  const saveScoreBtn = document.getElementById('save-score-btn');
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
      const name = playerNameInput?.value.trim();
      
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
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (container) {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(err => {
            console.error('Erreur plein écran:', err);
          });
        } else {
          document.exitFullscreen();
        }
      }
    });
  }

  // Tutoriel
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const closeTutorialBtn = document.getElementById('close-tutorial-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  
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
  if (!localStorage.getItem('tetris-tutorial-seen')) {
    if (tutorialOverlay) {
      tutorialOverlay.style.display = 'flex';
    }
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Bouton de changement de thème
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();
      showNotification(`Thème: ${themeName}`);
    });
  }

  // Rendu initial
  game.draw();
});
