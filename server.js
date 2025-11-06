const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => {
  console.log(`Serveur API Tetris démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
});
