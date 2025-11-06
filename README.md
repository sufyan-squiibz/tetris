# 🎮 Tetris Pro - TypeScript + PixiJS (WebGL)

Un jeu Tetris moderne et performant construit avec TypeScript et PixiJS pour un rendu WebGL accéléré par GPU.

## ✨ Caractéristiques

### Technologies
- **TypeScript** - Code type-safe et maintenable
- **PixiJS v7** - Rendu WebGL haute performance
- **Vite** - Build ultra-rapide et Hot Module Replacement
- **Express** - Serveur backend pour les high scores

### Fonctionnalités du jeu
- ✅ **Gameplay classique Tetris** avec toutes les pièces standard
- ✅ **Ghost Piece** - Prévisualisation de l'emplacement de la pièce
- ✅ **Hold System** - Réservez une pièce pour plus tard (touche C)
- ✅ **Next Preview** - Visualisez les 3 prochaines pièces
- ✅ **Système de combo** - Bonus pour les lignes consécutives
- ✅ **Back-to-Back Tetris** - Bonus pour les Tetris consécutifs
- ✅ **Statistiques en temps réel** - PPS, combo, temps de jeu
- ✅ **Système de niveaux** - Difficulté progressive
- ✅ **High Scores** - Classement des meilleurs scores
- ✅ **Effets de particules** - Animations fluides et visuellement attrayantes
- ✅ **4 thèmes visuels** - Classique, Néon, Rétro, Sombre
- ✅ **Audio** - Sons synthétisés avec Web Audio API
- ✅ **Contrôles personnalisables** - Ajustez la sensibilité

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm

### Installation des dépendances
```bash
npm install
```

## 🎯 Utilisation

### Mode développement
Lance le serveur de développement Vite avec hot reload :
```bash
npm run dev
```
Ouvrez http://localhost:5173 dans votre navigateur.

Pour lancer également le serveur API (high scores) :
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server
```

### Build pour production
Compile le projet TypeScript et crée le bundle optimisé :
```bash
npm run build
```

### Prévisualiser le build de production
```bash
npm run preview
```

### Lancer le serveur complet (production)
```bash
npm start
```
Ouvrez http://localhost:3000 dans votre navigateur.

## 🎮 Contrôles

| Touche | Action |
|--------|--------|
| ← / → | Déplacer la pièce latéralement |
| ↓ | Descente rapide (soft drop) |
| ↑ | Rotation horaire |
| Z | Rotation anti-horaire |
| Espace / Entrée | Chute immédiate (hard drop) |
| C | Hold - Mettre en réserve |
| P | Pause / Reprendre |

## 📊 Système de scoring

- **1 ligne** : 100 pts × niveau
- **2 lignes** : 300 pts × niveau
- **3 lignes** : 500 pts × niveau
- **4 lignes (Tetris)** : 800 pts × niveau
- **Combo** : +50 pts par ligne consécutive × niveau
- **Back-to-Back Tetris** : +50% de bonus
- **Hard Drop** : +2 pts par cellule

## 🏗️ Structure du projet

```
/workspace
├── src/                    # Code source TypeScript
│   ├── game/              # Logique du jeu
│   │   ├── pieces.ts      # Définition des pièces Tetris
│   │   ├── renderer.ts    # Rendu PixiJS (WebGL)
│   │   └── tetris.ts      # Classe principale du jeu
│   ├── audio/             # Gestionnaire audio
│   │   └── audio-manager.ts
│   ├── particles/         # Système de particules
│   │   └── particle-system.ts
│   ├── themes/            # Gestionnaire de thèmes
│   │   └── theme-manager.ts
│   ├── utils/             # Utilitaires
│   │   └── controls.ts    # Gestion des contrôles
│   ├── types/             # Types TypeScript
│   │   └── index.ts
│   └── main.ts            # Point d'entrée
├── public/                # Assets statiques
│   ├── css/
│   │   └── style.css
│   └── index.html (old)
├── index.html             # Nouveau point d'entrée HTML
├── server.js              # Serveur Express (API)
├── tsconfig.json          # Configuration TypeScript
├── vite.config.ts         # Configuration Vite
└── package.json           # Dépendances et scripts
```

## 🎨 Thèmes disponibles

1. **Classique** - Le look Tetris traditionnel
2. **Néon** - Style cyberpunk avec effets de glow
3. **Rétro** - Inspiré des Game Boy classiques
4. **Sombre** - Mode sombre moderne

Changez de thème en cliquant sur le bouton 🎨 dans l'interface.

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement Vite
- `npm run build` - Compile et build pour production
- `npm run preview` - Prévisualise le build de production
- `npm run type-check` - Vérifie les types TypeScript sans compiler
- `npm start` - Lance le serveur Express (production)
- `npm run server` - Lance le serveur Express avec nodemon (dev)

## 🐛 Débogage

Le jeu expose certains objets globalement pour faciliter le débogage :

```javascript
// Dans la console du navigateur
window.game          // Instance du jeu
window.audioManager  // Gestionnaire audio
window.themeManager  // Gestionnaire de thèmes
```

## 📝 Notes techniques

### Améliorations par rapport à la version JavaScript

1. **Type Safety** - TypeScript élimine les erreurs de type à la compilation
2. **Performance** - PixiJS (WebGL) offre un rendu jusqu'à 10x plus rapide que Canvas 2D
3. **Maintenabilité** - Code mieux structuré avec des classes et interfaces
4. **Tooling** - Vite offre un HMR ultra-rapide et un build optimisé
5. **Scalabilité** - Architecture modulaire facilitant l'ajout de nouvelles fonctionnalités

### Optimisations

- Rendu WebGL via PixiJS pour des performances maximales
- Batching automatique des sprites par PixiJS
- Tree-shaking et minification par Vite
- Code-splitting possible pour réduire la taille du bundle initial

## 📄 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Bon jeu ! 🎮✨**
