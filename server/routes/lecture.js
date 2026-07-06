const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const documentParser = require('../services/documentParser');
const scriptGenerator = require('../services/scriptGenerator');
const authMiddleware = require('../middleware/auth');
const { rateLimitMiddleware } = require('../middleware/rateLimit');

// BUG-006 FIX: /generate now requires authentication.
// Phase 2: rate limiter applied after auth so we can key by userId.
// This prevents a single authenticated user from hammering paid Groq API calls.
router.post('/generate', authMiddleware, rateLimitMiddleware, async (req, res) => {
  try {
    const { documentId, mode, style } = req.body;

    // Validate inputs
    if (!documentId || !mode || !style) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['documentId', 'mode', 'style']
      });
    }

    const validModes = ['summary', 'detailed', 'test'];
    const validStyles = ['professor', 'visual'];

    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode', validModes });
    }

    if (!validStyles.includes(style)) {
      return res.status(400).json({ error: 'Invalid style', validStyles });
    }

    // Get the document file
    const filePath = path.join(__dirname, '../uploads', documentId);

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        error: 'Document not found',
        message: 'The uploaded document could not be found. Please upload again.'
      });
    }

    const ext = path.extname(documentId).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.txt': 'text/plain'
    };
    const mimeType = mimeTypes[ext];

    // Parse document
    console.log('Parsing document...');
    const text = await documentParser.parseDocument(filePath, mimeType);

    // Generate script
    console.log('Generating lecture script...');
    const script = await scriptGenerator.generateScript(text, mode, style);

    // Generate structured scenes
    console.log('Generating structured scenes...');
    let scenes = null;
    let warning = undefined;
    try {
      scenes = await scriptGenerator.generateStructuredScenes(script, mode, style);
    } catch (e) {
      console.warn('Structured scene generation failed:', e.message);
      warning = `Structured scene generation failed: ${e.message}`;
    }

    res.json({
      success: true,
      lecture: {
        documentId,
        mode,
        style,
        script,
        sceneBreakdown: null,
        scenes,
        wordCount: script.split(' ').length,
        estimatedDuration: Math.ceil(script.split(' ').length / 150)
      },
      message: 'Lecture script generated successfully',
      warning,
      next: 'Submit the script to /api/video/generate to produce a video'
    });

  } catch (error) {
    console.error('Lecture generation error:', error);
    res.status(500).json({
      error: 'Failed to generate lecture',
      message: error.message
    });
  }
});

// Get lecture status
router.get('/status/:lectureId', async (req, res) => {
  res.json({
    message: 'Video generation tracking coming soon',
    lectureId: req.params.lectureId
  });
});

module.exports = router;
