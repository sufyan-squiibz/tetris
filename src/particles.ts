import * as PIXI from 'pixi.js';

export class Particle {
  public x: number;
  public y: number;
  private vx: number;
  private vy: number;
  private color: number;
  private opacity: number;
  public life: number;
  private size: number;
  private gravity: number;
  private graphics: PIXI.Graphics;

  constructor(x: number, y: number, angle: number, speed: number, color: string, opacity: number) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle * Math.PI / 180) * speed;
    this.vy = Math.sin(angle * Math.PI / 180) * speed;
    this.color = this.hexToNumber(color);
    this.opacity = opacity;
    this.life = 1.0;
    this.size = 2 + Math.random() * 3;
    this.gravity = 0.1;
    
    this.graphics = new PIXI.Graphics();
    this.updateGraphics();
  }

  private hexToNumber(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  private updateGraphics(): void {
    this.graphics.clear();
    this.graphics.beginFill(this.color, this.opacity);
    this.graphics.drawCircle(0, 0, this.size);
    this.graphics.endFill();
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= 0.02;
    this.opacity = this.life;
    this.updateGraphics();
  }

  getGraphics(): PIXI.Graphics {
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    return this.graphics;
  }
}

export class ParticleSystem {
  private container: PIXI.Container;
  private particles: Particle[] = [];
  private gameCanvas: HTMLCanvasElement;

  constructor(container: PIXI.Container, gameCanvas: HTMLCanvasElement) {
    this.container = container;
    this.gameCanvas = gameCanvas;
  }

  createLineExplosion(y: number, color: string): void {
    const boardRect = this.gameCanvas.getBoundingClientRect();
    const startX = 0;
    const startY = y * 30;
    const width = boardRect.width;

    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      const particle = new Particle(
        x,
        startY,
        Math.random() * 360,
        2 + Math.random() * 3,
        color || this.getRandomColor(),
        0.8
      );
      this.particles.push(particle);
      this.container.addChild(particle.getGraphics());
    }
  }

  createTetrisExplosion(_lines: number[], color: string): void {
    const boardRect = this.gameCanvas.getBoundingClientRect();
    const centerX = boardRect.width / 2;
    const centerY = boardRect.height / 2;

    for (let i = 0; i < 100; i++) {
      const particle = new Particle(
        centerX,
        centerY,
        Math.random() * 360,
        3 + Math.random() * 5,
        color || this.getRandomColor(),
        1.0
      );
      this.particles.push(particle);
      this.container.addChild(particle.getGraphics());
    }
  }

  createComboEffect(combo: number, y: number): void {
    const boardRect = this.gameCanvas.getBoundingClientRect();
    const posX = boardRect.width / 2;
    const posY = y * 30;

    for (let i = 0; i < combo * 5; i++) {
      const particle = new Particle(
        posX,
        posY,
        Math.random() * 360,
        1 + Math.random() * 2,
        '#FFD700',
        0.6
      );
      this.particles.push(particle);
      this.container.addChild(particle.getGraphics());
    }
  }

  createLevelUpEffect(): void {
    const boardRect = this.gameCanvas.getBoundingClientRect();
    const centerX = boardRect.width / 2;
    const centerY = boardRect.height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const hue = i * 6;
      const color = `hsl(${hue}, 100%, 50%)`;
      const particle = new Particle(
        centerX,
        centerY,
        angle * (180 / Math.PI),
        4,
        color,
        1.0
      );
      this.particles.push(particle);
      this.container.addChild(particle.getGraphics());
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(): void {
    this.particles = this.particles.filter(p => {
      if (p.life <= 0) {
        this.container.removeChild(p.getGraphics());
        return false;
      }
      p.update();
      return true;
    });
  }
}
