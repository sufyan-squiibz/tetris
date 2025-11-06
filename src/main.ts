import * as PIXI from 'pixi.js';
import { TetrisGame } from './core/Game';
import { EnhancedRenderer } from './rendering/EnhancedRenderer';
import { ControlsManager } from './core/Controls';
import { AudioManager } from './audio/AudioManager';
import { PixiParticleSystem } from './effects/PixiParticles';
import { AnimationSystem } from './effects/AnimationSystem';
import { ThemeManager } from './config/themes';
import { UIManager } from './ui/UIManager';
import { HighScore } from './types';

class TetrisApp {
  private game: TetrisGame;
  private renderer: EnhancedRenderer;
  private controls: ControlsManager;
  private audio: AudioManager;
  private pixiParticles!: PixiParticleSystem;
  private animations: AnimationSystem;
  private themeManager: ThemeManager;
  private ui: UIManager;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;

  constructor() {
    this.game = new TetrisGame();
    this.renderer = new EnhancedRenderer(document.getElementById('game-canvas') as HTMLCanvasElement);
    this.controls = new ControlsManager(this.game);
    this.audio = new AudioManager();
    this.animations = new AnimationSystem();
    this.themeManager = new ThemeManager();
    this.ui = new UIManager();

    this.setupGameCallbacks();
  }

  public async init(): Promise<void> {
    await this.renderer.init();
    
    // Initialize PixiJS particle system using renderer's container
    const particlesContainer = new PIXI.Container();
    this.renderer.getApp().stage.addChild(particlesContainer);
    this.pixiParticles = new PixiParticleSystem(particlesContainer);
    
    // Start particle update loop
    this.renderer.getApp().ticker.add((delta) => {
      this.pixiParticles.update(delta);
    });
    
    this.controls.init();
    this.themeManager.applyTheme();
    this.game.updatePieceColors(this.themeManager.getPieceColors());
    
    this.setupUIEvents();
    this.setupSensitivityControls();
    this.setupThemeButton();
    this.loadHighScores();
    
    // Initialiser l'audio au premier clic
    document.addEventListener('pointerdown', () => this.audio.unlock(), { once: true });
    document.addEventListener('keydown', () => this.audio.unlock(), { once: true });
    
    // Afficher le tutoriel au premier lancement
    if (!localStorage.getItem('tetris-tutorial-seen')) {
      this.showTutorial();
      localStorage.setItem('tetris-tutorial-seen', 'true');
    }
    
    // Dessiner l'état initial
    this.renderer.render(this.game);
    this.updateNextPiecesDisplay();
    this.updateHoldDisplay();
    
    console.log('🎮 Enhanced Tetris initialized with WebGL rendering!');
  }

  private setupGameCallbacks(): void {
    this.game.onLinesClear = async (lines, rows) => {
      this.audio.playSound('clear');
      
      // Get board position for particles
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      const boardRect = canvas.getBoundingClientRect();
      const containerRect = canvas.getBoundingClientRect();
      
      const boardX = boardRect.left - containerRect.left;
      const boardY = boardRect.top - containerRect.top;
      const width = boardRect.width;
      
      // Create GPU-accelerated particle effects
      rows.forEach(row => {
        const color = 0xFFD700; // Gold color for cleared lines
        this.pixiParticles.createLineExplosion(row, color, boardX, boardY, width);
      });
      
      // Special Tetris explosion
      if (lines === 4) {
        const centerX = boardX + width / 2;
        const centerY = boardY + boardRect.height / 2;
        this.pixiParticles.createTetrisExplosion(centerX, centerY, 0xFFD700);
        
        // Shake effect for impact
        this.animations.shake(this.renderer.getApp().stage, 8, { duration: 0.4 });
      }
      
      // Combo display with animation
      if (this.game.stats.combo > 1) {
        this.ui.showComboDisplay(this.game.stats.combo);
        const centerX = boardX + width / 2;
        const centerY = boardY + boardRect.height / 3;
        this.pixiParticles.createComboEffect(centerX, centerY, this.game.stats.combo);
      }
      
      // Animated line clear
      await this.renderer.animateLineClear(rows);
    };

    this.game.onPieceLock = () => {
      this.audio.playSound('drop');
      this.updateNextPiecesDisplay();
      this.updateHoldDisplay();
    };

    this.game.onLevelUp = (_newLevel) => {
      this.audio.playSound('levelup');
      
      // Get board center for effects
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      const boardRect = canvas.getBoundingClientRect();
      const containerRect = canvas.getBoundingClientRect();
      
      const centerX = (boardRect.left - containerRect.left) + boardRect.width / 2;
      const centerY = (boardRect.top - containerRect.top) + boardRect.height / 2;
      
      // Epic level up effect
      this.pixiParticles.createLevelUpEffect(centerX, centerY);
      this.animations.pulse(this.renderer.getApp().stage, { duration: 0.6 });
    };

    this.game.onGameOver = (stats) => {
      this.audio.playSound('gameover');
      this.ui.showGameOver(stats);
      this.animations.fadeOut(this.renderer.getApp().stage, {
        duration: 0.8,
        onComplete: () => {
          this.renderer.getApp().stage.alpha = 1;
        }
      });
    };

    this.game.onScoreUpdate = (stats) => {
      this.ui.updateStats(stats);
    };
  }

