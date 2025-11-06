// Système de rendu PixiJS (WebGL) pour Tetris

import * as PIXI from 'pixi.js';
import { TetrisPiece } from './pieces';
import { COLS, ROWS, BLOCK_SIZE } from './game';

export class Renderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
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
      autoDensity: true,
    });

    // Container pour la grille
    this.gridGraphics = new PIXI.Graphics();
    this.app.stage.addChild(this.gridGraphics);

    // Container pour les blocs placés
    this.boardContainer = new PIXI.Container();
    this.app.stage.addChild(this.boardContainer);

    // Container pour le ghost piece
    this.ghostPieceContainer = new PIXI.Container();
    this.app.stage.addChild(this.ghostPieceContainer);

    // Container pour la pièce courante
    this.currentPieceContainer = new PIXI.Container();
    this.app.stage.addChild(this.currentPieceContainer);

    this.drawGrid();
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

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  private createBlockGraphics(color: string): PIXI.Graphics {
    const colorNum = this.hexToNumber(color);
    const graphics = new PIXI.Graphics();

    // Bloc principal
    graphics.beginFill(colorNum);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, 1);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière (haut)
    graphics.beginFill(0xffffff, 0.2);
    graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
    graphics.endFill();

    return graphics;
  }


  render(board: number[][], currentPiece: TetrisPiece | null, gameOver: boolean): void {
    // Nettoyer les containers
    this.boardContainer.removeChildren();
    this.currentPieceContainer.removeChildren();
    this.ghostPieceContainer.removeChildren();

    // Dessiner les blocs placés
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const colorHex = this.numberToHex(board[y][x]);
          const block = this.createBlockGraphics(colorHex);
          block.x = x * BLOCK_SIZE;
          block.y = y * BLOCK_SIZE;
          this.boardContainer.addChild(block);
        }
      }
    }

    // Dessiner la pièce courante et le ghost piece
    if (currentPiece && !gameOver) {
      this.drawGhostPiece(currentPiece, board);
      this.drawCurrentPiece(currentPiece);
    }
  }

  private numberToHex(num: number): string {
    return '#' + num.toString(16).padStart(6, '0');
  }

  private drawCurrentPiece(piece: TetrisPiece): void {
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const block = this.createBlockGraphics(piece.color);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.currentPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private drawGhostPiece(piece: TetrisPiece, board: number[][]): void {
    const ghostPiece = this.calculateGhostPosition(piece, board);
    if (!ghostPiece) return;

    const shape = ghostPiece.getShape();
    const colorNum = this.hexToNumber(piece.color);

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = ghostPiece.x + x;
          const boardY = ghostPiece.y + y;

          if (boardY >= 0) {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(colorNum, 0.18);
            graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
            graphics.endFill();
            graphics.lineStyle(1, 0x000000, 0.35);
            graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
            graphics.x = boardX * BLOCK_SIZE;
            graphics.y = boardY * BLOCK_SIZE;
            this.ghostPieceContainer.addChild(graphics);
          }
        }
      }
    }
  }

  private calculateGhostPosition(piece: TetrisPiece, board: number[][]): TetrisPiece | null {
    // Créer une copie pour calculer la position du ghost
    const ghostPiece = {
      x: piece.x,
      y: piece.y,
      rotation: piece.rotation,
      getShape: () => piece.getShape(),
    } as TetrisPiece;

    while (!this.checkCollision(ghostPiece, board)) {
      ghostPiece.y++;
    }
    ghostPiece.y--;

    return ghostPiece;
  }

  private checkCollision(piece: TetrisPiece, board: number[][]): boolean {
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
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  updateBackgroundColor(color: string): void {
    const colorNum = this.hexToNumber(color);
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
