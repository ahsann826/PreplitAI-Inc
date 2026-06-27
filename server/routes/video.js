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

    // TODO: We could deduct credits here if we wanted, 
    // but for now let's just queue the job.
    
    // Add job to the SQLite queue
    const jobId = queueService.addJob('generate_video', { script, options: options || {} });
    
    res.json({
      success: true,
      message: 'Video generation queued successfully',
      jobId
    });
  } catch (error) {
    console.error('Error queuing video generation:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

// Check status of a video generation job
router.get('/status/:jobId', authMiddleware, (req, res) => {
  try {
    const job = queueService.getJob(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({
      success: true,
      status: job.status,
      videoUrl: job.result ? job.result.videoUrl : null,
      error: job.error
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status' });
  }
});

// Get video history (this is still a stub, it would typically fetch from the database's user_videos table)
router.get('/history', authMiddleware, (req, res) => {
  res.json({ success: true, videos: [] });
});

module.exports = router;
