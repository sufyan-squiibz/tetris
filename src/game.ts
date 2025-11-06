import { COLS, ROWS, Board, GameStats, HighScore } from './types';
import { TetrisPiece, getRandomPiece, copyPiece } from './pieces';
import { TetrisRenderer } from './renderer';
import { showNotification } from './utils';

export class TetrisGame {
  private board: Board;
  private currentPiece: TetrisPiece | null = null;
  private nextPieces: TetrisPiece[] = [];
  private holdPiece: TetrisPiece | null = null;
  private canHold: boolean = true;

  // État du jeu
  public gameOver: boolean = false;
  public paused: boolean = false;
  public started: boolean = false;

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
  private highScores: HighScore[] = [];

  // Renderer
  private renderer: TetrisRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    this.renderer = new TetrisRenderer(canvas);
    this.init();
    this.loadHighScores();
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
      requestAnimationFrame(this.update.bind(this));
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
    requestAnimationFrame(this.update.bind(this));
  }

  public dropPiece(_isManual: boolean = false): boolean {
    if (!this.currentPiece) return false;

    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
      this.clearLines();
      this.spawnPiece();
      return true;
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
  }

  private checkCollision(): boolean {
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

  private lockPiece(): void {
    if (!this.currentPiece) return;

    const shape = this.currentPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;

          if (boardY >= 0) {
            // Stocker la couleur comme hash
            this.board[boardY][boardX] = this.colorToNumber(this.currentPiece.color);
          }
        }
      }
    }

    this.piecesPlaced++;
    this.canHold = true;
  }

  private colorToNumber(color: string): number {
    return parseInt(color.replace('#', ''), 16);
  }

  private clearLines(): number {
    let linesCleared = 0;
    const clearedRows: number[] = [];

    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== 0)) {
        clearedRows.push(y);
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Re-check the same row
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);

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
    this.level = Math.floor(this.lines / 10) + 1;
    this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

    this.updateStats();
    this.updateProgressBar();
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

    if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
    if (levelEl) levelEl.textContent = this.level.toString();
    if (linesEl) linesEl.textContent = this.lines.toString();
    if (goalEl) goalEl.textContent = (this.level * 10).toString();
    if (comboEl) comboEl.textContent = this.combo.toString();
    if (maxComboEl) maxComboEl.textContent = this.maxCombo.toString();
    if (tetrisCountEl) tetrisCountEl.textContent = this.tetrisCount.toString();

    // PPS (Pieces Per Second)
    if (this.elapsedTime > 0 && ppsEl) {
      const pps = (this.piecesPlaced / (this.elapsedTime / 1000)).toFixed(1);
      ppsEl.textContent = pps;
    }
  }

  private updateTimeDisplay(): void {
    const seconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    const timeEl = document.getElementById('time-played');
    if (timeEl) timeEl.textContent = timeString;
  }

  private updateProgressBar(): void {
    const linesInLevel = this.lines % 10;
    const progress = (linesInLevel / 10) * 100;
    
    const progressFill = document.getElementById('progress-fill') as HTMLElement;
    if (progressFill) progressFill.style.width = `${progress}%`;
  }

  private updateNextPieces(): void {
    for (let i = 0; i < 3; i++) {
      const canvasId = `next-canvas-${i + 1}`;
      if (this.nextPieces[i]) {
        const size = i === 0 ? 25 : 20;
        this.renderer.renderNextPiece(canvasId, this.nextPieces[i], size);
      }
    }
  }

  private updateHoldDisplay(): void {
    this.renderer.renderHoldPiece(this.holdPiece);
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
    const gameOverEl = document.getElementById('game-over');
    if (gameOverEl) gameOverEl.style.display = 'flex';

    const finalScoreEl = document.getElementById('final-score');
    const finalLevelEl = document.getElementById('final-level');
    const finalLinesEl = document.getElementById('final-lines');
    const finalMaxComboEl = document.getElementById('final-max-combo');
    const finalTetrisEl = document.getElementById('final-tetris');
    const finalTimeEl = document.getElementById('final-time');

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
    const savedName = localStorage.getItem('tetris-player-name');
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (savedName && playerNameInput) {
      playerNameInput.value = savedName;
    }
  }

  public async loadHighScores(): Promise<void> {
    try {
      const response = await fetch('/api/scores');
      this.highScores = await response.json();
      this.displayHighScores();
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
      this.highScores = [];
    }
  }

  public async saveScore(name: string, score: number, level: number, lines: number): Promise<void> {
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
    const pauseBtn = document.getElementById('pause-btn');
    
    if (pauseScreen) pauseScreen.style.display = this.paused ? 'flex' : 'none';
    if (pauseBtn) pauseBtn.textContent = this.paused ? '▶ REPRENDRE' : '⏸ PAUSE';
  }

  public resetGame(): void {
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
    if (!this.currentPiece) return;

    // Calculer le ghost piece
    const ghostPiece = copyPiece(this.currentPiece);
    while (!this.checkCollisionForPiece(ghostPiece)) {
      ghostPiece.y++;
    }
    ghostPiece.y--;

    // Rendu avec PixiJS
    this.renderer.drawBoard(this.board);
    this.renderer.drawGhostPiece(ghostPiece);
    this.renderer.drawCurrentPiece(this.currentPiece);
  }

  private checkCollisionForPiece(piece: TetrisPiece): boolean {
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

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

  public getStats(): GameStats {
    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      combo: this.combo,
      maxCombo: this.maxCombo,
      tetrisCount: this.tetrisCount,
      piecesPlaced: this.piecesPlaced,
      elapsedTime: this.elapsedTime,
    };
  }
}
