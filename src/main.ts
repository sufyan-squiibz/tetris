import { TetrisGame } from './game';
import { initControls, initSensitivityControl } from './controls';
import { addAudioControls, registerAudioUnlock } from './audio';
import { showNotification } from './themes';

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;

    if (!gameCanvas || !particlesCanvas) {
        console.error('Canvas elements non trouvés');
        return;
    }

    let game = new TetrisGame(gameCanvas, particlesCanvas);
    (window as any).game = game;

    // Événements de contrôle
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            game.start();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            game.togglePause();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            game.resetGame();
        });
    }

    // Initialiser les contrôles clavier
    initControls(game);

    // Événement pour sauvegarder le score
    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', () => {
            const playerNameEl = document.getElementById('player-name') as HTMLInputElement;
            const name = playerNameEl?.value.trim() || '';

            if (!name) {
                showNotification('Veuillez entrer votre nom');
                return;
            }

            if (game.isHighScore(game.score)) {
                game.saveScore(name, game.score, game.level, game.lines);
            } else {
                showNotification('Votre score n\'est pas assez élevé pour le classement');
            }

            const gameOverEl = document.getElementById('game-over');
            if (gameOverEl) {
                (gameOverEl as HTMLElement).style.display = 'none';
            }
        });
    }

    // Plein écran
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const container = document.getElementById('game-container');
            if (container) {
                if (!document.fullscreenElement) {
                    (container as HTMLElement).requestFullscreen().catch(err => {
                        console.error('Erreur plein écran:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
        });
    }

    // Tutoriel
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');
    const startTutorialBtn = document.getElementById('start-tutorial-btn');

    if (tutorialBtn && tutorialOverlay) {
        tutorialBtn.addEventListener('click', () => {
            (tutorialOverlay as HTMLElement).style.display = 'flex';
        });
    }

    if (closeTutorialBtn && tutorialOverlay) {
        closeTutorialBtn.addEventListener('click', () => {
            (tutorialOverlay as HTMLElement).style.display = 'none';
        });
    }

    if (startTutorialBtn && tutorialOverlay) {
        startTutorialBtn.addEventListener('click', () => {
            (tutorialOverlay as HTMLElement).style.display = 'none';
            game.start();
        });
    }

    // Afficher le tutoriel au premier lancement
    if (tutorialOverlay && !localStorage.getItem('tetris-tutorial-seen')) {
        (tutorialOverlay as HTMLElement).style.display = 'flex';
        localStorage.setItem('tetris-tutorial-seen', 'true');
    }

    // Thème
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const themeName = game.getThemeManager().nextTheme();
            showNotification(`Thème: ${themeName}`);
        });
    }

    // Initialiser les contrôles de sensibilité
    initSensitivityControl();

    // Initialiser l'audio
    addAudioControls();
    registerAudioUnlock();

    // Rendu initial
    game.draw();
});

// Exporter showNotification globalement pour compatibilité
(window as any).showNotification = showNotification;
