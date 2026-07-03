const db = require('../db/database');

/**
 * Credit Service
 * Handles all credit-related operations
 */
class CreditService {
  /**
   * Get user's credit balance
   */
  async getUserBalance(userId) {
    const userResult = await db.query('SELECT credit_balance FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    return userResult.rows[0].credit_balance;
  }

  /**
   * Calculate cost for video generation
   */
  calculateCost(options) {
    const {
      durationMinutes = 1,
      resolution = '720p',
      customMusic = false,
      premiumTTS = false,
      aiEnhancement = false
    } = options;

    const roundedMinutes = Math.ceil(durationMinutes);
    let baseCost = resolution === '1080p' ? 8 : 5;
    let videoCost = baseCost * roundedMinutes;
    let musicCost = customMusic ? 2 : 0;
    let ttsCost = premiumTTS ? 3 : 0;
    let enhancementCost = aiEnhancement ? 4 : 0;

    const totalCost = videoCost + musicCost + ttsCost + enhancementCost;

    return {
      breakdown: { video: videoCost, music: musicCost, tts: ttsCost, enhancement: enhancementCost },
      total: totalCost,
      durationMinutes: roundedMinutes,
      resolution
    };
  }

  /**
   * Check if user has sufficient credits
   */
  async hasEnoughCredits(userId, requiredCredits) {
    const balance = await this.getUserBalance(userId);
    return balance >= requiredCredits;
  }

  /**
   * Debit credits from user account
   */
  async debitCredits(userId, amount, description, videoGenerationId = null) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const userResult = await client.query('SELECT credit_balance FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) throw new Error('User not found');
      
      const user = userResult.rows[0];
      if (user.credit_balance < amount) throw new Error('Insufficient credits');

      const newBalance = user.credit_balance - amount;

      await client.query('UPDATE users SET credit_balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newBalance, userId]);

      const result = await client.query(`
        INSERT INTO transactions (user_id, type, amount, balance_after, description, status)
        VALUES ($1, 'DEBIT', $2, $3, $4, 'COMPLETED') RETURNING id
      `, [userId, amount, newBalance, description]);
      
      const transactionId = result.rows[0].id;

      if (videoGenerationId) {
        await client.query('UPDATE video_generations SET transaction_id = $1 WHERE id = $2', [transactionId, videoGenerationId]);
      }

      await client.query('COMMIT');
      return { transactionId, amountDebited: amount, balanceAfter: newBalance };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Credit credits to user account
   */
  async creditCredits(userId, amount, type, description, paymentId = null) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const userResult = await client.query('SELECT credit_balance, total_credits_purchased FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) throw new Error('User not found');
      
      const user = userResult.rows[0];
      const newBalance = user.credit_balance + amount;
      const newTotalPurchased = type === 'PURCHASE' ? user.total_credits_purchased + amount : user.total_credits_purchased;

      await client.query(`
        UPDATE users 
        SET credit_balance = $1, total_credits_purchased = $2, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3
      `, [newBalance, newTotalPurchased, userId]);

      const result = await client.query(`
        INSERT INTO transactions (user_id, type, amount, balance_after, description, payment_id, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'COMPLETED') RETURNING id
      `, [userId, type, amount, newBalance, description, paymentId]);
      
      const transactionId = result.rows[0].id;
      
      await client.query('COMMIT');
      return { transactionId, amountCredited: amount, balanceAfter: newBalance };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Refund credits for failed video generation
   */
  async refundCredits(userId, videoGenerationId) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const videoGenResult = await client.query('SELECT credits_used, status FROM video_generations WHERE id = $1 AND user_id = $2', [videoGenerationId, userId]);
      if (videoGenResult.rows.length === 0) throw new Error('Video generation not found');
      
      const videoGen = videoGenResult.rows[0];
      if (videoGen.status === 'REFUNDED') throw new Error('Credits already refunded');

      const refund = await this.creditCredits(userId, videoGen.credits_used, 'REFUND', `Refund for failed video generation #${videoGenerationId}`);

      await client.query('UPDATE video_generations SET status = $1 WHERE id = $2', ['REFUNDED', videoGenerationId]);

      await client.query('COMMIT');
      return refund;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(userId, options = {}) {
    const { limit = 50, offset = 0, type = null } = options;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    let params = [userId];
    let paramCount = 2;

    if (type) {
      query += ` AND type = $${paramCount++}`;
      params.push(type);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const transactions = await db.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = $1';
    let countParams = [userId];
    
    if (type) {
      countQuery += ' AND type = $2';
      countParams.push(type);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total, 10);

    return {
      transactions: transactions.rows,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    };
  }

  /**
   * Get all active credit packages
   */
  async getActivePackages() {
    const packages = await db.query('SELECT * FROM credit_packages WHERE is_active = 1 ORDER BY price ASC');
    return packages.rows;
  }

  /**
   * Get package by ID
   */
  async getPackageById(packageId) {
    const pkgResult = await db.query('SELECT * FROM credit_packages WHERE id = $1 AND is_active = 1', [packageId]);
    if (pkgResult.rows.length === 0) throw new Error('Package not found');
    return pkgResult.rows[0];
  }

  /**
   * Create video generation record
   */
  async createVideoGeneration(userId, creditsUsed, options) {
    const result = await db.query(`
      INSERT INTO video_generations (user_id, credits_used, duration_seconds, resolution, options, status)
      VALUES ($1, $2, $3, $4, $5, 'PROCESSING') RETURNING id
    `, [userId, creditsUsed, options.durationSeconds || null, options.resolution || null, JSON.stringify(options)]);

    return result.rows[0].id;
  }

  /**
   * Update video generation status
   */
  async updateVideoGeneration(videoGenId, updates) {
    const { status, videoUrl } = updates;
    await db.query(`
      UPDATE video_generations 
      SET status = $1, 
          video_url = $2,
          completed_at = CASE WHEN $3 IN ('COMPLETED', 'FAILED') THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = $4
    `, [status, videoUrl || null, status, videoGenId]);
  }

  /**
   * Get video generation history for user
   */
  async getVideoHistory(userId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const videosResult = await db.query(`
      SELECT vg.*, t.description as transaction_description
      FROM video_generations vg
      LEFT JOIN transactions t ON vg.transaction_id = t.id
      WHERE vg.user_id = $1
      ORDER BY vg.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) as total FROM video_generations WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].total, 10);

    return {
      videos: videosResult.rows.map(v => ({
        ...v,
        options: v.options ? JSON.parse(v.options) : {}
      })),
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    };
  }
}

module.exports = new CreditService();
