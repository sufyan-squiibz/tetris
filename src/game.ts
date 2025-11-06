// ===== TETRIS PRO - GAME LOGIC ENHANCED =====

import { TetrisPiece, getRandomPiece } from './pieces';
import { Renderer } from './render';
import { HighScore } from './types';

// Configuration du jeu
export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

// Interfaces globales pour les modules externes
declare global {
  interface Window {
    game: TetrisGame;
    audioManager?: AudioManager;
    particleSystem?: ParticleSystem;
    themeManager?: ThemeManager;
  }
}

interface ThemeManager {
  nextTheme(): string;
}

interface AudioManager {
  playSound(name: string): void;
}

interface ParticleSystem {
  createLineExplosion(y: number, color: string): void;
  createTetrisExplosion(lines: number[], color: string): void;
  createLevelUpEffect(): void;
}

export class TetrisGame {
  // État du jeu
  board: number[][];
  currentPiece: TetrisPiece | null;
  nextPieces: TetrisPiece[];
  holdPiece: TetrisPiece | null;
  canHold: boolean;

  // État de jeu
  gameOver: boolean;
  paused: boolean;
  started: boolean;

  // Scoring
  score: number;
  level: number;
  lines: number;
  combo: number;
  maxCombo: number;
  tetrisCount: number;
  backToBack: boolean;

  // Timing
  dropInterval: number;
  dropCounter: number;
  lastTime: number;
  startTime: number;
  elapsedTime: number;

  // Statistiques
  piecesPlaced: number;
  highScores: HighScore[];

  // Renderer
  private renderer: Renderer;

  constructor() {
    // État du jeu
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    this.currentPiece = null;
    this.nextPieces = [];
    this.holdPiece = null;
    this.canHold = true;

    // État de jeu
    this.gameOver = false;
    this.paused = false;
    this.started = false;

    // Scoring
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.tetrisCount = 0;
    this.backToBack = false;

    // Timing
    this.dropInterval = 1000;
    this.dropCounter = 0;
    this.lastTime = 0;
    this.startTime = 0;
    this.elapsedTime = 0;

    // Statistiques
    this.piecesPlaced = 0;
    this.highScores = [];

    // Initialiser le renderer
    this.renderer = new Renderer('game-canvas');

    this.init();
    this.loadHighScores();
  }

  init(): void {
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

  start(): void {
    if (!this.started && !this.gameOver) {
      this.started = true;
      this.startTime = Date.now();
      this.update();

      // Activer le bouton pause
      const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseBtn) {
        pauseBtn.disabled = false;
      }
    }
  }

  update(time: number = 0): void {
    if (!this.started) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.paused || this.gameOver) return;

