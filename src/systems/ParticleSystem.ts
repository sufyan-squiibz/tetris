import * as PIXI from 'pixi.js';

class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public color: string;
  public opacity: number;
  public life: number;
  public size: number;
  private gravity: number = 0.1;

  constructor(x: number, y: number, angle: number, speed: number, color: string, opacity: number) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos((angle * Math.PI) / 180) * speed;
    this.vy = Math.sin((angle * Math.PI) / 180) * speed;
    this.color = color;
    this.opacity = opacity;
    this.life = 1.0;
    this.size = 2 + Math.random() * 3;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= 0.02;
    this.opacity = this.life;
  }

  draw(graphics: PIXI.Graphics): void {
    const colorNum = parseInt(this.color.replace('#', ''), 16);
    graphics.beginFill(colorNum, this.opacity);
    graphics.drawCircle(this.x, this.y, this.size);
    graphics.endFill();
  }
}

export class ParticleSystem {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private graphics: PIXI.Graphics;
  private particles: Particle[] = [];
  private animationId: number = 0;

  constructor(canvasElement: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvasElement,
      width: canvasElement.width,
      height: canvasElement.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    this.container = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);
    this.app.stage.addChild(this.container);

    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    const container = document.querySelector('.game-container');
    if (container) {
      this.app.renderer.resize(container.clientWidth, container.clientHeight);
    }
  }

  createLineExplosion(y: number, color: string, boardRect: DOMRect, containerRect: DOMRect): void {
    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + y * 30;
    const width = boardRect.width;

    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      this.particles.push(new Particle(x, startY, Math.random() * 360, 2 + Math.random() * 3, color || this.getRandomColor(), 0.8));
    }
  }

  createTetrisExplosion(_lines: number[], color: string, boardRect: DOMRect, containerRect: DOMRect): void {
    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(centerX, centerY, Math.random() * 360, 3 + Math.random() * 5, color || this.getRandomColor(), 1.0));
    }
  }

  createLevelUpEffect(boardRect: DOMRect, containerRect: DOMRect): void {
    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const hue = i * 6;
      this.particles.push(new Particle(centerX, centerY, (angle * 180) / Math.PI, 4, `hsl(${hue}, 100%, 50%)`, 1.0));
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private update(): void {
    this.particles = this.particles.filter((p) => p.life > 0);
    this.particles.forEach((p) => p.update());
  }

  private draw(): void {
    this.graphics.clear();
    this.particles.forEach((p) => p.draw(this.graphics));
  }

  private animate(): void {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy(): void {
    cancelAnimationFrame(this.animationId);
    this.app.destroy(true, { children: true, texture: true });
  }
}
