# Jeu Tetris

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec Node.js, TypeScript et PixiJS (WebGL).

## Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Compilez le code TypeScript :
   ```bash
   npm run build
   ```

## Lancement

```bash
# Compiler en mode développement (avec watch)
npm run watch

# Compiler en mode production
npm run build

# Démarrer le serveur
npm start

# Mode développement avec recompilation automatique
npm run dev
```

Le jeu sera accessible à l'adresse : http://localhost:3000

## Fonctionnalités

- ✅ 7 types de pièces Tetris classiques
- ✅ Rotation dans les deux sens
- ✅ Système de ghost piece (prévisualisation)
- ✅ Détection des collisions
- ✅ Système de scoring avec multiplicateurs
- ✅ Niveaux de difficulté progressifs
- ✅ High scores persistants
- ✅ Contrôles clavier configurables
- ✅ Interface responsive

## Contrôles

- **Flèche gauche** : Déplacer à gauche
- **Flèche droite** : Déplacer à droite
- **Flèche bas** : Accélérer la descente
- **Flèche haut** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace** : Hard drop (chute immédiate)
- **P** : Pause/Reprendre

## Structure du projet

```
tetris/
├── src/                    # Code source TypeScript
│   ├── index.ts           # Point d'entrée principal
│   ├── game.ts            # Logique principale du jeu
│   ├── pieces.ts          # Définition des pièces
│   ├── renderer.ts        # Rendu PixiJS/WebGL
│   ├── controls.ts        # Gestion des contrôles
│   ├── audio.ts           # Gestionnaire audio
│   ├── particles.ts       # Système de particules PixiJS
│   ├── themes.ts          # Gestionnaire de thèmes
│   └── config.ts          # Configuration du jeu
├── public/
│   ├── index.html         # Page principale
│   ├── css/style.css      # Styles CSS
│   └── js/
│       └── bundle.js      # Bundle compilé (généré)
├── server.js              # Serveur Node.js
├── package.json           # Configuration npm
├── tsconfig.json          # Configuration TypeScript
├── webpack.config.js      # Configuration Webpack
└── README.md             # Documentation
```

## Technologies utilisées

- **TypeScript** : Typage statique
- **PixiJS 7** : Rendu WebGL accéléré par GPU
- **Webpack** : Bundler et compilation
- **Node.js/Express** : Serveur backend
