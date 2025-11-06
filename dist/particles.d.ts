export declare class ParticleSystem {
    private app;
    private particles;
    private container;
    constructor(canvas: HTMLCanvasElement);
    private resize;
    private hexToNumber;
    createLineExplosion(y: number, color: string): void;
    createTetrisExplosion(_lines: number[], color: string): void;
    createComboEffect(combo: number, _x: number, y: number): void;
    createLevelUpEffect(): void;
    private getRandomColor;
    private update;
    private draw;
    private animate;
    destroy(): void;
}
//# sourceMappingURL=particles.d.ts.map