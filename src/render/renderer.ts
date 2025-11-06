import * as PIXI from 'pixi.js';
import { TetrisPiece, copyPiece } from '../pieces';
import { COLS, ROWS, BLOCK_SIZE } from '../game/constants';

export class Renderer {
    private app: PIXI.Application;
    private boardContainer: PIXI.Container;
    private pieceContainer: PIXI.Container;
    private ghostContainer: PIXI.Container;
    private blockGraphics: Map<string, PIXI.Graphics> = new Map();

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }

        this.app = new PIXI.Application({
            view: canvas,
            width: COLS * BLOCK_SIZE,
            height: ROWS * BLOCK_SIZE,
            backgroundColor: 0x1a1a2e,
            antialias: false,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        // Créer les conteneurs
        this.boardContainer = new PIXI.Container();
        this.pieceContainer = new PIXI.Container();
        this.ghostContainer = new PIXI.Container();

        this.app.stage.addChild(this.boardContainer);
        this.app.stage.addChild(this.ghostContainer);
        this.app.stage.addChild(this.pieceContainer);

        this.drawGrid();
    }

    private drawGrid(): void {
        const graphics = new PIXI.Graphics();
        
        // Lignes verticales
        for (let x = 0; x <= COLS; x++) {
            graphics.lineStyle(1, 0x34495e, 0.5);
            graphics.moveTo(x * BLOCK_SIZE, 0);
            graphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        }
        
        // Lignes horizontales
        for (let y = 0; y <= ROWS; y++) {
            graphics.lineStyle(1, 0x34495e, 0.5);
            graphics.moveTo(0, y * BLOCK_SIZE);
            graphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        }
        
        this.boardContainer.addChild(graphics);
    }

    private createBlockGraphic(color: string): PIXI.Graphics {
        const cached = this.blockGraphics.get(color);
        if (cached) {
            return cached.clone();
        }

        const graphics = new PIXI.Graphics();
        const colorNum = this.hexToNumber(color);
        
        // Bloc principal
        graphics.beginFill(colorNum);
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        graphics.endFill();
        
        // Bordure
        graphics.lineStyle(2, 0x000000, 1);
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        
        // Effet de lumière (haut)
        graphics.beginFill(0xffffff, 0.2);
        graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
        graphics.endFill();
        
        this.blockGraphics.set(color, graphics);
        return graphics.clone();
    }

    private hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }


    public renderBoard(board: (number | string)[][]): void {
        
        // Supprimer les anciens blocs (sauf la grille)
        const toRemove: PIXI.DisplayObject[] = [];
        this.boardContainer.children.forEach((child, index) => {
            if (index > 0) { // Garder la grille (index 0)
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => this.boardContainer.removeChild(child));

        // Dessiner les blocs placés
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                    const cell = board[y][x];
                    if (cell !== 0) {
                        const block = this.createBlockGraphic(String(cell));
                    block.x = x * BLOCK_SIZE;
                    block.y = y * BLOCK_SIZE;
                    this.boardContainer.addChild(block);
                }
            }
        }
    }

    public renderCurrentPiece(piece: TetrisPiece): void {
        // Nettoyer le conteneur de pièce
        this.pieceContainer.removeChildren();

        const shape = piece.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    if (boardY >= 0) {
                        const block = this.createBlockGraphic(piece.color);
                        block.x = boardX * BLOCK_SIZE;
                        block.y = boardY * BLOCK_SIZE;
                        this.pieceContainer.addChild(block);
                    }
                }
            }
        }
    }

    public renderGhostPiece(piece: TetrisPiece, board: (number | string)[][]): void {
        // Nettoyer le conteneur de ghost
        this.ghostContainer.removeChildren();

        const ghostPiece = copyPiece(piece);
        
        // Faire descendre le ghost piece jusqu'à la collision
        while (!this.checkCollision(ghostPiece, board)) {
            ghostPiece.y++;
        }
        ghostPiece.y--;
        
        const shape = ghostPiece.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = ghostPiece.x + x;
                    const boardY = ghostPiece.y + y;
                    
                    if (boardY >= 0) {
                        const graphics = new PIXI.Graphics();
                        const hexColor = this.hexToNumber(piece.color);
                        const r = (hexColor >> 16) & 255;
                        const g = (hexColor >> 8) & 255;
                        const b = hexColor & 255;
                        
                        graphics.beginFill((r << 16) | (g << 8) | b, 0.18);
                        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                        graphics.endFill();
                        
                        graphics.lineStyle(1, 0x000000, 0.35);
                        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                        
                        graphics.x = boardX * BLOCK_SIZE;
                        graphics.y = boardY * BLOCK_SIZE;
                        this.ghostContainer.addChild(graphics);
                    }
                }
            }
        }
    }

    private checkCollision(piece: TetrisPiece, board: (number | string)[][]): boolean {
        const shape = piece.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;

                    if (boardX < 0 || boardX >= COLS || 
                        boardY >= ROWS || 
                        (boardY >= 0 && board[boardY][boardX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public updateTheme(theme: { boardBg?: string; gridColor?: string }): void {
        if (theme.boardBg) {
            const bgColor = this.hexToNumber(theme.boardBg);
            this.app.renderer.background.color = bgColor;
        }
    }

    public resize(width: number, height: number): void {
        this.app.renderer.resize(width, height);
    }

    public destroy(): void {
        this.app.destroy(true);
    }
}
