// server.js
console.log('Starting server.js...');
const path    = require('path');
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
require('dotenv').config(); // Load .env for OPENAI_API_KEY
//console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
const OpenAI = require('openai');
const session = require('express-session');
const { testConnection, pool } = require('./config/database');
const favoritesRouter = require('./routes/favorites');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

//extra debugging step
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get('/test-log', (req, res) => {
  console.log('Test log route hit');
  res.send('Logged!');
});

// Debug logging
console.log('Current directory:', __dirname);
console.log('Public directory path:', path.join(__dirname, 'public'));
console.log('Index.html path:', path.join(__dirname, 'public', 'index.html'));

// Login route
app.get('/login', (req, res) => {
  console.log('Request received for /login');
  const loginPath = path.join(__dirname, 'public', 'login.html');
  console.log('Attempting to send file:', loginPath);
  
  if (!fs.existsSync(loginPath)) {
    console.error('Login file does not exist:', loginPath);
    return res.status(404).send('Login page not found');
  }

  res.sendFile(loginPath, (err) => {
    if (err) {
      console.error('Error sending login file:', err);
      res.status(500).send('Error loading login page');
    }
  });
});

// 1) serve your frontend from /public
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'htm']
}));

// 2) JSON parsing + CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',            // allow all origins for local development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// 3) health-check (optional)
app.get('/', (req, res) => {
  console.log('Request received for /');
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log('Attempting to send file:', indexPath);
  
  // Check if file exists
  if (!fs.existsSync(indexPath)) {
    console.error('File does not exist:', indexPath);
    return res.status(404).send('File not found');
  }

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});



// Login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      // User not found
      return res.redirect('/login?error=1');
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      // Password does not match
      return res.redirect('/login?error=1');
    }
    req.session.username = username;
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=1');
  }
});

// Test database connection on startup
testConnection().catch(console.error);

// Routes
app.use('/api/favorites', favoritesRouter);

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/ask-gpt', async (req, res) => {
    try {
        const messages = req.body.messages || [];
        const prompt = req.body.prompt;

        if (prompt) {
            // Handle direct prompts (for recommendations)
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }]
            });
            res.json({ reply: completion.choices[0].message.content });
        } else if (messages.length > 0) {
            // Handle chat conversations
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: messages
            });
            res.json({ reply: completion.choices[0].message.content });
        } else {
            res.status(400).json({ error: 'No prompt or messages provided' });
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});

// Routes for pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/*app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});*/

/* app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    console.log('Login POST:', { username });
    console.log('Session after login:', req.session);
    res.redirect('/');
}); */

//debugcodeforlogin
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('DB rows:', rows);
    if (rows.length === 0) {
      console.log('User not found');
      return res.redirect('/login?error=1');
    }
    const user = rows[0];
    console.log('User from DB:', user);
    const match = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', match);
    if (!match) {
      console.log('Password does not match');
      return res.redirect('/login?error=1');
    }
    req.session.username = username;
    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=1');
  }
});

// === Signup endpoint ===
app.post('/api/signup', async (req, res) => {
  //fs.appendFileSync('/tmp/signup.log', `Signup route hit at ${new Date().toISOString()} with body: ${JSON.stringify(req.body)}\n`);
  console.log('Received signup request:', req.body); // <-- Add this as the first line - just for debugging
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    // Check if username exists
    const [rows] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already taken.' });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert user (email is NULL)
    await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, NULL, ?)',
      [username, hash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Signup failed. Please try again.' });
  }
});

// === Auth: get current user ===
app.get('/api/me', (req, res) => {
  console.log('Session in /api/me:', req.session);
  if (req.session && req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ username: null });
  }
});

// === Auth: logout ===
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 4) listen!
app.listen(PORT, () => {
  console.log(`✅ Server up on http://localhost:${PORT}`);
  console.log(`✅ Also available on http://127.0.0.1:${PORT}`);
  console.log(`✅ Login page available at http://localhost:${PORT}/login`);
});
