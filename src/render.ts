import * as PIXI from 'pixi.js';
import { COLS, ROWS, BLOCK_SIZE } from './types';
import { TetrisGame } from './game';
import { TetrisPiece, copyPiece } from './pieces';

export class Renderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private blocksContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;

  constructor(canvasId: string = 'game-canvas') {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

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
    this.blocksContainer = new PIXI.Container();
    this.currentPieceContainer = new PIXI.Container();
    this.ghostPieceContainer = new PIXI.Container();

    this.app.stage.addChild(this.boardContainer);
    this.boardContainer.addChild(this.blocksContainer);
    this.boardContainer.addChild(this.ghostPieceContainer);
    this.boardContainer.addChild(this.currentPieceContainer);

    // Dessiner la grille
    this.gridGraphics = new PIXI.Graphics();
    this.drawGrid();
    this.boardContainer.addChildAt(this.gridGraphics, 0);

    // Gérer le redimensionnement
    window.addEventListener('resize', () => this.handleResize());
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

  private handleResize(): void {
    // Le canvas a une taille fixe, donc pas besoin de redimensionner
    // Mais on peut ajuster la résolution si nécessaire
    this.app.renderer.resolution = window.devicePixelRatio || 1;
  }

  private hexToNumber(hex: string): number {
    if (hex.startsWith('#')) {
      return parseInt(hex.slice(1), 16);
    }
    return parseInt(hex, 16);
  }


  private drawBlock(x: number, y: number, color: string, container: PIXI.Container, alpha: number = 1): void {
    const block = new PIXI.Graphics();

    // Bloc principal
    block.beginFill(this.hexToNumber(color), alpha);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.endFill();

    // Bordure
    block.lineStyle(2, 0x000000, alpha);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière
    if (alpha > 0.5) {
      block.beginFill(0xffffff, 0.2 * alpha);
      block.drawRect(2, 2, BLOCK_SIZE - 4, 10);
      block.endFill();
    }

    block.x = x * BLOCK_SIZE;
    block.y = y * BLOCK_SIZE;
    container.addChild(block);
  }

  private drawBoard(board: (string | number)[][]): void {
    this.blocksContainer.removeChildren();

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const color = typeof board[y][x] === 'string' ? board[y][x] : '#ffffff';
          this.drawBlock(x, y, color as string, this.blocksContainer);
        }
      }
    }
  }

  private drawCurrentPiece(piece: TetrisPiece): void {
    this.currentPieceContainer.removeChildren();
    const shape = piece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;

          if (boardY >= 0) {
            this.drawBlock(boardX, boardY, piece.color, this.currentPieceContainer);
          }
        }
      }
    }
  }

  private drawGhostPiece(piece: TetrisPiece, board: (string | number)[][]): void {
    this.ghostPieceContainer.removeChildren();
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
            // Dessiner en ombre translucide
            const graphics = new PIXI.Graphics();
            graphics.beginFill(this.hexToNumber(piece.color), 0.18);
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

  private checkCollision(piece: TetrisPiece, board: (string | number)[][]): boolean {
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
            (boardY >= 0 && board[boardY] && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public render(game: TetrisGame): void {
    // Dessiner le plateau
    this.drawBoard(game.board);

    // Dessiner la pièce courante et le ghost piece
    if (game.currentPiece && !game.gameOver) {
      this.drawGhostPiece(game.currentPiece, game.board);
      this.drawCurrentPiece(game.currentPiece);
    }
  }

  public updateBackgroundColor(color: string): void {
    const hexColor = this.hexToNumber(color);
    // PixiJS v7: changer la couleur de fond via renderer.background
    if (this.app.renderer.background) {
      (this.app.renderer.background as any).color = hexColor;
    }
  }

  public destroy(): void {
    this.app.destroy(true);
  }
}
