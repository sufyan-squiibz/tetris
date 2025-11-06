# Jeu Tetris

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec **TypeScript**, **PixiJS (WebGL)** et **Node.js**.

## 🚀 Technologies

- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **PixiJS 7** : Rendu WebGL haute performance
- **Vite** : Build tool moderne et rapide
- **Node.js + Express** : Serveur backend

## 📦 Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🎮 Lancement

```bash
# Mode développement (serveur + client avec hot-reload)
npm run dev

# Mode production (build puis serveur)
npm run build
npm start
```

Le jeu sera accessible à l'adresse : http://localhost:5173 (dev) ou http://localhost:3000 (production)

## ✨ Fonctionnalités

- ✅ 7 types de pièces Tetris classiques
- ✅ Rotation dans les deux sens
- ✅ Système de ghost piece (prévisualisation)
- ✅ Système de Hold (réserve de pièce)
- ✅ Preview des 3 prochaines pièces
- ✅ Détection des collisions
- ✅ Système de scoring avec multiplicateurs
- ✅ Système de combo
- ✅ Niveaux de difficulté progressifs
- ✅ High scores persistants
- ✅ Contrôles clavier configurables
- ✅ Interface responsive
- ✅ Système de particules pour effets visuels
- ✅ Thèmes personnalisables
- ✅ Audio avec Web Audio API

## 🎯 Contrôles

- **Flèche gauche** : Déplacer à gauche
- **Flèche droite** : Déplacer à droite
- **Flèche bas** : Accélérer la descente (soft drop)
- **Flèche haut** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace / Entrée** : Hard drop (chute immédiate)
- **C** : Hold (mettre en réserve)
- **P** : Pause/Reprendre

## 📁 Structure du projet

```
tetris/
├── src/                    # Code source TypeScript
│   ├── main.ts            # Point d'entrée
│   ├── game.ts            # Logique principale du jeu
│   ├── pieces.ts          # Définition des pièces
│   ├── render.ts          # Rendu PixiJS (WebGL)
│   ├── controls.ts        # Gestion des contrôles
│   ├── audio.ts           # Gestionnaire audio
│   ├── particles.ts        # Système de particules
│   ├── themes.ts          # Gestionnaire de thèmes
│   └── types.ts           # Types TypeScript
├── public/
│   ├── index.html         # Page principale
│   ├── css/style.css      # Styles CSS
│   └── js/                # Anciens fichiers JS (conservés pour référence)
├── dist/                  # Build de production (généré)
├── server.js              # Serveur Node.js
├── vite.config.ts         # Configuration Vite
├── tsconfig.json          # Configuration TypeScript
├── package.json           # Configuration npm
└── README.md              # Documentation
```

## 🛠️ Scripts disponibles

- `npm run dev` : Lance le serveur et le client en mode développement
- `npm run dev:server` : Lance uniquement le serveur Node.js
- `npm run dev:client` : Lance uniquement Vite (client)
- `npm run build` : Compile TypeScript et build avec Vite
- `npm start` : Lance le serveur en mode production
- `npm run preview` : Prévisualise le build de production

## 🎨 Rendu WebGL

Le jeu utilise **PixiJS** pour le rendu WebGL, offrant :
- Performance optimale même avec de nombreux éléments
- Effets visuels fluides
- Support automatique du GPU
- Rendu haute résolution (retina displays)
