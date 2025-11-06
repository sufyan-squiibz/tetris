import { TetrisPiece } from './TetrisPiece';
import { PieceFactory } from './PieceFactory';
import { PixiRenderer } from '../systems/PixiRenderer';
import { PreviewRenderer } from '../systems/PreviewRenderer';
import { AudioManager } from '../systems/AudioManager';
import { ControlsManager } from '../systems/ControlsManager';
import { ParticleSystem } from '../systems/ParticleSystem';
import { ThemeManager } from '../systems/ThemeManager';
import { GameConfig, GameStats, HighScore } from '../types';

export class TetrisGame {
  // Configuration
  private readonly config: GameConfig = {
    cols: 10,
    rows: 20,
    blockSize: 30,
  };

  // État du jeu
  private board: (number | string)[][] = [];
  private currentPiece: TetrisPiece | null = null;
  private nextPieces: TetrisPiece[] = [];
  private holdPiece: TetrisPiece | null = null;
  private canHold: boolean = true;

  // État de jeu
  private gameOver: boolean = false;
  private paused: boolean = false;
  private started: boolean = false;

  // Scoring
  private stats: GameStats = {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    maxCombo: 0,
    tetrisCount: 0,
    piecesPlaced: 0,
    elapsedTime: 0,
  };
  private backToBack: boolean = false;

  // Timing
  private dropInterval: number = 1000;
  private dropCounter: number = 0;
  private lastTime: number = 0;
  private startTime: number = 0;

  // High scores
  private highScores: HighScore[] = [];

  // Systèmes
  private pieceFactory: PieceFactory;
  private renderer: PixiRenderer;
  private holdRenderer: PreviewRenderer;
  private nextRenderers: PreviewRenderer[] = [];
  private audioManager: AudioManager;
  private controlsManager: ControlsManager;
  private particleSystem: ParticleSystem | null = null;
  private themeManager: ThemeManager;

  constructor(
    gameCanvas: HTMLCanvasElement,
    holdCanvas: HTMLCanvasElement,
    nextCanvases: HTMLCanvasElement[],
    particlesCanvas: HTMLCanvasElement,
    themeManager: ThemeManager,
    audioManager: AudioManager
  ) {
    this.themeManager = themeManager;
    this.audioManager = audioManager;
    this.pieceFactory = new PieceFactory(this.themeManager.getPieceColors());

    // Initialiser les renderers
    this.renderer = new PixiRenderer(gameCanvas, this.config);
    this.holdRenderer = new PreviewRenderer(holdCanvas, 100, 100);
    this.nextRenderers = nextCanvases.map((canvas, i) => {
      const size = i === 0 ? 100 : 80;
      return new PreviewRenderer(canvas, size, size);
    });

    // Initialiser le système de particules
    if (particlesCanvas) {
      this.particleSystem = new ParticleSystem(particlesCanvas);
    }

    // Initialiser les contrôles
    this.controlsManager = new ControlsManager({
      moveLeft: () => this.movePiece(-1),
      moveRight: () => this.movePiece(1),
      moveDown: () => this.dropPiece(true),
      rotate: () => this.rotatePiece(),
      rotateReverse: () => this.rotatePieceReverse(),
      hardDrop: () => this.hardDrop(),
      hold: () => this.holdCurrentPiece(),
      pause: () => this.togglePause(),
    });

    this.init();
    this.loadHighScores();
  }

  private init(): void {
    this.board = Array(this.config.rows)
      .fill(null)
      .map(() => Array(this.config.cols).fill(0));

    this.nextPieces = [this.pieceFactory.getRandomPiece(), this.pieceFactory.getRandomPiece(), this.pieceFactory.getRandomPiece()];
    this.currentPiece = this.pieceFactory.getRandomPiece();
    this.holdPiece = null;
    this.canHold = true;

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
      elapsedTime: 0,
    };

    this.backToBack = false;
    this.dropInterval = 1000;
    this.startTime = Date.now();

