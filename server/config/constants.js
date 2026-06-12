/**
 * Server-wide configuration constants.
 * Eliminates JWT_SECRET duplication between middleware/auth.js and routes/auth.js.
 */

module.exports = {
  /** JWT signing secret — must be overridden in production via environment variable */
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  /** HTTP port the Express server listens on */
  PORT: process.env.PORT || 5000,

  /** Allowed MIME types for document uploads */
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],

  /** Maximum upload file size in bytes (10 MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  /** JWT token expiry duration */
  JWT_EXPIRES_IN: '7d',
};
