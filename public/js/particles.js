// Système de particules pour effets visuels
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        const container = document.querySelector('.game-container');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    createLineExplosion(y, color) {
        const boardRect = document.getElementById('game-canvas').getBoundingClientRect();
        const containerRect = this.canvas.getBoundingClientRect();
        
        const startX = boardRect.left - containerRect.left;
        const startY = boardRect.top - containerRect.top + (y * 30);
        const width = boardRect.width;

        // Créer des particules le long de la ligne
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

    createTetrisExplosion(lines, color) {
        const boardRect = document.getElementById('game-canvas').getBoundingClientRect();
        const containerRect = this.canvas.getBoundingClientRect();
        
        const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
        const centerY = boardRect.top - containerRect.top + boardRect.height / 2;

        // Explosion massive pour un Tetris
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

    createComboEffect(combo, x, y) {
        const boardRect = document.getElementById('game-canvas').getBoundingClientRect();
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

    createLevelUpEffect() {
        const boardRect = document.getElementById('game-canvas').getBoundingClientRect();
        const containerRect = this.canvas.getBoundingClientRect();
        
        const centerX = boardRect.left - containerRect.left + boardRect.width / 2;
        const centerY = boardRect.top - containerRect.left + boardRect.height / 2;

        // Effet circulaire pour level up
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

    getRandomColor() {
        const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff00', '#ff0000', '#0000ff', '#ff7f00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => p.draw(this.ctx));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, angle, speed, color, opacity) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle * Math.PI / 180) * speed;
        this.vy = Math.sin(angle * Math.PI / 180) * speed;
        this.color = color;
        this.opacity = opacity;
        this.life = 1.0;
        this.size = 2 + Math.random() * 3;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= 0.02;
        this.opacity = this.life;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialiser le système de particules
let particleSystem;
document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
    window.particleSystem = particleSystem;
});

