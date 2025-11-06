export declare class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    opacity: number;
    life: number;
    size: number;
    gravity: number;
    constructor(x: number, y: number, angle: number, speed: number, color: string, opacity: number);
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
export declare class ParticleSystem {
    private canvas;
    private ctx;
    private particles;
    constructor();
    resize(): void;
    createLineExplosion(y: number, color: string): void;
    createTetrisExplosion(_lines: number[], color: string): void;
    createComboEffect(combo: number, _x: number, y: number): void;
    createLevelUpEffect(): void;
    getRandomColor(): string;
    update(): void;
    draw(): void;
    animate(): void;
}
//# sourceMappingURL=particles.d.ts.map