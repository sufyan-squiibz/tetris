import { TetrisGame } from './game';
import { GameRenderer } from './renderer';
import { AudioManager, addAudioControls, registerAudioUnlock } from './audio';
import { ParticleSystem } from './particles';
import { ThemeManager, showNotification } from './themes';
import { initControls, initSensitivityControl } from './controls';

// Initialisation du jeu après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Créer les instances
    const game = new TetrisGame();
    const audioManager = new AudioManager();
    
    // Obtenir les canvas
    const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const particlesCanvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    
    if (!gameCanvas) {
        console.error('Canvas de jeu non trouvé');
        return;
    }
    
    // Créer le renderer PixiJS
    const renderer = new GameRenderer(gameCanvas, game.board as (string | number)[][]);
    game.setRenderer(renderer);
    game.setAudioManager(audioManager);
    
    // Créer le système de particules
    if (particlesCanvas) {
        const particleSystem = new ParticleSystem(particlesCanvas);
        game.setParticleSystem(particleSystem);
    }
    
    // Créer le gestionnaire de thèmes
    const themeManager = new ThemeManager();
    
    // Exposer globalement pour compatibilité
    (window as any).game = game;
    (window as any).audioManager = audioManager;
    (window as any).themeManager = themeManager;
    (window as any).showNotification = showNotification;
    
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
                gameOverEl.style.display = 'none';
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
                    container.requestFullscreen().catch(err => {
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
            tutorialOverlay.style.display = 'flex';
        });
    }
    
    if (closeTutorialBtn && tutorialOverlay) {
        closeTutorialBtn.addEventListener('click', () => {
            tutorialOverlay.style.display = 'none';
        });
    }
    
    if (startTutorialBtn && tutorialOverlay) {
        startTutorialBtn.addEventListener('click', () => {
            tutorialOverlay.style.display = 'none';
            game.start();
        });
    }
    
    // Afficher le tutoriel au premier lancement
    if (!localStorage.getItem('tetris-tutorial-seen') && tutorialOverlay) {
        tutorialOverlay.style.display = 'flex';
        localStorage.setItem('tetris-tutorial-seen', 'true');
    }
    
    // Bouton de changement de thème
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const themeName = themeManager.nextTheme();
            const container = document.querySelector('.game-container');
            if (container) {
                (container as HTMLElement).style.transition = 'background 0.5s ease';
            }
            showNotification(`Thème: ${themeName}`);
        });
    }
    
    // Initialiser les contrôles audio
    addAudioControls(audioManager);
    registerAudioUnlock(audioManager);
    
    // Initialiser le contrôle de sensibilité
    initSensitivityControl();
    
    // Rendu initial
    game.draw();
});
