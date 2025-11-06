import * as PIXI from 'pixi.js';
import { TetrisPiece } from '../core/TetrisPiece';
import { GameConfig } from '../types';

export class PixiRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private piecesContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  private config: GameConfig;

  constructor(canvasElement: HTMLCanvasElement, config: GameConfig) {
    this.config = config;

    // Initialiser l'application PixiJS
    this.app = new PIXI.Application({
      view: canvasElement,
      width: config.cols * config.blockSize,
      height: config.rows * config.blockSize,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    // Créer les containers pour organiser les couches
    this.boardContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();
    this.piecesContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();

    // Ajouter les containers dans l'ordre
    this.app.stage.addChild(this.gridGraphics);
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.piecesContainer);

    this.drawGrid();
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

    // Lignes verticales
    for (let x = 0; x <= this.config.cols; x++) {
      this.gridGraphics.moveTo(x * this.config.blockSize, 0);
      this.gridGraphics.lineTo(x * this.config.blockSize, this.config.rows * this.config.blockSize);
    }

    // Lignes horizontales
    for (let y = 0; y <= this.config.rows; y++) {
      this.gridGraphics.moveTo(0, y * this.config.blockSize);
      this.gridGraphics.lineTo(this.config.cols * this.config.blockSize, y * this.config.blockSize);
    }
  }

  private createBlock(x: number, y: number, color: string): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    // Bloc principal
    graphics.beginFill(colorNum);
    graphics.drawRect(
      x * this.config.blockSize,
      y * this.config.blockSize,
      this.config.blockSize,
      this.config.blockSize
    );
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, 1);
    graphics.drawRect(
      x * this.config.blockSize,
      y * this.config.blockSize,
      this.config.blockSize,
      this.config.blockSize
    );

    // Effet de lumière (highlight)
    const highlight = new PIXI.Graphics();
    highlight.beginFill(0xffffff, 0.2);
    highlight.drawRect(
      x * this.config.blockSize + 2,
      y * this.config.blockSize + 2,
      this.config.blockSize - 4,
      10
    );
    highlight.endFill();
    graphics.addChild(highlight);

    return graphics;
  }

  drawBoard(board: (number | string)[][]): void {
    // Nettoyer le container du plateau
    this.boardContainer.removeChildren();

    // Dessiner les blocs placés
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] !== 0) {
          const color = typeof board[y][x] === 'string' ? board[y][x] as string : '#ffffff';
          const block = this.createBlock(x, y, color);
          this.boardContainer.addChild(block);
        }
      }
    }
  }

  drawPiece(piece: TetrisPiece): void {
    // Nettoyer le container des pièces
    this.piecesContainer.removeChildren();

    const shape = piece.getShape();
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const block = this.createBlock(boardX, boardY, piece.color);
            this.piecesContainer.addChild(block);
          }
        }
      }
    }
  }

  drawGhostPiece(piece: TetrisPiece, board: (number | string)[][]): void {
    // Nettoyer le container du ghost
    this.ghostContainer.removeChildren();

    // Calculer la position du ghost
    const ghostPiece = piece.clone();
    while (!this.checkCollision(ghostPiece, board)) {
      ghostPiece.y++;
    }
    ghostPiece.y--;

    const shape = ghostPiece.getShape();
    const colorNum = parseInt(piece.color.replace('#', ''), 16);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = ghostPiece.x + x;
          const boardY = ghostPiece.y + y;

          if (boardY >= 0) {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(colorNum, 0.18);
            graphics.drawRect(
              boardX * this.config.blockSize,
              boardY * this.config.blockSize,
              this.config.blockSize,
              this.config.blockSize
            );
            graphics.endFill();

            graphics.lineStyle(1, 0x000000, 0.35);
            graphics.drawRect(
              boardX * this.config.blockSize,
              boardY * this.config.blockSize,
              this.config.blockSize,
              this.config.blockSize
            );

            this.ghostContainer.addChild(graphics);
          }
        }
      }
    }
  }

  private checkCollision(piece: TetrisPiece, board: (number | string)[][]): boolean {
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (
            boardX < 0 ||
            boardX >= this.config.cols ||
            boardY >= this.config.rows ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(board: (number | string)[][], currentPiece: TetrisPiece | null): void {
    this.drawBoard(board);
    if (currentPiece) {
      this.drawGhostPiece(currentPiece, board);
      this.drawPiece(currentPiece);
    }
  }

  clear(): void {
    this.boardContainer.removeChildren();
    this.piecesContainer.removeChildren();
    this.ghostContainer.removeChildren();
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
  }

  getApp(): PIXI.Application {
    return this.app;
  }
}
