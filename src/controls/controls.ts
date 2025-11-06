import { TetrisGame } from '../game';

const CONTROLS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE: 'ArrowUp',
    ROTATE_REVERSE: 'KeyZ',
    HARD_DROP: 'Space',
    HOLD: 'KeyC',
    PAUSE: 'KeyP'
};

const keys: Record<string, boolean> = {};
const lastMoveTime: { left: number; right: number; down: number } = { left: 0, right: 0, down: 0 };
let MOVE_DELAY = 30;

const CONTROL_KEY_SET = new Set([
    CONTROLS.LEFT,
    CONTROLS.RIGHT,
    CONTROLS.DOWN,
    CONTROLS.ROTATE,
    CONTROLS.ROTATE_REVERSE,
    CONTROLS.HARD_DROP,
    CONTROLS.HOLD,
    CONTROLS.PAUSE,
    'Enter'
]);

export function initControls(game: TetrisGame): void {
    document.addEventListener('keydown', (event) => {
        if (CONTROL_KEY_SET.has(event.code)) {
            event.preventDefault();
        }
        
        if (!keys[event.code]) {
            keys[event.code] = true;
        }
        
        handleInput(game, event.code);
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    const continuousLoop = () => {
        handleContinuousInput(game);
        requestAnimationFrame(continuousLoop);
    };
    continuousLoop();
}

function handleInput(game: TetrisGame, key: string): void {
    if (game.paused || game.gameOver) return;

    switch (key) {
        case CONTROLS.LEFT:
        case CONTROLS.RIGHT:
        case CONTROLS.DOWN:
            break;
        case CONTROLS.ROTATE:
            game.rotatePiece();
            break;
        case CONTROLS.ROTATE_REVERSE:
            game.rotatePieceReverse();
            break;
        case CONTROLS.HARD_DROP:
        case 'Enter':
            game.hardDrop();
            break;
        case CONTROLS.HOLD:
            game.holdCurrentPiece();
            break;
        case CONTROLS.PAUSE:
            game.togglePause();
            break;
    }
}

function handleContinuousInput(game: TetrisGame): void {
    if (game.paused || game.gameOver || !game.started) return;

    const now = Date.now();

    if (keys[CONTROLS.LEFT]) {
        if (now - lastMoveTime.left >= MOVE_DELAY) {
            game.movePiece(-1);
            lastMoveTime.left = now;
        }
    }

    if (keys[CONTROLS.RIGHT]) {
        if (now - lastMoveTime.right >= MOVE_DELAY) {
            game.movePiece(1);
            lastMoveTime.right = now;
        }
    }

    if (keys[CONTROLS.DOWN]) {
        if (now - lastMoveTime.down >= MOVE_DELAY) {
            game.dropPiece(true);
            lastMoveTime.down = now;
        }
    }
}

export function setSensitivity(value: number | string): void {
    MOVE_DELAY = parseInt(String(value), 10);
    localStorage.setItem('tetris-sensitivity', String(value));
    console.log(`Sensibilité ajustée à ${MOVE_DELAY}ms`);
}

export function initSensitivityControl(): void {
    const slider = document.getElementById('sensitivity-range') as HTMLInputElement;
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
        MOVE_DELAY = parseInt(savedSensitivity, 10);
        if (slider) slider.value = savedSensitivity;
        if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
    }
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            setSensitivity(value);
            if (valueDisplay) {
                valueDisplay.textContent = `${value}ms`;
            }
            
            presetButtons.forEach(btn => {
                btn.classList.remove('active');
                if ((btn as HTMLElement).dataset.value === value) {
                    btn.classList.add('active');
                }
            });
        });
    }
    
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = (btn as HTMLElement).dataset.value;
            if (value) {
                setSensitivity(value);
                
                if (slider) slider.value = value;
                if (valueDisplay) valueDisplay.textContent = `${value}ms`;
                
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                showNotification(`Sensibilité: ${btn.textContent}`);
            }
        });
    });
    
    presetButtons.forEach(btn => {
        if ((btn as HTMLElement).dataset.value === String(MOVE_DELAY)) {
            btn.classList.add('active');
        }
    });
}

function showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}
