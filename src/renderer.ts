import * as PIXI from 'pixi.js';
import { TetrisPiece } from './pieces';

// Configuration du rendu
export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export class GameRenderer {
    private app: PIXI.Application;
    private boardContainer: PIXI.Container;
    private currentPieceContainer: PIXI.Container;
    private ghostPieceContainer: PIXI.Container;
    private gridGraphics: PIXI.Graphics;
    private blockSprites: Map<string, PIXI.Graphics> = new Map();

    constructor(canvas: HTMLCanvasElement) {
        this.app = new PIXI.Application({
            view: canvas,
            width: COLS * BLOCK_SIZE,
            height: ROWS * BLOCK_SIZE,
            background: 0x1a1a2e,
            antialias: false,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        // Créer les conteneurs
        this.boardContainer = new PIXI.Container();
        this.currentPieceContainer = new PIXI.Container();
        this.ghostPieceContainer = new PIXI.Container();
        
        this.app.stage.addChild(this.boardContainer);
        this.app.stage.addChild(this.ghostPieceContainer);
        this.app.stage.addChild(this.currentPieceContainer);

        // Dessiner la grille
        this.gridGraphics = new PIXI.Graphics();
        this.drawGrid();
        this.app.stage.addChildAt(this.gridGraphics, 0);
    }

    private drawGrid(): void {
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

        // Lignes verticales
        for (let x = 0; x <= COLS; x++) {
            this.gridGraphics.moveTo(x * BLOCK_SIZE, 0);
            this.gridGraphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        }

        // Lignes horizontales
        for (let y = 0; y <= ROWS; y++) {
            this.gridGraphics.moveTo(0, y * BLOCK_SIZE);
            this.gridGraphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        }
    }

    private createBlockSprite(color: string): PIXI.Graphics {
        const key = color;
        if (this.blockSprites.has(key)) {
            return this.blockSprites.get(key)!.clone();
        }

        const graphics = new PIXI.Graphics();
        
        // Couleur principale
        graphics.beginFill(this.hexToNumber(color));
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        graphics.endFill();

        // Bordure
        graphics.lineStyle(2, 0x000000);
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);

        // Effet de lumière (haut)
        graphics.beginFill(0xffffff, 0.2);
        graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
        graphics.endFill();

        this.blockSprites.set(key, graphics);
        return graphics.clone();
    }

    private hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }


    drawBoard(board: number[][]): void {
        // Nettoyer le conteneur
        this.boardContainer.removeChildren();

        // Dessiner les blocs placés
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x] !== 0) {
                    const color = this.numberToHex(board[y][x]);
                    const block = this.createBlockSprite(color);
                    block.x = x * BLOCK_SIZE;
                    block.y = y * BLOCK_SIZE;
                    this.boardContainer.addChild(block);
                }
            }
        }
    }

    private numberToHex(num: number): string {
        return '#' + num.toString(16).padStart(6, '0');
    }

    drawCurrentPiece(piece: TetrisPiece, board: number[][]): void {
        // Nettoyer les conteneurs
        this.currentPieceContainer.removeChildren();
        this.ghostPieceContainer.removeChildren();

        const shape = piece.getShape();

        // Dessiner la pièce courante
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;

                    if (boardY >= 0) {
                        const block = this.createBlockSprite(piece.color);
                        block.x = boardX * BLOCK_SIZE;
                        block.y = boardY * BLOCK_SIZE;
                        this.currentPieceContainer.addChild(block);
                    }
                }
            }
        }

        // Dessiner le ghost piece
        this.drawGhostPiece(piece, board);
    }

    private drawGhostPiece(piece: TetrisPiece, board: number[][]): void {
        const ghostPiece = this.copyPieceForGhost(piece);

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
                        graphics.beginFill(this.hexToNumber(piece.color), 0.18);
                        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                        graphics.endFill();
                        graphics.lineStyle(1, 0x000000, 0.35);
                        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                        graphics.x = boardX * BLOCK_SIZE;
                        graphics.y = boardY * BLOCK_SIZE;
                        this.ghostPieceContainer.addChild(graphics);
                    }
                }
            }
        }
    }

    private copyPieceForGhost(piece: TetrisPiece): TetrisPiece {
        const newPiece = new TetrisPiece(piece.shape, piece.color);
        newPiece.x = piece.x;
        newPiece.y = piece.y;
        newPiece.rotation = piece.rotation;
        return newPiece;
    }

    private checkCollision(piece: TetrisPiece, board: number[][]): boolean {
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

    updateTheme(backgroundColor: number, gridColor: number): void {
        // Dans PixiJS 7, on peut changer le background via les options
        (this.app.renderer as any).background.color = backgroundColor;
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, gridColor, 0.5);

        // Redessiner la grille
        for (let x = 0; x <= COLS; x++) {
            this.gridGraphics.moveTo(x * BLOCK_SIZE, 0);
            this.gridGraphics.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        }

        for (let y = 0; y <= ROWS; y++) {
            this.gridGraphics.moveTo(0, y * BLOCK_SIZE);
            this.gridGraphics.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        }
    }

    resize(width: number, height: number): void {
        this.app.renderer.resize(width, height);
    }

    destroy(): void {
        this.app.destroy(true);
    }
}
