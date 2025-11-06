// Point d'entrée principal de l'application Tetris

import { TetrisGame } from './game';
import { PixiRenderer } from './renderer';
import { ControlsManager } from './controls';
import { ThemeManager } from './themes';
import { ParticleSystem } from './particles';
import { AudioManager } from './audio';
import { UIManager } from './ui';

// Fonction principale d'initialisation
async function init() {
  try {
    // Récupérer les éléments du DOM
    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    
    if (!gameCanvas) {
      throw new Error('Game canvas not found');
    }

    // Initialiser le renderer PixiJS
    const renderer = new PixiRenderer();
    await renderer.init(gameCanvas);

    // Initialiser le jeu
    const game = new TetrisGame(renderer);
    
    // Initialiser les systèmes auxiliaires
    new ControlsManager(game);
    const themeManager = new ThemeManager();
    const audioManager = new AudioManager();
    const uiManager = new UIManager(game, renderer);
    
    // Initialiser le système de particules si disponible
    let particleSystem: ParticleSystem | null = null;
    if (particlesCanvas) {
      particleSystem = new ParticleSystem(particlesCanvas);
    }

    // Configurer les callbacks du jeu
    game.setOnStatsUpdate((stats) => {
      uiManager.updateStats(stats);
      uiManager.updateNextPieces();
    });

    game.setOnGameOver((stats) => {
      uiManager.showGameOver(stats);
      audioManager.playSound('gameover');
    });

    game.setOnLevelUp((level) => {
      audioManager.playSound('levelup');
      uiManager.showNotification(`Niveau ${level}! 🎉`);
      if (particleSystem) {
        particleSystem.createLevelUpEffect();
      }
    });

    game.setOnLinesClear((lines, combo) => {
      audioManager.playSound('clear');
      
      if (combo > 1 && particleSystem) {
        uiManager.showComboDisplay(combo);
      }
      
      if (lines === 4 && particleSystem) {
        particleSystem.createTetrisExplosion([0], '#FFD700');
      }
    });

    // Charger les high scores
    await game.loadHighScores();
    uiManager.displayHighScores(game.getHighScores());

    // Configurer le bouton de thème
    const themeBtn = document.getElementById('theme-btn');
    themeBtn?.addEventListener('click', () => {
      const themeName = themeManager.nextTheme();
      uiManager.showNotification(`Thème: ${themeName}`);
    });

    // Configurer les contrôles audio
    setupAudioControls(audioManager, uiManager);

    // Configurer les contrôles de sensibilité
    uiManager.setupSensitivityControls();

    // Déverrouiller l'audio au premier clic
    const unlockAudio = () => {
      audioManager.unlock();
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });

    // Rendre les objets disponibles globalement pour le débogage
    (window as any).game = game;
    (window as any).renderer = renderer;
    (window as any).themeManager = themeManager;
    (window as any).audioManager = audioManager;

    console.log('🎮 Tetris Pro chargé avec succès!');
    console.log('✨ Rendu: PixiJS (WebGL)');
    console.log('📝 Langage: TypeScript');
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    alert('Erreur lors du chargement du jeu. Veuillez rafraîchir la page.');
  }
}

function setupAudioControls(audioManager: AudioManager, _uiManager: UIManager) {
  const audioControls = document.createElement('div');
  audioControls.style.position = 'absolute';
  audioControls.style.top = '10px';
  audioControls.style.right = '10px';
  audioControls.style.display = 'flex';
  audioControls.style.gap = '10px';

  const soundBtn = document.createElement('button');
  soundBtn.textContent = audioManager.isSoundEnabled() ? '🔊 Son' : '🔇 Son';
  soundBtn.className = 'btn btn-secondary';
  soundBtn.onclick = () => {
    const enabled = audioManager.toggleSound();
    soundBtn.textContent = enabled ? '🔊 Son' : '🔇 Son';
  };

  const musicBtn = document.createElement('button');
  musicBtn.textContent = audioManager.isMusicEnabled() ? '🎵 Musique (ON)' : '🎵 Musique (OFF)';
  musicBtn.className = 'btn btn-secondary';
  musicBtn.onclick = () => {
    const enabled = audioManager.toggleMusic();
    musicBtn.textContent = enabled ? '🎵 Musique (ON)' : '🎵 Musique (OFF)';
  };

  audioControls.appendChild(soundBtn);
  audioControls.appendChild(musicBtn);

  const container = document.querySelector('.game-container');
  container?.appendChild(audioControls);
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
