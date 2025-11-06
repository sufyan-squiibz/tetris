import * as PIXI from 'pixi.js';
import { TetrisGame } from '../core/Game';
import { TetrisPiece } from '../core/Piece';
import { GAME_CONFIG } from '../config/constants';

/**
 * Enhanced Renderer with advanced WebGL effects
 * - Glow effects on pieces
 * - Smooth animations
 * - Dynamic lighting
 * - GPU-accelerated particles
 */
export class EnhancedRenderer {
  private app: PIXI.Application;
  private boardContainer: PIXI.Container;
  private blocksContainer: PIXI.Container;
  private currentPieceContainer: PIXI.Container;
  private ghostPieceContainer: PIXI.Container;
  private effectsContainer: PIXI.Container;
  private particlesContainer: PIXI.Container;
  private gridGraphics: PIXI.Graphics;
  private backgroundGraphics: PIXI.Graphics;
  
  // Texture cache for performance
  private blockTextureCache: Map<number, PIXI.Texture> = new Map();

  constructor(private canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: this.canvas,
      width: GAME_CONFIG.cols * GAME_CONFIG.blockSize,
      height: GAME_CONFIG.rows * GAME_CONFIG.blockSize,
      backgroundColor: 0x0a0a1a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    // Initialize containers
    this.boardContainer = new PIXI.Container();
    this.blocksContainer = new PIXI.Container();
    this.currentPieceContainer = new PIXI.Container();
    this.ghostPieceContainer = new PIXI.Container();
    this.effectsContainer = new PIXI.Container();
    this.particlesContainer = new PIXI.Container();
    this.gridGraphics = new PIXI.Graphics();
    this.backgroundGraphics = new PIXI.Graphics();
  }

  public async init(): Promise<void> {
    // Setup background
    this.drawEnhancedBackground();
    this.app.stage.addChild(this.backgroundGraphics);

    // Setup containers hierarchy
    this.boardContainer.addChild(this.gridGraphics);
    this.boardContainer.addChild(this.blocksContainer);
    this.boardContainer.addChild(this.ghostPieceContainer);
    this.boardContainer.addChild(this.currentPieceContainer);
    this.boardContainer.addChild(this.effectsContainer);
    
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.particlesContainer);
    
    // Enable filters
    this.setupFilters();
    this.drawEnhancedGrid();
    
