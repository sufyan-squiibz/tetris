import './style.css';
import { TetrisGame } from './game/TetrisGame';
import { PreviewRenderer } from './renderer/PreviewRenderer';
import { ControlsManager } from './systems/Controls';
import { AudioManager } from './systems/AudioManager';
import { ParticleSystem } from './systems/ParticleSystem';
import { ThemeManager } from './systems/ThemeManager';
import { IGameStats } from './types';

// Classe principale de l'application
class TetrisApp {
  private game: TetrisGame | null = null;
  private controls: ControlsManager | null = null;
  private audio: AudioManager;
  private particles: ParticleSystem | null = null;
  private theme: ThemeManager;
  private nextRenderers: PreviewRenderer[] = [];
  private holdRenderer: PreviewRenderer | null = null;

  constructor() {
    this.audio = new AudioManager();
    this.theme = new ThemeManager();
    
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  private init(): void {
    // Initialiser les canvas
    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    
    if (!gameCanvas) {
      console.error('Game canvas not found!');
      return;
    }

    // Créer le jeu
    this.game = new TetrisGame(gameCanvas);

    // Initialiser les renderers de preview
    for (let i = 1; i <= 3; i++) {
      const canvas = document.getElementById(`next-canvas-${i}`) as HTMLCanvasElement;
      if (canvas) {
        const size = i === 1 ? 100 : 80;
        this.nextRenderers.push(new PreviewRenderer(canvas, size, size));
      }
    }

    // Initialiser le renderer de hold
    const holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    if (holdCanvas) {
      this.holdRenderer = new PreviewRenderer(holdCanvas, 100, 100);
      this.game.setHoldRenderer(this.holdRenderer);
    }

    this.game.setNextRenderers(this.nextRenderers);

    // Initialiser les systèmes
    this.controls = new ControlsManager(this.game);
    
    if (particlesCanvas) {
      this.particles = new ParticleSystem(particlesCanvas);
    }

    // Configurer les callbacks
    this.game.setOnStatsUpdate(this.handleStatsUpdate);
    this.game.setOnGameOver(this.handleGameOver);
    this.game.setOnAudioEvent((event) => this.audio.playSound(event));
    this.game.setOnParticleEvent(this.handleParticleEvent);

    // Initialiser les contrôles UI
    this.initUI();
    
    // Charger les high scores
    this.game.loadHighScores().then(() => {
      this.displayHighScores();
    });

    // Rendu initial
    this.game.draw();
  }

  private initUI(): void {
    if (!this.game) return;

    // Bouton démarrer
    const startBtn = document.getElementById('start-btn');
    startBtn?.addEventListener('click', () => {
      this.game?.start();
      if (startBtn) (startBtn as HTMLButtonElement).disabled = true;
      const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseBtn) pauseBtn.disabled = false;
    });

    // Bouton pause
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn?.addEventListener('click', () => {
      this.game?.togglePause();
      const isPaused = this.game?.isPaused();
      const pauseScreen = document.getElementById('pause-screen');
      if (pauseScreen) {
        pauseScreen.style.display = isPaused ? 'flex' : 'none';
      }
      if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶ REPRENDRE' : '⏸ PAUSE';
      }
    });

    // Bouton reset
    const resetBtn = document.getElementById('reset-btn');
    resetBtn?.addEventListener('click', () => {
      this.game?.resetGame();
      const pauseScreen = document.getElementById('pause-screen');
      const gameOverScreen = document.getElementById('game-over');
      if (pauseScreen) pauseScreen.style.display = 'none';
      if (gameOverScreen) gameOverScreen.style.display = 'none';
      
      const pauseBtnEl = document.getElementById('pause-btn') as HTMLButtonElement;
      const startBtnEl = document.getElementById('start-btn') as HTMLButtonElement;
      if (pauseBtnEl) {
        pauseBtnEl.disabled = true;
        pauseBtnEl.textContent = '⏸ PAUSE';
      }
      if (startBtnEl) startBtnEl.disabled = false;
    });

    // Bouton plein écran
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn?.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (!document.fullscreenElement && container) {
        container.requestFullscreen().catch((err) => {
          console.error('Erreur plein écran:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });

    // Bouton thème
    const themeBtn = document.getElementById('theme-btn');
    themeBtn?.addEventListener('click', () => {
      const themeName = this.theme.nextTheme();
      this.showNotification(`Thème: ${themeName}`);
    });

    // Bouton tutoriel
    const tutorialBtn = document.getElementById('tutorial-btn');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    const startTutorialBtn = document.getElementById('start-tutorial-btn');

    tutorialBtn?.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'flex';
    });

    closeTutorialBtn?.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'none';
    });

    startTutorialBtn?.addEventListener('click', () => {
      if (tutorialOverlay) tutorialOverlay.style.display = 'none';
      this.game?.start();
      const startBtnEl = document.getElementById('start-btn') as HTMLButtonElement;
      const pauseBtnEl = document.getElementById('pause-btn') as HTMLButtonElement;
      if (startBtnEl) startBtnEl.disabled = true;
      if (pauseBtnEl) pauseBtnEl.disabled = false;
    });

    // Afficher le tutoriel au premier lancement
    if (!localStorage.getItem('tetris-tutorial-seen') && tutorialOverlay) {
      tutorialOverlay.style.display = 'flex';
      localStorage.setItem('tetris-tutorial-seen', 'true');
    }

