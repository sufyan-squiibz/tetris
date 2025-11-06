// Logique principale du jeu Tetris

import type { TetrisPiece } from './Piece';
import { getRandomPiece } from './Piece';
import type { TetrisRenderer } from './Renderer';
import type { AudioManager } from '../utils/AudioManager';
import type { ParticleSystem } from '../utils/ParticleSystem';
import type { IHighScore } from './types';

const COLS = 10;
const ROWS = 20;

export class TetrisGame {
  private board: string[][] = [];
  private currentPiece: TetrisPiece | null = null;
  private nextPieces: TetrisPiece[] = [];
  private holdPiece: TetrisPiece | null = null;
  private canHold: boolean = true;

  // État de jeu
  private gameOver: boolean = false;
  private paused: boolean = false;
  private started: boolean = false;

  // Scoring
  private score: number = 0;
  private level: number = 1;
  private lines: number = 0;
  private combo: number = 0;
  private maxCombo: number = 0;
  private tetrisCount: number = 0;
  private backToBack: boolean = false;

  // Timing
  private dropInterval: number = 1000;
  private dropCounter: number = 0;
  private lastTime: number = 0;
  private startTime: number = 0;
  private elapsedTime: number = 0;

  // Statistiques
  private piecesPlaced: number = 0;
  private highScores: IHighScore[] = [];

  // Références externes
  private renderer: TetrisRenderer;
  private audioManager: AudioManager | null = null;
  private particleSystem: ParticleSystem | null = null;
  private animationFrameId: number | null = null;

  constructor(renderer: TetrisRenderer) {
    this.renderer = renderer;
    this.init();
    this.loadHighScores();
  }

  public setAudioManager(audioManager: AudioManager): void {
    this.audioManager = audioManager;
  }

  public setParticleSystem(particleSystem: ParticleSystem): void {
    this.particleSystem = particleSystem;
  }

  private init(): void {
    this.board = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill('0'));

    // Initialiser les pièces
    this.nextPieces = [getRandomPiece(), getRandomPiece(), getRandomPiece()];
    this.currentPiece = getRandomPiece();
    this.holdPiece = null;
    this.canHold = true;

    // Réinitialiser les stats
    this.gameOver = false;
    this.paused = false;
    this.started = false;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.tetrisCount = 0;
    this.backToBack = false;
    this.dropInterval = 1000;
    this.piecesPlaced = 0;
    this.startTime = Date.now();
    this.elapsedTime = 0;

