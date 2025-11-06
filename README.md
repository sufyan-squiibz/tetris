# Jeu Tetris Pro - TypeScript + WebGL (PixiJS)

Un jeu Tetris classique avec toutes les fonctionnalités originales, migré vers **TypeScript** et utilisant **PixiJS** pour le rendu WebGL.

## 🚀 Technologies

- **TypeScript** - Typage statique et meilleure maintenabilité
- **PixiJS** - Rendu WebGL haute performance
- **Vite** - Build tool moderne et rapide
- **Node.js + Express** - Serveur backend

## 📦 Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🎮 Lancement

### Mode développement
```bash
# Lance le serveur backend ET le serveur Vite en parallèle
npm run dev

# Ou séparément :
npm run dev:server  # Serveur Express sur http://localhost:3000
npm run dev:client  # Serveur Vite sur http://localhost:5173
```

Le jeu sera accessible à l'adresse : http://localhost:5173

### Mode production
```bash
# Compile TypeScript et build avec Vite
npm run build

# Lance le serveur de production
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
- ✅ **Rendu WebGL avec PixiJS** (performances optimales)
- ✅ **Système de particules** pour effets visuels
- ✅ **Gestionnaire de thèmes** (Classique, Néon, Rétro, Sombre)
- ✅ **Audio** avec Web Audio API

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
├── src/                      # Code source TypeScript
│   ├── main.ts              # Point d'entrée principal
│   ├── game.ts              # Logique principale du jeu
│   ├── pieces.ts            # Définition des pièces
│   ├── render.ts            # Rendu PixiJS (WebGL)
│   ├── controls.ts          # Gestion des contrôles
│   ├── audio.ts             # Gestionnaire audio
│   ├── particles.ts         # Système de particules
│   ├── themes.ts            # Gestionnaire de thèmes
│   └── types.ts             # Types TypeScript
├── public/
│   ├── index.html           # Page principale
│   ├── css/style.css        # Styles CSS
│   └── js/                  # Anciens fichiers JS (conservés pour référence)
├── dist/                     # Build de production (généré)
├── server.js                # Serveur Node.js (ES modules)
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
├── package.json             # Configuration npm
└── README.md                # Documentation
```

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur backend et Vite en parallèle
- `npm run dev:server` - Lance uniquement le serveur Express
- `npm run dev:client` - Lance uniquement le serveur Vite
- `npm run build` - Compile TypeScript et build avec Vite
- `npm run preview` - Prévisualise le build de production
- `npm start` - Lance le serveur de production

## 🎨 Thèmes disponibles

- **Classique** - Thème par défaut avec couleurs traditionnelles
- **Néon** - Thème avec effets de lueur
- **Rétro** - Style Game Boy avec effet pixelisé
- **Sombre** - Thème sombre avec couleurs vives

## 🚀 Migration vers TypeScript + PixiJS

Le projet a été entièrement migré depuis JavaScript vanilla vers :

1. **TypeScript** pour un typage statique et une meilleure maintenabilité
2. **PixiJS** pour remplacer le rendu Canvas 2D par WebGL, offrant :
   - Meilleures performances
   - Rendu accéléré par GPU
   - Support des effets visuels avancés

## 📝 Notes de développement

- Le code source TypeScript se trouve dans `src/`
- Vite compile automatiquement le TypeScript en développement
- Le build de production génère des fichiers optimisés dans `dist/`
- Les anciens fichiers JavaScript dans `public/js/` sont conservés pour référence

## 🐛 Dépannage

Si vous rencontrez des problèmes :

1. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
2. Vérifiez que les ports 3000 et 5173 sont disponibles
3. Assurez-vous d'utiliser Node.js 18+ pour le support des ES modules
