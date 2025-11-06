// Gestion de l'interface utilisateur

import type { GameStats, HighScore } from './types';
import { TetrisGame } from './game';
import { PixiRenderer } from './renderer';

export class UIManager {
  private game: TetrisGame;
  private renderer: PixiRenderer;

  constructor(game: TetrisGame, renderer: PixiRenderer) {
    this.game = game;
    this.renderer = renderer;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Boutons de contrôle
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    startBtn?.addEventListener('click', () => this.handleStart());
    pauseBtn?.addEventListener('click', () => this.handlePause());
    resetBtn?.addEventListener('click', () => this.handleReset());

    // Plein écran
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

    // Tutoriel
    const tutorialBtn = document.getElementById('tutorial-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    const startTutorialBtn = document.getElementById('start-tutorial-btn');

    tutorialBtn?.addEventListener('click', () => this.showTutorial());
    closeTutorialBtn?.addEventListener('click', () => this.hideTutorial());
    startTutorialBtn?.addEventListener('click', () => {
      this.hideTutorial();
      this.handleStart();
    });

    // Sauvegarder le score
    const saveScoreBtn = document.getElementById('save-score-btn');
    saveScoreBtn?.addEventListener('click', () => this.handleSaveScore());

    // Vérifier si c'est le premier lancement
    if (!localStorage.getItem('tetris-tutorial-seen')) {
      this.showTutorial();
      localStorage.setItem('tetris-tutorial-seen', 'true');
    }
  }

  private handleStart(): void {
    this.game.start();
    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
    if (pauseBtn) pauseBtn.disabled = false;
  }

  private handlePause(): void {
    this.game.togglePause();
    const pauseBtn = document.getElementById('pause-btn');
    const pauseScreen = document.getElementById('pause-screen');
    
    if (pauseBtn) {
      pauseBtn.textContent = this.game.isPaused() ? '▶ REPRENDRE' : '⏸ PAUSE';
    }
    
    if (pauseScreen) {
      pauseScreen.style.display = this.game.isPaused() ? 'flex' : 'none';
    }
  }

  private handleReset(): void {
    this.game.resetGame();
    const gameOverScreen = document.getElementById('game-over');
    const pauseScreen = document.getElementById('pause-screen');
    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
    
    if (gameOverScreen) gameOverScreen.style.display = 'none';
    if (pauseScreen) pauseScreen.style.display = 'none';
    if (pauseBtn) pauseBtn.disabled = true;
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

  private async handleSaveScore(): Promise<void> {
    const nameInput = document.getElementById('player-name') as HTMLInputElement;
    const name = nameInput?.value.trim();
    
    if (!name) {
      this.showNotification('Veuillez entrer votre nom');
      return;
    }

    const stats = this.game.getStats();
    if (this.game.isHighScore(stats.score)) {
      const success = await this.game.saveScore(name);
      if (success) {
        this.showNotification('Score sauvegardé avec succès! 🎉');
        this.displayHighScores(this.game.getHighScores());
        localStorage.setItem('tetris-player-name', name);
      } else {
        this.showNotification('Erreur lors de la sauvegarde du score');
      }
    } else {
      this.showNotification("Votre score n'est pas assez élevé pour le classement");
    }
    
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'none';
    }
  }

  updateStats(stats: GameStats): void {
    this.setElementText('score', stats.score.toLocaleString());
    this.setElementText('level', stats.level.toString());
    this.setElementText('lines', stats.lines.toString());
    this.setElementText('goal', (stats.level * 10).toString());
    this.setElementText('combo', stats.combo.toString());
    this.setElementText('max-combo', stats.maxCombo.toString());
    this.setElementText('tetris-count', stats.tetrisCount.toString());
    
    // PPS (Pieces Per Second)
    if (stats.elapsedTime > 0) {
      const pps = (stats.piecesPlaced / (stats.elapsedTime / 1000)).toFixed(1);
      this.setElementText('pps', pps);
    }

    // Temps écoulé
    const seconds = Math.floor(stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('time-played', timeString);

    // Barre de progression
    const linesInLevel = stats.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  showGameOver(stats: GameStats): void {
    const gameOverScreen = document.getElementById('game-over');
    if (!gameOverScreen) return;

    gameOverScreen.style.display = 'flex';
    
    this.setElementText('final-score', stats.score.toLocaleString());
    this.setElementText('final-level', stats.level.toString());
    this.setElementText('final-lines', stats.lines.toString());
    this.setElementText('final-max-combo', stats.maxCombo.toString());
    this.setElementText('final-tetris', stats.tetrisCount.toString());
    
    const seconds = Math.floor(stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('final-time', timeString);
    
    // Pré-remplir le nom du joueur
    const savedName = localStorage.getItem('tetris-player-name');
    const nameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && nameInput) {
      nameInput.value = savedName;
    }
  }

  updateNextPieces(): void {
    const nextPieces = this.game.getNextPieces();
    
    for (let i = 0; i < 3; i++) {
      const canvas = document.getElementById(`next-canvas-${i + 1}`) as HTMLCanvasElement;
      if (canvas && nextPieces[i]) {
        this.renderer.renderNextPiece(nextPieces[i], canvas, i === 0 ? 25 : 20);
      }
    }
  }

  updateHoldPiece(): void {
    const canvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    const holdPiece = this.game.getHoldPiece();
    
    if (!canvas) return;
    
    if (holdPiece) {
      this.renderer.renderNextPiece(holdPiece, canvas, 25);
    } else {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  showComboDisplay(combo: number): void {
    const display = document.getElementById('combo-display');
    if (!display) return;
    
    display.textContent = `COMBO x${combo}!`;
    display.style.opacity = '1';
    display.style.animation = 'comboPopup 1s ease-out';
    
    setTimeout(() => {
      display.style.opacity = '0';
    }, 1000);
  }

  displayHighScores(highScores: HighScore[]): void {
    const scoresList = document.getElementById('high-scores-list');
    if (!scoresList) return;
    
    scoresList.innerHTML = '';

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

  showNotification(message: string): void {
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

  private setElementText(id: string, text: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  setupSensitivityControls(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    let currentSensitivity = savedSensitivity ? parseInt(savedSensitivity, 10) : 30;
    
    if (slider) slider.value = currentSensitivity.toString();
    if (valueDisplay) valueDisplay.textContent = `${currentSensitivity}ms`;
    
    // Événement du slider
    slider?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value, 10);
      localStorage.setItem('tetris-sensitivity', value.toString());
      if (valueDisplay) {
        valueDisplay.textContent = `${value}ms`;
      }
      
      // Mettre à jour les boutons presets
      presetButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((btn as HTMLElement).dataset.value === value.toString()) {
          btn.classList.add('active');
        }
      });
    });
    
    // Événements des boutons presets
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = (btn as HTMLElement).dataset.value;
        if (!value) return;
        
        localStorage.setItem('tetris-sensitivity', value);
        
        if (slider) slider.value = value;
        if (valueDisplay) valueDisplay.textContent = `${value}ms`;
        
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.showNotification(`Sensibilité: ${btn.textContent}`);
      });
    });
    
    // Mettre à jour l'état actif initial
    presetButtons.forEach(btn => {
      if ((btn as HTMLElement).dataset.value === currentSensitivity.toString()) {
        btn.classList.add('active');
      }
    });
  }
}
