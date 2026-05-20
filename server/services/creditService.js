const db = require('../db/database');

/**
 * Credit Service
 * Handles all credit-related operations
 */
class CreditService {
  /**
   * Get user's credit balance
   */
  getUserBalance(userId) {
    const user = db.prepare('SELECT credit_balance FROM users WHERE id = ?').get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.credit_balance;
  }

  /**
   * Calculate cost for video generation
   * @param {Object} options - Video generation options
   * @param {number} options.durationMinutes - Video duration in minutes
   * @param {string} options.resolution - Video resolution (720p or 1080p)
   * @param {boolean} options.customMusic - Whether custom music is used
   * @param {boolean} options.premiumTTS - Whether premium TTS voice is used
   * @param {boolean} options.aiEnhancement - Whether AI slide enhancement is used
   * @returns {Object} Cost breakdown
   */
  calculateCost(options) {
    const {
      durationMinutes = 1,
      resolution = '720p',
      customMusic = false,
      premiumTTS = false,
      aiEnhancement = false
    } = options;

    // Round up duration to nearest minute
    const roundedMinutes = Math.ceil(durationMinutes);

    // Base cost per minute
    let baseCost = resolution === '1080p' ? 8 : 5;
    let videoCost = baseCost * roundedMinutes;

    // Additional features
    let musicCost = customMusic ? 2 : 0;
    let ttsCost = premiumTTS ? 3 : 0;
    let enhancementCost = aiEnhancement ? 4 : 0;

    const totalCost = videoCost + musicCost + ttsCost + enhancementCost;

    return {
      breakdown: {
        video: videoCost,
        music: musicCost,
        tts: ttsCost,
        enhancement: enhancementCost
      },
      total: totalCost,
      durationMinutes: roundedMinutes,
      resolution
    };
  }

  /**
   * Check if user has sufficient credits
   */
  hasEnoughCredits(userId, requiredCredits) {
    const balance = this.getUserBalance(userId);
    return balance >= requiredCredits;
  }

  /**
   * Debit credits from user account
   * Creates a transaction record and updates user balance
   * @returns {Object} Transaction details
   */
  debitCredits(userId, amount, description, videoGenerationId = null) {
    return db.transaction(() => {
      // Get current balance
      const user = db.prepare('SELECT credit_balance FROM users WHERE id = ?').get(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.credit_balance < amount) {
        throw new Error('Insufficient credits');
      }

      const newBalance = user.credit_balance - amount;

      // Update user balance
      db.prepare('UPDATE users SET credit_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newBalance, userId);

      // Create transaction record
      const result = db.prepare(`
        INSERT INTO transactions (user_id, type, amount, balance_after, description, status)
        VALUES (?, 'DEBIT', ?, ?, ?, 'COMPLETED')
      `).run(userId, amount, newBalance, description);

      // Link transaction to video generation if provided
      if (videoGenerationId) {
        db.prepare('UPDATE video_generations SET transaction_id = ? WHERE id = ?')
          .run(result.lastInsertRowid, videoGenerationId);
      }

      return {
        transactionId: result.lastInsertRowid,
        amountDebited: amount,
        balanceAfter: newBalance
      };
    })();
  }

  /**
   * Credit credits to user account (purchase, refund, bonus)
   */
  creditCredits(userId, amount, type, description, paymentId = null) {
    return db.transaction(() => {
      // Get current balance
      const user = db.prepare('SELECT credit_balance, total_credits_purchased FROM users WHERE id = ?').get(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const newBalance = user.credit_balance + amount;
      const newTotalPurchased = type === 'PURCHASE' 
        ? user.total_credits_purchased + amount 
        : user.total_credits_purchased;

      // Update user balance
      db.prepare(`
        UPDATE users 
        SET credit_balance = ?, 
            total_credits_purchased = ?,
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(newBalance, newTotalPurchased, userId);

      // Create transaction record
      const result = db.prepare(`
        INSERT INTO transactions (user_id, type, amount, balance_after, description, payment_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'COMPLETED')
      `).run(userId, type, amount, newBalance, description, paymentId);

      return {
        transactionId: result.lastInsertRowid,
        amountCredited: amount,
        balanceAfter: newBalance
      };
    })();
  }

  /**
   * Refund credits for failed video generation
   */
  refundCredits(userId, videoGenerationId) {
    return db.transaction(() => {
      // Get the video generation record
      const videoGen = db.prepare('SELECT credits_used, status FROM video_generations WHERE id = ? AND user_id = ?')
        .get(videoGenerationId, userId);

      if (!videoGen) {
        throw new Error('Video generation not found');
      }

      if (videoGen.status === 'REFUNDED') {
        throw new Error('Credits already refunded');
      }

      // Credit back the credits
      const refund = this.creditCredits(
        userId,
        videoGen.credits_used,
        'REFUND',
        `Refund for failed video generation #${videoGenerationId}`
      );

      // Update video generation status
      db.prepare('UPDATE video_generations SET status = ? WHERE id = ?')
        .run('REFUNDED', videoGenerationId);

      return refund;
    })();
  }

  /**
   * Get user's transaction history
   */
  getTransactionHistory(userId, options = {}) {
    const { limit = 50, offset = 0, type = null } = options;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const transactions = db.prepare(query).all(...params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    const countParams = [userId];
    
    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }
    
    const { total } = db.prepare(countQuery).get(...countParams);

    return {
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  /**
   * Get all active credit packages
   */
  getActivePackages() {
    return db.prepare('SELECT * FROM credit_packages WHERE is_active = 1 ORDER BY price ASC').all();
  }

  /**
   * Get package by ID
   */
  getPackageById(packageId) {
    const pkg = db.prepare('SELECT * FROM credit_packages WHERE id = ? AND is_active = 1').get(packageId);
    if (!pkg) {
      throw new Error('Package not found');
    }
    return pkg;
  }

  /**
   * Create video generation record
   */
  createVideoGeneration(userId, creditsUsed, options) {
    const result = db.prepare(`
      INSERT INTO video_generations (user_id, credits_used, duration_seconds, resolution, options, status)
      VALUES (?, ?, ?, ?, ?, 'PROCESSING')
    `).run(
      userId,
      creditsUsed,
      options.durationSeconds || null,
      options.resolution || null,
      JSON.stringify(options)
    );

    return result.lastInsertRowid;
  }

  /**
   * Update video generation status
   */
  updateVideoGeneration(videoGenId, updates) {
    const { status, videoUrl } = updates;
    
    db.prepare(`
      UPDATE video_generations 
      SET status = ?, 
          video_url = ?,
          completed_at = CASE WHEN ? IN ('COMPLETED', 'FAILED') THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = ?
    `).run(status, videoUrl || null, status, videoGenId);
  }

  /**
   * Get video generation history for user
   */
  getVideoHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const videos = db.prepare(`
      SELECT vg.*, t.description as transaction_description
      FROM video_generations vg
      LEFT JOIN transactions t ON vg.transaction_id = t.id
      WHERE vg.user_id = ?
      ORDER BY vg.created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset);

    const { total } = db.prepare('SELECT COUNT(*) as total FROM video_generations WHERE user_id = ?')
      .get(userId);

    return {
      videos: videos.map(v => ({
        ...v,
        options: v.options ? JSON.parse(v.options) : {}
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }
}

module.exports = new CreditService();
