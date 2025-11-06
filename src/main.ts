import './styles.css';
import { TetrisGame } from './core/TetrisGame';
import { ThemeManager } from './systems/ThemeManager';
import { AudioManager } from './systems/AudioManager';

// Fonction pour afficher une notification
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

// Ajouter les contrôles audio
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

  const container = document.querySelector('.game-container');
  if (container) {
    container.appendChild(audioControls);
  }
}

// Initialiser le contrôle de sensibilité
function initSensitivityControl(game: TetrisGame): void {
  const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
  const valueDisplay = document.getElementById('sensitivity-value');
  const presetButtons = document.querySelectorAll('.preset-btn');

  const savedSensitivity = game.getSensitivity();
  if (slider) slider.value = savedSensitivity.toString();
  if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;

  if (slider) {
    slider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      game.setSensitivity(value);
      if (valueDisplay) {
        valueDisplay.textContent = `${value}ms`;
      }

      presetButtons.forEach((btn) => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-value') === value.toString()) {
          btn.classList.add('active');
        }
      });
    });
  }

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = parseInt(btn.getAttribute('data-value') || '30');
      game.setSensitivity(value);

      if (slider) slider.value = value.toString();
      if (valueDisplay) valueDisplay.textContent = `${value}ms`;

      presetButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const btnText = btn.textContent || '';
      showNotification(`Sensibilité: ${btnText}`);
    });
  });

  presetButtons.forEach((btn) => {
    if (btn.getAttribute('data-value') === savedSensitivity.toString()) {
      btn.classList.add('active');
    }
  });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les gestionnaires
  const themeManager = new ThemeManager();
  const audioManager = new AudioManager();

  // Récupérer les canvas
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
  const nextCanvases = [
    document.getElementById('next-canvas-1') as HTMLCanvasElement,
    document.getElementById('next-canvas-2') as HTMLCanvasElement,
    document.getElementById('next-canvas-3') as HTMLCanvasElement,
  ];
  const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;

  // Initialiser le jeu
  const game = new TetrisGame(gameCanvas, holdCanvas, nextCanvases, particlesCanvas, themeManager, audioManager);

  // Boutons de contrôle du jeu
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

  // Sauvegarder le score
  const saveScoreBtn = document.getElementById('save-score-btn');
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('player-name') as HTMLInputElement;
      const name = nameInput.value.trim();

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      if (game.isHighScore()) {
        game.saveScore(name);
      } else {
        showNotification("Votre score n'est pas assez élevé pour le classement");
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

  // Initialiser les contrôles audio
  addAudioControls(audioManager);

  // Initialiser le contrôle de sensibilité
  initSensitivityControl(game);

  // Déverrouiller l'audio au premier clic
  const unlockAudio = () => {
    audioManager.unlock();
  };
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });

  // Rendre le jeu accessible globalement pour le débogage
  (window as any).game = game;
});
