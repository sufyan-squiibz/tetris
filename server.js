const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du dossier dist (généré par webpack)
// Si dist n'existe pas, servir depuis public (développement)
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');
const fs = require('fs');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('Serving static files from dist/');
} else {
  app.use(express.static(publicPath));
  console.log('Serving static files from public/');
}

// Stockage simple des scores en mémoire (pourrait être remplacé par une base de données)
let highScores = [];

// API pour les scores
app.get('/api/scores', (req, res) => {
  res.json(highScores.sort((a, b) => b.score - a.score).slice(0, 10));
});

app.post('/api/scores', (req, res) => {
  const { name, score, level, lines } = req.body;
  
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Nom et score requis' });
  }
  
  highScores.push({ name, score, level, lines, date: new Date().toISOString() });
  highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 10);
  
  res.json({ success: true, highScores });
});

// Servir l'application principale
app.get('/', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(publicIndex);
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Tetris démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});
