# Tetris Pro - TypeScript + PixiJS Edition 🎮

Version moderne du jeu Tetris classique, entièrement réécrit en **TypeScript** avec **PixiJS** pour le rendu WebGL haute performance.

## 🚀 Nouvelles Technologies

- **TypeScript** : Code typé et maintenable
- **PixiJS 7** : Rendu WebGL haute performance
- **Vite** : Bundler ultra-rapide avec HMR
- **Architecture modulaire** : Code organisé et réutilisable

## ✨ Fonctionnalités

### Gameplay Complet
- ✅ Système de pièces Tetris classique (7 pièces)
- ✅ Rotation dans les deux sens (↑ et Z)
- ✅ Hard Drop (Espace/Entrée)
- ✅ Hold Piece (C) - Réservez une pièce pour plus tard
- ✅ Ghost Piece - Prévisualisation de la position finale
- ✅ Preview des 3 prochaines pièces
- ✅ Système de scoring avec combos
- ✅ Progression par niveaux
- ✅ Back-to-back Tetris bonus

### Interface Moderne
- 🎨 4 thèmes visuels (Classique, Néon, Rétro, Sombre)
- 🎵 Effets sonores et musique
- ✨ Système de particules avec PixiJS
- 📊 Statistiques en temps réel (PPS, combos, temps)
- 🏆 Système de high scores
- ⚙️ Sensibilité des contrôles ajustable
- 📱 Support plein écran

### Performance
- 🚀 Rendu WebGL via PixiJS
- ⚡ 60 FPS stable
- 🎯 Contrôles ultra-réactifs
- 💾 Sauvegarde locale des préférences

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

## 🎮 Développement

```bash
# Lancer le mode développement (serveur + client avec HMR)
npm run dev

# Ou lancer séparément :
npm run dev:server  # Serveur backend (port 3001)
npm run dev:client  # Client Vite (port 3000)
```

Le jeu sera accessible sur `http://localhost:3000`

## 🏗️ Build Production

```bash
# Compiler TypeScript et construire le bundle
npm run build

# Prévisualiser le build
npm run preview

# Lancer en production
npm start
```

## 🎯 Contrôles

| Touche | Action |
|--------|--------|
| ← → | Déplacer la pièce |
| ↓ | Descente rapide (soft drop) |
| ↑ | Rotation horaire |
| Z | Rotation anti-horaire |
| Espace / Entrée | Chute immédiate (hard drop) |
| C | Hold - Mettre en réserve |
| P | Pause |

## 📊 Système de Score

- **1 ligne** : 100 pts × niveau
- **2 lignes** : 300 pts × niveau
- **3 lignes** : 500 pts × niveau
- **4 lignes (Tetris)** : 800 pts × niveau
- **Combo** : +50 pts par ligne consécutive × niveau
- **Hard Drop** : +2 pts par cellule
- **Back-to-back Tetris** : +50% bonus

## 🏗️ Architecture du Projet

```
/workspace
├── src/
│   ├── game/
│   │   ├── types.ts          # Types TypeScript
│   │   ├── Piece.ts          # Définition des pièces
│   │   ├── Renderer.ts       # Rendu PixiJS (WebGL)
│   │   ├── TetrisGame.ts     # Logique du jeu
│   │   └── Controls.ts       # Gestion des contrôles
│   ├── utils/
│   │   ├── AudioManager.ts   # Gestion audio
│   │   ├── ThemeManager.ts   # Gestion des thèmes
│   │   └── ParticleSystem.ts # Particules PixiJS
│   ├── main.ts              # Point d'entrée
│   └── index.html           # HTML principal
├── public/
│   └── css/
│       └── style.css        # Styles CSS
├── server.js                # Serveur Express
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
└── package.json
```

## 🎨 Technologies Utilisées

- **TypeScript 5.3** - Typage statique
- **PixiJS 7.3** - Rendu WebGL 2D
- **Vite 5** - Bundler et dev server
- **Express 4** - Serveur backend
- **Web Audio API** - Sons et musique

## 🔧 Scripts Disponibles

- `npm run dev` - Mode développement (backend + frontend)
- `npm run dev:server` - Serveur backend uniquement
- `npm run dev:client` - Client Vite uniquement
- `npm run build` - Build production
- `npm run preview` - Prévisualiser le build
- `npm start` - Lancer le serveur production

## 🎯 Optimisations

### WebGL avec PixiJS
Le rendu utilise maintenant PixiJS pour bénéficier de l'accélération matérielle WebGL :
- Dessin des blocs optimisé
- Système de particules performant
- Ghost piece sans impact sur les performances
- Animations fluides à 60 FPS

### TypeScript
- Typage fort pour éviter les bugs
- IntelliSense dans les IDE
- Meilleure maintenabilité
- Code auto-documenté

### Architecture Modulaire
- Séparation claire des responsabilités
- Composants réutilisables
- Facile à étendre et modifier

## 📝 Notes de Migration

### Changements par rapport à la version JavaScript

1. **Rendu Canvas → PixiJS WebGL**
   - Amélioration des performances
   - Meilleur support des effets visuels
   - Préparation pour de futures améliorations graphiques

2. **Structure du Code**
   - Code organisé en modules ES6
   - Types TypeScript pour la sécurité
   - Pattern de conception orienté objet

3. **Build Process**
   - Vite remplace le chargement direct de scripts
   - Hot Module Replacement en développement
   - Optimisation automatique en production

## 🐛 Développement

Pour contribuer ou modifier le jeu :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 🎉 Crédits

Développé avec ❤️ en TypeScript + PixiJS
