// Point d'entrée principal de l'application Tetris

import { TetrisGame } from './game/TetrisGame';
import { TetrisRenderer } from './game/Renderer';
import { ControlsManager } from './game/Controls';
import { AudioManager } from './utils/AudioManager';
import { ThemeManager } from './utils/ThemeManager';
import { ParticleSystem } from './utils/ParticleSystem';

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

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
  // Récupérer les éléments canvas
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;

  if (!gameCanvas || !particlesCanvas) {
    console.error('Canvas elements not found!');
    return;
  }

  // Initialiser les systèmes
  const renderer = new TetrisRenderer(gameCanvas);
  const audioManager = new AudioManager();
  const themeManager = new ThemeManager();
  const particleSystem = new ParticleSystem(particlesCanvas);

  // Initialiser le jeu
  const game = new TetrisGame(renderer);
  game.setAudioManager(audioManager);
  game.setParticleSystem(particleSystem);

  // Initialiser les contrôles
  const controls = new ControlsManager(game);

  // Exposer globalement pour debug
  (window as any).game = game;
  (window as any).audioManager = audioManager;
  (window as any).themeManager = themeManager;
  (window as any).particleSystem = particleSystem;

  // Événements de contrôle du jeu
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

      if (game.isHighScore(game.getScore())) {
        game.saveScore(name);
      } else {
        showNotification("Votre score n'est pas assez élevé pour le classement");
      }

      const gameOverDiv = document.getElementById('game-over');
      if (gameOverDiv) {
        gameOverDiv.style.display = 'none';
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

      // Animation de changement
      const container = document.querySelector('.game-container') as HTMLElement;
      if (container) {
        container.style.transition = 'background 0.5s ease';
      }

      // Notification
      showNotification(`Thème: ${themeName}`);
    });
  }

  // Contrôles audio
  function addAudioControls(): void {
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

  // Débloquer l'audio
  function registerAudioUnlock(): void {
    const unlock = () => {
      audioManager.unlock();
    };

    const onceOptions = { once: true, capture: false };
    document.addEventListener('pointerdown', unlock, onceOptions);
    document.addEventListener('keydown', unlock, onceOptions);
  }

  addAudioControls();
  registerAudioUnlock();

  // Initialiser le contrôle de sensibilité
  function initSensitivityControl(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
      const value = parseInt(savedSensitivity);
      controls.setSensitivity(value);
      if (slider) slider.value = savedSensitivity;
      if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
    }

    // Événement du slider
    if (slider) {
      slider.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        controls.setSensitivity(value);
        if (valueDisplay) {
          valueDisplay.textContent = `${value}ms`;
        }

        // Mettre à jour les boutons presets
        presetButtons.forEach((btn) => {
          btn.classList.remove('active');
          if ((btn as HTMLElement).dataset.value === value.toString()) {
            btn.classList.add('active');
          }
        });
      });
    }

    // Événements des boutons presets
    presetButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = parseInt((btn as HTMLElement).dataset.value || '30');
        controls.setSensitivity(value);

        if (slider) slider.value = value.toString();
        if (valueDisplay) valueDisplay.textContent = `${value}ms`;

        // Mettre à jour l'état actif
        presetButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Notification visuelle
        showNotification(`Sensibilité: ${btn.textContent}`);
      });
    });

    // Mettre à jour l'état actif initial
    presetButtons.forEach((btn) => {
      if ((btn as HTMLElement).dataset.value === controls.getMoveDelay().toString()) {
        btn.classList.add('active');
      }
    });
  }

  initSensitivityControl();
});

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
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
