// Système de particules avec TypeScript
class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public color: string;
  public opacity: number;
  public life: number;
  public size: number;
  private readonly gravity: number = 0.1;

  constructor(x: number, y: number, angle: number, speed: number, color: string, opacity: number) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle * Math.PI / 180) * speed;
    this.vy = Math.sin(angle * Math.PI / 180) * speed;
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

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];

  constructor(element: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particles-canvas';
    element.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Impossible de créer le contexte 2D pour les particules');
    }
    this.ctx = context;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    const container = document.querySelector('.game-container') as HTMLElement;
    if (container) {
      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
    }
  }

  createLineExplosion(y: number, color: number): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();

    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + (y * 30);
    const width = boardRect.width;

    const colorStr = this.hexToRgbString(color);

    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      this.particles.push(new Particle(
        x,
        startY,
        Math.random() * 360,
        2 + Math.random() * 3,
        colorStr,
        0.8
      ));
    }
  }

  createTetrisExplosion(_lines: number[], color: number): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    const colorStr = this.hexToRgbString(color);

    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(
        centerX,
        centerY,
        Math.random() * 360,
        3 + Math.random() * 5,
        colorStr,
        1.0
      ));
    }
  }

  createComboEffect(combo: number, _x: number, y: number): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();

    const posX = boardRect.left - containerRect.left + boardRect.width / 2;
    const posY = boardRect.top - containerRect.top + y * 30;

    for (let i = 0; i < combo * 5; i++) {
      this.particles.push(new Particle(
        posX,
        posY,
        Math.random() * 360,
        1 + Math.random() * 2,
        '#FFD700',
        0.6
      ));
    }
  }

  createLevelUpEffect(): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      this.particles.push(new Particle(
        centerX,
        centerY,
        angle * (180 / Math.PI),
        4,
        `hsl(${i * 6}, 100%, 50%)`,
        1.0
      ));
    }
  }

  private hexToRgbString(hex: number): string {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  private update(): void {
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => p.update());
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => p.draw(this.ctx));
  }

  private animate(): void {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
