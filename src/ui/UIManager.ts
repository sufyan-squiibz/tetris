import { GameStats, HighScore } from '../types';

export class UIManager {
  private elements: { [key: string]: HTMLElement | null } = {};

  constructor() {
    this.cacheElements();
  }

  private cacheElements(): void {
    const ids = [
      'score', 'level', 'lines', 'goal', 'combo', 'max-combo', 'tetris-count',
      'time-played', 'pps', 'progress-fill', 'combo-display', 'game-over',
      'final-score', 'final-level', 'final-lines', 'final-max-combo',
      'final-tetris', 'final-time', 'pause-screen', 'pause-btn',
      'high-scores-list', 'player-name'
    ];

    ids.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });
  }

  public updateStats(stats: GameStats): void {
    this.setText('score', stats.score.toLocaleString());
    this.setText('level', stats.level.toString());
    this.setText('lines', stats.lines.toString());
    this.setText('goal', (stats.level * 10).toString());
    this.setText('combo', stats.combo.toString());
    this.setText('max-combo', stats.maxCombo.toString());
    this.setText('tetris-count', stats.tetrisCount.toString());
    
    const pps = stats.elapsedTime > 0 
      ? (stats.piecesPlaced / (stats.elapsedTime / 1000)).toFixed(1)
      : '0.0';
    this.setText('pps', pps);
    
    this.updateProgressBar(stats.lines);
  }

  public updateTimeDisplay(elapsedTime: number): void {
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setText('time-played', timeString);
  }

  private updateProgressBar(lines: number): void {
    const linesInLevel = lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = this.elements['progress-fill'] as HTMLElement;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  public showComboDisplay(combo: number): void {
    const display = this.elements['combo-display'];
    if (display) {
      display.textContent = `COMBO x${combo}!`;
      display.style.opacity = '1';
      display.style.animation = 'comboPopup 1s ease-out';
      
      setTimeout(() => {
        display.style.opacity = '0';
      }, 1000);
    }
  }

  public showGameOver(stats: GameStats): void {
    const gameOverEl = this.elements['game-over'];
    if (gameOverEl) {
      gameOverEl.style.display = 'flex';
    }

    this.setText('final-score', stats.score.toLocaleString());
    this.setText('final-level', stats.level.toString());
    this.setText('final-lines', stats.lines.toString());
    this.setText('final-max-combo', stats.maxCombo.toString());
    this.setText('final-tetris', stats.tetrisCount.toString());
    
    const seconds = Math.floor(stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setText('final-time', timeString);
    
    // Pré-remplir le nom du joueur
    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = this.elements['player-name'] as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }
  }

  public hideGameOver(): void {
    const gameOverEl = this.elements['game-over'];
    if (gameOverEl) {
      gameOverEl.style.display = 'none';
    }
  }

  public showPauseScreen(paused: boolean): void {
    const pauseScreen = this.elements['pause-screen'];
    const pauseBtn = this.elements['pause-btn'] as HTMLButtonElement;
    
    if (pauseScreen) {
      pauseScreen.style.display = paused ? 'flex' : 'none';
    }
    
    if (pauseBtn) {
      pauseBtn.textContent = paused ? '▶ REPRENDRE' : '⏸ PAUSE';
    }
  }

  public setPauseButtonEnabled(enabled: boolean): void {
    const pauseBtn = this.elements['pause-btn'] as HTMLButtonElement;
    if (pauseBtn) {
      pauseBtn.disabled = !enabled;
    }
  }

  public displayHighScores(scores: HighScore[]): void {
    const scoresList = this.elements['high-scores-list'];
    if (!scoresList) return;

    scoresList.innerHTML = '';

    const displayScores = scores.slice(0, 5);
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#3498db', '#9b59b6'];

    displayScores.forEach((score, index) => {
      const li = document.createElement('li');
      
      const rank = document.createElement('span');
      rank.textContent = `${index + 1}.`;
      rank.style.fontWeight = 'bold';
      rank.style.color = colors[index] || '#ecf0f1';
      
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

    if (displayScores.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Aucun score enregistré';
      li.style.textAlign = 'center';
      li.style.color = '#bdc3c7';
      scoresList.appendChild(li);
    }
  }

  public showNotification(message: string): void {
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

  private setText(id: string, text: string): void {
    const element = this.elements[id];
    if (element) {
      element.textContent = text;
    }
  }
}
