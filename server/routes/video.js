const express = require('express');
const router = express.Router();
const queueService = require('../services/queue');
const creditService = require('../services/creditService');
const authMiddleware = require('../middleware/auth');

// Generate video by enqueueing a background job
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { script, options } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    // Calculate cost: 1 credit per 1000 characters
    const estimatedMinutes = Math.max(1, Math.ceil(script.length / 1000));
    const costDetails = creditService.calculateCost({
      durationMinutes: estimatedMinutes,
      resolution: options?.ratio === '16:9' ? '1080p' : '720p',
      premiumTTS: true
    });

    const requiredCredits = costDetails.total;
    const userId = req.userId;

    // Check credits
    if (!creditService.hasEnoughCredits(userId, requiredCredits)) {
      return res.status(402).json({ 
        error: 'Insufficient credits',
        required: requiredCredits,
        current: creditService.getUserBalance(userId)
      });
    }

    // Deduct credits
    const transaction = creditService.debitCredits(
      userId, 
      requiredCredits, 
      'Video Generation via D-ID'
    );

    // Add job to the SQLite queue with transaction details for potential refund
    const jobId = queueService.addJob('generate_video', { 
      script, 
      options: options || {},
      userId,
      transactionId: transaction.transactionId
    });
    
    res.json({
      success: true,
      message: 'Video generation queued successfully',
      jobId,
      creditsDeducted: requiredCredits
    });
  } catch (error) {
    console.error('Error queuing video generation:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

// Check status of a video generation job via Server-Sent Events (SSE)
router.get('/status/:jobId', authMiddleware, (req, res) => {
  const { jobId } = req.params;
  const initialJob = queueService.getJob(jobId);
  
  if (!initialJob) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Setup SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Helper to send events
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial state
  sendEvent({
    status: initialJob.status,
    videoUrl: initialJob.result?.videoUrl || null,
    error: initialJob.error
  });

  // If already done, close connection
  if (initialJob.status === 'completed' || initialJob.status === 'failed') {
    res.end();
    return;
  }

  // Listen for updates from the QueueService
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

  // Cleanup on client disconnect
  const cleanup = () => {
    queueService.removeListener('job_updated', onJobUpdate);
  };
  req.on('close', cleanup);
});

// Get video history (stub)
router.get('/history', authMiddleware, (req, res) => {
  res.json({ success: true, videos: [] });
});

module.exports = router;
