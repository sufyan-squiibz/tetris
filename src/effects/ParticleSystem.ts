class Particle {
  private vx: number;
  private vy: number;
  public life: number = 1.0;
  private size: number;
  private gravity: number = 0.1;

  constructor(
    public x: number,
    public y: number,
    angle: number,
    speed: number,
    public color: string,
    public opacity: number
  ) {
    this.vx = Math.cos(angle * Math.PI / 180) * speed;
    this.vy = Math.sin(angle * Math.PI / 180) * speed;
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
  private animationFrameId: number | null = null;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`);
    }
    
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    
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

  public createLineExplosion(y: number, color: string): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();
    
    const startX = boardRect.left - containerRect.left;
    const startY = boardRect.top - containerRect.top + (y * 30);
    const width = boardRect.width;

    for (let i = 0; i < 30; i++) {
      const x = startX + (width / 30) * i;
      this.particles.push(new Particle(
        x,
        startY,
        Math.random() * 360,
        2 + Math.random() * 3,
        color || this.getRandomColor(),
        0.8
      ));
    }
  }

  public createTetrisExplosion(_lines: number[], color: string): void {
    const gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return;

    const boardRect = gameCanvas.getBoundingClientRect();
    const containerRect = this.canvas.getBoundingClientRect();
    
    const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
    const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(
        centerX,
        centerY,
        Math.random() * 360,
        3 + Math.random() * 5,
        color || this.getRandomColor(),
        1.0
      ));
    }
  }

  public createLevelUpEffect(): void {
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

  private getRandomColor(): string {
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
    return colors[Math.floor(Math.random() * colors.length)];
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
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}
