# 🎮 Tetris Pro - TypeScript + PixiJS Edition

Jeu Tetris moderne développé avec **TypeScript** et **PixiJS (WebGL)** pour des performances optimales.

## ✨ Caractéristiques

### Technologies
- 🔷 **TypeScript** - Code typé et sécurisé
- 🎨 **PixiJS** - Rendu WebGL haute performance
- ⚡ **Vite** - Build system ultra-rapide
- 🎯 **Architecture modulaire** - Code organisé et maintenable

### Fonctionnalités du jeu
- 🎮 Contrôles fluides et réactifs avec sensibilité ajustable
- 👻 Ghost piece (prévisualisation de la chute)
- 📦 Système de Hold (réserve de pièce)
- 👁️ Prévisualisation de 3 pièces suivantes
- 🎨 Système de thèmes (Classique, Néon, Rétro, Sombre)
- 📊 Statistiques en temps réel (PPS, combos, temps)
- 🏆 Système de high scores avec API
- ✨ Effets visuels et particules
- 🔊 Sons et musique (Web Audio API)
- 📱 Responsive et plein écran

## 🚀 Installation et Démarrage

### Installation des dépendances
```bash
npm install
```

### Mode développement
```bash
npm run dev
```
Le jeu sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```
Les fichiers optimisés seront générés dans le dossier `dist/`

### Prévisualisation du build
```bash
npm run preview
```

### Serveur API (scores)
```bash
npm run server
```
Démarre le serveur Express pour l'API des scores sur le port 3001

## 📂 Structure du projet

```
/workspace
├── src/                    # Code source TypeScript
│   ├── main.ts            # Point d'entrée principal
│   ├── game.ts            # Logique du jeu
│   ├── renderer.ts        # Rendu PixiJS/WebGL
│   ├── pieces.ts          # Définition des pièces Tetris
│   ├── controls.ts        # Gestion des contrôles clavier
│   ├── themes.ts          # Système de thèmes
│   ├── particles.ts       # Système de particules
│   ├── audio.ts           # Gestionnaire audio
│   ├── ui.ts              # Gestion de l'interface
│   ├── types.ts           # Types TypeScript
│   └── constants.ts       # Constantes du jeu
├── public/                 # Fichiers statiques
│   ├── css/
│   │   └── style.css      # Styles CSS
│   └── index.html         # HTML (ancien, pour référence)
├── index.html             # Nouveau HTML pour Vite
├── dist/                  # Build de production (généré)
├── server.js              # Serveur Express pour l'API
├── tsconfig.json          # Configuration TypeScript
├── vite.config.ts         # Configuration Vite
└── package.json           # Dépendances NPM
```

## 🎮 Contrôles

| Touche | Action |
|--------|--------|
| ← → | Déplacer latéralement |
| ↓ | Descente rapide (soft drop) |
| ↑ | Rotation horaire |
| Z | Rotation anti-horaire |
| Espace / Entrée | Chute immédiate (hard drop) |
| C | Hold - Mettre en réserve |
| P | Pause |

## 💯 Système de scoring

- **1 ligne** = 100 pts × niveau
- **2 lignes** = 300 pts × niveau
- **3 lignes** = 500 pts × niveau
- **4 lignes (Tetris)** = 800 pts × niveau
- **Combo** = +50 pts par ligne consécutive
- **Hard Drop** = +2 pts par cellule
- **Back-to-Back Tetris** = ×1.5 multiplicateur

## 🔧 Configuration

### Sensibilité des contrôles
Ajustable dans l'interface (10ms - 100ms)
- Très rapide: 10ms
- Normal: 30ms
- Lent: 50ms

### Thèmes disponibles
1. **Classique** - Couleurs originales du Tetris
2. **Néon** - Style cyberpunk avec effets glow
3. **Rétro** - Style Game Boy monochrome
4. **Sombre** - Design moderne et élégant

## 🛠️ Technologies utilisées

- **TypeScript 5.9+** - Langage de programmation
- **PixiJS 8.0+** - Bibliothèque de rendu WebGL
- **Vite 7.0+** - Build tool et dev server
- **Express 4.18+** - Serveur API backend
- **Web Audio API** - Sons et musique
- **Canvas API** - Rendu des previews (fallback)

## 📊 Statistiques en temps réel

- ⏱️ **Temps de jeu** - Chronomètre
- ⚡ **PPS** - Pièces par seconde
- 🔥 **Combo** - Lignes consécutives effacées
- 🏆 **Max Combo** - Record de combo
- 💎 **Tetris** - Nombre de 4 lignes

## 🎯 Migration depuis JavaScript

Ce projet a été migré depuis une version JavaScript vers TypeScript + PixiJS pour :
- ✅ Meilleure maintenabilité avec le typage
- ✅ Performances accrues avec WebGL
- ✅ Architecture plus modulaire
- ✅ Développement plus rapide avec Vite
- ✅ Moins d'erreurs grâce au typage statique

## 📝 Notes de développement

### Avantages de PixiJS sur Canvas natif
- Rendu GPU accéléré (WebGL)
- Meilleure gestion des sprites et textures
- Optimisations automatiques
- API plus intuitive
- Support multi-plateforme

### Architecture TypeScript
- Types stricts pour éviter les erreurs
- Interfaces claires pour chaque composant
- Séparation des responsabilités
- Code auto-documenté
- Refactoring facilité

## 🐛 Débogage

Les objets suivants sont exposés globalement en mode développement :
- `window.game` - Instance du jeu
- `window.renderer` - Renderer PixiJS
- `window.themeManager` - Gestionnaire de thèmes
- `window.audioManager` - Gestionnaire audio

## 📄 Licence

MIT License

## 👨‍💻 Auteur

Projet Tetris Pro - Édition TypeScript + PixiJS

---

**Bon jeu ! 🎮✨**
