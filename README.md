# Tetris Pro - TypeScript + PixiJS Edition

Un jeu Tetris moderne et performant développé avec **TypeScript** et **PixiJS** pour un rendu WebGL accéléré par GPU.

## 🚀 Fonctionnalités

### Gameplay
- ✅ Toutes les mécaniques classiques de Tetris
- 👻 **Ghost Piece** - Aperçu de l'emplacement de chute
- 🎯 **Hold System** - Réserve une pièce pour plus tard
- 👀 **Preview** - Visualisation des 3 prochaines pièces
- 🎮 **Contrôles réactifs** avec sensibilité ajustable
- 🏆 **Système de scoring** avancé avec combos et back-to-back Tetris

### Technique
- 💻 **TypeScript** - Code typé et maintenable
- 🎨 **PixiJS v7** - Rendu WebGL haute performance
- ⚡ **Vite** - Build ultra-rapide et HMR
- 🎭 **4 Thèmes visuels** - Classique, Néon, Rétro, Sombre
- 🎵 **Système audio** avec sons synthétisés
- ✨ **Système de particules** pour les effets visuels
- 📊 **Statistiques en temps réel** - PPS, combos, temps de jeu

## 📦 Installation

## 🚀 Installation et Démarrage

### Installation des dépendances
```bash
npm install
```

### Mode développement
```bash
# Installer les dépendances
npm install
```

## 🎮 Utilisation

### Mode Développement

Démarrez le serveur de développement avec hot-reload :

```bash
# Terminal 1 : Serveur API (port 3001)
node server.js

# Terminal 2 : Vite dev server (port 3000)
npm run dev
```
Démarre le serveur Express pour l'API des scores sur le port 3001

Puis ouvrez votre navigateur sur `http://localhost:3000`

### Mode Production

Compilez le projet pour la production :

```bash
# Build
npm run build

# Preview du build
npm run preview
```

## ⌨️ Contrôles

| Touche | Action |
|--------|--------|
| `←` `→` | Déplacer latéralement |
| `↓` | Descente rapide (soft drop) |
| `↑` | Rotation horaire |
| `Z` | Rotation anti-horaire |
| `Espace` / `Entrée` | Chute immédiate (hard drop) |
| `C` | Hold - Mettre en réserve |
| `P` | Pause |

## 📁 Structure du Projet

```
/workspace
├── src/
│   ├── core/           # Logique du jeu
│   │   ├── Game.ts     # Classe principale du jeu
│   │   ├── Piece.ts    # Définition des pièces
│   │   ├── PieceFactory.ts
│   │   └── Controls.ts # Gestion des contrôles
│   ├── rendering/      # Système de rendu PixiJS
│   │   └── Renderer.ts
│   ├── audio/          # Gestion du son
│   │   └── AudioManager.ts
│   ├── effects/        # Effets visuels
│   │   └── ParticleSystem.ts
│   ├── ui/             # Interface utilisateur
│   │   └── UIManager.ts
│   ├── config/         # Configuration
│   │   ├── constants.ts
│   │   └── themes.ts
│   ├── types/          # Types TypeScript
│   │   └── index.ts
│   └── main.ts         # Point d'entrée
├── public/
│   ├── css/
│   │   └── style.css
│   └── index.html
├── server.js           # Serveur Express pour l'API
├── vite.config.ts      # Configuration Vite
├── tsconfig.json       # Configuration TypeScript
└── package.json
```

## 🎯 Architecture

### Game Engine
Le moteur de jeu est divisé en modules indépendants :
- **Game** : Gestion de l'état du jeu et de la logique
- **Renderer** : Rendu WebGL via PixiJS
- **Controls** : Gestion des entrées clavier
- **AudioManager** : Synthèse audio en temps réel
- **ParticleSystem** : Effets visuels Canvas 2D
- **UIManager** : Mise à jour de l'interface

### Système de Rendu
- **PixiJS** pour le plateau de jeu (WebGL)
- **Canvas 2D** pour les particules
- Cache de graphiques pour optimiser les performances
- Animations fluides avec `requestAnimationFrame`

## 🔧 Technologies Utilisées

- **TypeScript 5.3** - Langage
- **PixiJS 7.3** - Moteur de rendu WebGL
- **Vite 5.0** - Build tool et dev server
- **Express 4.18** - Serveur API
- **Web Audio API** - Synthèse sonore

## 📊 Système de Scoring

| Action | Points |
|--------|--------|
| 1 ligne | 100 × niveau |
| 2 lignes | 300 × niveau |
| 3 lignes | 500 × niveau |
| 4 lignes (Tetris) | 800 × niveau |
| Combo | +50 × niveau par ligne consécutive |
| Hard Drop | +2 par cellule |
| Back-to-Back Tetris | ×1.5 multiplicateur |

## 🎨 Thèmes

4 thèmes visuels sont disponibles :
- **Classique** - Couleurs vives traditionnelles
- **Néon** - Style cyberpunk avec effets lumineux
- **Rétro** - Inspiré de la Game Boy
- **Sombre** - Palette moderne et sobre

## 🚀 Performance

- Rendu WebGL via PixiJS pour des performances maximales
- 60 FPS constant même avec de nombreuses particules
- Cache des graphiques pour réduire les allocations mémoire
- Code TypeScript optimisé et type-safe

## 📝 Scripts NPM

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
npm start        # Démarrer le serveur API uniquement
```

## 🐛 Debug

L'application expose un objet global `tetrisApp` dans la console pour le débogage :

```javascript
// Dans la console du navigateur
tetrisApp.game.stats  // Voir les statistiques
tetrisApp.game.board  // Voir l'état du plateau
```

## 📄 Licence

MIT

## 🎮 Améliorations Futures

- [ ] Mode multijoueur en ligne
- [ ] Replays et sauvegarde de parties
- [ ] Challenges quotidiens
- [ ] Leaderboards globaux
- [ ] Support mobile avec contrôles tactiles
- [ ] Plus de modes de jeu (Sprint, Marathon, etc.)

---

**Développé avec ❤️ en TypeScript + PixiJS**
