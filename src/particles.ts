import * as PIXI from 'pixi.js';

// Système de particules pour effets visuels avec PixiJS
export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: number;
    opacity: number;
    life: number;
    size: number;
    gravity: number;
    sprite: PIXI.Graphics;

    constructor(x: number, y: number, angle: number, speed: number, color: number, opacity: number, container: PIXI.Container) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle * Math.PI / 180) * speed;
        this.vy = Math.sin(angle * Math.PI / 180) * speed;
        this.color = color;
        this.opacity = opacity;
        this.life = 1.0;
        this.size = 2 + Math.random() * 3;
        this.gravity = 0.1;

        // Créer le sprite PixiJS
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(color, opacity);
        this.sprite.drawCircle(0, 0, this.size);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        container.addChild(this.sprite);
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= 0.02;
        this.opacity = this.life;

        // Mettre à jour le sprite
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.alpha = this.opacity;
    }

    destroy(): void {
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.sprite.destroy();
    }
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
            background: 0x000000,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });
        this.app.stage.alpha = 0;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.animate();
    }

    resize(): void {
        const container = document.querySelector('.game-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.app.renderer.resize(rect.width, rect.height);
        }
    }

    private hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }

    createLineExplosion(y: number, color: string): void {
        const boardCanvas = document.getElementById('game-canvas');
        if (!boardCanvas) return;

        const boardRect = boardCanvas.getBoundingClientRect();
        const view = this.app.view as HTMLCanvasElement;
        if (!view) return;
        const containerRect = view.getBoundingClientRect();

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
                0.8,
                this.container
            ));
        }
    }

    createTetrisExplosion(_lines: number[], color: string): void {
        const boardCanvas = document.getElementById('game-canvas');
        if (!boardCanvas) return;

        const boardRect = boardCanvas.getBoundingClientRect();
        const view = this.app.view as HTMLCanvasElement;
        if (!view) return;
        const containerRect = view.getBoundingClientRect();

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
                1.0,
                this.container
            ));
        }
    }

    createComboEffect(combo: number, _x: number, y: number): void {
        const boardCanvas = document.getElementById('game-canvas');
        if (!boardCanvas) return;

        const boardRect = boardCanvas.getBoundingClientRect();
        const view = this.app.view as HTMLCanvasElement;
        if (!view) return;
        const containerRect = view.getBoundingClientRect();

        const posX = boardRect.left - containerRect.left + boardRect.width / 2;
        const posY = boardRect.top - containerRect.top + y * 30;
        const goldColor = this.hexToNumber('#FFD700');

        for (let i = 0; i < combo * 5; i++) {
            this.particles.push(new Particle(
                posX,
                posY,
                Math.random() * 360,
                1 + Math.random() * 2,
                goldColor,
                0.6,
                this.container
            ));
        }
    }

    createLevelUpEffect(): void {
        const boardCanvas = document.getElementById('game-canvas');
        if (!boardCanvas) return;

        const boardRect = boardCanvas.getBoundingClientRect();
        const view = this.app.view as HTMLCanvasElement;
        if (!view) return;
        const containerRect = view.getBoundingClientRect();

        const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
        const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

        // Effet circulaire pour level up
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const hue = i * 6;
            // Convertir HSL en RGB puis en hex
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
                1.0,
                this.container
            ));
        }
    }

    getRandomColor(): string {
        const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(): void {
        this.particles = this.particles.filter(p => {
            if (p.life <= 0) {
                p.destroy();
                return false;
            }
            p.update();
            return true;
        });
    }

    animate(): void {
        this.update();
        this.app.renderer.render(this.app.stage);
        requestAnimationFrame(() => this.animate());
    }

    destroy(): void {
        this.particles.forEach(p => p.destroy());
        this.app.destroy(true);
    }
}
