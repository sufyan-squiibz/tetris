import * as PIXI from 'pixi.js';
import { TetrisGame } from '../core/Game';
import { TetrisPiece } from '../core/Piece';
import { GAME_CONFIG } from '../config/constants';

export class TetrisRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private blocksContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  private blockGraphicsCache: Map<number, PIXI.Graphics> = new Map();

  constructor(private canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: this.canvas,
      width: GAME_CONFIG.cols * GAME_CONFIG.blockSize,
      height: GAME_CONFIG.rows * GAME_CONFIG.blockSize,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    });
    this.boardContainer = new PIXI.Container();
    this.blocksContainer = new PIXI.Container();
    this.currentPieceContainer = new PIXI.Container();
    this.ghostPieceContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();
  }

  public async init(): Promise<void> {

    // Ajouter les conteneurs dans l'ordre
    this.boardContainer.addChild(this.gridGraphics);
    this.boardContainer.addChild(this.blocksContainer);
    this.boardContainer.addChild(this.ghostPieceContainer);
    this.boardContainer.addChild(this.currentPieceContainer);
    
    this.app.stage.addChild(this.boardContainer);
    
    this.drawGrid();
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

    // Lignes verticales
    for (let x = 0; x <= GAME_CONFIG.cols; x++) {
      this.gridGraphics.moveTo(x * GAME_CONFIG.blockSize, 0);
      this.gridGraphics.lineTo(x * GAME_CONFIG.blockSize, GAME_CONFIG.rows * GAME_CONFIG.blockSize);
    }

    // Lignes horizontales
    for (let y = 0; y <= GAME_CONFIG.rows; y++) {
      this.gridGraphics.moveTo(0, y * GAME_CONFIG.blockSize);
      this.gridGraphics.lineTo(GAME_CONFIG.cols * GAME_CONFIG.blockSize, y * GAME_CONFIG.blockSize);
    }
  }

  private createBlock(color: number, alpha: number = 1): PIXI.Graphics {
    const block = new PIXI.Graphics();
    
    // Bloc principal
    block.beginFill(color, alpha);
    block.drawRect(0, 0, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
    block.endFill();
    
    // Bordure
    block.lineStyle(2, 0x000000, alpha * 0.8);
    block.drawRect(0, 0, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
    
    // Effet de lumière (highlight)
    if (alpha >= 0.5) {
      block.beginFill(0xffffff, 0.2 * alpha);
      block.drawRect(2, 2, GAME_CONFIG.blockSize - 4, 10);
      block.endFill();
    }
    
    return block;
  }

  private getOrCreateBlockGraphics(color: number, alpha: number = 1): PIXI.Graphics {
    const key = color * 100 + Math.floor(alpha * 100);
    
    if (!this.blockGraphicsCache.has(key)) {
      this.blockGraphicsCache.set(key, this.createBlock(color, alpha));
    }
    
    return this.blockGraphicsCache.get(key)!.clone();
  }

  public render(game: TetrisGame): void {
    this.drawBoard(game);
    this.drawGhostPiece(game);
    this.drawCurrentPiece(game);
  }

  private drawBoard(game: TetrisGame): void {
    this.blocksContainer.removeChildren();
    
    for (let y = 0; y < GAME_CONFIG.rows; y++) {
      for (let x = 0; x < GAME_CONFIG.cols; x++) {
        const color = game.board[y][x];
        if (color !== 0) {
          const block = this.getOrCreateBlockGraphics(color);
          block.x = x * GAME_CONFIG.blockSize;
          block.y = y * GAME_CONFIG.blockSize;
          this.blocksContainer.addChild(block);
        }
      }
    }
  }

  private drawCurrentPiece(game: TetrisGame): void {
    this.currentPieceContainer.removeChildren();
    
    if (!game.currentPiece || game.gameOver) return;
    
    const shape = game.currentPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = game.currentPiece.x + x;
          const boardY = game.currentPiece.y + y;
          
          if (boardY >= 0) {
            const block = this.getOrCreateBlockGraphics(game.currentPiece.color);
            block.x = boardX * GAME_CONFIG.blockSize;
            block.y = boardY * GAME_CONFIG.blockSize;
            this.currentPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private drawGhostPiece(game: TetrisGame): void {
    this.ghostPieceContainer.removeChildren();
    
    const ghostPiece = game.getGhostPiece();
    if (!ghostPiece) return;
    
    const shape = ghostPiece.getShape();
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = ghostPiece.x + x;
          const boardY = ghostPiece.y + y;
          
          if (boardY >= 0) {
            const block = this.getOrCreateBlockGraphics(ghostPiece.color, 0.15);
            block.x = boardX * GAME_CONFIG.blockSize;
            block.y = boardY * GAME_CONFIG.blockSize;
            this.ghostPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  public drawPreviewPiece(piece: TetrisPiece, canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const shape = piece.getShape();
    const blockSize = canvas.width === 100 ? 25 : 20;
    const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
    const offsetY = (canvas.height - shape.length * blockSize) / 2;
    
    // Convertir la couleur hexadécimale en string
    const color = `#${piece.color.toString(16).padStart(6, '0')}`;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          ctx.fillStyle = color;
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

  public animateLineClear(rows: number[], duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      const graphics = new PIXI.Graphics();
      this.boardContainer.addChild(graphics);
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
          this.boardContainer.removeChild(graphics);
          resolve();
          return;
        }
        
        graphics.clear();
        graphics.beginFill(0xffffff, 1 - progress);
        
        rows.forEach(row => {
          graphics.drawRect(
            0, 
            row * GAME_CONFIG.blockSize, 
            GAME_CONFIG.cols * GAME_CONFIG.blockSize, 
            GAME_CONFIG.blockSize
          );
        });
        
        graphics.endFill();
        
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }

  public destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    this.blockGraphicsCache.clear();
  }

  public getApp(): PIXI.Application {
    return this.app;
  }
}
