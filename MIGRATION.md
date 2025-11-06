# Migration vers TypeScript + PixiJS

Ce projet a été migré de JavaScript vanilla avec Canvas 2D vers TypeScript avec PixiJS (WebGL).

## Changements principaux

### Structure du projet

- **Avant** : Fichiers JavaScript dans `public/js/`
- **Après** : Code TypeScript dans `src/` compilé vers `public/js/bundle.js`

### Technologies

- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **PixiJS 7** : Rendu WebGL accéléré par GPU au lieu de Canvas 2D
- **Webpack** : Bundler pour compiler et optimiser le code

### Fichiers migrés

1. `pieces.js` → `src/pieces.ts`
2. `game.js` → `src/game.ts`
3. `render.js` → `src/renderer.ts` (refait avec PixiJS)
4. `controls.js` → `src/controls.ts`
5. `audio.js` → `src/audio.ts`
6. `particles.js` → `src/particles.ts` (refait avec PixiJS)
7. `themes.js` → `src/themes.ts`

### Nouveau point d'entrée

- `src/index.ts` : Initialise tous les modules et connecte les événements

## Commandes disponibles

```bash
# Installer les dépendances
npm install

# Compiler en mode développement
npm run build:dev

# Compiler en mode production
npm run build

# Compiler en mode watch (recompilation automatique)
npm run watch

# Démarrer le serveur
npm start

# Démarrer le serveur en mode développement
npm run dev
```

## Avantages de la migration

1. **Performance** : WebGL est beaucoup plus rapide que Canvas 2D, surtout avec beaucoup d'éléments
2. **Typage** : TypeScript détecte les erreurs à la compilation
3. **Maintenabilité** : Code mieux structuré et plus facile à maintenir
4. **Évolutivité** : Plus facile d'ajouter de nouvelles fonctionnalités

## Notes techniques

- Le rendu utilise maintenant PixiJS avec WebGL
- Les particules utilisent également PixiJS pour de meilleures performances
- Le canvas 2D est toujours utilisé pour les previews (next pieces et hold) pour simplifier
- Tous les types sont définis pour une meilleure sécurité de type
