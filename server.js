import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis dist en production, public en développement
const isProduction = process.env.NODE_ENV === 'production';
const staticDir = isProduction ? 'dist' : 'public';
app.use(express.static(path.join(__dirname, staticDir)));

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
  res.sendFile(path.join(__dirname, staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur Tetris démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});
