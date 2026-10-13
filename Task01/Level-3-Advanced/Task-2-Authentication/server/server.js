require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { authenticateToken } = require('./middleware');

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.disable('x-powered-by');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json({ limit: '10kb' }));

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateRegistration({ fullName, email, password }) {
  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return 'Name, email, and password are required.';
  }

  if (!fullName.trim() || fullName.trim().length > 100) {
    return 'Name must contain between 1 and 100 characters.';
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return 'Enter a valid email address.';
  }

  if (password.length < 8 || password.length > 72) {
    return 'Password must contain between 8 and 72 characters.';
  }

  return null;
}

function createToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const validationError = validateRegistration(req.body || {});

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const fullName = req.body.fullName.trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [fullName, email, passwordHash]
    );

    const user = result.rows[0];

    return res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    console.error('Registration failed:', error.message);
    return res.status(500).json({
      message: 'Unable to complete registration.',
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: 'Email and password are required.',
    });
  }

  if (email.length > 254 || password.length > 72) {
    return res.status(401).json({
      message: 'Invalid email or password.',
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash
       FROM users
       WHERE email = $1`,
      [normalizeEmail(email)]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    return res.json({
      message: 'Login successful.',
      token: createToken(user),
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({
      message: 'Unable to complete login.',
    });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.user.sub]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: 'The account for this token no longer exists.',
      });
    }

    const user = result.rows[0];

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile lookup failed:', error.message);
    return res.status(500).json({
      message: 'Unable to retrieve the profile.',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

async function startServer() {
  if (!process.env.DB_PASSWORD || !process.env.JWT_SECRET) {
    throw new Error('DB_PASSWORD and JWT_SECRET must be configured.');
  }

  await pool.query('SELECT 1');

  app.listen(PORT, () => {
    console.log(`Authentication API running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start authentication API:', error.message);
  process.exitCode = 1;
});

async function shutdown() {
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
