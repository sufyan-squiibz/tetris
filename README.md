# Tetris Pro - TypeScript + PixiJS (WebGL)

Un jeu Tetris moderne et performant développé avec TypeScript et PixiJS pour un rendu accéléré par WebGL.

## 🚀 Nouvelles Fonctionnalités

### Migration vers TypeScript + PixiJS
- ✅ **TypeScript** : Code entièrement typé pour une meilleure maintenabilité
- ✅ **PixiJS** : Rendu WebGL haute performance
- ✅ **Vite** : Build ultra-rapide et Hot Module Replacement (HMR)
- ✅ **Architecture modulaire** : Code organisé en modules ES6

## 📦 Installation

```bash
npm install
```

## 🎮 Démarrage

### Mode Développement
```bash
npm run dev
```
Le jeu sera accessible sur `http://localhost:3000` avec rechargement automatique.

### Build Production
```bash
npm run build
```
Les fichiers compilés seront dans le dossier `dist/`.

### Prévisualiser le Build
```bash
npm run preview
```

### Serveur API (optionnel)
Pour le système de scores :
```bash
npm run server
```

## 🏗️ Structure du Projet

```
/workspace
├── src/                    # Code source TypeScript
│   ├── main.ts            # Point d'entrée principal
│   ├── game.ts            # Logique du jeu
│   ├── renderer.ts        # Rendu PixiJS (WebGL)
│   ├── pieces.ts          # Définition des pièces Tetris
│   ├── controls.ts        # Gestion des contrôles clavier
│   ├── particles.ts       # Système de particules
│   ├── themes.ts          # Gestionnaire de thèmes
│   ├── audio.ts           # Gestionnaire audio
│   ├── types.ts           # Définitions TypeScript
│   ├── constants.ts       # Constantes du jeu
│   ├── utils.ts           # Fonctions utilitaires
│   └── style.css          # Import du CSS
├── public/                # Ressources statiques
│   ├── css/
│   │   └── style.css      # Styles CSS
│   └── index.html         # (ancien - non utilisé)
├── index.html             # HTML principal (racine)
├── tsconfig.json          # Configuration TypeScript
├── vite.config.ts         # Configuration Vite
├── package.json           # Dépendances et scripts
└── server.js              # Serveur Express (API scores)
```

## 🎯 Fonctionnalités du Jeu

### Gameplay
- **7 pièces Tetris classiques** avec système de rotation
- **Ghost piece** : Aperçu de la position de chute
- **Hold** : Réserver une pièce pour plus tard (touche C)
- **Preview** : Voir les 3 prochaines pièces
- **Hard Drop** : Chute instantanée (Espace/Entrée)

### Contrôles
- `←` `→` : Déplacer gauche/droite
- `↓` : Descente rapide (soft drop)
- `↑` : Rotation horaire
- `Z` : Rotation anti-horaire
- `Espace` / `Entrée` : Chute immédiate (hard drop)
- `C` : Hold - Mettre en réserve
- `P` : Pause

### Scoring
- **1 ligne** : 100 pts × niveau
- **2 lignes** : 300 pts × niveau
- **3 lignes** : 500 pts × niveau
- **4 lignes (Tetris)** : 800 pts × niveau
- **Combo** : +50 pts par ligne consécutive
- **Hard Drop** : +2 pts par cellule
- **Back-to-Back Tetris** : Bonus de 50%

### Fonctionnalités Pro
- 🎨 **4 thèmes visuels** (Classique, Néon, Rétro, Sombre)
- 📊 **Statistiques en temps réel** (PPS, Combo, Tetris)
- 🎵 **Audio procédural** (synthèse de sons)
- ✨ **Effets de particules** pour les lignes et combos
- ⚙️ **Sensibilité ajustable** des contrôles
- 🏆 **Top 5 des meilleurs scores**
- 💾 **Sauvegarde locale** des préférences

## 🔧 Technologies Utilisées

- **TypeScript 5.9+** : Langage typé
- **PixiJS 8.14+** : Moteur de rendu WebGL 2D
- **Vite 7.2+** : Build tool moderne
- **Express 4.18** : Serveur API (optionnel)
- **Web Audio API** : Synthèse audio en temps réel

## 🎨 Améliorations WebGL (PixiJS)

Le passage à PixiJS apporte plusieurs avantages :

1. **Performance** : Rendu accéléré par GPU via WebGL
2. **Fluidité** : 60 FPS constants même avec effets
3. **Effets visuels** : Possibilité d'ajouter shaders et filtres
4. **Scalabilité** : Meilleure gestion des résolutions variées
5. **Batching automatique** : Optimisation du rendu

## 📝 Notes de Migration

### Changements Majeurs
- **Rendu** : Canvas 2D → PixiJS WebGL
- **Modules** : Scripts globaux → Modules ES6
- **Types** : JavaScript → TypeScript
- **Build** : Aucun bundler → Vite

### Compatibilité
- Tous les navigateurs modernes supportant WebGL
- Fallback automatique vers Canvas 2D si WebGL indisponible

## 🐛 Développement

### Linter TypeScript
```bash
npx tsc --noEmit
```

### Hot Module Replacement
Le mode dev inclut HMR - les modifications sont reflétées instantanément sans recharger la page.

## 📄 Licence

MIT License - Libre d'utilisation et de modification.

---

**Version** : 2.0.0  
**Moteur** : TypeScript + PixiJS  
**Build Tool** : Vite
