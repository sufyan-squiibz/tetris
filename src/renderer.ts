import * as PIXI from 'pixi.js';
import { TetrisPiece } from './pieces';
import { COLS, ROWS, BLOCK_SIZE } from './constants';
import { copyPiece } from './pieces';

export class GameRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
  private blockGraphics: Map<string, PIXI.Graphics>;
  private board: number[][];

  constructor(canvas: HTMLCanvasElement, board: number[][]) {
    this.board = board;
    this.blockGraphics = new Map();

    // Créer l'application PixiJS
    this.app = new PIXI.Application({
      view: canvas,
      width: COLS * BLOCK_SIZE,
      height: ROWS * BLOCK_SIZE,
      backgroundColor: 0x1a1a2e,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    // Créer les conteneurs
    this.boardContainer = new PIXI.Container();
    this.currentPieceContainer = new PIXI.Container();
    this.ghostPieceContainer = new PIXI.Container();

    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostPieceContainer);
    this.app.stage.addChild(this.currentPieceContainer);

    this.drawGrid();
  }

  private drawGrid(): void {
    const gridGraphics = new PIXI.Graphics();
    
    // Lignes verticales
    for (let x = 0; x <= COLS; x++) {
      gridGraphics.lineStyle(1, 0x34495e, 0.5);
      gridGraphics.moveTo(x * BLOCK_SIZE, 0);
      gridGraphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    }

    // Lignes horizontales
    for (let y = 0; y <= ROWS; y++) {
      gridGraphics.lineStyle(1, 0x34495e, 0.5);
      gridGraphics.moveTo(0, y * BLOCK_SIZE);
      gridGraphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
    }

    this.boardContainer.addChild(gridGraphics);
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  private createBlockGraphic(color: string, alpha: number = 1.0): PIXI.Graphics {
    const key = `${color}-${alpha}`;
    if (this.blockGraphics.has(key)) {
      return this.blockGraphics.get(key)!.clone();
    }

    const graphics = new PIXI.Graphics();
    const colorNum = this.hexToNumber(color);

    // Bloc principal
    graphics.beginFill(colorNum, alpha);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    graphics.endFill();

    // Bordure
    graphics.lineStyle(2, 0x000000, alpha);
    graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière (haut)
    graphics.beginFill(0xffffff, alpha * 0.2);
    graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
    graphics.endFill();

    this.blockGraphics.set(key, graphics);
    return graphics.clone();
  }

  updateBoard(board: number[][]): void {
    this.board = board;
  }

  render(board: number[][], currentPiece: TetrisPiece | null): void {
    // Nettoyer les conteneurs
    this.currentPieceContainer.removeChildren();
    this.ghostPieceContainer.removeChildren();

    // Dessiner les blocs placés sur le board
    const boardGraphics = new PIXI.Graphics();
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const color = this.numberToHex(board[y][x]);
          const block = this.createBlockGraphic(color);
          block.x = x * BLOCK_SIZE;
          block.y = y * BLOCK_SIZE;
          boardGraphics.addChild(block);
        }
      }
    }
    
    // Remplacer l'ancien board
    const oldBoard = this.boardContainer.children.find(child => child !== this.boardContainer.children[0]);
    if (oldBoard) {
      this.boardContainer.removeChild(oldBoard);
    }
    this.boardContainer.addChild(boardGraphics);

    if (currentPiece && currentPiece.y >= -4) {
      // Dessiner le ghost piece
      this.drawGhostPiece(currentPiece, board);
      
      // Dessiner la pièce courante
      this.drawPiece(currentPiece, this.currentPieceContainer);
    }
  }

  private drawPiece(piece: TetrisPiece, container: PIXI.Container): void {
    const shape = piece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0) {
            const block = this.createBlockGraphic(piece.color);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            container.addChild(block);
          }
        }
      }
    }
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
            const block = this.createBlockGraphic(piece.color, 0.18);
            block.x = boardX * BLOCK_SIZE;
            block.y = boardY * BLOCK_SIZE;
            this.ghostPieceContainer.addChild(block);
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

  private numberToHex(num: number): string {
    // Convertir un nombre en hexadécimal (format #RRGGBB)
    const hex = num.toString(16).padStart(6, '0');
    return '#' + hex;
  }

  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  destroy(): void {
    this.app.destroy(true);
  }
}
