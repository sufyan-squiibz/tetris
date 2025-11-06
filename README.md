# Jeu Tetris Pro

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec **TypeScript** et **PixiJS (WebGL)**.

## 🚀 Technologies

- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **PixiJS v7** : Rendu WebGL haute performance
- **Webpack** : Bundling et compilation
- **Node.js + Express** : Serveur backend

## 📦 Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🛠️ Développement

```bash
# Compiler le TypeScript en mode développement (avec watch)
npm run watch

# Dans un autre terminal, lancer le serveur
npm run dev
```

Le jeu sera accessible à l'adresse : http://localhost:3000

## 🏗️ Build de production

```bash
# Compiler pour la production
npm run build

# Lancer le serveur
npm start
```

## ✨ Fonctionnalités

- ✅ 7 types de pièces Tetris classiques
- ✅ Rotation dans les deux sens
- ✅ Système de ghost piece (prévisualisation)
- ✅ Détection des collisions
- ✅ Système de scoring avec multiplicateurs
- ✅ Niveaux de difficulté progressifs
- ✅ High scores persistants
- ✅ Contrôles clavier configurables
- ✅ Interface responsive
- ✅ **Rendu WebGL avec PixiJS** pour de meilleures performances
- ✅ **TypeScript** pour une meilleure qualité de code

## 🎮 Contrôles

- **Flèche gauche** : Déplacer à gauche
- **Flèche droite** : Déplacer à droite
- **Flèche bas** : Accélérer la descente
- **Flèche haut** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace** : Hard drop (chute immédiate)
- **C** : Hold (mettre en réserve)
- **P** : Pause/Reprendre

## 📁 Structure du projet

```
tetris/
├── src/                    # Code source TypeScript
│   ├── main.ts            # Point d'entrée principal
│   ├── game.ts            # Logique principale du jeu
│   ├── pieces.ts          # Définition des pièces
│   ├── renderer.ts        # Rendu PixiJS (WebGL)
│   ├── controls.ts        # Gestion des contrôles
│   ├── audio.ts           # Gestionnaire audio
│   ├── particles.ts       # Système de particules
│   ├── themes.ts          # Gestionnaire de thèmes
│   └── types.ts           # Définitions de types
├── public/
│   ├── index.html         # Page principale
│   ├── css/style.css      # Styles CSS
│   └── js/
│       └── bundle.js      # Bundle compilé (généré)
├── server.js              # Serveur Node.js
├── webpack.config.js      # Configuration Webpack
├── tsconfig.json          # Configuration TypeScript
├── package.json           # Configuration npm
└── README.md             # Documentation
```

## 🔧 Scripts disponibles

- `npm start` : Lancer le serveur en production
- `npm run dev` : Lancer le serveur en mode développement avec nodemon
- `npm run build` : Compiler TypeScript pour la production
- `npm run build:dev` : Compiler TypeScript en mode développement
- `npm run watch` : Compiler TypeScript en mode watch (recompilation automatique)
