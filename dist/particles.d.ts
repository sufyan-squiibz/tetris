import * as PIXI from 'pixi.js';
export declare class Particle {
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
    constructor(x: number, y: number, angle: number, speed: number, color: number, opacity: number, container: PIXI.Container);
    update(): void;
    destroy(): void;
}
export declare class ParticleSystem {
    private app;
    private container;
    private particles;
    constructor(canvas: HTMLCanvasElement);
    resize(): void;
    private hexToNumber;
    createLineExplosion(y: number, color: string): void;
    createTetrisExplosion(_lines: number[], color: string): void;
    createComboEffect(combo: number, _x: number, y: number): void;
    createLevelUpEffect(): void;
    getRandomColor(): string;
    update(): void;
    animate(): void;
    destroy(): void;
}
//# sourceMappingURL=particles.d.ts.map