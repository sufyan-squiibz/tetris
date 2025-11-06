// Définition des pièces Tetris classiques
class TetrisPiece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
    }

    rotate() {
        this.rotation = (this.rotation + 1) % this.shape.length;
        return this.getShape();
    }

    rotateReverse() {
        this.rotation = (this.rotation - 1 + this.shape.length) % this.shape.length;
        return this.getShape();
    }

    getShape() {
        return this.shape[this.rotation];
    }

    reset() {
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
    }
}

// Pièces Tetris avec formes correctes
const TETRIS_PIECES = {
    I: new TetrisPiece([
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
        [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
        [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
        [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
    ], '#00ffff'),

    J: new TetrisPiece([
        [[1,0,0], [1,1,1], [0,0,0]],
        [[0,1,1], [0,1,0], [0,1,0]],
        [[0,0,0], [1,1,1], [0,0,1]],
        [[0,1,0], [0,1,0], [1,1,0]]
    ], '#0000ff'),

    L: new TetrisPiece([
        [[0,0,1], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,0], [0,1,1]],
        [[0,0,0], [1,1,1], [1,0,0]],
        [[1,1,0], [0,1,0], [0,1,0]]
    ], '#ff7f00'),

    O: new TetrisPiece([
        [[1,1], [1,1]],
        [[1,1], [1,1]],
        [[1,1], [1,1]],
        [[1,1], [1,1]]
    ], '#ffff00'),

    S: new TetrisPiece([
        [[0,1,1], [1,1,0], [0,0,0]],
        [[0,1,0], [0,1,1], [0,0,1]],
        [[0,0,0], [0,1,1], [1,1,0]],
        [[1,0,0], [1,1,0], [0,1,0]]
    ], '#00ff00'),

    T: new TetrisPiece([
        [[0,1,0], [1,1,1], [0,0,0]],
        [[0,1,0], [0,1,1], [0,1,0]],
        [[0,0,0], [1,1,1], [0,1,0]],
        [[0,1,0], [1,1,0], [0,1,0]]
    ], '#800080'),

    Z: new TetrisPiece([
        [[1,1,0], [0,1,1], [0,0,0]],
        [[0,0,1], [0,1,1], [0,1,0]],
        [[0,0,0], [1,1,0], [0,1,1]],
        [[0,1,0], [1,1,0], [1,0,0]]
    ], '#ff0000')
};

const PIECE_TYPES = Object.keys(TETRIS_PIECES);
let pieceBag = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomPiece() {
    if (pieceBag.length === 0) {
        pieceBag = shuffle(PIECE_TYPES.slice());
    }

    const nextType = pieceBag.pop();
    const piece = TETRIS_PIECES[nextType];
    const newPiece = new TetrisPiece(piece.shape, piece.color);
    newPiece.reset();
    return newPiece;
}

function copyPiece(piece) {
    const newPiece = new TetrisPiece(piece.shape, piece.color);
    newPiece.x = piece.x;
    newPiece.y = piece.y;
    newPiece.rotation = piece.rotation;
    return newPiece;
}