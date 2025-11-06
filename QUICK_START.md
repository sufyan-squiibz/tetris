# 🚀 Quick Start - Tetris Pro (TypeScript + PixiJS)

## Installation Rapide

\`\`\`bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement
npm run dev
\`\`\`

Le jeu s'ouvre automatiquement sur **http://localhost:3000**

## Commandes Principales

| Commande | Description |
|----------|-------------|
| \`npm run dev\` | Mode développement avec hot reload |
| \`npm run build\` | Build de production |
| \`npm run preview\` | Preview du build |
| \`npm start\` | Lancer le serveur API |

## Structure Simplifiée

\`\`\`
workspace/
├── src/              # Code TypeScript
│   ├── game/         # Logique du jeu
│   ├── renderer/     # Rendu PixiJS
│   ├── systems/      # Systèmes (audio, contrôles, etc.)
│   └── main.ts       # Point d'entrée
├── public/           # Fichiers statiques
├── dist/             # Build de production
└── server.js         # API Express
\`\`\`

## Technologies

- **TypeScript 5.3** - Typage fort
- **PixiJS 7.3** - Rendu WebGL
- **Vite 5.0** - Build tool

## Contrôles

- **← →** : Déplacer
- **↓** : Descente rapide
- **↑** : Rotation
- **Z** : Rotation inverse
- **Espace** : Chute immédiate
- **C** : Hold
- **P** : Pause

## 🎮 Prêt à jouer !

Lancez \`npm run dev\` et amusez-vous ! 🎉
