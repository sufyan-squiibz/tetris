# Jeu Tetris Pro - TypeScript + PixiJS

Un jeu Tetris classique avec toutes les fonctionnalités originales, développé avec TypeScript et PixiJS (WebGL).

## 🚀 Technologies

- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **PixiJS** : Rendu WebGL haute performance
- **Vite** : Build tool moderne et rapide
- **Express** : Serveur Node.js pour l'API

## 📦 Installation

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

# Mode production (serveur uniquement)
npm start
```

En mode développement :
- **Client Vite** : http://localhost:5173
- **Serveur API** : http://localhost:3000

Le client Vite proxy automatiquement les requêtes `/api` vers le serveur Express.

## ✨ Fonctionnalités

- ✅ 7 types de pièces Tetris classiques
- ✅ Rotation dans les deux sens
- ✅ Système de ghost piece (prévisualisation)
- ✅ Hold (réserve de pièce)
- ✅ Preview des 3 prochaines pièces
- ✅ Détection des collisions
- ✅ Système de scoring avec multiplicateurs
- ✅ Système de combo
- ✅ Niveaux de difficulté progressifs
- ✅ High scores persistants
- ✅ Contrôles clavier configurables
- ✅ Système de particules pour les effets visuels
- ✅ Thèmes personnalisables
- ✅ Audio avec Web Audio API
- ✅ Interface responsive
- ✅ Rendu WebGL haute performance avec PixiJS

## ⌨️ Contrôles

- **Flèche gauche** : Déplacer à gauche
- **Flèche droite** : Déplacer à droite
- **Flèche bas** : Accélérer la descente (soft drop)
- **Flèche haut** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace / Entrée** : Hard drop (chute immédiate)
- **C** : Hold - Mettre en réserve
- **P** : Pause/Reprendre

## 📁 Structure du projet

```
tetris/
├── src/                      # Code source TypeScript
│   ├── main.ts              # Point d'entrée principal
│   ├── game.ts              # Logique principale du jeu
│   ├── pieces.ts            # Définition des pièces
│   ├── renderer.ts          # Rendu PixiJS (WebGL)
│   ├── renderer-utils.ts    # Utilitaires de rendu
│   ├── controls.ts          # Gestion des contrôles
│   ├── audio.ts             # Gestionnaire audio
│   ├── particles.ts         # Système de particules
│   ├── themes.ts            # Gestionnaire de thèmes
│   ├── types.ts             # Définitions de types
│   └── constants.ts         # Constantes du jeu
├── public/                  # Fichiers statiques
│   ├── index.html           # Page principale
│   ├── css/
│   │   └── style.css        # Styles CSS
│   └── js/                  # Anciens fichiers JS (dépréciés)
├── dist/                    # Build de production (généré)
├── server.js                # Serveur Express
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Configuration npm
└── README.md                # Documentation
```

## 🛠️ Scripts disponibles

- `npm run dev` : Lance le serveur Express et Vite en parallèle
- `npm run dev:server` : Lance uniquement le serveur Express
- `npm run dev:client` : Lance uniquement Vite
- `npm run build` : Compile TypeScript et build avec Vite
- `npm run preview` : Prévisualise le build de production
- `npm start` : Lance le serveur en mode production

## 🎨 Thèmes

Le jeu inclut plusieurs thèmes :
- **Classique** : Thème par défaut
- **Néon** : Thème avec effets de lueur
- **Rétro** : Style Game Boy
- **Sombre** : Thème sombre moderne

Changez de thème avec le bouton 🎨 dans l'interface.

## 📊 Scoring

- **1 ligne** : 100 pts × niveau
- **2 lignes** : 300 pts × niveau
- **3 lignes** : 500 pts × niveau
- **4 lignes (Tetris)** : 800 pts × niveau
- **Combo** : +50 pts par ligne consécutive
- **Hard Drop** : +2 pts par cellule

## 🔧 Développement

Le projet utilise :
- **TypeScript** avec configuration stricte
- **PixiJS v7** pour le rendu WebGL
- **Vite** pour le bundling et le hot-reload
- **ES Modules** pour une meilleure organisation du code

Pour contribuer :
1. Créez une branche pour votre fonctionnalité
2. Développez en TypeScript
3. Assurez-vous que le code compile sans erreurs
4. Testez les fonctionnalités
5. Créez une pull request

## 📝 Notes

- Les anciens fichiers JavaScript dans `public/js/` sont conservés pour référence mais ne sont plus utilisés
- Le rendu utilise maintenant PixiJS avec WebGL pour de meilleures performances
- Tous les types sont définis dans `src/types.ts`
- Les constantes du jeu sont dans `src/constants.ts`

## 🐛 Problèmes connus

Aucun problème connu pour le moment. Si vous en rencontrez, n'hésitez pas à ouvrir une issue.

## 📄 Licence

MIT
