/**
 * Server-wide configuration constants.
 * All secrets MUST be provided via environment variables.
 * This file performs startup validation — missing secrets cause an immediate crash
 * rather than silently running with insecure defaults.
 */

const isProduction = process.env.NODE_ENV === 'production';

// ── JWT Secret ────────────────────────────────────────────────────────────────
// Hard failure in production if not set. In development, allow the insecure
// default but emit a loud warning so developers don't miss it.
let JWT_SECRET;
if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET;
} else if (isProduction) {
  console.error('FATAL: JWT_SECRET environment variable is not set in production.');
  console.error('Generate a secure 64-char secret and set it as JWT_SECRET.');
  process.exit(1);
} else {
  JWT_SECRET = 'your-secret-key-change-in-production';
  console.warn(
    '⚠️  WARNING: JWT_SECRET is using the insecure development default. ' +
    'Set JWT_SECRET in your .env file before deploying to production.'
  );
}

module.exports = {
  /** JWT signing secret */
  JWT_SECRET,

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
