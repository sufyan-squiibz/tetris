// Système de rendu avec PixiJS

import { Application, Container, Graphics } from 'pixi.js';
import { TetrisPiece } from './pieces';
import { COLS, ROWS, BLOCK_SIZE } from './constants';
import type { Board } from './types';

export class PixiRenderer {
  private app: Application;
  private boardContainer: Container;
  private currentPieceContainer: Container;
  private ghostPieceContainer: Container;
  private gridGraphics: Graphics;
  private blockCache: Map<string, Graphics>;
  
  constructor() {
    this.app = new Application();
    this.boardContainer = new Container();
    this.currentPieceContainer = new Container();
    this.ghostPieceContainer = new Container();
    this.gridGraphics = new Graphics();
    this.blockCache = new Map();
  }

  async init(canvasElement: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas: canvasElement,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    // Ajouter les conteneurs à la scène
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostPieceContainer);
    this.app.stage.addChild(this.currentPieceContainer);
    
    // Dessiner la grille de fond
    this.drawGrid();
    this.app.stage.addChildAt(this.gridGraphics, 0);
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

  private createBlock(color: string, alpha: number = 1): Graphics {
    const cacheKey = `${color}_${alpha}`;
    
    if (this.blockCache.has(cacheKey)) {
      const cached = this.blockCache.get(cacheKey)!;
      return cached.clone() as Graphics;
    }

    const block = new Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);
    
    // Remplissage principal
    block.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.fill({ color: colorNum, alpha });
    
    // Bordure
    block.rect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.stroke({ color: 0x000000, width: 2, alpha });
    
    // Effet de lumière (highlight)
    block.rect(2, 2, BLOCK_SIZE - 4, 10);
    block.fill({ color: 0xffffff, alpha: alpha * 0.2 });
    
    this.blockCache.set(cacheKey, block);
    return block.clone() as Graphics;
  }

  drawBoard(board: Board): void {
    // Nettoyer le conteneur du plateau
    this.boardContainer.removeChildren();

    // Dessiner les blocs placés
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const color = this.getCellColor(board[y][x]);
          const block = this.createBlock(color);
          block.x = x * BLOCK_SIZE;
          block.y = y * BLOCK_SIZE;
          this.boardContainer.addChild(block);
        }
      }
    }
  }

  drawCurrentPiece(piece: TetrisPiece, board: Board): void {
    // Nettoyer les conteneurs
    this.currentPieceContainer.removeChildren();
    this.ghostPieceContainer.removeChildren();

    // Dessiner le ghost piece d'abord
    this.drawGhostPiece(piece, board);

    // Dessiner la pièce courante
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0) {
            const block = this.createBlock(piece.color);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.currentPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private drawGhostPiece(piece: TetrisPiece, board: Board): void {
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
            const block = this.createBlock(piece.color, 0.18);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.ghostPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private checkCollision(piece: TetrisPiece, board: Board): boolean {
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

  private getCellColor(cellValue: number | string): string {
    if (typeof cellValue === 'string') {
      return cellValue;
    }
    // Fallback pour les valeurs numériques
    return '#ffffff';
  }

  renderNextPiece(piece: TetrisPiece, canvas: HTMLCanvasElement, scale: number = 25): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const shape = piece.getShape();
    const blockSize = scale;
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

  render(board: Board, currentPiece: TetrisPiece | null): void {
    this.drawBoard(board);
    
    if (currentPiece) {
      this.drawCurrentPiece(currentPiece, board);
    }
  }

  destroy(): void {
    this.app.destroy(true);
    this.blockCache.clear();
  }

  getApp(): Application {
    return this.app;
  }
}
