// server.js
require('dotenv').config();       // loads OPENAI_API_KEY from .env
const path    = require('path');
const express = require('express');
const cors    = require('cors');

// v4+ OpenAI client
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) serve your frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// 2) JSON parsing + CORS
app.use(express.json());
app.use(cors({
  origin: true,            // allow all codespace origins
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type']
}));

// 3) health-check (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4) proxy to OpenAI
app.post('/ask-gpt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    // v4+ usage: .chat.completions.create(…)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// 5) listen!
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server up on http://0.0.0.0:${PORT}`);
});
