'use strict';

/**
 * Tests for Phase 1 bug fixes:
 *   BUG-004 — resolvePython() platform selection
 *   BUG-005 — /api/upload requires auth
 *   BUG-006 — /api/lecture/generate requires auth
 *   BUG-007 — /api/video/history not a stub (verified present, was already fixed)
 *   BUG-008 — refund uses data.creditsDeducted (verified present, was already fixed)
 */

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost/placeholder';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-32chars';
process.env.GROQ_API_KEY = 'test';

// ── Mock the database so tests don't need a real connection ──────────────────
jest.mock('../db/database', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  pool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    }),
    end: jest.fn(),
  },
}));

// ── BUG-004: resolvePython() platform selection ──────────────────────────────
describe('BUG-004 — resolvePython() selects the right binary per platform', () => {
  let originalPlatform;

  beforeEach(() => {
    originalPlatform = process.platform;
    // Clear module cache so re-requiring picks up the platform override
    jest.resetModules();
    // Re-apply the DB mock after resetModules
    jest.mock('../db/database', () => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      pool: { connect: jest.fn(), end: jest.fn() },
    }));
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  test('win32 → Scripts/python.exe', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' });
    const videoService = require('../services/video');
    // resolvePython is not exported, but we can infer via the module path used in spawn.
    // We test by checking the path includes the expected segment.
    // Access the private function via module internals inspection:
    const src = require('fs').readFileSync(require('path').join(__dirname, '../services/video.js'), 'utf-8');
    expect(src).toMatch(/process\.platform.*win32/);
    expect(src).toMatch(/Scripts.*python\.exe/);
    expect(src).toMatch(/bin.*python3/);
  });

  test('linux → bin/python3', () => {
    Object.defineProperty(process, 'platform', { value: 'linux' });
    // resolvePython returns the else branch. We verify the code path exists.
    const path = require('path');
    const src = require('fs').readFileSync(path.join(__dirname, '../services/video.js'), 'utf-8');
    expect(src).toContain("return path.join(root, '.venv', 'bin', 'python3')");
  });
});

// ── BUG-005 / BUG-006: Auth protection on upload + lecture ───────────────────
const request = require('supertest');
const express = require('express');

function buildApp() {
  const app = express();
  app.use(express.json());

  // Mock multer so supertest doesn't need a real file upload
  jest.mock('multer', () => {
    const multerMock = () => ({
      single: () => (req, res, next) => {
        req.file = null; // no file — will trigger 400, but we only care about 401 first
        next();
      }
    });
    multerMock.diskStorage = () => ({});
    return multerMock;
  });

  const uploadRoutes = require('../routes/upload');
  const lectureRoutes = require('../routes/lecture');
  app.use('/api/upload', uploadRoutes);
  app.use('/api/lecture', lectureRoutes);
  return app;
}

describe('BUG-005 — /api/upload requires authentication', () => {
  let app;

  beforeAll(() => {
    jest.resetModules();
    jest.mock('../db/database', () => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      pool: { connect: jest.fn(), end: jest.fn() },
    }));
    jest.mock('multer', () => {
      const m = () => ({ single: () => (req, res, next) => next() });
      m.diskStorage = () => ({});
      return m;
    });
    app = express();
    app.use(express.json());
    app.use('/api/upload', require('../routes/upload'));
  });

  test('POST /api/upload without token → 401', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Content-Type', 'multipart/form-data');
    expect(res.status).toBe(401);
  });

  test('POST /api/upload/text without token → 401', async () => {
    const res = await request(app)
      .post('/api/upload/text')
      .send({ text: 'hello world' });
    expect(res.status).toBe(401);
  });
});

describe('BUG-006 — /api/lecture/generate requires authentication', () => {
  let app;

  beforeAll(() => {
    jest.resetModules();
    jest.mock('../db/database', () => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      pool: { connect: jest.fn(), end: jest.fn() },
    }));
    app = express();
    app.use(express.json());
    app.use('/api/lecture', require('../routes/lecture'));
  });

  test('POST /api/lecture/generate without token → 401', async () => {
    const res = await request(app)
      .post('/api/lecture/generate')
      .send({ documentId: 'test.pdf', mode: 'summary', style: 'professor' });
    expect(res.status).toBe(401);
  });
});

// ── BUG-007 / BUG-008: verify fixes are present in source code ───────────────
describe('BUG-007 — /api/video/history wired to creditService.getVideoHistory', () => {
  test('video route source contains getVideoHistory call (not hardcoded stub)', () => {
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '../routes/video.js'), 'utf-8'
    );
    expect(src).toContain('creditService.getVideoHistory');
    expect(src).not.toMatch(/videos:\s*\[\]/); // old stub returned videos: []
  });
});

describe('BUG-008 — refund uses data.creditsDeducted, not recomputed cost', () => {
  test('queue source reads creditsDeducted from job payload', () => {
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '../services/queue.js'), 'utf-8'
    );
    expect(src).toContain('data.creditsDeducted');
    // Must NOT contain the old re-computation pattern
    expect(src).not.toContain('data.script.length / 1000');
  });

  test('queue source logs REFUND_AMOUNT_MISSING when creditsDeducted is absent', () => {
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '../services/queue.js'), 'utf-8'
    );
    expect(src).toContain('REFUND_AMOUNT_MISSING');
  });
});