    // Mettre à jour le temps écoulé
    this.elapsedTime = Date.now() - this.startTime;
    this.updateTimeDisplay();

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
      this.dropCounter = 0;
    }

    this.draw();
    requestAnimationFrame((t) => this.update(t));
  }

  dropPiece(isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      if (window.audioManager) {
        window.audioManager.playSound('drop');
      }
      return true;
    }
    if (isManual && window.audioManager) {
      window.audioManager.playSound('move');
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
    if (window.audioManager) {
      window.audioManager.playSound('move');
    }
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
    if (window.audioManager) {
      window.audioManager.playSound('rotate');
    }
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
    if (window.audioManager) {
      window.audioManager.playSound('rotate');
    }
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
    this.score += dropDistance * 2;

    this.lockPiece();
    this.clearLines();
    this.spawnPiece();
    if (window.audioManager) {
      window.audioManager.playSound('drop');
    }
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

    if (window.audioManager) {
      window.audioManager.playSound('move');
    }
  }

  checkCollision(): boolean {
    if (!this.currentPiece) return true;

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
            (boardY >= 0 && this.board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lockPiece(): void {
    if (!this.currentPiece) return;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;

          if (boardY >= 0) {
            this.board[boardY][boardX] = this.hexToNumber(this.currentPiece.color);
          }
        }
      }
    }

    this.piecesPlaced++;
    this.canHold = true;
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  clearLines(): number {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== 0)) {
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
      if (window.particleSystem) {
        clearedRows.forEach((row) => {
          window.particleSystem!.createLineExplosion(row, this.currentPiece?.color || '#ffffff');
        });

        if (linesCleared === 4) {
          window.particleSystem.createTetrisExplosion(clearedRows, '#FFD700');
        }
      }

      // Afficher le combo
      if (this.combo > 1) {
        this.showComboDisplay();
      }
    } else {
      this.combo = 0;
      this.backToBack = false;
    }

    return linesCleared;
  }

  updateScore(linesCleared: number): void {
    const basePoints = [0, 100, 300, 500, 800];
    let points = basePoints[linesCleared] * this.level;

    // Bonus Tetris (4 lignes)
    if (linesCleared === 4) {
      this.tetrisCount++;
      if (this.backToBack) {
        points *= 1.5;
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

    if (window.audioManager) {
      window.audioManager.playSound('clear');
      if (this.level > previousLevel) {
        window.audioManager.playSound('levelup');
        if (window.particleSystem) {
          window.particleSystem.createLevelUpEffect();
        }
      }
    }
  }

  spawnPiece(): void {
    if (this.nextPieces.length === 0) return;

    this.currentPiece = this.nextPieces.shift()!;
    this.nextPieces.push(getRandomPiece());
    this.updateNextPieces();

    if (this.checkCollision()) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  updateStats(): void {
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');
    const goalEl = document.getElementById('goal');
    const comboEl = document.getElementById('combo');
    const maxComboEl = document.getElementById('max-combo');
    const tetrisCountEl = document.getElementById('tetris-count');
    const ppsEl = document.getElementById('pps');

    if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
    if (levelEl) levelEl.textContent = this.level.toString();
    if (linesEl) linesEl.textContent = this.lines.toString();
    if (goalEl) goalEl.textContent = (this.level * 10).toString();
    if (comboEl) comboEl.textContent = this.combo.toString();
    if (maxComboEl) maxComboEl.textContent = this.maxCombo.toString();
    if (tetrisCountEl) tetrisCountEl.textContent = this.tetrisCount.toString();

    // PPS (Pieces Per Second)
    if (ppsEl && this.elapsedTime > 0) {
      const pps = (this.piecesPlaced / (this.elapsedTime / 1000)).toFixed(1);
      ppsEl.textContent = pps;
    }
  }

  updateTimeDisplay(): void {
    const seconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    const timeEl = document.getElementById('time-played');
    if (timeEl) {
      timeEl.textContent = timeString;
    }
  }

  updateProgressBar(): void {
    const linesInLevel = this.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  updateNextPieces(): void {
    for (let i = 0; i < 3; i++) {
      const canvas = document.getElementById(`next-canvas-${i + 1}`) as HTMLCanvasElement;
      if (canvas && this.nextPieces[i]) {
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const piece = this.nextPieces[i];
        const shape = piece.getShape();
        const blockSize = i === 0 ? 25 : 20;
        const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (canvas.height - shape.length * blockSize) / 2;

        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
              ctx.fillStyle = piece.color;
              ctx.fillRect(
                offsetX + x * blockSize,
                offsetY + y * blockSize,
                blockSize,
                blockSize
              );
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              ctx.strokeRect(
                offsetX + x * blockSize,
                offsetY + y * blockSize,
                blockSize,
                blockSize
              );
            }
          }
        }
      }
    }
  }

  updateHoldDisplay(): void {
    const canvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.holdPiece) {
      const shape = this.holdPiece.getShape();
      const blockSize = 25;
      const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
      const offsetY = (canvas.height - shape.length * blockSize) / 2;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            ctx.fillStyle = this.holdPiece.color;
            ctx.fillRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize,
              blockSize
            );
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize,
              blockSize
            );
          }
        }
      }
    }
  }

  showComboDisplay(): void {
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

  showGameOver(): void {
    const gameOverEl = document.getElementById('game-over');
    const finalScoreEl = document.getElementById('final-score');
    const finalLevelEl = document.getElementById('final-level');
    const finalLinesEl = document.getElementById('final-lines');
    const finalMaxComboEl = document.getElementById('final-max-combo');
    const finalTetrisEl = document.getElementById('final-tetris');
    const finalTimeEl = document.getElementById('final-time');

    if (gameOverEl) gameOverEl.style.display = 'flex';
    if (finalScoreEl) finalScoreEl.textContent = this.score.toLocaleString();
    if (finalLevelEl) finalLevelEl.textContent = this.level.toString();
    if (finalLinesEl) finalLinesEl.textContent = this.lines.toString();
    if (finalMaxComboEl) finalMaxComboEl.textContent = this.maxCombo.toString();
    if (finalTetrisEl) finalTetrisEl.textContent = this.tetrisCount.toString();

    const seconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    if (finalTimeEl) finalTimeEl.textContent = timeString;

    // Pré-remplir le nom du joueur si disponible
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (playerNameInput) {
      const savedName = localStorage.getItem('tetris-player-name');
      if (savedName) {
        playerNameInput.value = savedName;
      }
    }

    if (window.audioManager) {
      window.audioManager.playSound('gameover');
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

  async saveScore(name: string, score: number, level: number, lines: number): Promise<void> {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score, level, lines }),
      });

      if (response.ok) {
        const result = await response.json();
        this.highScores = result.highScores;
        this.displayHighScores();

        localStorage.setItem('tetris-player-name', name);

        showNotification('Score sauvegardé avec succès! 🎉');
      } else {
        showNotification('Erreur lors de la sauvegarde du score');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur de connexion au serveur');
    }
  }

  displayHighScores(): void {
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
  }

  draw(): void {
    this.renderer.render(this.board, this.currentPiece, this.gameOver);
  }
}

// Fonction utilitaire pour les notifications
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
