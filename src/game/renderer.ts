// Rendu avec PixiJS (WebGL)
import * as PIXI from 'pixi.js';
import type { TetrisPiece } from './pieces';
import { GAME_CONFIG } from '../types';

const { COLS, ROWS, BLOCK_SIZE } = GAME_CONFIG;

export class PixiRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  private boardBlocks: PIXI.Graphics[][] = [];
  private holdContainer: PIXI.Container | null = null;
  private nextContainers: PIXI.Container[] = [];

  constructor(element: HTMLElement) {
    // Initialiser PixiJS
    this.app = new PIXI.Application({
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    element.appendChild(this.app.view as HTMLCanvasElement);

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.currentPieceContainer = new PIXI.Container();
    this.ghostPieceContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();

    this.app.stage.addChild(this.gridGraphics);
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostPieceContainer);
    this.app.stage.addChild(this.currentPieceContainer);

    this.initBoard();
    this.drawGrid();
  }

  private initBoard(): void {
    for (let y = 0; y < ROWS; y++) {
      this.boardBlocks[y] = [];
      for (let x = 0; x < COLS; x++) {
        this.boardBlocks[y][x] = new PIXI.Graphics();
        this.boardContainer.addChild(this.boardBlocks[y][x]);
      }
    }
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

  private drawBlock(graphics: PIXI.Graphics, x: number, y: number, color: number, alpha: number = 1): void {
    graphics.clear();
    graphics.beginFill(color, alpha);
    graphics.drawRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, alpha * 0.5);
    graphics.drawRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

    // Effet de lumière
    graphics.beginFill(0xffffff, alpha * 0.2);
    graphics.drawRect(x * BLOCK_SIZE + 3, y * BLOCK_SIZE + 3, BLOCK_SIZE - 6, 8);
    graphics.endFill();
  }

  drawBoard(board: number[][]): void {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const graphics = this.boardBlocks[y][x];
        if (board[y][x] !== 0) {
          this.drawBlock(graphics, x, y, board[y][x]);
        } else {
          graphics.clear();
        }
      }
    }
  }

  drawCurrentPiece(piece: TetrisPiece): void {
    this.currentPieceContainer.removeChildren();
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const graphics = new PIXI.Graphics();
            this.drawBlock(graphics, boardX, boardY, piece.color);
            this.currentPieceContainer.addChild(graphics);
          }
        }
      }
    }
  }

  drawGhostPiece(piece: TetrisPiece, board: number[][]): void {
    this.ghostPieceContainer.removeChildren();
    const ghostPiece = piece.copy();

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
            const graphics = new PIXI.Graphics();
            this.drawBlock(graphics, boardX, boardY, piece.color, 0.2);
            this.ghostPieceContainer.addChild(graphics);
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

  setupHoldCanvas(element: HTMLElement): void {
    const holdApp = new PIXI.Application({
      width: 100,
      height: 100,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    element.appendChild(holdApp.view as HTMLCanvasElement);
    this.holdContainer = new PIXI.Container();
    holdApp.stage.addChild(this.holdContainer);
  }

  setupNextCanvases(elements: HTMLElement[]): void {
    elements.forEach((element, index) => {
      const size = index === 0 ? 100 : 80;
      const nextApp = new PIXI.Application({
        width: size,
        height: size,
        backgroundColor: 0x1a1a2e,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      element.appendChild(nextApp.view as HTMLCanvasElement);
      const container = new PIXI.Container();
      nextApp.stage.addChild(container);
      this.nextContainers.push(container);
    });
  }

  drawHoldPiece(piece: TetrisPiece | null): void {
    if (!this.holdContainer) return;
    this.holdContainer.removeChildren();

    if (piece) {
      const shape = piece.getShape();
      const blockSize = 25;
      const offsetX = (100 - shape[0].length * blockSize) / 2;
      const offsetY = (100 - shape.length * blockSize) / 2;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(piece.color);
            graphics.drawRect(offsetX + x * blockSize + 1, offsetY + y * blockSize + 1, blockSize - 2, blockSize - 2);
            graphics.endFill();
            graphics.lineStyle(1, 0x000000);
            graphics.drawRect(offsetX + x * blockSize + 1, offsetY + y * blockSize + 1, blockSize - 2, blockSize - 2);
            this.holdContainer.addChild(graphics);
          }
        }
      }
    }
  }

  drawNextPieces(pieces: TetrisPiece[]): void {
    pieces.forEach((piece, index) => {
      if (index >= this.nextContainers.length) return;
      const container = this.nextContainers[index];
      container.removeChildren();

      const shape = piece.getShape();
      const blockSize = index === 0 ? 25 : 20;
      const canvasSize = index === 0 ? 100 : 80;
      const offsetX = (canvasSize - shape[0].length * blockSize) / 2;
      const offsetY = (canvasSize - shape.length * blockSize) / 2;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(piece.color);
            graphics.drawRect(offsetX + x * blockSize + 1, offsetY + y * blockSize + 1, blockSize - 2, blockSize - 2);
            graphics.endFill();
            graphics.lineStyle(1, 0x000000);
            graphics.drawRect(offsetX + x * blockSize + 1, offsetY + y * blockSize + 1, blockSize - 2, blockSize - 2);
            container.addChild(graphics);
          }
        }
      }
    });
  }

  clear(): void {
    this.currentPieceContainer.removeChildren();
    this.ghostPieceContainer.removeChildren();
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}
