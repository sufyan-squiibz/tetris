// Système de rendu PixiJS pour Tetris
import * as PIXI from 'pixi.js';
import { COLS, ROWS, BLOCK_SIZE } from './constants';
import type { TetrisPiece } from './pieces';

export class TetrisRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private pieceContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  private blockGraphics: Map<string, PIXI.Graphics>;

  constructor(canvas: HTMLCanvasElement) {
    // Créer l'application PixiJS
    this.app = new PIXI.Application();
    this.blockGraphics = new Map();
    
    // Initialisation asynchrone
    this.init(canvas).catch(err => {
      console.error('Failed to initialize PixiJS:', err);
    });

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();
    this.pieceContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();
  }

  private async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    // Ajouter les conteneurs à la scène
    this.app.stage.addChild(this.gridGraphics);
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.pieceContainer);

    // Dessiner la grille initiale
    this.drawGrid();
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x34495e, 0.3);

    // Lignes verticales
    for (let x = 0; x <= COLS; x++) {
      this.gridGraphics.moveTo(x * BLOCK_SIZE, 0);
      this.gridGraphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    }

    // Lignes horizontales
    for (let y = 0; y <= ROWS; y++) {
      this.gridGraphics.moveTo(0, y * BLOCK_SIZE);
      this.gridGraphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
    }

    this.gridGraphics.stroke();
  }

  private drawBlock(container: PIXI.Container, x: number, y: number, color: string, alpha: number = 1): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    
    // Convertir la couleur hex en nombre
    const colorNum = parseInt(color.replace('#', ''), 16);
    
    // Dessiner le bloc principal
    graphics.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    graphics.fill({ color: colorNum, alpha });
    
    // Bordure
    graphics.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    graphics.stroke({ width: 2, color: 0x000000, alpha });
    
    // Effet de lumière (highlight)
    graphics.rect(2, 2, BLOCK_SIZE - 4, 10);
    graphics.fill({ color: 0xffffff, alpha: alpha * 0.2 });
    
    // Positionner le bloc
    graphics.x = x * BLOCK_SIZE;
    graphics.y = y * BLOCK_SIZE;
    
    container.addChild(graphics);
    return graphics;
  }

  drawBoard(board: string[][]): void {
    // Effacer le conteneur du plateau
    this.boardContainer.removeChildren();
    this.blockGraphics.clear();

    // Dessiner tous les blocs placés
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== '0' && board[y][x] !== '') {
          const graphics = this.drawBlock(this.boardContainer, x, y, board[y][x]);
          this.blockGraphics.set(`${x}-${y}`, graphics);
        }
      }
    }
  }

  drawCurrentPiece(piece: TetrisPiece, board: string[][]): void {
    // Effacer les pièces précédentes
    this.pieceContainer.removeChildren();
    this.ghostContainer.removeChildren();

    // Dessiner d'abord le ghost piece
    this.drawGhostPiece(piece, board);

    // Dessiner la pièce courante
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0) {
            this.drawBlock(this.pieceContainer, boardX, boardY, piece.color);
          }
        }
      }
    }
  }

  private drawGhostPiece(piece: TetrisPiece, board: string[][]): void {
    const ghostPiece = piece.clone();
    
    // Faire descendre le ghost piece jusqu'à la collision
    while (!this.checkCollision(ghostPiece, board)) {
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
            this.drawBlock(this.ghostContainer, boardX, boardY, piece.color, 0.2);
          }
        }
      }
    }
  }

  private checkCollision(piece: TetrisPiece, board: string[][]): boolean {
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardX < 0 || boardX >= COLS || 
              boardY >= ROWS || 
              (boardY >= 0 && board[boardY][boardX] !== '0' && board[boardY][boardX] !== '')) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(board: string[][], currentPiece: TetrisPiece | null): void {
    this.drawBoard(board);
    
    if (currentPiece) {
      this.drawCurrentPiece(currentPiece, board);
    }
  }

  // Rendu pour les canvas de preview (next pieces et hold)
  renderPreviewPiece(canvas: HTMLCanvasElement, piece: TetrisPiece | null, size: number = 25): void {
    if (!piece) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const shape = piece.getShape();
    const offsetX = (canvas.width - shape[0].length * size) / 2;
    const offsetY = (canvas.height - shape.length * size) / 2;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          // Bloc principal
          ctx.fillStyle = piece.color;
          ctx.fillRect(
            offsetX + x * size,
            offsetY + y * size,
            size,
            size
          );
          
          // Bordure
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            offsetX + x * size,
            offsetY + y * size,
            size,
            size
          );
          
          // Effet de lumière
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(
            offsetX + x * size + 2,
            offsetY + y * size + 2,
            size - 4,
            6
          );
        }
      }
    }
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
  }
}
