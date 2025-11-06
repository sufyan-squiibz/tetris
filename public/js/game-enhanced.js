// ===== TETRIS PRO - GAME LOGIC ENHANCED =====

// Configuration du jeu
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

class TetrisGame {
    constructor() {
        // État du jeu
        this.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        this.currentPiece = null;
        this.nextPieces = []; // 3 pièces en preview
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
        
        this.init();
        this.loadHighScores();
    }

    init() {
        this.board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        
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

    start() {
        if (!this.started && !this.gameOver) {
            this.started = true;
            this.startTime = Date.now();
            this.update();
            
            // Activer le bouton pause
            document.getElementById('pause-btn').disabled = false;
        }
    }

    update(time = 0) {
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
        requestAnimationFrame(this.update.bind(this));
    }

    dropPiece(isManual = false) {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.lockPiece();
            this.clearLines();
            this.spawnPiece();
            if (window.audioManager) {
                audioManager.playSound('drop');
            }
            return true;
        }
        if (isManual && window.audioManager) {
            audioManager.playSound('move');
        }
        return false;
    }

    movePiece(dx) {
        this.currentPiece.x += dx;
        if (this.checkCollision()) {
            this.currentPiece.x -= dx;
            return false;
        }
        if (window.audioManager) {
            audioManager.playSound('move');
        }
        return true;
    }

    rotatePiece() {
        const originalRotation = this.currentPiece.rotation;
        this.currentPiece.rotate();
        if (this.checkCollision()) {
            this.currentPiece.rotation = originalRotation;
            return false;
        }
        if (window.audioManager) {
            audioManager.playSound('rotate');
        }
        return true;
    }

    rotatePieceReverse() {
        const originalRotation = this.currentPiece.rotation;
        this.currentPiece.rotateReverse();
        if (this.checkCollision()) {
            this.currentPiece.rotation = originalRotation;
            return false;
        }
        if (window.audioManager) {
            audioManager.playSound('rotate');
        }
        return true;
    }

    hardDrop() {
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
            audioManager.playSound('drop');
        }
    }

    holdCurrentPiece() {
        if (!this.canHold) return;
        
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
            audioManager.playSound('move');
        }
    }

    checkCollision() {
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

    lockPiece() {
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

    clearLines() {
        let linesCleared = 0;
        const clearedRows = [];
        
        for (let y = ROWS - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                clearedRows.push(y);
                this.board.splice(y, 1);
                this.board.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++; // Re-check the same row
            }
        }

        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            
            // Effets visuels
            if (window.particleSystem) {
                clearedRows.forEach(row => {
                    particleSystem.createLineExplosion(row, this.currentPiece.color);
                });
                
                if (linesCleared === 4) {
                    particleSystem.createTetrisExplosion(clearedRows, '#FFD700');
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

    updateScore(linesCleared) {
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
        
        if (window.audioManager) {
            audioManager.playSound('clear');
            if (this.level > previousLevel) {
                audioManager.playSound('levelup');
                if (window.particleSystem) {
                    particleSystem.createLevelUpEffect();
                }
            }
        }
    }

    spawnPiece() {
        this.currentPiece = this.nextPieces.shift();
        this.nextPieces.push(getRandomPiece());
        this.updateNextPieces();
        
        if (this.checkCollision()) {
            this.gameOver = true;
            this.showGameOver();
        }
    }

    updateStats() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('goal').textContent = this.level * 10;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('max-combo').textContent = this.maxCombo;
        document.getElementById('tetris-count').textContent = this.tetrisCount;
        
        // PPS (Pieces Per Second)
        if (this.elapsedTime > 0) {
            const pps = (this.piecesPlaced / (this.elapsedTime / 1000)).toFixed(1);
            document.getElementById('pps').textContent = pps;
        }
    }

    updateTimeDisplay() {
        const seconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('time-played').textContent = timeString;
    }

    updateProgressBar() {
        const linesInLevel = this.lines % 10;
        const progress = (linesInLevel / 10) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    updateNextPieces() {
        // Mettre à jour les 3 canvas de preview
        for (let i = 0; i < 3; i++) {
            const canvas = document.getElementById(`next-canvas-${i + 1}`);
            if (canvas && this.nextPieces[i]) {
                const ctx = canvas.getContext('2d');
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

    updateHoldDisplay() {
        const canvas = document.getElementById('hold-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
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

    showComboDisplay() {
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

    showGameOver() {
        document.getElementById('game-over').style.display = 'flex';
        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('final-lines').textContent = this.lines;
        document.getElementById('final-max-combo').textContent = this.maxCombo;
        document.getElementById('final-tetris').textContent = this.tetrisCount;
        
        const seconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('final-time').textContent = timeString;
        
        // Pré-remplir le nom du joueur si disponible
        const savedName = localStorage.getItem('tetris-player-name');
        if (savedName) {
            document.getElementById('player-name').value = savedName;
        }
        
        if (window.audioManager) {
            audioManager.playSound('gameover');
        }
    }

    async loadHighScores() {
        try {
            const response = await fetch('/api/scores');
            this.highScores = await response.json();
            this.displayHighScores();
        } catch (error) {
            console.error('Erreur lors du chargement des scores:', error);
            this.highScores = [];
        }
    }

    async saveScore(name, score, level, lines) {
        try {
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, score, level, lines })
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

    displayHighScores() {
        const scoresList = document.getElementById('high-scores-list');
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

    isHighScore(score) {
        return this.highScores.length < 10 || score > this.highScores[this.highScores.length - 1]?.score;
    }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-screen').style.display = this.paused ? 'flex' : 'none';
        document.getElementById('pause-btn').textContent = this.paused ? '▶ REPRENDRE' : '⏸ PAUSE';
    }

    resetGame() {
        this.init();
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('pause-screen').style.display = 'none';
        document.getElementById('pause-btn').disabled = true;
        this.started = false;
    }

    draw() {
        // Le rendu sera géré par render.js
    }
}

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    let game = new TetrisGame();
    window.game = game; // Rendre accessible globalement
    
    // Événements de contrôle
    document.getElementById('start-btn').addEventListener('click', () => {
        game.start();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        game.togglePause();
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        game.resetGame();
    });

    // Initialiser les contrôles clavier
    initControls(game);

    // Événement pour sauvegarder le score
    document.getElementById('save-score-btn').addEventListener('click', () => {
        const name = document.getElementById('player-name').value.trim();
        
        if (!name) {
            showNotification('Veuillez entrer votre nom');
            return;
        }

        if (game.isHighScore(game.score)) {
            game.saveScore(name, game.score, game.level, game.lines);
        } else {
            showNotification('Votre score n\'est pas assez élevé pour le classement');
        }
        
        document.getElementById('game-over').style.display = 'none';
    });

    // Plein écran
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const container = document.getElementById('game-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Erreur plein écran:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Tutoriel
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    document.getElementById('tutorial-btn').addEventListener('click', () => {
        tutorialOverlay.style.display = 'flex';
    });

    document.getElementById('close-tutorial-btn').addEventListener('click', () => {
        tutorialOverlay.style.display = 'none';
    });

    document.getElementById('start-tutorial-btn').addEventListener('click', () => {
        tutorialOverlay.style.display = 'none';
        game.start();
    });

    // Afficher le tutoriel au premier lancement
    if (!localStorage.getItem('tetris-tutorial-seen')) {
        tutorialOverlay.style.display = 'flex';
        localStorage.setItem('tetris-tutorial-seen', 'true');
    }

    // Rendu initial
    game.draw();
});

