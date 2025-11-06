import * as PIXI from 'pixi.js';

class Particle {
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

    constructor(x: number, y: number, angle: number, speed: number, color: number, opacity: number) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle * Math.PI / 180) * speed;
        this.vy = Math.sin(angle * Math.PI / 180) * speed;
        this.color = color;
        this.opacity = opacity;
        this.life = 1.0;
        this.size = 2 + Math.random() * 3;
        this.gravity = 0.1;
        
        this.graphics = new PIXI.Graphics();
        this.updateGraphics();
    }

    private updateGraphics(): void {
        this.graphics.clear();
        this.graphics.beginFill(this.color, this.opacity);
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();
        this.graphics.x = this.x;
        this.graphics.y = this.y;
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
        return this.graphics;
    }
}

export class ParticleSystem {
    private app: PIXI.Application;
    private particles: Particle[] = [];
    private container: PIXI.Container;

    constructor(canvas: HTMLCanvasElement) {
        // Créer l'application PixiJS pour les particules
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        // Définir le background transparent après création
        this.app.renderer.background.alpha = 0;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    private resize(): void {
        const container = document.querySelector('.game-container') as HTMLElement;
        if (container) {
            this.app.renderer.resize(container.offsetWidth, container.offsetHeight);
        }
    }

    private hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }

    createLineExplosion(y: number, color: string): void {
        const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!gameCanvas) return;
        const boardRect = gameCanvas.getBoundingClientRect();
        
        const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
        const startX = boardRect.left - containerRect.left;
        const startY = boardRect.top - containerRect.top + (y * 30);
        const width = boardRect.width;

        const colorNum = this.hexToNumber(color || this.getRandomColor());
        
        // Créer des particules le long de la ligne
        for (let i = 0; i < 30; i++) {
            const x = startX + (width / 30) * i;
            this.particles.push(new Particle(
                x,
                startY,
                Math.random() * 360,
                2 + Math.random() * 3,
                colorNum,
                0.8
            ));
        }
    }

    createTetrisExplosion(_lines: number[], color: string): void {
        const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!gameCanvas) return;
        const boardRect = gameCanvas.getBoundingClientRect();
        
        const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
        const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
        const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

        const colorNum = this.hexToNumber(color || this.getRandomColor());

        // Explosion massive pour un Tetris
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(
                centerX,
                centerY,
                Math.random() * 360,
                3 + Math.random() * 5,
                colorNum,
                1.0
            ));
        }
    }

    createComboEffect(combo: number, _x: number, y: number): void {
        const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!gameCanvas) return;
        const boardRect = gameCanvas.getBoundingClientRect();
        
        const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
        const posX = boardRect.left - containerRect.left + boardRect.width / 2;
        const posY = boardRect.top - containerRect.top + y * 30;

        const colorNum = this.hexToNumber('#FFD700');

        for (let i = 0; i < combo * 5; i++) {
            this.particles.push(new Particle(
                posX,
                posY,
                Math.random() * 360,
                1 + Math.random() * 2,
                colorNum,
                0.6
            ));
        }
    }

    createLevelUpEffect(): void {
        const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!gameCanvas) return;
        const boardRect = gameCanvas.getBoundingClientRect();
        
        const containerRect = (this.app.view as HTMLCanvasElement).getBoundingClientRect();
        const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
        const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

        // Effet circulaire pour level up
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const hue = (i * 6) % 360;
            // Convertir HSL en RGB approximatif
            const h = hue / 360;
            const s = 1;
            const l = 0.5;
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs((h * 6) % 2 - 1));
            const m = l - c / 2;
            let r = 0, g = 0, b = 0;
            if (h < 1/6) { r = c; g = x; b = 0; }
            else if (h < 2/6) { r = x; g = c; b = 0; }
            else if (h < 3/6) { r = 0; g = c; b = x; }
            else if (h < 4/6) { r = 0; g = x; b = c; }
            else if (h < 5/6) { r = x; g = 0; b = c; }
            else { r = c; g = 0; b = x; }
            const color = ((Math.floor((r + m) * 255) << 16) | (Math.floor((g + m) * 255) << 8) | Math.floor((b + m) * 255));
            
            this.particles.push(new Particle(
                centerX,
                centerY,
                angle * (180 / Math.PI),
                4,
                color,
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
        this.container.removeChildren();
        this.particles.forEach(p => {
            this.container.addChild(p.getGraphics());
        });
    }

    private animate(): void {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    destroy(): void {
        this.app.destroy(true);
    }
}
