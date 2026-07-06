require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const lectureRoutes = require('./routes/lecture');
const videoRoutes = require('./routes/video');
const authRoutes = require('./routes/auth');
const creditsRoutes = require('./routes/credits');
const paymentsRoutes = require('./routes/payments');
const path = require('path');
const db = require('./db/database'); // Initialize database
const compression = require('compression');

const { PORT } = require('./config/constants');
const app = express();

// ── Phase 2: Explicit CORS allowlist ─────────────────────────────────────────
// Set ALLOWED_ORIGINS in .env as a comma-separated list of allowed origins.
// Example: ALLOWED_ORIGINS=https://preplitai.com,https://www.preplitai.com
// Falls back to localhost for development convenience.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin header (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} is not in the allowed list`));
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for generated outputs and simple UI
// Enable proper video streaming with range requests
app.use('/outputs', express.static(path.join(__dirname, 'outputs'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4') || filePath.endsWith('.webm')) {
      res.set('Accept-Ranges', 'bytes');
      res.set('Content-Type', 'video/mp4');
    }
    // Cache videos for 7 days
    res.set('Cache-Control', 'public, max-age=604800, immutable');
  }
}));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '30d',
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/lecture', lectureRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/payments', paymentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PreplitAI API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
