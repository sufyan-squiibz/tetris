// Configuration du rendu
// (Les constantes COLS, ROWS et BLOCK_SIZE sont définies dans game.js)

// Canvas context
const gameCanvas = document.getElementById('game-canvas');

if (!gameCanvas) {
    throw new Error('Canvas elements non trouvés. Vérifiez que le DOM est chargé avant render.js');
}

const gameCtx = gameCanvas.getContext('2d');

function colorWithAlpha(color, alpha) {
    if (!color) {
        return `rgba(255,255,255,${alpha})`;
    }

    if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }
        const intVal = parseInt(hex, 16);
        const r = (intVal >> 16) & 255;
        const g = (intVal >> 8) & 255;
        const b = intVal & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    if (color.startsWith('rgb')) {
        const values = color
            .replace(/rgba?\(/, '')
            .replace(')', '')
            .split(',')
            .map(v => Number(v.trim()));
        const [r = 255, g = 255, b = 255] = values;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return `rgba(255,255,255,${alpha})`;
}

// Fonction pour dessiner un bloc
function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Bordure
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Effet de lumière
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, 10);
}

// Dessiner la grille de jeu
function drawBoard(board) {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Dessiner la grille de fond
    gameCtx.fillStyle = '#1a1a2e';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Dessiner les lignes de grille
    gameCtx.strokeStyle = '#34495e';
    gameCtx.lineWidth = 1;
    
    for (let x = 0; x <= COLS; x++) {
        gameCtx.beginPath();
        gameCtx.moveTo(x * BLOCK_SIZE, 0);
        gameCtx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        gameCtx.stroke();
    }
    
    for (let y = 0; y <= ROWS; y++) {
        gameCtx.beginPath();
        gameCtx.moveTo(0, y * BLOCK_SIZE);
        gameCtx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        gameCtx.stroke();
    }
    
    // Dessiner les blocs placés
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                drawBlock(gameCtx, x, y, board[y][x]);
            }
        }
    }
}

// Dessiner la pièce courante
function drawCurrentPiece(piece, board) {
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;
                
                if (boardY >= 0) {
                    drawBlock(gameCtx, boardX, boardY, piece.color);
                }
            }
        }
    }
    
    // Dessiner le ghost piece (prévisualisation)
    drawGhostPiece(piece, board);
}

// Dessiner le ghost piece
function drawGhostPiece(piece, board) {
    const ghostPiece = copyPiece(piece);
    
    // Faire descendre le ghost piece jusqu'à la collision
    while (!checkCollision(ghostPiece, board)) {
        ghostPiece.y++;
    }
    ghostPiece.y--;
    
    const shape = ghostPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardX = ghostPiece.x + x;
                const boardY = ghostPiece.y + y;
                
                if (boardY >= 0) {
                    // Dessiner en ombre translucide
                    gameCtx.fillStyle = colorWithAlpha(piece.color, 0.18);
                    gameCtx.fillRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

                    gameCtx.strokeStyle = colorWithAlpha('#000000', 0.35);
                    gameCtx.lineWidth = 1;
                    gameCtx.strokeRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
}

// Vérifier les collisions (pour le ghost piece)
function checkCollision(piece, board) {
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;

                if (boardX < 0 || boardX >= COLS || 
                    boardY >= ROWS || 
                    (boardY >= 0 && board[boardY][boardX] !== 0)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Les pièces suivantes et hold sont maintenant gérées dans game.js
// via updateNextPieces() et updateHoldDisplay()

// Fonction principale de rendu
function render(game) {
    drawBoard(game.board);
    
    if (game.currentPiece && !game.gameOver) {
        drawCurrentPiece(game.currentPiece, game.board);
    }
}

// Mettre à jour la méthode draw de TetrisGame
TetrisGame.prototype.draw = function() {
    render(this);
};

// Animation pour la suppression de lignes
function animateLineClear(lines) {
    let opacity = 1;
    
    function animate() {
        opacity -= 0.05;
        
        if (opacity <= 0) {
            return;
        }
        
        gameCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        lines.forEach(y => {
            gameCtx.fillRect(0, y * BLOCK_SIZE, COLS * BLOCK_SIZE, BLOCK_SIZE);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
