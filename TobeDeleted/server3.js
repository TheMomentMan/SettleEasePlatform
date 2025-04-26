const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ✅ Middleware to handle CORS (allows frontend on port 5500)
app.use(cors({
  origin: 'https://obscure-halibut-75r4v5vjp9pfw5q6-5500.app.github.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Parses incoming JSON requests
app.use(express.json());

// ✅ Simple health check route
app.get('/', (req, res) => {
  res.send('Settleease backend is up and running! 🚀');
});

// ✅ Main GPT route (returns mock response for now)
app.post('/ask-gpt', (req, res) => {
  console.log('🔔 Reached /ask-gpt');

  const { prompt } = req.body;

  if (!prompt) {
    console.log('❌ Prompt missing!');
    return res.status(400).json({ error: 'Missing prompt' });
  }

  console.log('📥 Prompt received:', prompt);
  console.log('✅ Sending mock response');

  return res.json({ reply: `Mock response for: ${prompt}` });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
