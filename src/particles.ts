import * as PIXI from 'pixi.js';
import { BLOCK_SIZE } from './types';

class Particle {
  private sprite: PIXI.Graphics;
  private vx: number;
  private vy: number;
  private life: number;
  private maxLife: number;
  private gravity: number;

  constructor(x: number, y: number, angle: number, speed: number, color: string, opacity: number) {
    this.vx = Math.cos((angle * Math.PI) / 180) * speed;
    this.vy = Math.sin((angle * Math.PI) / 180) * speed;
    this.life = opacity;
    this.maxLife = opacity;
    this.gravity = 0.1;

    const hexColor = parseInt(color.replace('#', ''), 16);
    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(hexColor, opacity);
    const size = 2 + Math.random() * 3;
    this.sprite.drawCircle(0, 0, size);
    this.sprite.endFill();
    this.sprite.x = x;
    this.sprite.y = y;
  }

  update(): void {
    this.sprite.x += this.vx;
    this.sprite.y += this.vy;
    this.vy += this.gravity;
    this.life -= 0.02;
    this.sprite.alpha = Math.max(0, this.life / this.maxLife);
  }

  getSprite(): PIXI.Graphics {
    return this.sprite;
  }

  isAlive(): boolean {
    return this.life > 0;
  }
}

export class ParticleSystem {
  private app: PIXI.Application;
  private particles: Particle[] = [];
  private container: PIXI.Container;

  constructor(canvasId: string = 'particles-canvas') {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas element with id "${canvasId}" not found, particle system disabled`);
      // Créer un canvas virtuel pour PixiJS
      this.app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: false,
      });
      // Attacher le canvas au DOM
      const container = document.querySelector('.game-container');
      if (container) {
        container.appendChild(this.app.view as HTMLCanvasElement);
        (this.app.view as HTMLCanvasElement).id = canvasId;
        (this.app.view as HTMLCanvasElement).style.position = 'absolute';
        (this.app.view as HTMLCanvasElement).style.top = '0';
        (this.app.view as HTMLCanvasElement).style.left = '0';
        (this.app.view as HTMLCanvasElement).style.pointerEvents = 'none';
        (this.app.view as HTMLCanvasElement).style.zIndex = '1000';
      }
    } else {
      this.app = new PIXI.Application({
        view: canvas,
        width: canvas.width || window.innerWidth,
        height: canvas.height || window.innerHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: false,
      });
    }

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    const container = document.querySelector('.game-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      this.app.renderer.resize(rect.width, rect.height);
    }
  }

  createLineExplosion(y: number, color: string): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    if (!boardRect) return;
    
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + y * BLOCK_SIZE;
    const width = boardRect.width;

    // Créer des particules le long de la ligne
    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      const particle = new Particle(x, startY, Math.random() * 360, 2 + Math.random() * 3, color || this.getRandomColor(), 0.8);
      this.particles.push(particle);
      this.container.addChild(particle.getSprite());
    }
  }

  createTetrisExplosion(_lines: number[], color: string): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    if (!boardRect) return;
    
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Explosion massive pour un Tetris
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
      this.container.addChild(particle.getSprite());
    }
  }

  createComboEffect(combo: number, _x: number, y: number): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    if (!boardRect) return;
    
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const posX = boardRect.left - containerRect.left + boardRect.width / 2;
    const posY = boardRect.top - containerRect.top + y * BLOCK_SIZE;

    for (let i = 0; i < combo * 5; i++) {
      const particle = new Particle(posX, posY, Math.random() * 360, 1 + Math.random() * 2, '#FFD700', 0.6);
      this.particles.push(particle);
      this.container.addChild(particle.getSprite());
    }
  }

  createLevelUpEffect(): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    if (!boardRect) return;
    
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Effet circulaire pour level up
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const particle = new Particle(
        centerX,
        centerY,
        (angle * 180) / Math.PI,
        4,
        `hsl(${i * 6}, 100%, 50%)`,
        1.0
      );
      this.particles.push(particle);
      this.container.addChild(particle.getSprite());
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private update(): void {
    this.particles = this.particles.filter((p) => {
      if (p.isAlive()) {
        p.update();
        return true;
      } else {
        this.container.removeChild(p.getSprite());
        p.getSprite().destroy();
        return false;
      }
    });
  }

  private animate(): void {
    this.update();
    requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    this.particles.forEach((p) => {
      this.container.removeChild(p.getSprite());
      p.getSprite().destroy();
    });
    this.particles = [];
    this.app.destroy(true);
  }
}
