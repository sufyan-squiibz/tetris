import * as PIXI from 'pixi.js';
import { COLS, ROWS, BLOCK_SIZE } from './config';
import { TetrisPiece, copyPiece } from './pieces';

export class GameRenderer {
    private app: PIXI.Application;
    private boardContainer: PIXI.Container;
    private pieceContainer: PIXI.Container;
    private ghostContainer: PIXI.Container;
    private blockGraphics: { [key: string]: PIXI.Graphics } = {};
    private gridGraphics: PIXI.Graphics;
    private board: (string | number)[][];

    constructor(canvas: HTMLCanvasElement, board: (string | number)[][]) {
        this.board = board;
        
        // Créer l'application PixiJS
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
        this.pieceContainer = new PIXI.Container();
        this.ghostContainer = new PIXI.Container();
        
        this.app.stage.addChild(this.boardContainer);
        this.app.stage.addChild(this.ghostContainer);
        this.app.stage.addChild(this.pieceContainer);

        // Dessiner la grille
        this.gridGraphics = new PIXI.Graphics();
        this.drawGrid();
        this.boardContainer.addChild(this.gridGraphics);
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

    private createBlock(color: string): PIXI.Graphics {
        const key = color;
        if (this.blockGraphics[key]) {
            return this.blockGraphics[key].clone();
        }

        const graphics = new PIXI.Graphics();
        
        // Corps du bloc
        graphics.beginFill(this.hexToNumber(color));
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        graphics.endFill();
        
        // Bordure
        graphics.lineStyle(2, 0x000000, 1);
        graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
        
        // Effet de lumière (haut)
        graphics.beginFill(0xffffff, 0.2);
        graphics.drawRect(2, 2, BLOCK_SIZE - 4, 10);
        graphics.endFill();
        
        this.blockGraphics[key] = graphics;
        return graphics.clone();
    }

    private hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
    }


    drawBoard(board: (string | number)[][]): void {
        this.board = board;
        this.boardContainer.removeChildren();
        this.boardContainer.addChild(this.gridGraphics);
        
        // Dessiner les blocs placés
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x] !== 0) {
                    const block = this.createBlock(board[y][x] as string);
                    block.x = x * BLOCK_SIZE;
                    block.y = y * BLOCK_SIZE;
                    this.boardContainer.addChild(block);
                }
            }
        }
    }

    drawCurrentPiece(piece: TetrisPiece): void {
        this.pieceContainer.removeChildren();
        const shape = piece.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    if (boardY >= 0) {
                        const block = this.createBlock(piece.color);
                        block.x = boardX * BLOCK_SIZE;
                        block.y = boardY * BLOCK_SIZE;
                        this.pieceContainer.addChild(block);
                    }
                }
            }
        }
        
        // Dessiner le ghost piece
        this.drawGhostPiece(piece);
    }

    private drawGhostPiece(piece: TetrisPiece): void {
        this.ghostContainer.removeChildren();
        const ghostPiece = copyPiece(piece);
        
        // Faire descendre le ghost piece jusqu'à la collision
        while (!this.checkCollision(ghostPiece)) {
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
                        const color = this.hexToNumber(piece.color);
                        graphics.beginFill(color, 0.18);
                        graphics.drawRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        graphics.endFill();
                        
                        graphics.lineStyle(1, 0x000000, 0.35);
                        graphics.drawRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        
                        this.ghostContainer.addChild(graphics);
                    }
                }
            }
        }
    }

    private checkCollision(piece: TetrisPiece): boolean {
        const shape = piece.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;

                    if (boardX < 0 || boardX >= COLS || 
                        boardY >= ROWS || 
                        (boardY >= 0 && this.board[boardY][boardX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    updateBackground(color: string): void {
        this.app.renderer.background.color = this.hexToNumber(color);
    }

    resize(width: number, height: number): void {
        this.app.renderer.resize(width, height);
    }

    destroy(): void {
        this.app.destroy(true);
    }
}
