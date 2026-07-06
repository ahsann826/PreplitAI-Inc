'use strict';
/**
 * Rate limiting middleware using rate-limiter-flexible.
 *
 * Applied to routes that call paid external APIs (Groq, ElevenLabs) so
 * a single user cannot exhaust API quotas or run up costs.
 *
 * Configuration via environment variables:
 *   RATE_LIMIT_PER_USER_PER_HOUR  — max requests per user per hour (default: 20)
 *   RATE_LIMIT_GLOBAL_PER_MINUTE  — global request ceiling per minute (default: 60)
 */

const { RateLimiterMemory } = require('rate-limiter-flexible');

const PER_USER_POINTS = parseInt(process.env.RATE_LIMIT_PER_USER_PER_HOUR || '20', 10);
const GLOBAL_POINTS   = parseInt(process.env.RATE_LIMIT_GLOBAL_PER_MINUTE  || '60', 10);

// Per-user limiter: keyed by userId (set by authMiddleware)
const perUserLimiter = new RateLimiterMemory({
  keyPrefix: 'rl_user',
  points: PER_USER_POINTS,
  duration: 60 * 60, // 1 hour
});

// Global limiter: protects against distributed abuse
const globalLimiter = new RateLimiterMemory({
  keyPrefix: 'rl_global',
  points: GLOBAL_POINTS,
  duration: 60, // 1 minute
});

/**
 * Express middleware that enforces both per-user and global rate limits.
 * Must be placed AFTER authMiddleware so req.userId is available.
 */
async function rateLimitMiddleware(req, res, next) {
  try {
    // Per-user limit (keyed by authenticated user id)
    const userKey = String(req.userId || req.ip);
    await perUserLimiter.consume(userKey, 1);

    // Global limit
    await globalLimiter.consume('global', 1);

    next();
  } catch (rejRes) {
    const retryAfter = Math.ceil(
      (rejRes.msBeforeNext || 60000) / 1000
    );
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Please wait ${retryAfter} seconds before retrying.`,
      retryAfter
    });
  }
}

module.exports = { rateLimitMiddleware };
