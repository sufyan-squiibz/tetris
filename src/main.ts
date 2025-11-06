import { TetrisGame } from './game';
import { AudioManager } from './audio';
import { ParticleSystem } from './particles';
import { ThemeManager, showNotification } from './themes';
import { initControls, initSensitivityControl } from './controls';
import * as PIXI from 'pixi.js';

// Initialiser le gestionnaire audio
const audioManager = new AudioManager();
(window as any).audioManager = audioManager;

// Initialiser le gestionnaire de thèmes
let themeManager: ThemeManager;
let game: TetrisGame;
let particleSystem: ParticleSystem | null = null;

function addAudioControls(): void {
  const audioControls = document.createElement('div');
  audioControls.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
  `;

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

function registerAudioUnlock(): void {
  const unlock = () => {
    audioManager.unlock();
  };

  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}

function initParticleSystem(): ParticleSystem | null {
  const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
  if (!particlesCanvas) return null;

  const container = document.querySelector('.game-container');
  if (!container) return null;

  const particlesContainer = new PIXI.Container();
  const app = new PIXI.Application({
    view: particlesCanvas,
    width: (container as HTMLElement).offsetWidth,
    height: (container as HTMLElement).offsetHeight,
    background: 0x000000,
    antialias: false
  });

  app.stage.addChild(particlesContainer);

  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const system = new ParticleSystem(particlesContainer, gameCanvas);

  function animateParticles(): void {
    system.update();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    app.renderer.resize(
      (container as HTMLElement).offsetWidth,
      (container as HTMLElement).offsetHeight
    );
  });

  return system;
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le thème
  themeManager = new ThemeManager();
  (window as any).themeManager = themeManager;

  // Initialiser les contrôles audio
  addAudioControls();
  registerAudioUnlock();

  // Initialiser le système de particules
  particleSystem = initParticleSystem();
  (window as any).particleSystem = particleSystem;

  // Initialiser le jeu
  const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!gameCanvas) {
    console.error('Canvas de jeu non trouvé!');
    return;
  }

  game = new TetrisGame(gameCanvas, audioManager, particleSystem || undefined);
  (window as any).game = game;

  // Initialiser le renderer
  game.initialize();
  
  // Rendu initial
  game.getRenderer().render(game.getBoard(), game.getCurrentPiece());

  // Initialiser les contrôles
  initControls(game);
  initSensitivityControl();

  // Événements de contrôle
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const saveScoreBtn = document.getElementById('save-score-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const themeBtn = document.getElementById('theme-btn');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const closeTutorialBtn = document.getElementById('close-tutorial-btn');
  const startTutorialBtn = document.getElementById('start-tutorial-btn');

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
      const playerNameEl = document.getElementById('player-name') as HTMLInputElement;
      if (!playerNameEl) return;

      const name = playerNameEl.value.trim();

      if (!name) {
        showNotification('Veuillez entrer votre nom');
        return;
      }

      if (game.isHighScore(game.getScore())) {
        game.saveScore(name, game.getScore(), 1, 0);
      } else {
        showNotification('Votre score n\'est pas assez élevé pour le classement');
      }

      const gameOverEl = document.getElementById('game-over') as HTMLElement;
      if (gameOverEl) {
        gameOverEl.style.display = 'none';
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (!container) return;

      if (!document.fullscreenElement) {
        (container as HTMLElement).requestFullscreen().catch(err => {
          console.error('Erreur plein écran:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();
      const container = document.querySelector('.game-container');
      if (container) {
        (container as HTMLElement).style.transition = 'background 0.5s ease';
      }
      showNotification(`Thème: ${themeName}`);
    });
  }

  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      const tutorialOverlay = document.getElementById('tutorial-overlay') as HTMLElement;
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'flex';
      }
    });
  }

  if (closeTutorialBtn) {
    closeTutorialBtn.addEventListener('click', () => {
      const tutorialOverlay = document.getElementById('tutorial-overlay') as HTMLElement;
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
      }
    });
  }

  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', () => {
      const tutorialOverlay = document.getElementById('tutorial-overlay') as HTMLElement;
      if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
      }
      game.start();
    });
  }

  // Afficher le tutoriel au premier lancement
  if (!localStorage.getItem('tetris-tutorial-seen')) {
    const tutorialOverlay = document.getElementById('tutorial-overlay') as HTMLElement;
    if (tutorialOverlay) {
      tutorialOverlay.style.display = 'flex';
    }
    localStorage.setItem('tetris-tutorial-seen', 'true');
  }

  // Ne pas démarrer automatiquement - attendre le clic sur start
});
