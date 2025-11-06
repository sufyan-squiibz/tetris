# 🚀 Guide de démarrage rapide - Tetris Pro

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer en mode développement
```bash
npm run dev
```

Le jeu sera accessible sur **http://localhost:5173**

### 3. (Optionnel) Lancer l'API backend
Dans un autre terminal :
```bash
npm run server
```

L'API sera accessible sur **http://localhost:3001**

---

## 🎮 Commencer à jouer

1. Cliquer sur **▶ DÉMARRER**
2. Utiliser les flèches ← → pour déplacer
3. Utiliser ↑ ou Z pour tourner
4. Utiliser Espace pour hard drop

---

## 🎨 Changer de thème

Cliquer sur le bouton 🎨 en haut à droite

Thèmes disponibles :
- Classique
- Néon
- Rétro
- Sombre

---

## ⚙️ Ajuster la sensibilité

Utiliser le slider "SENSIBILITÉ" dans la barre latérale droite

Presets disponibles :
- Très rapide (10ms)
- Normal (30ms) 
- Lent (50ms)

---

## 🏆 Sauvegarder votre score

1. Faire Game Over
2. Entrer votre nom
3. Cliquer sur 💾 SAUVEGARDER

Votre score apparaîtra dans le TOP 5 !

---

## 📦 Build de production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier **dist/**

Pour tester le build :
```bash
npm run preview
```

---

## 🐛 Problèmes courants

### Le jeu ne se charge pas
- Vérifier que Node.js 18+ est installé
- Supprimer node_modules et réinstaller : `rm -rf node_modules && npm install`
- Vérifier la console navigateur pour les erreurs

### L'API ne fonctionne pas
- Lancer le serveur : `npm run server`
- Vérifier que le port 3001 est libre
- Voir les logs du serveur

### Erreurs TypeScript
- Exécuter : `npx tsc --noEmit`
- Vérifier que toutes les dépendances sont installées

---

## 📚 Documentation complète

- **README.md** - Documentation principale
- **MIGRATION.md** - Guide de migration depuis JS
- **CHANGELOG.md** - Historique des versions

---

**Bon jeu ! 🎮**
