#!/bin/bash

# 🎮 Tetris Pro - Script de démarrage rapide
# TypeScript + PixiJS Edition

echo "🎮 Tetris Pro - Démarrage"
echo "=========================="
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

echo "🚀 Démarrage des serveurs..."
echo ""
echo "  📡 API Server: http://localhost:3001"
echo "  🎮 Game: http://localhost:3000"
echo ""
echo "⌨️  Contrôles:"
echo "  ← → : Déplacer"
echo "  ↓ : Descendre"
echo "  ↑ : Rotation"
echo "  Z : Rotation inverse"
echo "  ESPACE : Chute immédiate"
echo "  C : Hold"
echo "  P : Pause"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"
echo ""

# Démarrer les deux serveurs en parallèle
node server.js &
API_PID=$!

npm run dev &
VITE_PID=$!

# Attendre la fin
wait $API_PID $VITE_PID
