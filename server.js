const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (priorité au build de production, sinon public)
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Vérifier si dist existe (build de production)
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(publicPath));
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
  const indexPath = require('fs').existsSync(distPath)
    ? path.join(distPath, 'index.html')
    : path.join(publicPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Serveur Tetris démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});
