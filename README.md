# Tetris Pro - TypeScript + PixiJS (WebGL)

Un jeu Tetris professionnel développé en **TypeScript** avec **PixiJS** pour un rendu WebGL accéléré par le GPU.

## 🚀 Fonctionnalités

### Gameplay Classique
- **7 pièces Tetris** avec rotations complètes
- **Ghost Piece** - Prévisualisation de la position de chute
- **Hold System** - Réservez une pièce pour plus tard
- **Preview** - Visualisez les 3 prochaines pièces
- **Scoring avancé** avec combos et bonus

### Système de Rendu
- ✨ **Rendu WebGL** avec PixiJS pour des performances optimales
- 🎨 **4 thèmes visuels** : Classique, Néon, Rétro, Sombre
- 💥 **Système de particules** pour les effets visuels
- 📱 **Responsive** et compatible mobile

### Fonctionnalités Avancées
- 🎮 **Contrôles configurables** avec sensibilité ajustable
- 🔊 **Audio** avec effets sonores et musique
- 🏆 **High Scores** sauvegardés sur le serveur
- 📊 **Statistiques** en temps réel (PPS, combos, temps)
- ⏸️ **Pause** et tutoriel intégré

## 🛠️ Technologies

- **TypeScript 5.3** - Typage statique
- **PixiJS 7.3** - Rendu WebGL/Canvas 2D
- **Vite 5.0** - Build tool ultra-rapide
- **Express 4.18** - Serveur backend
- **Architecture modulaire** - Code organisé et maintenable

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

## 🎮 Utilisation

### Mode Développement

```bash
# Terminal 1 : Lancer le serveur backend (API scores)
npm run server

# Terminal 2 : Lancer Vite dev server
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173`  
L'API est sur `http://localhost:3000`

### Mode Production

```bash
# Construire le projet
npm run build

# Prévisualiser le build
npm run preview

# Ou servir avec Express
npm run server
# Puis accéder à http://localhost:3000
```

## ⌨️ Contrôles

| Touche | Action |
|--------|--------|
| `←` `→` | Déplacer la pièce |
| `↓` | Descente rapide (soft drop) |
| `↑` | Rotation horaire |
| `Z` | Rotation anti-horaire |
| `Espace` / `Entrée` | Chute immédiate (hard drop) |
| `C` | Hold - Mettre en réserve |
| `P` | Pause / Reprendre |

## 📁 Structure du Projet

```
/workspace
├── src/
│   ├── core/              # Logique principale du jeu
│   │   ├── TetrisGame.ts  # Classe principale du jeu
│   │   ├── TetrisPiece.ts # Gestion des pièces
│   │   └── PieceFactory.ts# Génération des pièces
│   ├── systems/           # Systèmes auxiliaires
│   │   ├── PixiRenderer.ts    # Rendu WebGL principal
│   │   ├── PreviewRenderer.ts # Rendu des previews
│   │   ├── AudioManager.ts    # Gestion audio
│   │   ├── ParticleSystem.ts  # Effets de particules
│   │   ├── ThemeManager.ts    # Gestion des thèmes
│   │   └── ControlsManager.ts # Gestion des contrôles
│   ├── types/             # Définitions TypeScript
│   │   └── index.ts
│   ├── main.ts            # Point d'entrée
│   └── styles.css         # Styles additionnels
├── public/                # Ressources statiques
│   └── css/
│       └── style.css      # Styles principaux
├── dist/                  # Build de production
├── server.js              # Serveur Express
├── index.html             # HTML principal
├── vite.config.ts         # Configuration Vite
├── tsconfig.json          # Configuration TypeScript
└── package.json
```

## 🎯 Scoring

- **1 ligne** : 100 pts × niveau
- **2 lignes** : 300 pts × niveau
- **3 lignes** : 500 pts × niveau
- **4 lignes (Tetris)** : 800 pts × niveau
- **Combo** : +50 pts par ligne consécutive
- **Hard Drop** : +2 pts par cellule
- **Back-to-Back Tetris** : +50% de bonus

## 🔧 Configuration

### Sensibilité des contrôles
Ajustez la vitesse de déplacement des pièces via le slider dans l'interface ou en modifiant `localStorage.tetris-sensitivity`.

### Thèmes
4 thèmes disponibles, changement via le bouton 🎨. Le thème est sauvegardé dans `localStorage`.

## 🚧 Développement

### Commandes disponibles

```bash
npm run dev      # Mode développement avec hot reload
npm run build    # Compilation TypeScript + Build Vite
npm run preview  # Prévisualiser le build
npm run server   # Lancer le serveur Express
```

### Architecture

Le projet suit une architecture modulaire avec :
- **Séparation des responsabilités** : Core logic, rendering, input, audio
- **Types stricts** TypeScript pour éviter les erreurs
- **Systèmes découplés** pour faciliter les tests et la maintenance
- **Rendu optimisé** avec PixiJS et WebGL

## 🎨 Migration depuis Canvas 2D

Ce projet a été migré d'une version Canvas 2D vers PixiJS pour :
- ✅ Meilleures performances (GPU vs CPU)
- ✅ Support WebGL natif
- ✅ Rendu optimisé pour les animations
- ✅ Meilleure compatibilité mobile
- ✅ Code TypeScript typé et maintenable

## 📝 Notes

- Le jeu utilise le **7-bag random generator** pour une distribution équitable des pièces
- Les high scores sont stockés en mémoire côté serveur (peut être migré vers une DB)
- Compatible avec tous les navigateurs modernes supportant WebGL
- Les canvas sont gérés par PixiJS pour un rendu optimal

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Développé avec ❤️ en TypeScript + PixiJS
