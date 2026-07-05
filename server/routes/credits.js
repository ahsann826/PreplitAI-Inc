const express = require('express');
const router = express.Router();
const creditService = require('../services/creditService');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/credits/balance
 * Get user's current credit balance
 */
router.get('/balance', async (req, res) => {
  try {
    // 1.6 FIX: was missing await — returned a Promise, not the balance value
    const balance = await creditService.getUserBalance(req.userId);
    res.json({
      success: true,
      balance,
      userId: req.userId
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
});

/**
 * GET /api/credits/packages
 * Get available credit packages
 */
router.get('/packages', async (req, res) => {
  try {
    // 1.6 FIX: was missing await
    const packages = await creditService.getActivePackages();
    res.json({
      success: true,
      packages: packages.map(pkg => ({
        ...pkg,
        totalCredits: pkg.credits + pkg.bonus_credits,
        pricePerCredit: (pkg.price / (pkg.credits + pkg.bonus_credits)).toFixed(3)
      }))
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      error: 'Failed to fetch packages',
      message: error.message
    });
  }
});

/**
 * GET /api/credits/transactions
 * Get user's transaction history with pagination
 */
router.get('/transactions', async (req, res) => {
  try {
    const { limit = 50, offset = 0, type } = req.query;

    // 1.6 FIX: was missing await
    const result = await creditService.getTransactionHistory(req.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      type: type || null
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

/**
 * POST /api/credits/calculate-cost
 * Calculate credit cost for video generation.
 * Uses the same calculateCost() function as /api/video/generate so quotes
 * and actual charges are always identical.
 */
router.post('/calculate-cost', async (req, res) => {
  try {
    const { wordCount, durationMinutes, resolution, customMusic, premiumTTS, aiEnhancement } = req.body;

    // Accept either wordCount (preferred) or durationMinutes for backwards compat
    if (!wordCount && !durationMinutes) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Either wordCount or durationMinutes must be provided'
      });
    }

    const costBreakdown = creditService.calculateCost({
      wordCount: wordCount || null,
      durationMinutes: durationMinutes || null,
      resolution: resolution || '720p',
      customMusic: customMusic || false,
      premiumTTS: premiumTTS || false,
      aiEnhancement: aiEnhancement || false
    });

    // 1.6 FIX: was missing await — returned a Promise object, not the balance
    const userBalance = await creditService.getUserBalance(req.userId);
    const canAfford = userBalance >= costBreakdown.total;

    res.json({
      success: true,
      cost: costBreakdown,
      userBalance,
      canAfford,
      creditsNeeded: canAfford ? 0 : costBreakdown.total - userBalance
    });
  } catch (error) {
    console.error('Error calculating cost:', error);
    res.status(500).json({
      error: 'Failed to calculate cost',
      message: error.message
    });
  }
});

/**
 * GET /api/credits/video-history
 * Get user's video generation history
 */
router.get('/video-history', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // 1.6 FIX: was missing await
    const result = await creditService.getVideoHistory(req.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching video history:', error);
    res.status(500).json({
      error: 'Failed to fetch video history',
      message: error.message
    });
  }
});

module.exports = router;
