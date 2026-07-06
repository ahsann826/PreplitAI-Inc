const express = require('express');
const router = express.Router();
const queueService = require('../services/queue');
const creditService = require('../services/creditService');
const authMiddleware = require('../middleware/auth');
const { rateLimitMiddleware } = require('../middleware/rateLimit');

// ── POST /api/video/generate ──────────────────────────────────────────────────
// Deducts credits and enqueues a video generation job.
// Rate limiter is applied after auth (keyed by userId) to prevent API abuse.
router.post('/generate', authMiddleware, rateLimitMiddleware, async (req, res) => {
  try {
    const { script, options } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    // ── 1.4 FIX: Duration from word count, not character count ────────────────
    // Use the same WORDS_PER_MINUTE constant as creditService so the quote
    // endpoint (/api/credits/calculate-cost) and this charging path always agree.
    const wordCount = script.trim().split(/\s+/).filter(Boolean).length;

    // ── 1.4 FIX: Read real options from the request body ──────────────────────
    // Do NOT hardcode premiumTTS or drop other flags on the floor.
    const resolution = options?.ratio === '16:9' ? '1080p' : (options?.resolution || '720p');
    const premiumTTS = options?.premiumTTS === true;
    const customMusic = options?.customMusic === true;
    const aiEnhancement = options?.aiEnhancement === true;

    const costDetails = creditService.calculateCost({
      wordCount,
      resolution,
      premiumTTS,
      customMusic,
      aiEnhancement
    });

    const requiredCredits = costDetails.total;
    const userId = req.userId;

    // ── 1.1 FIX: await the async credit check ────────────────────────────────
    const hasCredits = await creditService.hasEnoughCredits(userId, requiredCredits);
    if (!hasCredits) {
      const currentBalance = await creditService.getUserBalance(userId);
      return res.status(402).json({
        error: 'Insufficient credits',
        required: requiredCredits,
        current: currentBalance,
        costBreakdown: costDetails.breakdown
      });
    }

    // ── 1.2 FIX: await the debit and only enqueue AFTER the debit commits ─────
    let debitResult;
    try {
      debitResult = await creditService.debitCredits(
        userId,
        requiredCredits,
        `Video Generation (${costDetails.durationMinutes} min, ${resolution})`
      );
    } catch (debitError) {
      // Debit failed (e.g. race condition caught by FOR UPDATE) — do NOT enqueue
      if (debitError.message === 'Insufficient credits') {
        const currentBalance = await creditService.getUserBalance(userId);
        return res.status(402).json({
          error: 'Insufficient credits',
          required: requiredCredits,
          current: currentBalance
        });
      }
      throw debitError;
    }

    // ── 1.5 FIX: store the exact amount debited in the job payload ────────────
    // The queue's refund path reads data.creditsDeducted and refunds exactly that —
    // it must never recompute the cost, which could drift from what was charged.
    const jobId = await queueService.addJob('generate_video', {
      script,
      options: { ...options, resolution, premiumTTS, customMusic, aiEnhancement },
      userId,
      transactionId: debitResult.transactionId,
      creditsDeducted: debitResult.amountDebited   // ← single source of truth for refund
    });

    res.json({
      success: true,
      message: 'Video generation queued successfully',
      jobId,
      creditsDeducted: requiredCredits,
      costBreakdown: costDetails.breakdown,
      balanceAfter: debitResult.balanceAfter
    });
  } catch (error) {
    console.error('Error queuing video generation:', error);
    res.status(500).json({ error: 'Failed to start video generation', message: error.message });
  }
});

// ── GET /api/video/status/:jobId ──────────────────────────────────────────────
// Check status of a video generation job via Server-Sent Events (SSE)
router.get('/status/:jobId', authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const initialJob = await queueService.getJob(jobId);

  if (!initialJob) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Setup SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent({
    status: initialJob.status,
    videoUrl: initialJob.result?.videoUrl || null,
    error: initialJob.error
  });

  if (initialJob.status === 'completed' || initialJob.status === 'failed') {
    res.end();
    return;
  }

  const onJobUpdate = (update) => {
    if (update.jobId === jobId) {
      sendEvent({
        status: update.status,
        videoUrl: update.result?.videoUrl || null,
        error: update.error
      });

      if (update.status === 'completed' || update.status === 'failed') {
        cleanup();
        res.end();
      }
    }
  };

  queueService.on('job_updated', onJobUpdate);

  const cleanup = () => {
    queueService.removeListener('job_updated', onJobUpdate);
  };
  req.on('close', cleanup);
});

// ── 1.8 FIX: Remove dead /history stub. ──────────────────────────────────────
// The frontend's api.ts calls /api/video/history but that was returning a
// hardcoded empty array. Redirect to the real implementation at
// /api/credits/video-history which calls creditService.getVideoHistory().
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await creditService.getVideoHistory(req.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching video history:', error);
    res.status(500).json({ error: 'Failed to fetch video history', message: error.message });
  }
});

module.exports = router;
