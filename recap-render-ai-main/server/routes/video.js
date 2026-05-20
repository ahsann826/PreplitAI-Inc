const express = require('express');
const router = express.Router();

// Test mode stubs: no external API calls, just simple responses
router.post('/generate', (req, res) => {
  res.json({
    success: true,
    message: 'Video generation is disabled in test mode',
    videoUrl: null,
    srtUrl: null
  });
});

router.get('/history', (req, res) => {
  res.json({ success: true, videos: [] });
});

module.exports = router;
