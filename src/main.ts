import { TetrisGame } from './game';
import { AudioManager, addAudioControls, registerAudioUnlock } from './audio';
import { ThemeManager, showNotification } from './themes';
import { ParticleSystem } from './particles';
import { Renderer } from './render';
import { initControls, initSensitivityControl } from './controls';

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les systèmes
  const audioManager = new AudioManager();
  const themeManager = new ThemeManager();
  const particleSystem = new ParticleSystem();
  const renderer = new Renderer();

  // Créer l'instance du jeu
  const game = new TetrisGame(audioManager, particleSystem, renderer);

  // Exposer globalement pour compatibilité
  (window as any).game = game;
  (window as any).audioManager = audioManager;
  (window as any).particleSystem = particleSystem;
  (window as any).themeManager = themeManager;

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

  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const playerNameEl = document.getElementById('player-name') as HTMLInputElement | null;
      const name = playerNameEl?.value.trim() || '';

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      if (game.isHighScore(game.score)) {
        game.saveScore(name, game.score, game.level, game.lines);
      } else {
        showNotification("Votre score n'est pas assez élevé pour le classement");
      }

      const gameOverEl = document.getElementById('game-over');
      if (gameOverEl) gameOverEl.style.display = 'none';
    });
  }

  // Plein écran
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (container) {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch((err) => {
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
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'flex';
    });
  }

  if (closeTutorialBtn) {
    closeTutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'none';
    });
  }

  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'none';
      game.start();
    });
  }

  // Afficher le tutoriel au premier lancement
  if (!localStorage.getItem('tetris-tutorial-seen')) {
    if (tutorialOverlay) tutorialOverlay.style.display = 'flex';
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Thème
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();
      const container = document.querySelector('.game-container');
      if (container) {
        container.setAttribute('style', 'transition: background 0.5s ease');
      }
      showNotification(`Thème: ${themeName}`);
    });
  }

  // Initialiser les contrôles clavier
  initControls(game);

  // Initialiser le contrôle de sensibilité
  initSensitivityControl(showNotification);

  // Initialiser l'audio
  addAudioControls(audioManager);
  registerAudioUnlock(audioManager);

  // Rendu initial
  game.draw();
});