    this.updateStats();
    this.updateNextPieces();
    this.updateHoldDisplay();
    this.draw();
  }

  start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.controlsManager.enable();
      this.update();

      const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseBtn) pauseBtn.disabled = false;
    }
  }

  private update = (time: number = 0): void => {
    if (!this.started) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) return;

    this.stats.elapsedTime = Date.now() - this.startTime;
    this.updateTimeDisplay();

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame(this.update);
  };

  private dropPiece(isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      this.audioManager.playSound('drop');
      return true;
    }
    if (isManual) {
      this.audioManager.playSound('move');
    }
    return false;
  }

  private movePiece(dx: number): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.x += dx;
    if (this.checkCollision()) {
      this.currentPiece.x -= dx;
      return false;
    }
    this.audioManager.playSound('move');
    return true;
  }

  private rotatePiece(): boolean {
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

  private rotatePieceReverse(): boolean {
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

  private hardDrop(): void {
    if (!this.currentPiece) return;

    let dropDistance = 0;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
      dropDistance++;
    }
    this.currentPiece.y--;
    dropDistance--;

    this.stats.score += dropDistance * 2;

    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    this.audioManager.playSound('drop');
  }

  private holdCurrentPiece(): void {
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

          if (boardX < 0 || boardX >= this.config.cols || boardY >= this.config.rows || (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
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

  private clearLines(): number {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = this.config.rows - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== 0)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(this.config.cols).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);

      if (this.particleSystem) {
        const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
        if (boardCanvas && particlesCanvas) {
          const boardRect = boardCanvas.getBoundingClientRect();
          const containerRect = particlesCanvas.getBoundingClientRect();

          clearedRows.forEach((row) => {
            this.particleSystem!.createLineExplosion(row, this.currentPiece?.color || '#ffffff', boardRect, containerRect);
          });

          if (linesCleared === 4) {
            this.particleSystem.createTetrisExplosion(clearedRows, '#FFD700', boardRect, containerRect);
          }
        }
      }

      if (this.stats.combo > 1) {
        this.showComboDisplay();
      }
    } else {
      this.stats.combo = 0;
      this.backToBack = false;
    }

    return linesCleared;
  }

  private updateScore(linesCleared: number): void {
    const basePoints = [0, 100, 300, 500, 800];
    let points = basePoints[linesCleared] * this.stats.level;

    if (linesCleared === 4) {
      this.stats.tetrisCount++;
      if (this.backToBack) {
        points *= 1.5;
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }

    if (linesCleared > 0) {
      this.stats.combo++;
      points += (this.stats.combo - 1) * 50 * this.stats.level;

      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    }

    this.stats.score += points;
    this.stats.lines += linesCleared;

    const previousLevel = this.stats.level;
    this.stats.level = Math.floor(this.stats.lines / 10) + 1;
    this.dropInterval = Math.max(100, 1000 - (this.stats.level - 1) * 100);

    this.updateStats();
    this.updateProgressBar();

    this.audioManager.playSound('clear');
    if (this.stats.level > previousLevel) {
      this.audioManager.playSound('levelup');

      if (this.particleSystem) {
        const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
        if (boardCanvas && particlesCanvas) {
          const boardRect = boardCanvas.getBoundingClientRect();
          const containerRect = particlesCanvas.getBoundingClientRect();
          this.particleSystem.createLevelUpEffect(boardRect, containerRect);
        }
      }
    }
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(this.pieceFactory.getRandomPiece());
    this.updateNextPieces();

    if (this.checkCollision()) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  private updateStats(): void {
    this.setElementText('score', this.stats.score.toLocaleString());
    this.setElementText('level', this.stats.level.toString());
    this.setElementText('lines', this.stats.lines.toString());
    this.setElementText('goal', (this.stats.level * 10).toString());
    this.setElementText('combo', this.stats.combo.toString());
    this.setElementText('max-combo', this.stats.maxCombo.toString());
    this.setElementText('tetris-count', this.stats.tetrisCount.toString());

    if (this.stats.elapsedTime > 0) {
      const pps = (this.stats.piecesPlaced / (this.stats.elapsedTime / 1000)).toFixed(1);
      this.setElementText('pps', pps);
    }
  }

  private updateTimeDisplay(): void {
    const seconds = Math.floor(this.stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('time-played', timeString);
  }

  private updateProgressBar(): void {
    const linesInLevel = this.stats.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  private updateNextPieces(): void {
    this.nextPieces.forEach((piece, i) => {
      if (this.nextRenderers[i]) {
        this.nextRenderers[i].drawPiece(piece, i === 0 ? 25 : 20);
      }
    });
  }

  private updateHoldDisplay(): void {
    this.holdRenderer.drawPiece(this.holdPiece, 25);
  }

  private showComboDisplay(): void {
    const display = document.getElementById('combo-display');
    if (display) {
      display.textContent = `COMBO x${this.stats.combo}!`;
      display.style.opacity = '1';
      display.style.animation = 'comboPopup 1s ease-out';

      setTimeout(() => {
        display.style.opacity = '0';
      }, 1000);
    }
  }

  private showGameOver(): void {
    this.controlsManager.disable();
    this.audioManager.playSound('gameover');

    const gameOverEl = document.getElementById('game-over');
    if (gameOverEl) {
      gameOverEl.style.display = 'flex';
    }

    this.setElementText('final-score', this.stats.score.toLocaleString());
    this.setElementText('final-level', this.stats.level.toString());
    this.setElementText('final-lines', this.stats.lines.toString());
    this.setElementText('final-max-combo', this.stats.maxCombo.toString());
    this.setElementText('final-tetris', this.stats.tetrisCount.toString());

    const seconds = Math.floor(this.stats.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('final-time', timeString);

    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          score: this.stats.score,
          level: this.stats.level,
          lines: this.stats.lines,
        }),
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
      const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#3498db', '#9b59b6'];
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

    if (this.highScores.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Aucun score enregistré';
      li.style.textAlign = 'center';
      li.style.color = '#bdc3c7';
      scoresList.appendChild(li);
    }
  }

  isHighScore(): boolean {
    return this.highScores.length < 10 || this.stats.score > (this.highScores[this.highScores.length - 1]?.score || 0);
  }

  togglePause(): void {
    this.paused = !this.paused;

    const pauseScreen = document.getElementById('pause-screen');
    const pauseBtn = document.getElementById('pause-btn');

    if (pauseScreen) {
      pauseScreen.style.display = this.paused ? 'flex' : 'none';
    }

    if (pauseBtn) {
      pauseBtn.textContent = this.paused ? '▶ REPRENDRE' : '⏸ PAUSE';
    }
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
    this.controlsManager.disable();
  }

  private draw(): void {
    this.renderer.render(this.board, this.currentPiece);
  }

  private setElementText(id: string, text: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
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

  setSensitivity(value: number): void {
    this.controlsManager.setSensitivity(value);
  }

  getSensitivity(): number {
    return this.controlsManager.getSensitivity();
  }

  destroy(): void {
    this.controlsManager.destroy();
    this.renderer.destroy();
    this.holdRenderer.destroy();
    this.nextRenderers.forEach((r) => r.destroy());
    if (this.particleSystem) {
      this.particleSystem.destroy();
    }
  }
}
