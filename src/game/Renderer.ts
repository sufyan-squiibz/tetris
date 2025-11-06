// Système de rendu avec PixiJS (WebGL)

import * as PIXI from 'pixi.js';
import type { TetrisPiece } from './Piece';
import { copyPiece } from './Piece';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

export class TetrisRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private pieceContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private graphics: PIXI.Graphics;
  
  // Canvas pour les pièces suivantes et hold
  private nextCanvases: HTMLCanvasElement[] = [];
  private holdCanvas: HTMLCanvasElement | null = null;

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

    this.boardContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();
    this.pieceContainer = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.pieceContainer);
    this.app.stage.addChild(this.graphics);

    // Initialiser les canvas pour next pieces et hold
    this.initPreviewCanvases();
  }

  private initPreviewCanvases(): void {
    for (let i = 1; i <= 3; i++) {
      const canvas = document.getElementById(`next-canvas-${i}`) as HTMLCanvasElement;
      if (canvas) {
        this.nextCanvases.push(canvas);
      }
    }
    this.holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
  }

  private colorToHex(color: string): number {
    // Convertir #RRGGBB en nombre hex
    const hex = color.replace('#', '');
    return parseInt(hex, 16);
  }

  private drawBlock(x: number, y: number, color: string, alpha: number = 1.0): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const colorHex = this.colorToHex(color);

    // Bloc principal
    graphics.beginFill(colorHex, alpha);
    graphics.drawRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, alpha);
    graphics.drawRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière
    graphics.beginFill(0xffffff, 0.2 * alpha);
    graphics.drawRect(
      x * BLOCK_SIZE + 2,
      y * BLOCK_SIZE + 2,
      BLOCK_SIZE - 4,
      10
    );
    graphics.endFill();

    return graphics;
  }

  private drawGrid(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0x34495e, 1);

    // Lignes verticales
    for (let x = 0; x <= COLS; x++) {
      this.graphics.moveTo(x * BLOCK_SIZE, 0);
      this.graphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    }

    // Lignes horizontales
    for (let y = 0; y <= ROWS; y++) {
      this.graphics.moveTo(0, y * BLOCK_SIZE);
      this.graphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
    }
  }

  public render(board: string[][], currentPiece: TetrisPiece | null, gameOver: boolean): void {
    // Nettoyer les containers
    this.boardContainer.removeChildren();
    this.pieceContainer.removeChildren();
    this.ghostContainer.removeChildren();

    // Dessiner la grille
    this.drawGrid();

    // Dessiner le plateau
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== '0' && board[y][x] !== '') {
          const block = this.drawBlock(x, y, board[y][x]);
          this.boardContainer.addChild(block);
        }
      }
    }

    // Dessiner la pièce courante et le ghost
    if (currentPiece && !gameOver) {
      this.drawGhostPiece(currentPiece, board);
      this.drawCurrentPiece(currentPiece);
    }
  }

  private drawCurrentPiece(piece: TetrisPiece): void {
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const block = this.drawBlock(boardX, boardY, piece.color);
            this.pieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private drawGhostPiece(piece: TetrisPiece, board: string[][]): void {
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
            const block = this.drawBlock(boardX, boardY, piece.color, 0.18);
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
            (boardY >= 0 && board[boardY][boardX] !== '0' && board[boardY][boardX] !== '')
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Dessiner les pièces suivantes
  public updateNextPieces(pieces: TetrisPiece[]): void {
    for (let i = 0; i < 3 && i < pieces.length; i++) {
      const canvas = this.nextCanvases[i];
      if (!canvas) continue;

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const piece = pieces[i];
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

  // Dessiner la pièce en hold
  public updateHoldDisplay(piece: TetrisPiece | null): void {
    if (!this.holdCanvas) return;

    const ctx = this.holdCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);

    if (piece) {
      const shape = piece.getShape();
      const blockSize = 25;
      const offsetX = (this.holdCanvas.width - shape[0].length * blockSize) / 2;
      const offsetY = (this.holdCanvas.height - shape.length * blockSize) / 2;

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

  public destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}
