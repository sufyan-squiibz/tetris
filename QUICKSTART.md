# 🚀 Démarrage Rapide - Tetris Pro TypeScript + PixiJS

## Installation et Lancement en 3 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Lancer en mode développement
```bash
npm run dev
```

### 3️⃣ Ouvrir le navigateur
Le jeu s'ouvrira automatiquement sur `http://localhost:3000`

## 🎮 Contrôles de Base

| Touche | Action |
|--------|--------|
| `←` `→` | Déplacer la pièce |
| `↓` | Descente rapide |
| `↑` | Rotation horaire |
| `Z` | Rotation anti-horaire |
| `Espace` | Chute instantanée |
| `C` | Mettre en réserve |
| `P` | Pause |

## 📦 Commandes Disponibles

```bash
# Développement avec hot-reload
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Vérifier les types TypeScript
npx tsc --noEmit

# Lancer le serveur API (scores)
npm run server
```

## 🎯 Différences avec la version JavaScript

### Ancien (JavaScript + Canvas 2D)
- JavaScript vanilla non typé
- Rendu Canvas 2D (CPU)
- Scripts chargés via tags `<script>`
- Pas de build process

### Nouveau (TypeScript + PixiJS)
- ✅ TypeScript avec types stricts
- ✅ Rendu WebGL (GPU) via PixiJS
- ✅ Modules ES6 avec imports/exports
- ✅ Build optimisé avec Vite
- ✅ Hot Module Replacement (HMR)
- ✅ Tree-shaking automatique

## 🔧 Résolution de Problèmes

### Le jeu ne se lance pas
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreurs TypeScript
```bash
# Vérifier les erreurs
npx tsc --noEmit
```

### Port déjà utilisé
Modifiez le port dans `vite.config.ts` :
```typescript
server: {
  port: 3001, // Changez le port ici
  open: true
}
```

## 📊 Performance

Le rendu PixiJS apporte :
- **60 FPS** constants même avec effets
- **Utilisation GPU** pour le rendu
- **Moins de charge CPU** qu'avec Canvas 2D
- **Meilleure gestion** des résolutions élevées

## 🎨 Personnalisation

### Ajouter un thème
Éditez `src/themes.ts` et ajoutez votre thème dans l'objet `THEMES`.

### Modifier les couleurs des pièces
Les couleurs sont dans `src/pieces.ts` et peuvent être overridées par le thème actif.

### Changer les sons
Ajustez les fréquences et durées dans `src/audio.ts`.

## 📝 Structure des Fichiers Principaux

```
src/
├── main.ts       → Point d'entrée (initialisation)
├── game.ts       → Logique du jeu
├── renderer.ts   → Rendu PixiJS
├── pieces.ts     → Définitions des pièces
├── controls.ts   → Gestion clavier
├── particles.ts  → Effets visuels
├── themes.ts     → Thèmes visuels
└── audio.ts      → Sons et musique
```

## 🌐 Déploiement

### Build Production
```bash
npm run build
```
Les fichiers seront dans `dist/`.

### Déployer sur un serveur
Copiez le contenu de `dist/` sur votre serveur web.

### Déployer sur Vercel/Netlify
Ces plateformes détectent automatiquement Vite et builderont le projet.

## ❓ Aide

- **README.md** : Documentation complète
- **Issues GitHub** : Signaler un bug
- **Ctrl+F1** : Aide en jeu

Bon jeu ! 🎮
