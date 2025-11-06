# Tetris Pro - TypeScript + WebGL (PixiJS)

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec TypeScript et PixiJS pour le rendu WebGL.

## 🚀 Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🎮 Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev

# Build pour production
npm run build

# Prévisualiser le build de production
npm run preview

# Lancer le serveur de production
npm start
```

Le jeu sera accessible à l'adresse : http://localhost:3000

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
- ✅ Rendu WebGL avec PixiJS pour de meilleures performances
- ✅ Système de particules pour effets visuels
- ✅ Gestionnaire de thèmes
- ✅ Audio avec Web Audio API

## 🎯 Contrôles

- **Flèche gauche** : Déplacer à gauche
- **Flèche droite** : Déplacer à droite
- **Flèche bas** : Accélérer la descente
- **Flèche haut** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace / Entrée** : Hard drop (chute immédiate)
- **C** : Hold (mettre en réserve)
- **P** : Pause/Reprendre

## 📁 Structure du projet

```
tetris/
├── src/                    # Code source TypeScript
│   ├── game/              # Logique du jeu
│   │   ├── game.ts        # Classe principale TetrisGame
│   │   └── constants.ts   # Constantes du jeu
│   ├── pieces/            # Définition des pièces
│   ├── render/            # Système de rendu PixiJS
│   ├── controls/          # Gestion des contrôles
│   ├── audio/             # Gestionnaire audio
│   ├── particles/         # Système de particules
│   ├── themes/            # Gestionnaire de thèmes
│   └── main.ts            # Point d'entrée
├── public/                # Fichiers statiques
│   ├── index.html         # Page principale
│   ├── css/              # Styles CSS
│   └── js/               # (Anciens fichiers JS - à supprimer)
├── dist/                  # Build de production (généré)
├── server.js              # Serveur Node.js/Express
├── package.json           # Configuration npm
├── tsconfig.json          # Configuration TypeScript
├── vite.config.ts         # Configuration Vite
└── README.md              # Documentation
```

## 🛠️ Technologies

- **TypeScript** : Langage de programmation typé
- **PixiJS 7** : Bibliothèque de rendu WebGL/Canvas
- **Vite** : Build tool et serveur de développement
- **Express** : Serveur Node.js pour l'API
- **Web Audio API** : Audio du jeu

## 📝 Scripts disponibles

- `npm run dev` : Lance le serveur de développement Vite avec hot-reload
- `npm run build` : Compile TypeScript et build le projet pour la production
- `npm run preview` : Prévisualise le build de production
- `npm start` : Lance le serveur de production Express

## 🎨 Thèmes

Le jeu inclut plusieurs thèmes :
- **Classique** : Thème par défaut
- **Néon** : Thème avec effets de lueur
- **Rétro** : Style pixel art
- **Sombre** : Thème sombre moderne

## 🔧 Développement

Le projet utilise :
- **TypeScript** pour la sécurité de type
- **Vite** pour le développement rapide avec HMR
- **PixiJS** pour le rendu WebGL performant
- **ES Modules** pour une structure modulaire

## 📦 Build

Pour créer un build de production :

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`.
