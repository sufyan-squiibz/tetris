import * as PIXI from 'pixi.js';
import { TetrisPiece } from '../core/TetrisPiece';

export class PreviewRenderer {
  private app: PIXI.Application;
  private container: PIXI.Container;

  constructor(canvasElement: HTMLCanvasElement, width: number, height: number) {
    this.app = new PIXI.Application({
      view: canvasElement,
      width,
      height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
  }

  drawPiece(piece: TetrisPiece | null, blockSize: number = 25): void {
    this.container.removeChildren();

    if (!piece) return;

    const shape = piece.getShape();
    const colorNum = parseInt(piece.color.replace('#', ''), 16);

    // Calculer le centrage
    const offsetX = (this.app.view.width - shape[0].length * blockSize) / 2;
    const offsetY = (this.app.view.height - shape.length * blockSize) / 2;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const graphics = new PIXI.Graphics();

          // Bloc principal
          graphics.beginFill(colorNum);
          graphics.drawRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize
          );
          graphics.endFill();

          // Bordure
          graphics.lineStyle(1, 0x000000, 1);
          graphics.drawRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize
          );

          this.container.addChild(graphics);
        }
      }
    }
  }

  clear(): void {
    this.container.removeChildren();
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
  }
}
