const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// CORS: allow Codespace front-end origin
const corsOptions = {
  origin: 'https://obscure-halibut-75r4v5vjp9pfw5q6-5500.app.github.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ask-gpt', (req, res) => {
  console.log('🔔 Reached /ask-gpt with prompt:', req.body.prompt);
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  // Here you would call OpenAI; for now we mock:
  res.json({ reply: `Mock response for: ${prompt}` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
