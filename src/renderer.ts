import * as PIXI from 'pixi.js';
import { COLS, ROWS, BLOCK_SIZE, Board } from './types';
import { TetrisPiece } from './pieces';

export class TetrisRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private ghostContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;

  constructor(canvasElement: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvasElement,
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
    this.currentPieceContainer = new PIXI.Container();
    
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.ghostContainer);
    this.app.stage.addChild(this.currentPieceContainer);

    // Dessiner la grille de fond
    this.gridGraphics = new PIXI.Graphics();
    this.drawGrid();
    this.app.stage.addChildAt(this.gridGraphics, 0);
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    
    // Fond
    this.gridGraphics.beginFill(0x1a1a2e);
    this.gridGraphics.drawRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    this.gridGraphics.endFill();

    // Lignes de grille
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

  private createBlock(x: number, y: number, color: string): PIXI.Graphics {
    const block = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    // Bloc principal
    block.beginFill(colorNum);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.endFill();

    // Bordure
    block.lineStyle(2, 0x000000, 1);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    // Effet de lumière
    block.beginFill(0xffffff, 0.2);
    block.drawRect(2, 2, BLOCK_SIZE - 4, 10);
    block.endFill();

    block.x = x * BLOCK_SIZE;
    block.y = y * BLOCK_SIZE;

    return block;
  }

  private createGhostBlock(x: number, y: number, color: string): PIXI.Graphics {
    const block = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    // Bloc fantôme translucide
    block.beginFill(colorNum, 0.18);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    block.endFill();

    // Bordure légère
    block.lineStyle(1, 0x000000, 0.35);
    block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

    block.x = x * BLOCK_SIZE;
    block.y = y * BLOCK_SIZE;

    return block;
  }

  drawBoard(board: Board): void {
    // Nettoyer le conteneur du plateau
    this.boardContainer.removeChildren();

    // Dessiner les blocs placés
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== 0) {
          const color = '#' + board[y][x].toString(16).padStart(6, '0');
          const block = this.createBlock(x, y, color);
          this.boardContainer.addChild(block);
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
            const block = this.createBlock(boardX, boardY, piece.color);
            this.currentPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  drawGhostPiece(ghostPiece: TetrisPiece): void {
    this.ghostContainer.removeChildren();
    const shape = ghostPiece.getShape();

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = ghostPiece.x + x;
          const boardY = ghostPiece.y + y;

          if (boardY >= 0) {
            const block = this.createGhostBlock(boardX, boardY, ghostPiece.color);
            this.ghostContainer.addChild(block);
          }
        }
      }
    }
  }

  clear(): void {
    this.boardContainer.removeChildren();
    this.ghostContainer.removeChildren();
    this.currentPieceContainer.removeChildren();
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
  }

  // Rendu des next pieces
  renderNextPiece(canvasId: string, piece: TetrisPiece, size: number = 25): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shape = piece.getShape();
    const blockSize = size;
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

  // Rendu de la pièce hold
  renderHoldPiece(piece: TetrisPiece | null): void {
    const canvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (piece) {
      const shape = piece.getShape();
      const blockSize = 25;
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
}
