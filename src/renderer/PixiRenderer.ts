import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../types';
import { TetrisPiece, copyPiece } from '../game/TetrisPiece';

const { COLS, ROWS, BLOCK_SIZE } = GAME_CONFIG;

export class PixiRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private pieceContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  
  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvas,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();
    this.pieceContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();

    // Ordre d'affichage: grille -> board -> ghost -> piece
    this.app.stage.addChild(this.gridGraphics);
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.pieceContainer);

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
  }

  private createBlock(color: string, alpha: number = 1): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    // Remplissage
    graphics.beginFill(colorNum, alpha);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, 0.5);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière
    if (alpha > 0.5) {
      graphics.beginFill(0xffffff, 0.2);
      graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
      graphics.endFill();
    }

    return graphics;
  }

  renderBoard(board: string[][]): void {
    // Nettoyer le conteneur du board
    this.boardContainer.removeChildren();

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== '0' && board[y][x]) {
          const block = this.createBlock(board[y][x]);
          block.x = x * BLOCK_SIZE;
          block.y = y * BLOCK_SIZE;
          this.boardContainer.addChild(block);
        }
      }
    }
  }

  renderCurrentPiece(piece: TetrisPiece): void {
    this.pieceContainer.removeChildren();

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
            this.pieceContainer.addChild(block);
          }
        }
      }
    }
  }

  renderGhostPiece(piece: TetrisPiece, board: string[][]): void {
    this.ghostContainer.removeChildren();

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
            const block = this.createBlock(piece.color, 0.18);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.ghostContainer.addChild(block);
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

          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS ||
            (boardY >= 0 && board[boardY][boardX] !== '0' && board[boardY][boardX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(board: string[][], currentPiece: TetrisPiece | null, gameOver: boolean): void {
    this.renderBoard(board);
    
    if (currentPiece && !gameOver) {
      this.renderGhostPiece(currentPiece, board);
      this.renderCurrentPiece(currentPiece);
    }
  }

  destroy(): void {
    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });
  }

  getApp(): PIXI.Application {
    return this.app;
  }
}
