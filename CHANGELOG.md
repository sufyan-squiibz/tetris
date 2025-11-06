# Changelog - Tetris Pro

## [2.0.0] - 2025-11-06

### 🚀 MIGRATION MAJEURE : TypeScript + PixiJS

#### Added
- ✨ **TypeScript** : Projet entièrement migré vers TypeScript avec types stricts
- ✨ **PixiJS** : Rendu WebGL haute performance (GPU)
- ✨ **Vite** : Build tool moderne avec HMR
- ✨ **Architecture modulaire** : Modules ES6 avec imports/exports
- ✨ 12 nouveaux fichiers TypeScript dans `/src`
- ✨ Configuration TypeScript (`tsconfig.json`)
- ✨ Configuration Vite (`vite.config.ts`)
- ✨ Documentation complète (README.md, QUICKSTART.md, MIGRATION.md)
- ✨ Support `.gitignore` pour TypeScript/Vite

#### Changed
- 🔄 Rendu Canvas 2D → PixiJS WebGL
- 🔄 Scripts globaux → Modules ES6
- 🔄 JavaScript → TypeScript
- 🔄 `package.json` : version 1.0.0 → 2.0.0
- 🔄 Scripts npm : `dev` utilise maintenant Vite
- 🔄 Structure : Code source déplacé dans `/src`
- 🔄 HTML principal : `public/index.html` → `index.html` (racine)

#### Improved
- ⚡ Performance : 60 FPS constants avec WebGL
- ⚡ Build optimisé : ~244 KB (76 KB gzippé)
- ⚡ Développement : Hot Module Replacement
- ⚡ Types : IntelliSense complet dans VS Code
- ⚡ Maintenabilité : Code mieux organisé et typé

#### Maintained
- ✅ Toutes les fonctionnalités originales préservées
- ✅ 7 pièces Tetris classiques
- ✅ Ghost piece et Hold system
- ✅ Preview (3 pièces suivantes)
- ✅ Système de scoring et combos
- ✅ 4 thèmes visuels
- ✅ Système de particules
- ✅ Audio procédural
- ✅ Contrôles avec sensibilité ajustable
- ✅ High scores via API
- ✅ Plein écran et tutoriel
- ✅ Compatible avec l'ancien système de sauvegarde

#### Technical Details
- **Dependencies added**:
  - `pixi.js@^8.14.0` (production)
  - `typescript@^5.9.3` (dev)
  - `vite@^7.2.1` (dev)
  - `@types/node@^24.10.0` (dev)

- **Fichiers créés** (13 fichiers):
  - `src/main.ts` - Point d'entrée
  - `src/game.ts` - Logique du jeu
  - `src/renderer.ts` - Rendu PixiJS
  - `src/pieces.ts` - Pièces Tetris
  - `src/controls.ts` - Contrôles clavier
  - `src/particles.ts` - Système de particules
  - `src/themes.ts` - Gestionnaire de thèmes
  - `src/audio.ts` - Gestionnaire audio
  - `src/types.ts` - Types TypeScript
  - `src/constants.ts` - Constantes
  - `src/utils.ts` - Utilitaires
  - `src/style.css` - Import CSS
  - `index.html` - HTML principal

- **Fichiers de config** (3 fichiers):
  - `tsconfig.json` - Configuration TypeScript
  - `vite.config.ts` - Configuration Vite
  - `.gitignore` - Git ignore

- **Documentation** (4 fichiers):
  - `README.md` - Documentation complète
  - `QUICKSTART.md` - Guide démarrage rapide
  - `MIGRATION.md` - Rapport de migration
  - `CHANGELOG.md` - Ce fichier

#### Breaking Changes
- ⚠️ **Build requis** : Le projet nécessite maintenant `npm run build` pour la production
- ⚠️ **Node modules** : Exécuter `npm install` après pull
- ⚠️ **Structure** : Fichiers sources dans `/src` au lieu de `/public/js`

#### Migration Notes
- Les anciens fichiers JavaScript sont conservés dans `public/js/` pour référence
- Aucune migration de données nécessaire (localStorage compatible)
- Les scores et préférences existants sont préservés

---

## [1.0.0] - Avant migration

### Version JavaScript originale
- JavaScript vanilla
- Canvas 2D pour le rendu
- Scripts chargés directement via HTML
- Toutes les fonctionnalités de base implémentées

