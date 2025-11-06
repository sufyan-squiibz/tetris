// Rendu avec PixiJS
import * as PIXI from 'pixi.js';
import { TetrisPiece } from './pieces';
import { copyPiece } from './pieces';

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export class Renderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private pieceContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.app = new PIXI.Application({
      view: canvas,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      background: 0x1a1a2e,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.pieceContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();

    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.pieceContainer);

    // Dessiner la grille
    this.gridGraphics = new PIXI.Graphics();
    this.drawGrid();
    this.boardContainer.addChild(this.gridGraphics);
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

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
  }

  private createBlockSprite(color: string, x: number, y: number, alpha: number = 1): PIXI.Graphics {
    // Ne pas utiliser de cache pour permettre les mises à jour dynamiques
    const block = new PIXI.Graphics();
    
    // Convertir la couleur hex en nombre
    const colorNum = parseInt(color.replace('#', ''), 16);
    
    // Dessiner le bloc principal
    block.beginFill(colorNum, alpha);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.endFill();
    
    // Bordure
    block.lineStyle(2, 0x000000, 0.8);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    
    // Effet de lumière
    block.beginFill(0xffffff, 0.2 * alpha);
    block.drawRect(2, 2, BLOCK_SIZE - 4, 10);
    block.endFill();
    
    block.x = x * BLOCK_SIZE;
    block.y = y * BLOCK_SIZE;
    
    return block;
  }

  drawBoard(board: number[][]): void {
    // Nettoyer les anciens blocs (sauf la grille)
    const childrenToRemove: PIXI.Container[] = [];
    this.boardContainer.children.forEach(child => {
      if (child !== this.gridGraphics) {
        childrenToRemove.push(child as PIXI.Container);
      }
    });
    childrenToRemove.forEach(child => {
      this.boardContainer.removeChild(child);
      if (child instanceof PIXI.Graphics) {
        child.destroy();
      }
    });

    // Dessiner les blocs placés
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const color = this.numberToColor(board[y][x]);
          const block = this.createBlockSprite(color, x, y);
          this.boardContainer.addChild(block);
        }
      }
    }
  }

  drawCurrentPiece(piece: TetrisPiece, board: number[][]): void {
    // Nettoyer les conteneurs et détruire les graphiques
    this.pieceContainer.children.forEach(child => {
      if (child instanceof PIXI.Graphics) {
        child.destroy();
      }
    });
    this.ghostContainer.children.forEach(child => {
      if (child instanceof PIXI.Graphics) {
        child.destroy();
      }
    });
    this.pieceContainer.removeChildren();
    this.ghostContainer.removeChildren();

    const shape = piece.getShape();

    // Dessiner la pièce courante
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const block = this.createBlockSprite(piece.color, boardX, boardY);
            this.pieceContainer.addChild(block);
          }
        }
      }
    }

    // Dessiner le ghost piece
    this.drawGhostPiece(piece, board);
  }

  private drawGhostPiece(piece: TetrisPiece, board: number[][]): void {
    const ghostPiece = copyPiece(piece);

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
            const block = new PIXI.Graphics();
            block.beginFill(parseInt(piece.color.replace('#', ''), 16), 0.18);
            block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
            block.endFill();
            block.lineStyle(1, 0x000000, 0.35);
            block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.ghostContainer.addChild(block);
          }
        }
      }
    }
  }

  private checkCollision(piece: TetrisPiece, board: number[][]): boolean {
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

  private numberToColor(num: number | string): string {
    // Convertir un nombre en couleur hex
    if (typeof num === 'string' && num.startsWith('#')) {
      return num;
    }
    const colors: { [key: number]: string } = {
      1: '#00ffff', // I
      2: '#0000ff', // J
      3: '#ff7f00', // L
      4: '#ffff00', // O
      5: '#00ff00', // S
      6: '#800080', // T
      7: '#ff0000'  // Z
    };
    return colors[num as number] || '#ffffff';
  }

  updateBackground(color: string): void {
    const colorNum = parseInt(color.replace('#', ''), 16);
    if (this.app.renderer.background) {
      this.app.renderer.background.color = colorNum;
    }
  }

  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  destroy(): void {
    this.app.destroy(true);
  }
}
