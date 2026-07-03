require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const uploadRoutes = require('../server/routes/upload');
const lectureRoutes = require('../server/routes/lecture');
const videoRoutes = require('../server/routes/video');
const authRoutes = require('../server/routes/auth');
const creditsRoutes = require('../server/routes/credits');
const paymentsRoutes = require('../server/routes/payments');
require('../server/db/database'); // Initialize database

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/lecture', lectureRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/payments', paymentsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PreplitAI Serverless API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

module.exports = app;
