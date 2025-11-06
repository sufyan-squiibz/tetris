import * as PIXI from 'pixi.js';

interface Particle {
  sprite: PIXI.Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    window.addEventListener('resize', this.resize);
    this.resize();

    this.app.ticker.add(this.update);
  }

  private resize = (): void => {
    const container = document.querySelector('.game-container') as HTMLElement;
    if (container && this.app.renderer) {
      this.app.renderer.resize(container.offsetWidth, container.offsetHeight);
    }
  };

  private createParticle(x: number, y: number, angle: number, speed: number, color: string, size: number): Particle {
    const graphics = new PIXI.Graphics();
    const colorNum = parseInt(color.replace('#', ''), 16);

    graphics.beginFill(colorNum);
    graphics.drawCircle(0, 0, size);
    graphics.endFill();

    graphics.x = x;
    graphics.y = y;

    this.container.addChild(graphics);

    return {
      sprite: graphics,
      vx: Math.cos((angle * Math.PI) / 180) * speed,
      vy: Math.sin((angle * Math.PI) / 180) * speed,
      life: 1.0,
      maxLife: 1.0,
    };
  }

  createLineExplosion(y: number, color: string): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
    if (!boardRect || !containerRect) return;

    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + y * 30;
    const width = boardRect.width;

    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      const angle = Math.random() * 360;
      const speed = 2 + Math.random() * 3;
      const size = 2 + Math.random() * 3;
      this.particles.push(this.createParticle(x, startY, angle, speed, color || this.getRandomColor(), size));
    }
  }

  createTetrisExplosion(_lines: number[], color: string): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
    if (!boardRect || !containerRect) return;

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 360;
      const speed = 3 + Math.random() * 5;
      const size = 2 + Math.random() * 4;
      this.particles.push(this.createParticle(centerX, centerY, angle, speed, color || this.getRandomColor(), size));
    }
  }

  createLevelUpEffect(): void {
    const boardRect = document.getElementById('game-canvas')?.getBoundingClientRect();
    const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
    if (!boardRect || !containerRect) return;

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 360;
      const colorNum = this.hslToHex(i * 6, 100, 50);
      this.particles.push(this.createParticle(centerX, centerY, angle, 4, colorNum, 3));
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  private update = (): void => {
    this.particles = this.particles.filter((p) => {
      p.sprite.x += p.vx;
      p.sprite.y += p.vy;
      p.vy += 0.1; // Gravity
      p.life -= 0.02;
      p.sprite.alpha = p.life;

      if (p.life <= 0) {
        this.container.removeChild(p.sprite);
        p.sprite.destroy();
        return false;
      }
      return true;
    });
  };

  destroy(): void {
    window.removeEventListener('resize', this.resize);
    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });
  }
}
