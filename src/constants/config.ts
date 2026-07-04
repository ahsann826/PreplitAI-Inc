/**
 * Application-wide configuration constants.
 * Single source of truth — avoids duplicate API_BASE_URL definitions
 * that previously existed in api.ts, AuthContext.tsx, and AccountOverview.tsx.
 */

/**
 * Backend API base URL.
 * In production, points directly to the Express server.
 * In development, uses the Vite proxy (configured in vite.config.ts).
 */
export const API_BASE_URL = '/api';

/** Application display name */
export const SITE_NAME = 'PreplitAI';

/** Default site URL (overridden by VITE_SITE_URL env var) */
export const DEFAULT_SITE_URL =
  (import.meta as any).env?.VITE_SITE_URL || 'https://yourdomain.com';

// ── Video Generation Defaults ──────────────────────────────────────────────

/** Default D-ID avatar image URL */
export const DEFAULT_AVATAR_URL =
  'https://create-images-results.d-id.com/DefaultPresenters/Billy_m/v2_with_background_image.jpg';

/** Default Azure TTS voice ID */
export const DEFAULT_VOICE_ID = 'en-US-JennyNeural';

// ── Auth ───────────────────────────────────────────────────────────────────

/** localStorage key for the JWT token */
export const TOKEN_STORAGE_KEY = 'token';
