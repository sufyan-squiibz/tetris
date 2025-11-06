// Configuration des contrôles
export const CONTROLS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE: 'ArrowUp',
    ROTATE_REVERSE: 'KeyZ',
    HARD_DROP: 'Space',
    HOLD: 'KeyC',
    PAUSE: 'KeyP'
};

// État des touches - système optimisé avec sensibilité ajustable
const keys: Record<string, boolean> = {};
const lastMoveTime: { left: number; right: number; down: number } = { left: 0, right: 0, down: 0 };
export let MOVE_DELAY = 30; // Délai minimum entre deux mouvements (ms) - ajustable

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

export interface GameControls {
    paused: boolean;
    gameOver: boolean;
    started: boolean;
    movePiece(dx: number): boolean;
    dropPiece(isManual: boolean): boolean;
    rotatePiece(): boolean;
    rotatePieceReverse(): boolean;
    hardDrop(): void;
    holdCurrentPiece(): void;
    togglePause(): void;
}

// Initialisation des contrôles
export function initControls(game: GameControls): void {
    // Événements clavier
    document.addEventListener('keydown', (event) => {
        if (CONTROL_KEY_SET.has(event.code)) {
            event.preventDefault();
        }

        // Marquer la touche comme pressée
        if (!keys[event.code]) {
            keys[event.code] = true;
        }

        // Gérer l'input immédiatement
        handleInput(game, event.code);
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    // Boucle de répétition ultra-rapide pour les mouvements continus
    const continuousLoop = () => {
        handleContinuousInput(game);
        requestAnimationFrame(continuousLoop);
    };
    continuousLoop();
}

// Gestion des inputs ponctuels (première pression uniquement)
function handleInput(game: GameControls, key: string): void {
    if (game.paused || game.gameOver) return;

    switch (key) {
        case CONTROLS.LEFT:
        case CONTROLS.RIGHT:
        case CONTROLS.DOWN:
            // Ces touches sont gérées par handleContinuousInput pour éviter la duplication
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

// Gestion des inputs continus (répétition automatique quand touche maintenue)
function handleContinuousInput(game: GameControls): void {
    if (game.paused || game.gameOver || !game.started) return;

    const now = Date.now();

    // Gauche - répétition continue si maintenu
    if (keys[CONTROLS.LEFT]) {
        if (now - lastMoveTime.left >= MOVE_DELAY) {
            game.movePiece(-1);
            lastMoveTime.left = now;
        }
    }

    // Droite - répétition continue si maintenu
    if (keys[CONTROLS.RIGHT]) {
        if (now - lastMoveTime.right >= MOVE_DELAY) {
            game.movePiece(1);
            lastMoveTime.right = now;
        }
    }

    // Bas - répétition continue si maintenu
    if (keys[CONTROLS.DOWN]) {
        if (now - lastMoveTime.down >= MOVE_DELAY) {
            game.dropPiece(true);
            lastMoveTime.down = now;
        }
    }
}

// Fonction pour changer la sensibilité
export function setSensitivity(value: number): void {
    MOVE_DELAY = parseInt(String(value), 10);
    localStorage.setItem('tetris-sensitivity', String(value));
    console.log(`Sensibilité ajustée à ${MOVE_DELAY}ms`);
}

// Initialiser le contrôle de sensibilité
export function initSensitivityControl(): void {
    const slider = document.getElementById('sensitivity-range');
    const valueDisplay = document.getElementById('sensitivity-value');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Charger la sensibilité sauvegardée
    const savedSensitivity = localStorage.getItem('tetris-sensitivity');
    if (savedSensitivity) {
        MOVE_DELAY = parseInt(savedSensitivity, 10);
        if (slider) (slider as HTMLInputElement).value = savedSensitivity;
        if (valueDisplay) valueDisplay.textContent = `${savedSensitivity}ms`;
    }

    // Événement du slider
    if (slider) {
        slider.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            setSensitivity(parseInt(value, 10));
            if (valueDisplay) {
                valueDisplay.textContent = `${value}ms`;
            }

            // Mettre à jour les boutons presets
            presetButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-value') === value) {
                    btn.classList.add('active');
                }
            });
        });
    }

    // Événements des boutons presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            if (value) {
                setSensitivity(parseInt(value, 10));

                if (slider) (slider as HTMLInputElement).value = value;
                if (valueDisplay) valueDisplay.textContent = `${value}ms`;

                // Mettre à jour l'état actif
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Notification visuelle
                if (typeof window !== 'undefined' && (window as any).showNotification) {
                    (window as any).showNotification(`Sensibilité: ${btn.textContent}`);
                }
            }
        });
    });

    // Mettre à jour l'état actif initial
    presetButtons.forEach(btn => {
        if (btn.getAttribute('data-value') === String(MOVE_DELAY)) {
            btn.classList.add('active');
        }
    });
}
