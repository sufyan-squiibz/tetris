import { TetrisGame } from './game';
import { initControls } from './controls';
import { AudioManager, initAudioControls } from './audio';
import { ParticleSystem } from './particles';
import { initThemeManager } from './themes';
import { showNotification } from './utils';
import '../public/css/style.css';

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le canvas
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!gameCanvas) {
    console.error('Canvas game-canvas non trouvé');
    return;
  }

  // Créer le jeu
  const game = new TetrisGame(gameCanvas);
  (window as any).game = game; // Rendre accessible globalement pour debug

  // Initialiser les contrôles
  initControls(game);

  // Initialiser l'audio
  const audioManager = new AudioManager();
  (window as any).audioManager = audioManager;
  initAudioControls(audioManager);
  addAudioControls(audioManager);

  // Initialiser le système de particules
  const particleSystem = new ParticleSystem();
  (window as any).particleSystem = particleSystem;

  // Initialiser le gestionnaire de thèmes
  const themeManager = initThemeManager();
  (window as any).themeManager = themeManager;

  // Événements de contrôle
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
      const name = playerNameInput?.value.trim();

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      const stats = game.getStats();
      if (game.isHighScore(stats.score)) {
        game.saveScore(name, stats.score, stats.level, stats.lines);
      } else {
        showNotification("Votre score n'est pas assez élevé pour le classement");
      }

      const gameOverEl = document.getElementById('game-over');
      if (gameOverEl) gameOverEl.style.display = 'none';
    });
  }

  // Plein écran
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (!document.fullscreenElement && container) {
        container.requestFullscreen().catch((err) => {
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
  if (!localStorage.getItem('tetris-tutorial-seen') && tutorialOverlay) {
    tutorialOverlay.style.display = 'flex';
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }
});

function addAudioControls(audioManager: AudioManager): void {
  const audioControls = document.createElement('div');
  audioControls.style.position = 'absolute';
  audioControls.style.top = '10px';
  audioControls.style.right = '10px';
  audioControls.style.display = 'flex';
  audioControls.style.gap = '10px';

  const soundBtn = document.createElement('button');
  soundBtn.textContent = '🔊 Son';
  soundBtn.className = 'btn btn-secondary';
  soundBtn.onclick = () => {
    const enabled = audioManager.toggleSound();
    soundBtn.textContent = enabled ? '🔊 Son' : '🔇 Son';
  };

  const musicBtn = document.createElement('button');
  musicBtn.textContent = '🎵 Musique';
  musicBtn.className = 'btn btn-secondary';
  musicBtn.onclick = () => {
    const enabled = audioManager.toggleMusic();
    musicBtn.textContent = enabled ? '🎵 Musique (ON)' : '🎵 Musique (OFF)';
  };

  audioControls.appendChild(soundBtn);
  audioControls.appendChild(musicBtn);

  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.appendChild(audioControls);
  }
}

// Ajouter les animations CSS pour les notifications
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
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