    // Sauvegarder le score
    const saveScoreBtn = document.getElementById('save-score-btn');
    saveScoreBtn?.addEventListener('click', async () => {
      const nameInput = document.getElementById('player-name') as HTMLInputElement;
      const name = nameInput?.value.trim();

      if (!name) {
        this.showNotification('Veuillez entrer votre nom');
        return;
      }

      const stats = this.game?.getStats();
      if (stats && this.game?.isHighScore(stats.score)) {
        const success = await this.game.saveScore(name);
        if (success) {
          this.showNotification('Score sauvegardé avec succès! 🎉');
          this.displayHighScores();
        } else {
          this.showNotification('Erreur lors de la sauvegarde du score');
        }
      } else {
        this.showNotification("Votre score n'est pas assez élevé pour le classement");
      }

      const gameOverScreen = document.getElementById('game-over');
      if (gameOverScreen) gameOverScreen.style.display = 'none';
    });

    // Contrôle de sensibilité
    this.initSensitivityControl();
  }

  private initSensitivityControl(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');

    if (slider && this.controls) {
      slider.value = this.controls.getSensitivity().toString();
      if (valueDisplay) {
        valueDisplay.textContent = `${this.controls.getSensitivity()}ms`;
      }

      slider.addEventListener('input', (e) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        this.controls?.setSensitivity(value);
        if (valueDisplay) {
          valueDisplay.textContent = `${value}ms`;
        }

        presetButtons.forEach((btn) => {
          btn.classList.remove('active');
          if ((btn as HTMLElement).dataset.value === value.toString()) {
            btn.classList.add('active');
          }
        });
      });
    }

    presetButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = parseInt((btn as HTMLElement).dataset.value || '30');
        this.controls?.setSensitivity(value);

        if (slider) slider.value = value.toString();
        if (valueDisplay) valueDisplay.textContent = `${value}ms`;

        presetButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.showNotification(`Sensibilité: ${btn.textContent}`);
      });

      if (this.controls && (btn as HTMLElement).dataset.value === this.controls.getSensitivity().toString()) {
        btn.classList.add('active');
      }
    });
  }

  private handleStatsUpdate = (stats: IGameStats): void => {
    document.getElementById('score')!.textContent = stats.score.toLocaleString();
    document.getElementById('level')!.textContent = stats.level.toString();
    document.getElementById('lines')!.textContent = stats.lines.toString();
    document.getElementById('goal')!.textContent = (stats.level * 10).toString();
    document.getElementById('combo')!.textContent = stats.combo.toString();
    document.getElementById('max-combo')!.textContent = stats.maxCombo.toString();
    document.getElementById('tetris-count')!.textContent = stats.tetrisCount.toString();

    // PPS (Pieces Per Second)
    if (stats.elapsedTime > 0) {
      const pps = (stats.piecesPlaced / (stats.elapsedTime / 1000)).toFixed(1);
      document.getElementById('pps')!.textContent = pps;
    }

    // Temps joué
    const seconds = Math.floor(stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.getElementById('time-played')!.textContent = timeString;

    // Barre de progression
    const linesInLevel = stats.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  };

  private handleGameOver = (stats: IGameStats): void => {
    const gameOverScreen = document.getElementById('game-over');
    if (!gameOverScreen) return;

    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score')!.textContent = stats.score.toLocaleString();
    document.getElementById('final-level')!.textContent = stats.level.toString();
    document.getElementById('final-lines')!.textContent = stats.lines.toString();
    document.getElementById('final-max-combo')!.textContent = stats.maxCombo.toString();
    document.getElementById('final-tetris')!.textContent = stats.tetrisCount.toString();

    const seconds = Math.floor(stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.getElementById('final-time')!.textContent = timeString;

    // Pré-remplir le nom du joueur si disponible
    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }
  };

  private handleParticleEvent = (event: string, data: any): void => {
    if (!this.particles) return;

    switch (event) {
      case 'lineExplosion':
        data.rows.forEach((row: number) => {
          this.particles?.createLineExplosion(row, data.color);
        });
        break;
      case 'tetrisExplosion':
        this.particles.createTetrisExplosion(data.rows, data.color);
        break;
      case 'levelUp':
        this.particles.createLevelUpEffect();
        break;
      case 'combo':
        const display = document.getElementById('combo-display');
        if (display) {
          display.textContent = `COMBO x${data.combo}!`;
          display.style.opacity = '1';
          display.style.animation = 'comboPopup 1s ease-out';

          setTimeout(() => {
            display.style.opacity = '0';
          }, 1000);
        }
        break;
    }
  };

  private displayHighScores(): void {
    const scoresList = document.getElementById('high-scores-list');
    if (!scoresList || !this.game) return;

    scoresList.innerHTML = '';
    const highScores = this.game.getHighScores();

    highScores.slice(0, 5).forEach((score, index) => {
      const li = document.createElement('li');

      const rank = document.createElement('span');
      rank.textContent = `${index + 1}.`;
      rank.style.fontWeight = 'bold';
      rank.style.color = ['#FFD700', '#C0C0C0', '#CD7F32', '#3498db', '#9b59b6'][index] || '#ecf0f1';

      const name = document.createElement('span');
      name.textContent = score.name;

      const scoreValue = document.createElement('span');
      scoreValue.textContent = score.score.toLocaleString();
      scoreValue.style.color = '#27ae60';
      scoreValue.style.fontWeight = 'bold';

      li.appendChild(rank);
      li.appendChild(name);
      li.appendChild(scoreValue);

      scoresList.appendChild(li);
    });

    if (highScores.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Aucun score enregistré';
      li.style.textAlign = 'center';
      li.style.color = '#bdc3c7';
      scoresList.appendChild(li);
    }
  }

  private showNotification(message: string): void {
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
}

// Initialiser l'application
new TetrisApp();