    this.updateStats();
    this.updateNextPieces();
    this.updateHoldDisplay();
  }

  public start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.update();

      // Activer le bouton pause
      const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseBtn) pauseBtn.disabled = false;
    }
  }

  private update(time: number = 0): void {
    if (!this.started) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) {
      this.animationFrameId = requestAnimationFrame((t) => this.update(t));
      return;
    }

    // Mettre à jour le temps écoulé
    this.elapsedTime = Date.now() - this.startTime;
    this.updateTimeDisplay();

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    this.animationFrameId = requestAnimationFrame((t) => this.update(t));
  }

  public dropPiece(isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      if (this.audioManager) {
        this.audioManager.playSound('drop');
      }
      return true;
    }
    if (isManual && this.audioManager) {
      this.audioManager.playSound('move');
    }
    return false;
  }

  public movePiece(dx: number): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.x += dx;
    if (this.checkCollision()) {
      this.currentPiece.x -= dx;
      return false;
    }
    if (this.audioManager) {
      this.audioManager.playSound('move');
    }
    return true;
  }

  public rotatePiece(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotate();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    if (this.audioManager) {
      this.audioManager.playSound('rotate');
    }
    return true;
  }

  public rotatePieceReverse(): boolean {
    if (!this.currentPiece) return false;

    const originalRotation = this.currentPiece.rotation;
    this.currentPiece.rotateReverse();
    if (this.checkCollision()) {
      this.currentPiece.rotation = originalRotation;
      return false;
    }
    if (this.audioManager) {
      this.audioManager.playSound('rotate');
    }
    return true;
  }

  public hardDrop(): void {
    if (!this.currentPiece) return;

    let dropDistance = 0;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
      dropDistance++;
    }
    this.currentPiece.y--;
    dropDistance--;

    // Bonus pour hard drop
    this.score += dropDistance * 2;

    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    if (this.audioManager) {
      this.audioManager.playSound('drop');
    }
  }

  public holdCurrentPiece(): void {
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

    if (this.audioManager) {
      this.audioManager.playSound('move');
    }
  }

  private checkCollision(): boolean {
    if (!this.currentPiece) return false;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = this.currentPiece.x + x;
          const boardY = this.currentPiece.y + y;

          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && this.board[boardY][boardX] !== '0')
          ) {
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

    this.piecesPlaced++;
    this.canHold = true; // Réactiver le hold après avoir placé une pièce
  }

  private clearLines(): number {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== '0')) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill('0'));
        linesCleared++;
        y++; // Re-check the same row
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);

      // Effets visuels
      if (this.particleSystem) {
        clearedRows.forEach((row) => {
          this.particleSystem!.createLineExplosion(row, this.currentPiece?.color || '#ffffff');
        });

        if (linesCleared === 4) {
          this.particleSystem.createTetrisExplosion(clearedRows, '#FFD700');
        }
      }

      // Afficher le combo
      if (this.combo > 1) {
        this.showComboDisplay();
      }
    } else {
      // Réinitialiser le combo si aucune ligne n'est effacée
      this.combo = 0;
      this.backToBack = false;
    }

    return linesCleared;
  }

  private updateScore(linesCleared: number): void {
    const basePoints = [0, 100, 300, 500, 800];
    let points = basePoints[linesCleared] * this.level;

    // Bonus Tetris (4 lignes)
    if (linesCleared === 4) {
      this.tetrisCount++;
      if (this.backToBack) {
        points *= 1.5; // Bonus Back-to-Back
      }
      this.backToBack = true;
    } else if (linesCleared > 0) {
      this.backToBack = false;
    }

    // Bonus combo
    if (linesCleared > 0) {
      this.combo++;
      points += (this.combo - 1) * 50 * this.level;

      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
    }

    this.score += points;
    this.lines += linesCleared;

    // Level up
    const previousLevel = this.level;
    this.level = Math.floor(this.lines / 10) + 1;
    this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

    this.updateStats();
    this.updateProgressBar();

    if (this.audioManager) {
      this.audioManager.playSound('clear');
      if (this.level > previousLevel) {
        this.audioManager.playSound('levelup');
        if (this.particleSystem) {
          this.particleSystem.createLevelUpEffect();
        }
      }
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
    this.setElementText('score', this.score.toLocaleString());
    this.setElementText('level', this.level.toString());
    this.setElementText('lines', this.lines.toString());
    this.setElementText('goal', (this.level * 10).toString());
    this.setElementText('combo', this.combo.toString());
    this.setElementText('max-combo', this.maxCombo.toString());
    this.setElementText('tetris-count', this.tetrisCount.toString());

    // PPS (Pieces Per Second)
    if (this.elapsedTime > 0) {
      const pps = (this.piecesPlaced / (this.elapsedTime / 1000)).toFixed(1);
      this.setElementText('pps', pps);
    }
  }

  private updateTimeDisplay(): void {
    const seconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('time-played', timeString);
  }

  private updateProgressBar(): void {
    const linesInLevel = this.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  private updateNextPieces(): void {
    this.renderer.updateNextPieces(this.nextPieces);
  }

  private updateHoldDisplay(): void {
    this.renderer.updateHoldDisplay(this.holdPiece);
  }

  private showComboDisplay(): void {
    const display = document.getElementById('combo-display');
    if (display) {
      display.textContent = `COMBO x${this.combo}!`;
      display.style.opacity = '1';
      display.style.animation = 'comboPopup 1s ease-out';

      setTimeout(() => {
        display.style.opacity = '0';
      }, 1000);
    }
  }

  private showGameOver(): void {
    const gameOverDiv = document.getElementById('game-over');
    if (gameOverDiv) {
      gameOverDiv.style.display = 'flex';
    }

    this.setElementText('final-score', this.score.toLocaleString());
    this.setElementText('final-level', this.level.toString());
    this.setElementText('final-lines', this.lines.toString());
    this.setElementText('final-max-combo', this.maxCombo.toString());
    this.setElementText('final-tetris', this.tetrisCount.toString());

    const seconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    this.setElementText('final-time', timeString);

    // Pré-remplir le nom du joueur si disponible
    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }

    if (this.audioManager) {
      this.audioManager.playSound('gameover');
    }
  }

  private async loadHighScores(): Promise<void> {
    try {
      const response = await fetch('/api/scores');
      this.highScores = await response.json();
      this.displayHighScores();
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.highScores = [];
    }
  }

  public async saveScore(name: string): Promise<void> {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          score: this.score,
          level: this.level,
          lines: this.lines
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

  public isHighScore(score: number): boolean {
    return this.highScores.length < 10 || score > (this.highScores[this.highScores.length - 1]?.score || 0);
  }

  public togglePause(): void {
    this.paused = !this.paused;
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
      pauseScreen.style.display = this.paused ? 'flex' : 'none';
    }
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = this.paused ? '▶ REPRENDRE' : '⏸ PAUSE';
    }
  }

  public resetGame(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.init();

    const gameOverDiv = document.getElementById('game-over');
    const pauseScreen = document.getElementById('pause-screen');
    const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;

    if (gameOverDiv) gameOverDiv.style.display = 'none';
    if (pauseScreen) pauseScreen.style.display = 'none';
    if (pauseBtn) pauseBtn.disabled = true;

    this.started = false;
  }

  private draw(): void {
    this.renderer.render(this.board, this.currentPiece, this.gameOver);
  }

  // Méthodes utilitaires
  private setElementText(id: string, text: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
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

  // Getters pour les contrôles
  public isPaused(): boolean {
    return this.paused;
  }

  public isGameOver(): boolean {
    return this.gameOver;
  }

  public isStarted(): boolean {
    return this.started;
  }

  public getScore(): number {
    return this.score;
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
