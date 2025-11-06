import * as PIXI from 'pixi.js';
import { TetrisPiece } from './pieces';
import { GameConfig } from './types';

export class GameRenderer {
  private app!: PIXI.Application;
  private boardContainer!: PIXI.Container;
  private pieceContainer!: PIXI.Container;
  private ghostContainer!: PIXI.Container;
  private gridGraphics!: PIXI.Graphics;
  private blockSize: number;
  private cols: number;
  private rows: number;

  constructor(_canvas: HTMLCanvasElement, config: GameConfig) {
    this.blockSize = config.blockSize;
    this.cols = config.cols;
    this.rows = config.rows;
  }

  initApp(canvas: HTMLCanvasElement, config: GameConfig): void {
    // Créer l'application PixiJS (API v7)
    this.app = new PIXI.Application({
      view: canvas,
      width: config.cols * config.blockSize,
      height: config.rows * config.blockSize,
      background: 0x1a1a2e,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.pieceContainer = new PIXI.Container();
    this.ghostContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();

    this.app.stage.addChild(this.gridGraphics);
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.pieceContainer);
  }

  private createBlockGraphics(color: string, alpha: number = 1.0): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const hexColor = this.hexToNumber(color);
    
    // Bloc principal
    graphics.beginFill(hexColor, alpha);
    graphics.drawRect(0, 0, this.blockSize, this.blockSize);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, alpha);
    graphics.drawRect(0, 0, this.blockSize, this.blockSize);

    // Effet de lumière (haut gauche)
    graphics.beginFill(0xffffff, alpha * 0.2);
    graphics.drawRect(2, 2, this.blockSize - 4, 10);
    graphics.endFill();

    return graphics;
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  drawBoard(board: number[][]): void {
    // Nettoyer le conteneur du plateau
    this.boardContainer.removeChildren();

    // Dessiner les blocs placés
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (board[y][x] !== 0) {
          const color = this.numberToHex(board[y][x]);
          const block = this.createBlockGraphics(color);
          block.x = x * this.blockSize;
          block.y = y * this.blockSize;
          this.boardContainer.addChild(block);
        }
      }
    }
  }

  private numberToHex(num: number): string {
    return '#' + num.toString(16).padStart(6, '0');
  }

  drawGrid(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

    // Lignes verticales
    for (let x = 0; x <= this.cols; x++) {
      this.gridGraphics.moveTo(x * this.blockSize, 0);
      this.gridGraphics.lineTo(x * this.blockSize, this.rows * this.blockSize);
    }

    // Lignes horizontales
    for (let y = 0; y <= this.rows; y++) {
      this.gridGraphics.moveTo(0, y * this.blockSize);
      this.gridGraphics.lineTo(this.cols * this.blockSize, y * this.blockSize);
    }
  }

  drawCurrentPiece(piece: TetrisPiece): void {
    this.pieceContainer.removeChildren();
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            const block = this.createBlockGraphics(piece.color);
            block.x = boardX * this.blockSize;
            block.y = boardY * this.blockSize;
            this.pieceContainer.addChild(block);
          }
        }
      }
    }
  }

  drawGhostPiece(piece: TetrisPiece, board: number[][]): void {
    this.ghostContainer.removeChildren();
    const ghostPiece = this.calculateGhostPosition(piece, board);
    if (!ghostPiece) return;

    const shape = ghostPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = ghostPiece.x + x;
          const boardY = ghostPiece.y + y;

          if (boardY >= 0) {
            const graphics = new PIXI.Graphics();
            const hexColor = this.hexToNumber(piece.color);
            
            graphics.beginFill(hexColor, 0.18);
            graphics.drawRect(0, 0, this.blockSize, this.blockSize);
            graphics.endFill();

            graphics.lineStyle(1, 0x000000, 0.35);
            graphics.drawRect(0, 0, this.blockSize, this.blockSize);

            graphics.x = boardX * this.blockSize;
            graphics.y = boardY * this.blockSize;
            this.ghostContainer.addChild(graphics);
          }
        }
      }
    }
  }

  private calculateGhostPosition(piece: TetrisPiece, board: number[][]): TetrisPiece | null {
    const ghostPiece = this.copyPieceForGhost(piece);
    
    while (!this.checkCollision(ghostPiece, board)) {
      ghostPiece.y++;
    }
    ghostPiece.y--;
    
    return ghostPiece;
  }

  private copyPieceForGhost(piece: TetrisPiece): TetrisPiece {
    const ghost = new TetrisPiece(piece.shape, piece.color);
    ghost.x = piece.x;
    ghost.y = piece.y;
    ghost.rotation = piece.rotation;
    return ghost;
  }

  private checkCollision(piece: TetrisPiece, board: number[][]): boolean {
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardX < 0 || boardX >= this.cols ||
              boardY >= this.rows ||
              (boardY >= 0 && board[boardY][boardX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  render(board: number[][], currentPiece: TetrisPiece | null): void {
    this.drawGrid();
    this.drawBoard(board);
    
    if (currentPiece) {
      this.drawGhostPiece(currentPiece, board);
      this.drawCurrentPiece(currentPiece);
    }
  }

  setBackgroundColor(color: number): void {
    this.app.renderer.background.color = color;
  }

  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  destroy(): void {
    this.app.destroy(true);
  }
}
