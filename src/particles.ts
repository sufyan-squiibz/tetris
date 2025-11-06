export class Particle {
  private life: number = 1.0;
  private opacity: number;
  private size: number;
  private gravity: number = 0.1;

  constructor(
    private x: number,
    private y: number,
    private vx: number,
    private vy: number,
    private color: string,
    opacity: number
  ) {
    this.opacity = opacity;
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

  isDead(): boolean {
    return this.life <= 0;
  }
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];

  constructor() {
    this.canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    if (!this.canvas) return;
    const container = document.querySelector('.game-container') as HTMLElement;
    if (container) {
      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
    }
  }

  createLineExplosion(y: number, color?: string): void {
    const boardRect = (document.getElementById('game-canvas') as HTMLCanvasElement).getBoundingClientRect();
    const containerRect = this.canvas!.getBoundingClientRect();

    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + y * 30;
    const width = boardRect.width;

    // Créer des particules le long de la ligne
    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      const angle = Math.random() * 360;
      const speed = 2 + Math.random() * 3;
      const vx = Math.cos((angle * Math.PI) / 180) * speed;
      const vy = Math.sin((angle * Math.PI) / 180) * speed;
      this.particles.push(new Particle(x, startY, vx, vy, color || this.getRandomColor(), 0.8));
    }
  }

  createTetrisExplosion(_lines: number[], color?: string): void {
    const boardRect = (document.getElementById('game-canvas') as HTMLCanvasElement).getBoundingClientRect();
    const containerRect = this.canvas!.getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Explosion massive pour un Tetris
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 360;
      const speed = 3 + Math.random() * 5;
      const vx = Math.cos((angle * Math.PI) / 180) * speed;
      const vy = Math.sin((angle * Math.PI) / 180) * speed;
      this.particles.push(new Particle(centerX, centerY, vx, vy, color || this.getRandomColor(), 1.0));
    }
  }

  createLevelUpEffect(): void {
    const boardRect = (document.getElementById('game-canvas') as HTMLCanvasElement).getBoundingClientRect();
    const containerRect = this.canvas!.getBoundingClientRect();

    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    // Effet circulaire pour level up
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const speed = 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push(new Particle(centerX, centerY, vx, vy, `hsl(${i * 6}, 100%, 50%)`, 1.0));
    }
  }

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private update(): void {
    this.particles = this.particles.filter((p) => !p.isDead());
    this.particles.forEach((p) => p.update());
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => p.draw(this.ctx!));
  }

  private animate(): void {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
