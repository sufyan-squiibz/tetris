// Point d'entrée principal de l'application Tetris
import { TetrisGame } from './game';
import { TetrisRenderer } from './renderer';
import { initControls, initSensitivityControl } from './controls';
import { ParticleSystem } from './particles';
import { ThemeManager } from './themes';
import { AudioManager, addAudioControls, registerAudioUnlock } from './audio';
import { showNotification } from './utils';
import './style.css';

// Rendre showNotification disponible globalement
(window as any).showNotification = showNotification;

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le jeu
  const game = new TetrisGame();
  (window as any).game = game;
  
  // Initialiser le renderer PixiJS
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!gameCanvas) {
    throw new Error('Canvas de jeu non trouvé');
  }
  
  const renderer = new TetrisRenderer(gameCanvas);
  game.setRenderer(renderer);
  
  // Initialiser les systèmes
  const particleSystem = new ParticleSystem();
  (window as any).particleSystem = particleSystem;
  
  const themeManager = new ThemeManager();
  (window as any).themeManager = themeManager;
  
  const audioManager = new AudioManager();
  (window as any).audioManager = audioManager;
  
  // Initialiser les contrôles
  initControls(game);
  initSensitivityControl();
  
  // Ajouter les contrôles audio
  addAudioControls(audioManager);
  registerAudioUnlock(audioManager);
  
  // Événements de contrôle du jeu
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      game.start();
    });
  }

  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      game.togglePause();
    });
  }

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      game.resetGame();
    });
  }

  // Événement pour sauvegarder le score
  const saveScoreBtn = document.getElementById('save-score-btn');
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
      const name = playerNameInput?.value.trim() || '';
      
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
        (gameOverEl as HTMLElement).style.display = 'none';
      }
    });
  }

  // Plein écran
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (!document.fullscreenElement && container) {
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
  const tutorialBtn = document.getElementById('tutorial-btn');
  if (tutorialBtn && tutorialOverlay) {
    tutorialBtn.addEventListener('click', () => {
      (tutorialOverlay as HTMLElement).style.display = 'flex';
    });
  }

  const closeTutorialBtn = document.getElementById('close-tutorial-btn');
  if (closeTutorialBtn && tutorialOverlay) {
    closeTutorialBtn.addEventListener('click', () => {
      (tutorialOverlay as HTMLElement).style.display = 'none';
    });
  }

  const startTutorialBtn = document.getElementById('start-tutorial-btn');
  if (startTutorialBtn && tutorialOverlay) {
    startTutorialBtn.addEventListener('click', () => {
      (tutorialOverlay as HTMLElement).style.display = 'none';
      game.start();
    });
  }

  // Afficher le tutoriel au premier lancement
  if (!localStorage.getItem('tetris-tutorial-seen') && tutorialOverlay) {
    (tutorialOverlay as HTMLElement).style.display = 'flex';
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Bouton de changement de thème
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();
      
      const container = document.querySelector('.game-container') as HTMLElement;
      if (container) {
        container.style.transition = 'background 0.5s ease';
      }
      
      showNotification(`Thème: ${themeName}`);
    });
  }

  // Rendu initial
  game.draw();
  
  console.log('Tetris Pro initialisé avec TypeScript + PixiJS! 🎮');
});
