# 🎮 Tetris Pro - TypeScript + PixiJS (WebGL)

Un jeu Tetris moderne et performant développé avec **TypeScript** et **PixiJS** pour un rendu WebGL accéléré par GPU.

## ✨ Fonctionnalités

### 🎯 Gameplay Complet
- **7 pièces Tetris classiques** avec système de bag randomisé
- **Ghost Piece** : prévisualisation de la position de chute
- **Hold System** : réservez une pièce pour plus tard (touche C)
- **Preview** : visualisez les 3 prochaines pièces
- **Hard Drop** : chute instantanée (Espace/Entrée)
- **Soft Drop** : descente rapide (Flèche Bas)
- **Rotation bidirectionnelle** (Flèche Haut / Z)

### 📊 Système de Score Avancé
- Score par ligne : 1 ligne = 100pts, 2 = 300pts, 3 = 500pts, 4 (Tetris) = 800pts
- **Système de Combo** : bonus pour les lignes consécutives
- **Back-to-Back Tetris** : bonus supplémentaire de 50%
- **Hard Drop Bonus** : +2 points par cellule
- **Multiplicateur de niveau** : score × niveau actuel
- **Statistiques en temps réel** : PPS (Pieces Per Second), combos, temps de jeu

### 🎨 Thèmes Visuels
- **Classique** : couleurs Tetris originales
- **Néon** : style cyberpunk avec effets glow
- **Rétro** : inspiration Game Boy
- **Sombre** : mode dark moderne

### 🎆 Effets Visuels (PixiJS)
- Rendu **WebGL** haute performance via PixiJS
- Système de particules pour les explosions de lignes
- Effets spéciaux pour les Tetris (4 lignes)
- Animations de level up
- Affichage des combos

### 🎵 Audio
- Sons synthétisés avec Web Audio API
- Effets sonores pour chaque action
- Musique de fond optionnelle

### ⚙️ Paramètres
- Sensibilité de déplacement ajustable (10-100ms)
- 3 presets : Très rapide, Normal, Lent
- Sauvegarde des préférences dans localStorage

### 🏆 High Scores
- Top 5 des meilleurs scores
- Sauvegarde serveur via API REST
- Affichage en temps réel

## 🛠️ Technologies

- **TypeScript 5.3** - Typage fort et code moderne
- **PixiJS 7.3** - Rendu WebGL 2D performant
- **Vite 5.0** - Build tool ultra-rapide
- **Express.js** - Serveur Node.js pour l'API
- **Web Audio API** - Sons et musique

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Mode développement (avec hot reload)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Lancer le serveur Node.js (API)
npm start
```

## 🚀 Démarrage Rapide

### Mode Développement
```bash
npm run dev
```
Ouvre automatiquement le navigateur sur `http://localhost:3000`

### Mode Production
```bash
# 1. Build l'application
npm run build

# 2. Lancer le serveur Node.js
npm start
```
Le serveur démarre sur `http://localhost:3000`

## 📁 Structure du Projet

```
/workspace
├── src/                      # Code source TypeScript
│   ├── game/                 # Logique du jeu
│   │   ├── TetrisGame.ts    # Classe principale du jeu
│   │   └── TetrisPiece.ts   # Gestion des pièces
│   ├── renderer/             # Système de rendu PixiJS
│   │   ├── PixiRenderer.ts  # Rendu principal WebGL
│   │   └── PreviewRenderer.ts # Rendu des previews
│   ├── systems/              # Systèmes auxiliaires
│   │   ├── AudioManager.ts  # Gestion audio
│   │   ├── Controls.ts      # Gestion des contrôles
│   │   ├── ParticleSystem.ts # Système de particules
│   │   └── ThemeManager.ts  # Gestion des thèmes
│   ├── types/                # Types et interfaces TypeScript
│   │   └── index.ts
│   ├── main.ts               # Point d'entrée principal
│   └── style.css             # Styles CSS
├── public/                   # Fichiers statiques
│   ├── css/
│   │   └── style.css
│   └── index.html (legacy)
├── index.html                # HTML principal (Vite)
├── server.js                 # Serveur Express.js
├── tsconfig.json             # Configuration TypeScript
├── vite.config.ts            # Configuration Vite
└── package.json              # Dépendances npm
```

## 🎮 Contrôles

| Touche | Action |
|--------|--------|
| ← / → | Déplacer latéralement |
| ↓ | Descente rapide (soft drop) |
| ↑ | Rotation horaire |
| Z | Rotation anti-horaire |
| Espace / Entrée | Chute immédiate (hard drop) |
| C | Hold - Mettre en réserve |
| P | Pause |
| F1 | Aide |

## 🔧 Configuration

### TypeScript
Le projet utilise TypeScript en mode strict avec les options suivantes :
- Target: ES2020
- Module: ESNext
- Strict mode activé
- Resolution: bundler

### Vite
Configuration optimisée pour :
- Hot Module Replacement (HMR)
- Build optimisé avec code splitting
- Source maps en développement
- Compression en production

### PixiJS
- Rendu WebGL avec fallback Canvas
- Anti-aliasing activé
- Support multi-résolution (Retina)
- Destruction propre des ressources

## 📈 Performance

Grâce à PixiJS et WebGL :
- **60 FPS** constant même avec de nombreuses particules
- Rendu GPU accéléré
- Gestion optimisée de la mémoire
- Sprites réutilisables

## 🐛 Debug

### Mode Développement
```bash
npm run dev
```
- Source maps activées
- Hot reload automatique
- Console de débogage accessible

### Vérifier la compilation TypeScript
```bash
npx tsc --noEmit
```

## 📝 API Serveur

### Endpoints

#### GET `/api/scores`
Récupère les high scores
```json
[
  {
    "name": "Player1",
    "score": 15000,
    "level": 8,
    "lines": 75,
    "date": "2024-01-01T12:00:00.000Z"
  }
]
```

#### POST `/api/scores`
Sauvegarde un nouveau score
```json
{
  "name": "Player1",
  "score": 15000,
  "level": 8,
  "lines": 75
}
```

## 🎯 Objectifs de Niveau

- Niveau 1-5 : Débutant
- Niveau 6-10 : Intermédiaire
- Niveau 11-15 : Avancé
- Niveau 16+ : Expert

La vitesse augmente de 100ms par niveau jusqu'à un minimum de 100ms.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 🙏 Remerciements

- **Alexey Pajitnov** - Créateur original de Tetris
- **PixiJS Team** - Framework de rendu WebGL
- **Vite Team** - Build tool moderne

---

Développé avec ❤️ en TypeScript + PixiJS
