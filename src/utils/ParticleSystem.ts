// Système de particules avec PixiJS pour effets visuels

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
}

export class ParticleSystem {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private particles: Particle[] = [];
  private particleGraphics: Map<Particle, PIXI.Graphics> = new Map();

  constructor(canvasElement: HTMLCanvasElement) {
    const containerDiv = document.querySelector('.game-container') as HTMLElement;

    this.app = new PIXI.Application({
      view: canvasElement,
      width: containerDiv.offsetWidth,
      height: containerDiv.offsetHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    const containerDiv = document.querySelector('.game-container') as HTMLElement;
    this.app.renderer.resize(containerDiv.offsetWidth, containerDiv.offsetHeight);
  }

  public createLineExplosion(y: number, color: string): void {
    const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!boardCanvas) return;
    
    const boardRect = boardCanvas.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + y * 30;
    const width = boardRect.width;

    // Créer des particules le long de la ligne
    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      this.particles.push(
        new Particle(x, startY, Math.random() * 360, 2 + Math.random() * 3, color || this.getRandomColor(), 0.8)
      );
    }
  }

  public createTetrisExplosion(_lines: number[], color: string): void {
    const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!boardCanvas) return;
    
    const boardRect = boardCanvas.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Explosion massive pour un Tetris
    for (let i = 0; i < 100; i++) {
      this.particles.push(
        new Particle(centerX, centerY, Math.random() * 360, 3 + Math.random() * 5, color || this.getRandomColor(), 1.0)
      );
    }
  }

  public createComboEffect(combo: number, _x: number, y: number): void {
    const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!boardCanvas) return;
    
    const boardRect = boardCanvas.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const posX = boardRect.left - containerRect.left + boardRect.width / 2;
    const posY = boardRect.top - containerRect.top + y * 30;

    for (let i = 0; i < combo * 5; i++) {
      this.particles.push(new Particle(posX, posY, Math.random() * 360, 1 + Math.random() * 2, '#FFD700', 0.6));
    }
  }

  public createLevelUpEffect(): void {
    const boardCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!boardCanvas) return;
    
    const boardRect = boardCanvas.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Effet circulaire pour level up
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      this.particles.push(
        new Particle(centerX, centerY, (angle * 180) / Math.PI, 4, `hsl(${i * 6}, 100%, 50%)`, 1.0)
      );
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private colorToHex(color: string): number {
    if (color.startsWith('#')) {
      return parseInt(color.replace('#', ''), 16);
    }
    if (color.startsWith('hsl')) {
      // Conversion simplifiée hsl -> hex (pour les besoins du jeu)
      return 0xffffff;
    }
    return 0xffffff;
  }

  private update(): void {
    // Supprimer les particules mortes
    this.particles = this.particles.filter((p) => {
      if (p.life <= 0) {
        const graphics = this.particleGraphics.get(p);
        if (graphics) {
          this.container.removeChild(graphics);
          this.particleGraphics.delete(p);
        }
        return false;
      }
      return true;
    });

    // Mettre à jour les particules
    this.particles.forEach((p) => {
      p.update();

      let graphics = this.particleGraphics.get(p);
      if (!graphics) {
        graphics = new PIXI.Graphics();
        this.container.addChild(graphics);
        this.particleGraphics.set(p, graphics);
      }

      graphics.clear();
      graphics.beginFill(this.colorToHex(p.color), p.opacity);
      graphics.drawCircle(p.x, p.y, p.size);
      graphics.endFill();
    });
  }

  private animate(): void {
    this.update();
    requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}
