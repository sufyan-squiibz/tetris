// Logique principale du jeu Tetris en TypeScript
import type { GameStats, HighScore } from '../types';
import { GAME_CONFIG } from '../types';
import { TetrisPiece, getRandomPiece } from './pieces';
import { PixiRenderer } from './renderer';
import { AudioManager } from '../audio/audio-manager';
import { ParticleSystem } from '../particles/particle-system';

const { COLS, ROWS, INITIAL_DROP_INTERVAL, MIN_DROP_INTERVAL, DROP_INTERVAL_DECREASE } = GAME_CONFIG;

export class TetrisGame {
  // État du jeu
  private board: number[][] = [];
  private currentPiece: TetrisPiece | null = null;
  private nextPieces: TetrisPiece[] = [];
  private holdPiece: TetrisPiece | null = null;
  private canHold: boolean = true;

  // État de jeu
  public gameOver: boolean = false;
  public paused: boolean = false;
  public started: boolean = false;

  // Scoring
  private stats: GameStats = {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    tetrisCount: 0,
    piecesPlaced: 0,
    elapsedTime: 0
  };

  private backToBack: boolean = false;

  // Timing
  private dropInterval: number = INITIAL_DROP_INTERVAL;
  private dropCounter: number = 0;
  private lastTime: number = 0;
  private startTime: number = 0;

  // High scores
  private highScores: HighScore[] = [];

  // Renderer & Systems
  private renderer: PixiRenderer;
  private audioManager: AudioManager;
  private particleSystem: ParticleSystem;

  constructor(
    gameElement: HTMLElement,
    audioManager: AudioManager,
    particleSystem: ParticleSystem
  ) {
    this.audioManager = audioManager;
    this.particleSystem = particleSystem;
    this.renderer = new PixiRenderer(gameElement);
    this.init();
    this.loadHighScores();
  }

  setupHoldAndNext(holdElement: HTMLElement, nextElements: HTMLElement[]): void {
    this.renderer.setupHoldCanvas(holdElement);
    this.renderer.setupNextCanvases(nextElements);
    this.updateHoldDisplay();
    this.updateNextPieces();
  }

