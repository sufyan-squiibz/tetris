export declare class Particle {
    private x;
    private y;
    private vx;
    private vy;
    private color;
    private life;
    private opacity;
    private size;
    private gravity;
    constructor(x: number, y: number, vx: number, vy: number, color: string, opacity: number);
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isDead(): boolean;
}
export declare class ParticleSystem {
    private canvas;
    private ctx;
    private particles;
    constructor();
    private resize;
    createLineExplosion(y: number, color?: string): void;
    createTetrisExplosion(_lines: number[], color?: string): void;
    createLevelUpEffect(): void;
    private getRandomColor;
    private update;
    private draw;
    private animate;
}
//# sourceMappingURL=particles.d.ts.map