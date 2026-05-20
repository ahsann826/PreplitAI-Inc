const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const documentParser = require('../services/documentParser');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload and parse document
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file.filename);

    // Resolve the stored path explicitly to avoid env-specific path issues
    const storedPath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('Stored path:', storedPath, 'mimetype:', req.file.mimetype, 'originalname:', req.file.originalname);

    // Parse the document
    const text = await documentParser.parseDocument(
      storedPath,
      req.file.mimetype
    );

    // Return success with document ID and preview
    res.json({
      success: true,
      documentId: req.file.filename,
      fileName: req.file.originalname,
      textPreview: text.substring(0, 200) + '...',
      wordCount: text.split(' ').length,
      message: 'Document uploaded and processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if parsing failed
    if (req.file) {
      try {
        const storedPath = path.join(__dirname, '../uploads', req.file.filename);
        await fs.unlink(storedPath);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to process document',
      message: error.message 
    });
  }
});

module.exports = router;
