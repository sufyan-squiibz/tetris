import * as PIXI from 'pixi.js';

interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  alpha: number;
}

/**
 * GPU-Accelerated Particle System using PixiJS
 * Much faster than Canvas 2D for large particle counts
 */
export class PixiParticleSystem {
  private container: PIXI.Container;
  private particles: PIXI.Graphics[] = [];
  private particlePool: PIXI.Graphics[] = [];
  private particleData: Map<PIXI.Graphics, ParticleConfig> = new Map();
  private readonly maxParticles = 500;
  private readonly gravity = 0.15;

  constructor(container: PIXI.Container) {
    this.container = container;
    this.initializePool();
  }

  private initializePool(): void {
    // Pre-create particles for object pooling
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new PIXI.Graphics();
      this.particlePool.push(particle);
    }
  }

  private getParticle(): PIXI.Graphics | null {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop()!;
    }
    return null;
  }

  private returnParticle(particle: PIXI.Graphics): void {
    particle.clear();
    this.container.removeChild(particle);
    this.particleData.delete(particle);
    this.particlePool.push(particle);
  }

  public createLineExplosion(
    y: number,
    color: number,
    boardX: number,
    boardY: number,
    width: number
  ): void {
    const startY = boardY + y * 30;
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.getParticle();
      if (!particle) continue;

      const x = boardX + (width / particleCount) * i + Math.random() * 20;
      const angle = Math.random() * Math.PI - Math.PI / 2; // Upward explosion
      const speed = 3 + Math.random() * 4;

      this.createParticle(particle, {
        x,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Initial upward velocity
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 4,
        color,
        alpha: 0.9
      });
    }
  }

  public createTetrisExplosion(
    centerX: number,
    centerY: number,
    color: number = 0xFFD700
  ): void {
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.getParticle();
      if (!particle) continue;

      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 4 + Math.random() * 6;
      const size = 4 + Math.random() * 6;

      this.createParticle(particle, {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size,
        color: this.randomizeColor(color, 30),
        alpha: 1.0
      });
    }

    // Add sparkles
    for (let i = 0; i < 50; i++) {
      const particle = this.getParticle();
      if (!particle) continue;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      this.createParticle(particle, {
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 2,
        color: 0xFFFFFF,
        alpha: 1.0
      });
    }
  }

  public createLevelUpEffect(centerX: number, centerY: number): void {
    const rings = 3;
    const particlesPerRing = 60;

    for (let ring = 0; ring < rings; ring++) {
      const ringRadius = (ring + 1) * 40;
      const ringDelay = ring * 100;

      setTimeout(() => {
        for (let i = 0; i < particlesPerRing; i++) {
          const particle = this.getParticle();
          if (!particle) continue;

          const angle = (Math.PI * 2 * i) / particlesPerRing;
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;
          const hue = (i / particlesPerRing) * 360;
          const color = this.hslToRgb(hue, 100, 50);

          this.createParticle(particle, {
            x,
            y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1,
            maxLife: 1,
            size: 5,
            color,
            alpha: 1.0
          });
        }
      }, ringDelay);
    }

    // Center burst
    for (let i = 0; i < 30; i++) {
      const particle = this.getParticle();
      if (!particle) continue;

      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      this.createParticle(particle, {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 8,
        color: 0xFFFFFF,
        alpha: 1.0
      });
    }
  }

  public createComboEffect(
    centerX: number,
    centerY: number,
    combo: number
  ): void {
    const particleCount = Math.min(combo * 10, 100);

    for (let i = 0; i < particleCount; i++) {
      const particle = this.getParticle();
      if (!particle) continue;

      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;

      this.createParticle(particle, {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 1,
        size: 4 + Math.random() * 3,
        color: 0xFFD700,
        alpha: 0.9
      });
    }
  }

  private createParticle(graphic: PIXI.Graphics, config: ParticleConfig): void {
    graphic.clear();
    graphic.beginFill(config.color, config.alpha);
    graphic.drawCircle(0, 0, config.size);
    graphic.endFill();
    
    graphic.x = config.x;
    graphic.y = config.y;
    
    this.particles.push(graphic);
    this.particleData.set(graphic, config);
    this.container.addChild(graphic);
  }

  public update(delta: number = 1): void {
    const toRemove: PIXI.Graphics[] = [];

    this.particles.forEach(particle => {
      const data = this.particleData.get(particle);
      if (!data) return;

      // Update physics
      data.vx *= 0.98; // Air resistance
      data.vy += this.gravity * delta;
      
      particle.x += data.vx * delta;
      particle.y += data.vy * delta;

      // Update life
      data.life -= 0.02 * delta;
      
      // Fade out
      particle.alpha = Math.max(0, data.life * data.alpha);
      
      // Scale effect
      const lifeProg = 1 - (data.life / data.maxLife);
      particle.scale.set(1 + lifeProg * 0.5);

      if (data.life <= 0) {
        toRemove.push(particle);
      }
    });

    // Remove dead particles
    toRemove.forEach(particle => {
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
      this.returnParticle(particle);
    });
  }

  private randomizeColor(baseColor: number, variance: number): number {
    const r = Math.max(0, Math.min(255, ((baseColor >> 16) & 0xFF) + (Math.random() - 0.5) * variance));
    const g = Math.max(0, Math.min(255, ((baseColor >> 8) & 0xFF) + (Math.random() - 0.5) * variance));
    const b = Math.max(0, Math.min(255, (baseColor & 0xFF) + (Math.random() - 0.5) * variance));
    
    return (r << 16) | (g << 8) | b;
  }

  private hslToRgb(h: number, s: number, l: number): number {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return ((Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255));
  }

  public clear(): void {
    this.particles.forEach(particle => {
      this.returnParticle(particle);
    });
    this.particles = [];
  }

  public destroy(): void {
    this.clear();
    this.particlePool.forEach(particle => particle.destroy());
    this.particlePool = [];
    this.particleData.clear();
  }

  public getParticleCount(): number {
    return this.particles.length;
  }
}