  private init(): void {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));

    // Initialiser les pièces
    this.nextPieces = [getRandomPiece(), getRandomPiece(), getRandomPiece()];
    this.currentPiece = getRandomPiece();
    this.holdPiece = null;
    this.canHold = true;

    // Réinitialiser les stats
    this.gameOver = false;
    this.paused = false;
    this.started = false;
    this.stats = {
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      maxCombo: 0,
      tetrisCount: 0,
      piecesPlaced: 0,
      elapsedTime: 0
    };
    this.backToBack = false;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.startTime = Date.now();

    this.updateStats();
    this.updateNextPieces();
    this.updateHoldDisplay();
  }

  start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.update();

      const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseBtn) pauseBtn.disabled = false;
    }
  }

  private update(time: number = 0): void {
    if (!this.started) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) {
      requestAnimationFrame(this.update.bind(this));
      return;
    }

    // Mettre à jour le temps écoulé
    this.stats.elapsedTime = Date.now() - this.startTime;
    this.updateTimeDisplay();

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  dropPiece(isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      if (isManual) {
        this.audioManager.playSound('drop');
      }
      return true;
    }
    if (isManual) {
      this.audioManager.playSound('move');
    }
    return false;
  }

  movePiece(dx: number): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.x += dx;
    if (this.checkCollision()) {
      this.currentPiece.x -= dx;
      return false;
    }
    this.audioManager.playSound('move');
    return true;
  }

  rotatePiece(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotate();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    this.audioManager.playSound('rotate');
    return true;
  }

  rotatePieceReverse(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotateReverse();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    this.audioManager.playSound('rotate');
    return true;
  }

  hardDrop(): void {
    if (!this.currentPiece) return;

    let dropDistance = 0;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
      dropDistance++;
    }
    this.currentPiece.y--;
    dropDistance--;

    // Bonus pour hard drop
    this.stats.score += dropDistance * 2;

    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    this.audioManager.playSound('drop');
  }

  holdCurrentPiece(): void {
    if (!this.canHold || !this.currentPiece) return;

    if (this.holdPiece === null) {
      this.holdPiece = this.currentPiece;
      this.spawnPiece();
    } else {
      const temp = this.holdPiece;
      this.holdPiece = this.currentPiece;
      this.currentPiece = temp;
      this.currentPiece.reset();
    }

    this.canHold = false;
    this.updateHoldDisplay();
    this.audioManager.playSound('move');
  }

  private checkCollision(): boolean {
    if (!this.currentPiece) return false;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = this.currentPiece.x + x;
          const boardY = this.currentPiece.y + y;

          if (boardX < 0 || boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private lockPiece(): void {
    if (!this.currentPiece) return;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;

          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color;
          }
        }
      }
    }

    this.stats.piecesPlaced++;
    this.canHold = true;
  }

  private clearLines(): void {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);

      // Effets visuels
      clearedRows.forEach(row => {
        this.particleSystem.createLineExplosion(row, this.currentPiece?.color || 0xffffff);
      });

      if (linesCleared === 4) {
        this.particleSystem.createTetrisExplosion(clearedRows, 0xffd700);
      }

      // Afficher le combo
      if (this.stats.combo > 1) {
        this.showComboDisplay();
      }
    } else {
      // Réinitialiser le combo si aucune ligne n'est effacée
      this.stats.combo = 0;
      this.backToBack = false;
    }
  }

  private updateScore(linesCleared: number): void {
    const basePoints = [0, 100, 300, 500, 800];
    let points = basePoints[linesCleared] * this.stats.level;

    // Bonus Tetris (4 lignes)
    if (linesCleared === 4) {
      this.stats.tetrisCount++;
      if (this.backToBack) {
        points *= 1.5;
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }

    // Bonus combo
    if (linesCleared > 0) {
      this.stats.combo++;
      points += (this.stats.combo - 1) * 50 * this.stats.level;

      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    }

    this.stats.score += points;
    this.stats.lines += linesCleared;

    // Level up
    const previousLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.lines / 10) + 1;
    this.dropInterval = Math.max(MIN_DROP_INTERVAL, INITIAL_DROP_INTERVAL - (this.stats.level - 1) * DROP_INTERVAL_DECREASE);

    this.updateStats();
    this.updateProgressBar();

    this.audioManager.playSound('clear');
    if (this.stats.level > previousLevel) {
      this.audioManager.playSound('levelup');
      this.particleSystem.createLevelUpEffect();
    }
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(getRandomPiece());
    this.updateNextPieces();

    if (this.checkCollision()) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  private updateStats(): void {
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');
    const goalEl = document.getElementById('goal');
    const comboEl = document.getElementById('combo');
    const maxComboEl = document.getElementById('max-combo');
    const tetrisCountEl = document.getElementById('tetris-count');
    const ppsEl = document.getElementById('pps');

    if (scoreEl) scoreEl.textContent = this.stats.score.toLocaleString();
    if (levelEl) levelEl.textContent = this.stats.level.toString();
    if (linesEl) linesEl.textContent = this.stats.lines.toString();
    if (goalEl) goalEl.textContent = (this.stats.level * 10).toString();
    if (comboEl) comboEl.textContent = this.stats.combo.toString();
    if (maxComboEl) maxComboEl.textContent = this.stats.maxCombo.toString();
    if (tetrisCountEl) tetrisCountEl.textContent = this.stats.tetrisCount.toString();

    // PPS (Pieces Per Second)
    if (this.stats.elapsedTime > 0 && ppsEl) {
      const pps = (this.stats.piecesPlaced / (this.stats.elapsedTime / 1000)).toFixed(1);
      ppsEl.textContent = pps;
    }
  }

  private updateTimeDisplay(): void {
    const timeEl = document.getElementById('time-played');
    if (!timeEl) return;

    const seconds = Math.floor(this.stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    timeEl.textContent = timeString;
  }

  private updateProgressBar(): void {
    const progressFill = document.getElementById('progress-fill');
    if (!progressFill) return;

    const linesInLevel = this.stats.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    progressFill.style.width = `${progress}%`;
  }

  private updateNextPieces(): void {
    this.renderer.drawNextPieces(this.nextPieces);
  }

  private updateHoldDisplay(): void {
    this.renderer.drawHoldPiece(this.holdPiece);
  }

  private showComboDisplay(): void {
    const display = document.getElementById('combo-display');
    if (!display) return;

    display.textContent = `COMBO x${this.stats.combo}!`;
    display.style.opacity = '1';
    display.style.animation = 'comboPopup 1s ease-out';

    setTimeout(() => {
      display.style.opacity = '0';
    }, 1000);
  }

  private showGameOver(): void {
    const gameOverEl = document.getElementById('game-over');
    if (!gameOverEl) return;

    gameOverEl.style.display = 'flex';

    const finalScoreEl = document.getElementById('final-score');
    const finalLevelEl = document.getElementById('final-level');
    const finalLinesEl = document.getElementById('final-lines');
    const finalMaxComboEl = document.getElementById('final-max-combo');
    const finalTetrisEl = document.getElementById('final-tetris');
    const finalTimeEl = document.getElementById('final-time');

    if (finalScoreEl) finalScoreEl.textContent = this.stats.score.toLocaleString();
    if (finalLevelEl) finalLevelEl.textContent = this.stats.level.toString();
    if (finalLinesEl) finalLinesEl.textContent = this.stats.lines.toString();
    if (finalMaxComboEl) finalMaxComboEl.textContent = this.stats.maxCombo.toString();
    if (finalTetrisEl) finalTetrisEl.textContent = this.stats.tetrisCount.toString();

    const seconds = Math.floor(this.stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    if (finalTimeEl) finalTimeEl.textContent = timeString;

    // Pré-remplir le nom du joueur si disponible
    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }

    this.audioManager.playSound('gameover');
  }

  async loadHighScores(): Promise<void> {
    try {
      const response = await fetch('/api/scores');
      this.highScores = await response.json();
      this.displayHighScores();
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.highScores = [];
    }
  }

  async saveScore(name: string): Promise<void> {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          score: this.stats.score,
          level: this.stats.level,
          lines: this.stats.lines
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.highScores = result.highScores;
        this.displayHighScores();

        localStorage.setItem('tetris-player-name', name);

        this.showNotification('Score sauvegardé avec succès! 🎉');
      } else {
        this.showNotification('Erreur lors de la sauvegarde du score');
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification('Erreur de connexion au serveur');
    }
  }

  private displayHighScores(): void {
    const scoresList = document.getElementById('high-scores-list');
    if (!scoresList) return;

    scoresList.innerHTML = '';

    this.highScores.slice(0, 5).forEach((score, index) => {
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

    if (this.highScores.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Aucun score enregistré';
      li.style.textAlign = 'center';
      li.style.color = '#bdc3c7';
      scoresList.appendChild(li);
    }
  }

  isHighScore(score: number): boolean {
    return this.highScores.length < 10 || score > (this.highScores[this.highScores.length - 1]?.score || 0);
  }

  togglePause(): void {
    this.paused = !this.paused;
    const pauseScreen = document.getElementById('pause-screen');
    const pauseBtn = document.getElementById('pause-btn');

    if (pauseScreen) pauseScreen.style.display = this.paused ? 'flex' : 'none';
    if (pauseBtn) pauseBtn.textContent = this.paused ? '▶ REPRENDRE' : '⏸ PAUSE';
  }

  resetGame(): void {
    this.init();
    const gameOverEl = document.getElementById('game-over');
    const pauseScreen = document.getElementById('pause-screen');
    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;

    if (gameOverEl) gameOverEl.style.display = 'none';
    if (pauseScreen) pauseScreen.style.display = 'none';
    if (pauseBtn) pauseBtn.disabled = true;

    this.started = false;
  }

  private draw(): void {
    this.renderer.drawBoard(this.board);

    if (this.currentPiece && !this.gameOver) {
      this.renderer.drawGhostPiece(this.currentPiece, this.board);
      this.renderer.drawCurrentPiece(this.currentPiece);
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

  getStats(): GameStats {
    return { ...this.stats };
  }
}
