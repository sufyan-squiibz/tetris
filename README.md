# Tetris Pro - TypeScript + PixiJS

Un jeu Tetris moderne développé avec TypeScript et rendu avec PixiJS (WebGL) pour des performances optimales.

## 🚀 Technologies

- **TypeScript** - Typage statique pour un code plus robuste
- **PixiJS** - Moteur de rendu WebGL haute performance
- **Webpack** - Bundler et système de build
- **Node.js + Express** - Serveur backend pour les scores
- **Canvas API** - Pour les éléments UI complémentaires

## 📦 Installation

1. Clonez le dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🎮 Lancement

### Mode développement
```bash
npm run dev
```
Cette commande lance :
- Le serveur Express sur le port 3000
- Le serveur de développement Webpack sur le port 3001 avec hot reload

Accédez au jeu sur : **http://localhost:3001**

### Mode production
```bash
npm run build
npm start
```
Le build de production génère les fichiers optimisés dans le dossier `dist/`.

Accédez au jeu sur : **http://localhost:3000**

## 📝 Scripts disponibles

- `npm run build` - Build de production (minifié)
- `npm run build:dev` - Build de développement (avec source maps)
- `npm run dev` - Mode développement avec hot reload
- `npm start` - Lance le serveur Express
- `npm run server` - Lance uniquement le serveur (sans webpack)
- `npm run webpack-dev` - Lance uniquement webpack dev server

## ✨ Fonctionnalités

### Gameplay
- ✅ 7 types de pièces Tetris classiques avec système de bag
- ✅ Rotation dans les deux sens (horaire et anti-horaire)
- ✅ Ghost piece (prévisualisation de la chute)
- ✅ Hold system (réserver une pièce)
- ✅ Preview des 3 prochaines pièces
- ✅ Hard drop et soft drop
- ✅ Détection de collisions optimisée

### Scoring
- ✅ Système de scoring avec multiplicateurs de niveau
- ✅ Bonus Tetris (4 lignes)
- ✅ Système de combo
- ✅ Back-to-back bonus
- ✅ Points pour hard drop

### UI/UX
- ✅ Rendu WebGL avec PixiJS pour des performances fluides
- ✅ Système de particules pour les effets visuels
- ✅ 4 thèmes visuels (Classique, Néon, Rétro, Sombre)
- ✅ Contrôles de sensibilité ajustables
- ✅ Statistiques en temps réel (PPS, combo, temps de jeu)
- ✅ Tableau des meilleurs scores (top 5)
- ✅ Mode plein écran
- ✅ Tutoriel interactif

### Audio
- ✅ Effets sonores (Web Audio API)
- ✅ Musique de fond optionnelle
- ✅ Contrôles audio séparés

## 🎯 Contrôles

| Touche | Action |
|--------|--------|
| ← → | Déplacer latéralement |
| ↓ | Descente rapide (soft drop) |
| ↑ | Rotation horaire |
| Z | Rotation anti-horaire |
| Espace / Entrée | Chute immédiate (hard drop) |
| C | Hold - Mettre en réserve |
| P | Pause |
| F1 | Aide |

## 📊 Scoring

- **1 ligne** = 100 pts × niveau
- **2 lignes** = 300 pts × niveau
- **3 lignes** = 500 pts × niveau
- **4 lignes (Tetris)** = 800 pts × niveau
- **Combo** = +50 pts × niveau par ligne consécutive
- **Hard Drop** = +2 pts par cellule

## 🏗️ Architecture du projet

```
tetris-game/
├── src/                    # Code source TypeScript
│   ├── index.ts           # Point d'entrée
│   ├── game.ts            # Logique principale du jeu
│   ├── pieces.ts          # Définition des pièces Tetris
│   ├── renderer.ts        # Système de rendu PixiJS
│   ├── controls.ts        # Gestion des contrôles
│   ├── audio.ts           # Gestionnaire audio
│   ├── particles.ts       # Système de particules
│   ├── themes.ts          # Gestionnaire de thèmes
│   ├── types.ts           # Types TypeScript
│   └── utils.ts           # Fonctions utilitaires
├── public/                # Fichiers statiques
│   ├── index.html         # Template HTML
│   └── css/
│       └── style.css      # Styles CSS
├── dist/                  # Build de production (généré)
├── server.js              # Serveur Express
├── webpack.config.js      # Configuration Webpack
├── tsconfig.json          # Configuration TypeScript
└── package.json           # Dépendances et scripts

```

## 🔧 Configuration

### TypeScript
Le projet utilise des règles strictes TypeScript pour garantir la qualité du code :
- Mode strict activé
- Vérification complète des null/undefined
- Pas de any implicite

### Webpack
- Dev server avec hot reload sur le port 3001
- Proxy API vers le serveur Express (port 3000)
- Source maps pour le debugging
- Optimisation automatique en production

## 🎨 PixiJS

Le jeu utilise PixiJS v8 pour le rendu WebGL :
- Rendu haute performance avec accélération matérielle
- Gestion efficace des sprites et containers
- Effets visuels fluides (ghost piece, animations)
- Support du retina display

## 📈 Améliorations futures possibles

- [ ] Mode multijoueur
- [ ] Système de replays
- [ ] Plus de modes de jeu (Marathon, Sprint, Ultra)
- [ ] Leaderboard en ligne
- [ ] Support mobile avec contrôles tactiles
- [ ] Plus de thèmes et skins
- [ ] Personnalisation des contrôles
- [ ] Achievements/trophées

## 📄 Licence

MIT

## 👨‍💻 Développement

Le projet a été migré de JavaScript vanilla vers TypeScript + PixiJS pour :
- Améliorer la maintenabilité du code avec le typage statique
- Optimiser les performances avec le rendu WebGL
- Faciliter l'ajout de nouvelles fonctionnalités
- Moderniser l'architecture du projet
