const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, and name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, name]
    );

    const userId = result.rows[0].id;

    // Generate JWT token
    const token = jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Get user with credit balance
    const newUserResult = await db.query('SELECT id, email, name, credit_balance FROM users WHERE id = $1', [userId]);
    const newUser = newUserResult.rows[0];

    res.json({
      success: true,
      message: 'User created successfully. You received 10 free credits!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        creditBalance: newUser.credit_balance
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup' 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    const user = userResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        creditBalance: user.credit_balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, email, name, credit_balance, created_at FROM users WHERE id = $1', [req.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    const user = userResult.rows[0];

    res.json({
      success: true,
      user: {
        ...user,
        creditBalance: user.credit_balance
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// PUT /api/auth/profile - Update name
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    await db.query('UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [name.trim(), req.userId]);
    const userResult = await db.query('SELECT id, email, name FROM users WHERE id = $1', [req.userId]);
    res.json({ success: true, message: 'Profile updated', user: userResult.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/auth/password - Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    const userResult = await db.query('SELECT id, password FROM users WHERE id = $1', [req.userId]);
    if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    
    const user = userResult.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashed, req.userId]);
    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
