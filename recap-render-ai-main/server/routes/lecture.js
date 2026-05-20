const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const documentParser = require('../services/documentParser');
const scriptGenerator = require('../services/scriptGenerator');

// Generate lecture from uploaded document
router.post('/generate', async (req, res) => {
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
      return res.status(400).json({ 
        error: 'Invalid mode',
        validModes 
      });
    }

    if (!validStyles.includes(style)) {
      return res.status(400).json({ 
        error: 'Invalid style',
        validStyles 
      });
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

    // Get file info to determine mime type
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

    // Generate scene breakdown
    console.log('Generating scene breakdown...');
    const sceneBreakdown = await scriptGenerator.generateSceneBreakdown(script);

    res.json({
      success: true,
      lecture: {
        documentId,
        mode,
        style,
        script,
        sceneBreakdown,
        wordCount: script.split(' ').length,
        estimatedDuration: Math.ceil(script.split(' ').length / 150) // ~150 words per minute
      },
      message: 'Lecture script generated successfully',
      next: 'Video generation will be added in the next phase'
    });

  } catch (error) {
    console.error('Lecture generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate lecture',
      message: error.message 
    });
  }
});

// Get lecture status (placeholder for future video generation tracking)
router.get('/status/:lectureId', async (req, res) => {
  res.json({
    message: 'Video generation tracking coming soon',
    lectureId: req.params.lectureId
  });
});

module.exports = router;
