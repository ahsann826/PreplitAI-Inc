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
const INSECURE_DEFAULT = 'your-secret-key-change-in-production';

let JWT_SECRET;
if (process.env.JWT_SECRET && process.env.JWT_SECRET !== INSECURE_DEFAULT) {
  // A real secret is set — use it
  JWT_SECRET = process.env.JWT_SECRET;
} else if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === INSECURE_DEFAULT)) {
  // In production with no secret or the known-insecure default — hard failure
  console.error('FATAL: JWT_SECRET must be set to a unique secret in production.');
  console.error('Go to Vercel Dashboard → Project → Settings → Environment Variables');
  console.error('Add JWT_SECRET with a strong random value (min 32 chars).');
  process.exit(1);
} else {
  JWT_SECRET = INSECURE_DEFAULT;
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
