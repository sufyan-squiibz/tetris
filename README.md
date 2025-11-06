# Jeu Tetris

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec Node.js et JavaScript vanilla.

## Installation

1. Clonez ou téléchargez le projet
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Lancement

```bash
# Mode développement
npm run dev

# Mode production
npm start
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
├── public/
│   ├── index.html          # Page principale
│   ├── css/style.css       # Styles CSS
│   ├── js/
│   │   ├── game.js         # Logique principale du jeu
│   │   ├── pieces.js       # Définition des pièces
│   │   ├── render.js       # Rendu graphique
│   │   └── controls.js     # Gestion des contrôles
│   └── assets/             # Ressources (sons, images)
├── server.js               # Serveur Node.js
├── package.json            # Configuration npm
└── README.md              # Documentation
```
