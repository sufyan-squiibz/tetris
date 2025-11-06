#!/bin/bash

echo "🔍 Vérification de la migration TypeScript + PixiJS"
echo "=================================================="
echo ""

# 1. Vérifier les fichiers TypeScript
echo "✅ Fichiers TypeScript créés:"
find src -name "*.ts" | sort
echo ""

# 2. Vérifier la compilation TypeScript
echo "✅ Compilation TypeScript:"
npx tsc --noEmit && echo "   ✓ Compilation réussie" || echo "   ✗ Erreurs de compilation"
echo ""

# 3. Vérifier les dépendances
echo "✅ Dépendances installées:"
npm list pixi.js typescript vite --depth=0 2>/dev/null || echo "   Certaines dépendances manquent"
echo ""

# 4. Vérifier la structure
echo "✅ Structure du projet:"
echo "   src/"
ls -1 src/
echo ""

# 5. Vérifier les fichiers de config
echo "✅ Fichiers de configuration:"
test -f tsconfig.json && echo "   ✓ tsconfig.json"
test -f vite.config.ts && echo "   ✓ vite.config.ts"
test -f package.json && echo "   ✓ package.json"
echo ""

echo "=================================================="
echo "✨ Vérification terminée!"
