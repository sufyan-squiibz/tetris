# 🚀 Quick Start - Tetris Pro TypeScript + PixiJS

## Installation Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement
npm run dev
```

Le jeu sera accessible sur **http://localhost:3000** 🎮

## Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance serveur + client en développement (HMR) |
| `npm run build` | Compile TypeScript et construit le bundle production |
| `npm start` | Lance le serveur production |
| `npm run preview` | Prévisualise le build production |

## Structure du Projet

```
/workspace
├── src/                    # Code source TypeScript
│   ├── game/              # Logique du jeu
│   │   ├── types.ts       # Types et interfaces
│   │   ├── Piece.ts       # Définitions des pièces
│   │   ├── Renderer.ts    # Rendu PixiJS (WebGL)
│   │   ├── TetrisGame.ts  # Logique principale
│   │   └── Controls.ts    # Gestion des contrôles
│   ├── utils/             # Utilitaires
│   │   ├── AudioManager.ts
│   │   ├── ThemeManager.ts
│   │   └── ParticleSystem.ts
│   ├── main.ts            # Point d'entrée
│   └── index.html         # HTML principal
├── public/                # Fichiers statiques (CSS)
├── dist/                  # Build production (généré)
├── server.js              # Serveur Express
├── tsconfig.json          # Config TypeScript
├── vite.config.ts         # Config Vite
└── package.json           # Dépendances
```

## Technologies Utilisées

- **TypeScript 5.3** - Langage
- **PixiJS 7.3** - Rendu WebGL
- **Vite 5** - Bundler
- **Express 4** - Serveur backend
- **Web Audio API** - Sons

## Workflow de Développement

### 1. Mode Dev (Recommandé)
```bash
npm run dev
```
- Backend sur port 3001
- Frontend sur port 3000
- Hot Module Replacement actif
- Rechargement automatique

### 2. Build et Production
```bash
npm run build    # Compile et bundle
npm start        # Lance le serveur
```

### 3. Prévisualisation
```bash
npm run build
npm run preview
```

## 🎮 Contrôles du Jeu

- **← →** : Déplacer
- **↓** : Descente rapide
- **↑** : Rotation horaire
- **Z** : Rotation anti-horaire
- **Espace/Entrée** : Chute immédiate
- **C** : Hold (réserver une pièce)
- **P** : Pause

## 📝 Modifications et Personnalisation

### Modifier le Jeu
Les fichiers principaux à éditer :
- `src/game/TetrisGame.ts` - Logique du jeu
- `src/game/Renderer.ts` - Rendu visuel
- `src/utils/ThemeManager.ts` - Thèmes

### Ajouter des Fonctionnalités
1. Créer un nouveau fichier `.ts` dans `src/`
2. Importer dans `main.ts`
3. Le HMR mettra à jour automatiquement

### Modifier les Styles
- Éditer `public/css/style.css`
- Les changements sont appliqués instantanément

## 🐛 Dépannage

### Port déjà utilisé
```bash
# Changer le port dans vite.config.ts
server: {
  port: 3000  // Modifier ici
}
```

### Erreurs TypeScript
```bash
# Vérifier les erreurs
npm run build

# Les erreurs apparaissent avec ligne et colonne
```

### PixiJS ne charge pas
- Vérifier que le navigateur supporte WebGL
- Ouvrir la console pour voir les erreurs

## ✅ Vérification Rapide

Test que tout fonctionne :
```bash
npm run build
# Doit se terminer sans erreurs
```

## 📚 Documentation Complète

- **README.md** - Documentation générale
- **MIGRATION.md** - Détails de la migration JS → TS
- **QUICKSTART.md** - Ce fichier

## 💡 Astuces

1. **Développement TypeScript**
   - Utilisez VS Code pour l'IntelliSense
   - Les types aident à éviter les bugs

2. **Performance**
   - PixiJS utilise WebGL (GPU)
   - 60 FPS garanti

3. **Hot Reload**
   - Les modifications sont instantanées
   - Pas besoin de rafraîchir

## 🎯 Pour Aller Plus Loin

1. Lire le code dans `src/game/`
2. Expérimenter avec les thèmes
3. Ajouter de nouvelles fonctionnalités
4. Créer des tests unitaires

---

**Bon code ! 🚀**