    // Start animation loop for effects
    this.app.ticker.add(this.updateEffects.bind(this));
  }

  private drawEnhancedBackground(): void {
    const g = this.backgroundGraphics;
    g.clear();
    
    // Gradient background
    const gradient = this.createGradientTexture(
      GAME_CONFIG.cols * GAME_CONFIG.blockSize,
      GAME_CONFIG.rows * GAME_CONFIG.blockSize,
      [0x0a0a1a, 0x1a1a2e, 0x0a0a1a]
    );
    
    const sprite = new PIXI.Sprite(gradient);
    g.addChild(sprite);
  }

  private createGradientTexture(width: number, height: number, colors: number[]): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `#${colors[0].toString(16).padStart(6, '0')}`);
    gradient.addColorStop(0.5, `#${colors[1].toString(16).padStart(6, '0')}`);
    gradient.addColorStop(1, `#${colors[2].toString(16).padStart(6, '0')}`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return PIXI.Texture.from(canvas);
  }

  private setupFilters(): void {
    // Add subtle glow to the whole board
    try {
      // Native glow implementation
      const glowFilter = new PIXI.BlurFilter(2);
      glowFilter.quality = 4;
      this.boardContainer.filters = [glowFilter];
      this.boardContainer.filterArea = new PIXI.Rectangle(
        0, 0,
        GAME_CONFIG.cols * GAME_CONFIG.blockSize,
        GAME_CONFIG.rows * GAME_CONFIG.blockSize
      );
    } catch (e) {
      console.warn('Advanced filters not available:', e);
    }
  }

  private drawEnhancedGrid(): void {
    this.gridGraphics.clear();
    
    const blockSize = GAME_CONFIG.blockSize;
    const alpha = 0.15;
    
    // Vertical lines with gradient
    for (let x = 0; x <= GAME_CONFIG.cols; x++) {
      const xPos = x * blockSize;
      this.gridGraphics.lineStyle(1, 0x4a5568, alpha);
      this.gridGraphics.moveTo(xPos, 0);
      this.gridGraphics.lineTo(xPos, GAME_CONFIG.rows * blockSize);
    }
    
    // Horizontal lines
    for (let y = 0; y <= GAME_CONFIG.rows; y++) {
      const yPos = y * blockSize;
      this.gridGraphics.lineStyle(1, 0x4a5568, alpha);
      this.gridGraphics.moveTo(0, yPos);
      this.gridGraphics.lineTo(GAME_CONFIG.cols * blockSize, yPos);
    }
  }

  private createEnhancedBlock(color: number, alpha: number = 1): PIXI.Container {
    const container = new PIXI.Container();
    const blockSize = GAME_CONFIG.blockSize;
    
    // Create gradient effect
    const gradient = this.createBlockGradient(color, blockSize);
    const sprite = new PIXI.Sprite(gradient);
    sprite.alpha = alpha;
    container.addChild(sprite);
    
    // Glossy highlight
    if (alpha >= 0.5) {
      const highlight = new PIXI.Graphics();
      highlight.beginFill(0xffffff, 0.3 * alpha);
      highlight.drawRoundedRect(3, 3, blockSize - 6, blockSize * 0.3, 2);
      highlight.endFill();
      container.addChild(highlight);
    }
    
    // Border with glow
    const border = new PIXI.Graphics();
    border.lineStyle(2, this.lightenColor(color, 30), alpha * 0.9);
    border.drawRoundedRect(1, 1, blockSize - 2, blockSize - 2, 2);
    container.addChild(border);
    
    // Inner glow effect
    if (alpha >= 0.8) {
      const innerGlow = new PIXI.Graphics();
      innerGlow.beginFill(this.lightenColor(color, 50), 0.2 * alpha);
      innerGlow.drawRoundedRect(2, 2, blockSize - 4, blockSize - 4, 2);
      innerGlow.endFill();
      innerGlow.filters = [new PIXI.BlurFilter(3)];
      container.addChild(innerGlow);
    }
    
    return container;
  }

  private createBlockGradient(color: number, size: number): PIXI.Texture {
    if (this.blockTextureCache.has(color)) {
      return this.blockTextureCache.get(color)!;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Radial gradient from top-left corner
    const gradient = ctx.createRadialGradient(
      size * 0.3, size * 0.3, 0,
      size * 0.5, size * 0.5, size * 0.8
    );
    
    const hexColor = `#${color.toString(16).padStart(6, '0')}`;
    const lightColor = this.lightenColor(color, 40);
    const hexLight = `#${lightColor.toString(16).padStart(6, '0')}`;
    
    gradient.addColorStop(0, hexLight);
    gradient.addColorStop(1, hexColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    const texture = PIXI.Texture.from(canvas);
    this.blockTextureCache.set(color, texture);
    return texture;
  }

  private lightenColor(color: number, percent: number): number {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    
    const nr = Math.min(255, r + (255 - r) * (percent / 100));
    const ng = Math.min(255, g + (255 - g) * (percent / 100));
    const nb = Math.min(255, b + (255 - b) * (percent / 100));
    
    return (nr << 16) | (ng << 8) | nb;
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
          const block = this.createEnhancedBlock(color);
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
            const block = this.createEnhancedBlock(game.currentPiece.color);
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
            const block = this.createEnhancedBlock(ghostPiece.color, 0.2);
            block.x = boardX * GAME_CONFIG.blockSize;
            block.y = boardY * GAME_CONFIG.blockSize;
            this.ghostPieceContainer.addChild(block);
          }
        }
      }
    }
  }

  private updateEffects(_delta: number): void {
    // Subtle pulsing effect on current piece
    if (this.currentPieceContainer.children.length > 0) {
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      this.currentPieceContainer.alpha = 0.9 + pulse * 0.1;
    }
  }

  public animateLineClear(rows: number[], duration: number = 500): Promise<void> {
    return new Promise((resolve) => {
      const blocks: PIXI.Container[] = [];
      
      // Find all blocks in cleared rows
      this.blocksContainer.children.forEach((child) => {
        const block = child as PIXI.Container;
        const row = Math.floor(block.y / GAME_CONFIG.blockSize);
        if (rows.includes(row)) {
          blocks.push(block);
        }
      });
      
      // Animate explosion effect
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        blocks.forEach((block, i) => {
          const angle = (i / blocks.length) * Math.PI * 2;
          const distance = progress * 100;
          block.x += Math.cos(angle) * distance * 0.1;
          block.y += Math.sin(angle) * distance * 0.1;
          block.alpha = 1 - progress;
          block.scale.set(1 + progress * 0.5);
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          blocks.forEach(block => this.blocksContainer.removeChild(block));
          resolve();
        }
      };
      
      animate();
    });
  }

  public drawPreviewPiece(piece: TetrisPiece, canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const shape = piece.getShape();
    const blockSize = canvas.width === 100 ? 25 : 20;
    const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
    const offsetY = (canvas.height - shape.length * blockSize) / 2;
    
    const hexColor = `#${piece.color.toString(16).padStart(6, '0')}`;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const px = offsetX + x * blockSize;
          const py = offsetY + y * blockSize;
          
          // Gradient fill
          const gradient = ctx.createRadialGradient(
            px + blockSize * 0.3, py + blockSize * 0.3, 0,
            px + blockSize * 0.5, py + blockSize * 0.5, blockSize * 0.8
          );
          
          const lightColor = this.lightenColorHex(hexColor, 40);
          gradient.addColorStop(0, lightColor);
          gradient.addColorStop(1, hexColor);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(px, py, blockSize, blockSize);
          
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(px + 2, py + 2, blockSize - 4, blockSize * 0.3);
          
          // Border
          ctx.strokeStyle = lightColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 1, py + 1, blockSize - 2, blockSize - 2);
        }
      }
    }
  }

  private lightenColorHex(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    
    const nr = Math.min(255, r + (255 - r) * (percent / 100));
    const ng = Math.min(255, g + (255 - g) * (percent / 100));
    const nb = Math.min(255, b + (255 - b) * (percent / 100));
    
    return `#${((nr << 16) | (ng << 8) | nb).toString(16).padStart(6, '0')}`;
  }

  public destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
    this.blockTextureCache.clear();
  }

  public getApp(): PIXI.Application {
    return this.app;
  }
}
