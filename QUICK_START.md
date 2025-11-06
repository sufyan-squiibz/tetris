# 🚀 Quick Start - Tetris Pro (TypeScript + PixiJS)

## ⚡ Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le projet

#### Option A : Mode développement (recommandé)
```bash
# Terminal 1 - Serveur de dev avec hot reload
npm run dev

# Terminal 2 (optionnel) - API pour les high scores
npm run server
```

Ouvrez http://localhost:5173 dans votre navigateur.

#### Option B : Mode production
```bash
# Build le projet
npm run build

# Lance le serveur
npm start
```

Ouvrez http://localhost:3000 dans votre navigateur.

## 🎮 Contrôles essentiels

- **← →** : Déplacer
- **↓** : Descente rapide
- **↑** : Rotation
- **Espace** : Chute immédiate
- **C** : Hold (réserve)
- **P** : Pause

## 📁 Fichiers importants

```
/workspace
├── src/                    # Code source TypeScript
│   ├── main.ts            # Point d'entrée ⭐
│   ├── game/
│   │   ├── tetris.ts      # Logique du jeu ⭐
│   │   ├── pieces.ts      # Définition des pièces
│   │   └── renderer.ts    # Rendu PixiJS WebGL ⭐
│   └── ...
├── index.html             # Point d'entrée HTML
├── vite.config.ts         # Config Vite
├── tsconfig.json          # Config TypeScript
└── package.json           # Scripts et dépendances
```

## 🔍 Vérifier que tout fonctionne

### Test 1 : Compilation TypeScript
```bash
npm run type-check
```
✅ Devrait terminer sans erreur.

### Test 2 : Build de production
```bash
npm run build
```
✅ Devrait créer le dossier `dist/` avec les fichiers compilés.

### Test 3 : Lancer le jeu
```bash
npm run dev
```
✅ Le navigateur devrait s'ouvrir sur http://localhost:5173
✅ Vous devriez voir le jeu Tetris
✅ Le bouton "DÉMARRER" devrait lancer le jeu

## 🐛 Problèmes courants

### Erreur : "Cannot find module"
**Solution :** Réinstallez les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur : Port 5173 déjà utilisé
**Solution :** Changez le port dans `vite.config.ts` :
```typescript
server: {
  port: 5174,  // Changez ici
  // ...
}
```

### Le jeu ne s'affiche pas
**Solution :** Vérifiez la console du navigateur (F12)
- Erreurs JavaScript ?
- Problème de chargement de PixiJS ?

### Les high scores ne fonctionnent pas
**Solution :** Lancez le serveur API dans un terminal séparé :
```bash
npm run server
```

## 📊 Structure des modules

```typescript
// Point d'entrée : src/main.ts
import { TetrisGame } from './game/tetris';         // Logique du jeu
import { ControlsManager } from './utils/controls'; // Contrôles
import { AudioManager } from './audio/audio-manager'; // Audio
import { ParticleSystem } from './particles/particle-system'; // Particules
import { ThemeManager } from './themes/theme-manager'; // Thèmes

// Initialisation
const game = new TetrisGame(element, audioManager, particleSystem);
new ControlsManager(game);
new ThemeManager();
```

## 🎨 Personnalisation rapide

### Changer les couleurs des pièces
**Fichier :** `src/game/pieces.ts`
```typescript
export const TETRIS_PIECES = {
  I: { color: 0x00ffff }, // Cyan
  // Changez les couleurs ici (format: 0xRRGGBB)
};
```

### Ajuster la difficulté
**Fichier :** `src/types/index.ts`
```typescript
export const GAME_CONFIG = {
  INITIAL_DROP_INTERVAL: 1000,  // Vitesse initiale (ms)
  DROP_INTERVAL_DECREASE: 100,  // Accélération par niveau
  // ...
};
```

### Modifier les thèmes
**Fichier :** `src/themes/theme-manager.ts`
```typescript
const THEMES = {
  myTheme: {
    name: 'Mon Thème',
    background: 'linear-gradient(...)',
    // ...
  }
};
```

## 🔧 Scripts npm disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de dev avec HMR |
| `npm run build` | Compile pour production |
| `npm run preview` | Prévisualise le build |
| `npm run type-check` | Vérifie les types TS |
| `npm start` | Lance le serveur Express |
| `npm run server` | Lance Express avec nodemon |

## 📚 En savoir plus

- **README.md** - Documentation complète
- **MIGRATION.md** - Guide de migration JS → TS
- [TypeScript Docs](https://www.typescriptlang.org)
- [PixiJS Docs](https://pixijs.com)
- [Vite Docs](https://vitejs.dev)

## ✅ Checklist de test

- [ ] Les dépendances sont installées (`node_modules/` existe)
- [ ] `npm run type-check` réussit
- [ ] `npm run build` crée le dossier `dist/`
- [ ] `npm run dev` lance le serveur sans erreur
- [ ] Le jeu s'affiche dans le navigateur
- [ ] Le bouton DÉMARRER lance le jeu
- [ ] Les pièces tombent correctement
- [ ] Les contrôles clavier fonctionnent
- [ ] Les thèmes changent (bouton 🎨)
- [ ] Les sons fonctionnent (si activés)

---

**Bon développement ! 🎮✨**
