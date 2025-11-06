import * as PIXI from 'pixi.js';
import { TetrisPiece } from '../game/TetrisPiece';

export class PreviewRenderer {
  private app: PIXI.Application;
  private container: PIXI.Container;
  
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.app = new PIXI.Application({
      view: canvas,
      width,
      height,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
  }

  private createBlock(color: string, size: number): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    graphics.beginFill(colorNum);
    graphics.drawRect(0, 0, size, size);
    graphics.endFill();

    graphics.lineStyle(1, 0x000000, 0.5);
    graphics.drawRect(0, 0, size, size);

    return graphics;
  }

  renderPiece(piece: TetrisPiece | null, blockSize: number = 25): void {
    this.container.removeChildren();

    if (!piece) return;

    const shape = piece.getShape();
    const offsetX = (this.app.screen.width - shape[0].length * blockSize) / 2;
    const offsetY = (this.app.screen.height - shape.length * blockSize) / 2;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const block = this.createBlock(piece.color, blockSize);
          block.x = offsetX + x * blockSize;
          block.y = offsetY + y * blockSize;
          this.container.addChild(block);
        }
      }
    }
  }

  destroy(): void {
    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });
  }
}
