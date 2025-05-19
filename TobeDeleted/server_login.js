// server.js
require('dotenv').config();       // loads OPENAI_API_KEY from .env
const path    = require('path');
const express = require('express');
const cors    = require('cors');

// ← ADDED: session & password hashing
const session = require('express-session');
const bcrypt  = require('bcrypt');

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app  = express();
const PORT = process.env.PORT || 3000;

// ← ADDED: configure sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,       // set true if you serve over HTTPS
    httpOnly: true,
  }
}));

// 1) JSON parsing + CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,            // allow all codespace origins
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type']
}));

// ← ADDED: simple in-memory user store
//    username: alice / password: password123
const users = {
  alice: {
    passwordHash: bcrypt.hashSync('password123', 10)
  }
};

// ← ADDED: render login page
app.get('/login', (req, res) => {
  if (req.session.username) {
    return res.redirect('/');
  }
  // serve a static login.html (you must create this)
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ← ADDED: handle login form post
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    req.session.username = username;
    return res.redirect('/');
  }
  // on failure, redirect back to login with a flag
  return res.redirect('/login?error=1');
});

// ← ADDED: logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// ← ADDED: protect everything below – must be after login routes
app.use((req, res, next) => {
  // allow login assets to be fetched without auth
  if (req.path.startsWith('/login') || req.path.startsWith('/public')) {
    return next();
  }
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
});

// 2) serve your frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// 3) health-check (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4) proxy to OpenAI
app.post('/ask-gpt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
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