  private setupUIEvents(): void {
    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => this.startGame());

    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn?.addEventListener('click', () => this.togglePause());

    const resetBtn = document.getElementById('reset-btn');
    resetBtn?.addEventListener('click', () => this.resetGame());

    const saveScoreBtn = document.getElementById('save-score-btn');
    saveScoreBtn?.addEventListener('click', () => this.saveScore());

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

    const tutorialBtn = document.getElementById('tutorial-btn');
    tutorialBtn?.addEventListener('click', () => this.showTutorial());

    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    closeTutorialBtn?.addEventListener('click', () => this.hideTutorial());

    const startTutorialBtn = document.getElementById('start-tutorial-btn');
    startTutorialBtn?.addEventListener('click', () => {
      this.hideTutorial();
      this.startGame();
    });
  }

  private setupSensitivityControls(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    const savedSensitivity = this.controls.getSensitivity();
    if (slider) slider.value = savedSensitivity.toString();
    if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
    
    slider?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value, 10);
      this.controls.setSensitivity(value);
      if (valueDisplay) valueDisplay.textContent = `${value}ms`;
      
      presetButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((btn as HTMLElement).dataset.value === value.toString()) {
          btn.classList.add('active');
        }
      });
    });
    
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = parseInt((btn as HTMLElement).dataset.value || '30', 10);
        this.controls.setSensitivity(value);
        
        if (slider) slider.value = value.toString();
        if (valueDisplay) valueDisplay.textContent = `${value}ms`;
        
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.ui.showNotification(`Sensibilité: ${btn.textContent}`);
      });
    });
  }

  private setupThemeButton(): void {
    const themeBtn = document.getElementById('theme-btn');
    themeBtn?.addEventListener('click', () => {
      const themeName = this.themeManager.nextTheme();
      this.game.updatePieceColors(this.themeManager.getPieceColors());
      this.renderer.render(this.game);
      this.updateNextPiecesDisplay();
      this.updateHoldDisplay();
      this.ui.showNotification(`Thème: ${themeName}`);
    });
  }

  private startGame(): void {
    if (!this.game.started && !this.game.gameOver) {
      this.game.start();
      this.ui.setPauseButtonEnabled(true);
      this.startGameLoop();
    }
  }

  private startGameLoop(): void {
    const gameLoop = (time: number) => {
      if (!this.game.started) return;
      
      const deltaTime = time - this.lastTime;
      this.lastTime = time;

      if (!this.game.paused && !this.game.gameOver) {
        this.game.update(deltaTime);
        this.renderer.render(this.game);
        this.ui.updateTimeDisplay(this.game.stats.elapsedTime);
      }

      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private togglePause(): void {
    this.game.togglePause();
    this.ui.showPauseScreen(this.game.paused);
  }

  private resetGame(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.game.init();
    this.ui.hideGameOver();
    this.ui.showPauseScreen(false);
    this.ui.setPauseButtonEnabled(false);
    this.ui.updateStats(this.game.stats);
    this.renderer.render(this.game);
    this.updateNextPiecesDisplay();
    this.updateHoldDisplay();
    this.lastTime = 0;
  }

  private updateNextPiecesDisplay(): void {
    for (let i = 0; i < 3; i++) {
      const canvas = document.getElementById(`next-canvas-${i + 1}`) as HTMLCanvasElement;
      if (canvas && this.game.nextPieces[i]) {
        this.renderer.drawPreviewPiece(this.game.nextPieces[i], canvas);
      }
    }
  }

  private updateHoldDisplay(): void {
    const canvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (this.game.holdPiece) {
      this.renderer.drawPreviewPiece(this.game.holdPiece, canvas);
    }
  }

  private async loadHighScores(): Promise<void> {
    try {
      const response = await fetch('/api/scores');
      const scores: HighScore[] = await response.json();
      this.ui.displayHighScores(scores);
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.ui.displayHighScores([]);
    }
  }

  private async saveScore(): Promise<void> {
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    const name = playerNameInput?.value.trim();
    
    if (!name) {
      this.ui.showNotification('Veuillez entrer votre nom');
      return;
    }

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          score: this.game.stats.score,
          level: this.game.stats.level,
          lines: this.game.stats.lines
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.ui.displayHighScores(result.highScores);
        localStorage.setItem('tetris-player-name', name);
        this.ui.showNotification('Score sauvegardé avec succès! 🎉');
      } else {
        this.ui.showNotification('Erreur lors de la sauvegarde du score');
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.ui.showNotification('Erreur de connexion au serveur');
    }
    
    this.ui.hideGameOver();
  }

  private toggleFullscreen(): void {
    const container = document.getElementById('game-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Erreur plein écran:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  private showTutorial(): void {
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    if (tutorialOverlay) {
      tutorialOverlay.style.display = 'flex';
    }
  }

  private hideTutorial(): void {
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    if (tutorialOverlay) {
      tutorialOverlay.style.display = 'none';
    }
  }
}

// Point d'entrée de l'application
document.addEventListener('DOMContentLoaded', async () => {
  const app = new TetrisApp();
  await app.init();
  
  // Exposer l'app globalement pour le débogage
  (window as any).tetrisApp = app;
});
