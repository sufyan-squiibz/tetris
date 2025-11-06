# 🚀 Guide de Démarrage Rapide - Tetris Pro

## Installation (1 commande)

```bash
npm install
```

## Démarrage Rapide (2 terminaux)

### Terminal 1 : Serveur API
```bash
node server.js
```
> Serveur API démarré sur http://localhost:3001

### Terminal 2 : Application
```bash
npm run dev
```
> Application disponible sur http://localhost:3000

## C'est tout ! 🎮

Ouvrez votre navigateur sur **http://localhost:3000** et commencez à jouer !

---

## Contrôles Clavier

| Touche | Action |
|--------|--------|
| `←` `→` | Déplacer |
| `↓` | Descendre |
| `↑` | Rotation |
| `Z` | Rotation inverse |
| `Espace` | Chute immédiate |
| `C` | Mettre en réserve |
| `P` | Pause |

---

## Build Production

```bash
# Compiler
npm run build

# Prévisualiser
npm run preview
```

Les fichiers compilés seront dans le dossier `dist/`.

---

## Structure du Projet

```
/workspace
├── src/                  # Code TypeScript
│   ├── main.ts          # Point d'entrée
│   ├── core/            # Logique du jeu
│   ├── rendering/       # Rendu PixiJS
│   └── ...
├── public/              # Assets statiques
│   ├── css/
│   └── index.html
├── dist/                # Build production
├── server.js            # API Express
└── package.json
```

---

## Troubleshooting

### Port déjà utilisé
Si le port 3000 ou 3001 est déjà utilisé:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Problème de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur TypeScript
```bash
npx tsc --noEmit
```

---

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev server avec hot reload |
| `npm run build` | Build production |
| `npm run preview` | Preview du build |
| `npm start` | Démarrer uniquement l'API |

---

## Fonctionnalités

✅ Rendu WebGL haute performance (PixiJS)  
✅ TypeScript avec types stricts  
✅ Hot Module Replacement (HMR)  
✅ 4 thèmes visuels  
✅ Système de particules  
✅ Audio synthétisé  
✅ Statistiques temps réel  
✅ High scores avec API  

---

## Technologies

- **TypeScript 5.3** - Langage
- **PixiJS 7.3** - Rendu WebGL
- **Vite 5.0** - Build tool
- **Express 4.18** - API server

---

## Ressources

- 📚 [README.md](./README.md) - Documentation complète
- 🔄 [MIGRATION.md](./MIGRATION.md) - Détails de la migration
- 🐛 [Issues](https://github.com/votre-repo/issues) - Reporter un bug

---

**Bon jeu ! 🎮✨**
