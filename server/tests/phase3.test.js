'use strict';
/**
 * Phase 3 Tests
 *
 * 1. ElevenLabs service: confirms all scenes dispatched IN PARALLEL (Promise.all)
 * 2. Remotion renderer: sceneTypeToCompositionId covers all 7 types
 * 3. QueueService: runElevenLabsRemotionPipeline calls all 3 stages in correct order
 *
 * NOTE on jest.mock() vs jest.doMock():
 *   - jest.mock() is hoisted by Babel and cannot reference non-mock-prefixed variables
 *     defined outside the factory. We use top-level jest.mock() only for module-wide stubs.
 *   - jest.doMock() is NOT hoisted and CAN reference any variable. We use it inside
 *     test/beforeEach functions where we need dynamic mocks.
 */

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost/placeholder';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-32chars';
process.env.ELEVENLABS_API_KEY = 'test-key';
process.env.ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// ── Module-wide stubs (top-level jest.mock — hoisted, no var references) ──────
jest.mock('../db/database', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  pool: { connect: jest.fn(), end: jest.fn() },
}));

// ── Test 1: ElevenLabs parallel dispatch ─────────────────────────────────────
// Mock variables MUST be mock-prefixed when referenced in top-level jest.mock() factories.
let mockInflight = 0;
let mockMaxInflight = 0;
let mockHttpResolvers = [];

jest.mock('https', () => ({
  request: jest.fn((_opts, callback) => {
    mockInflight++;
    if (mockInflight > mockMaxInflight) mockMaxInflight = mockInflight;

    const mockRes = { statusCode: 200, on: jest.fn() };
    const mockPromise = new Promise((resolve) => mockHttpResolvers.push(resolve));

    mockRes.on.mockImplementation((event, cb) => {
      if (event === 'data') mockPromise.then(() => cb(Buffer.from('x')));
      if (event === 'end')  mockPromise.then(() => { mockInflight--; cb(); });
    });

    callback(mockRes);
    return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
  }),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    ...jest.requireActual('fs').promises,
    mkdir:     jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    unlink:    jest.fn().mockResolvedValue(undefined),
    rm:        jest.fn().mockResolvedValue(undefined),
    copyFile:  jest.fn().mockResolvedValue(undefined),
  },
}));

describe('ElevenLabsService.synthesizeAllScenes() — parallel dispatch', () => {
  beforeEach(() => {
    mockInflight = 0;
    mockMaxInflight = 0;
    mockHttpResolvers = [];
  });

  test('all scenes start before any resolves (Promise.all behaviour)', async () => {
    const service = require('../services/elevenlabs');
    const scenes = [
      { narration: 'Scene one' },
      { narration: 'Scene two' },
      { narration: 'Scene three' },
    ];

    const synthPromise = service.synthesizeAllScenes(scenes, '/tmp/audio');
    await new Promise(r => setImmediate(r));

    // With Promise.all all 3 start before any finishes
    expect(mockHttpResolvers.length).toBe(3);
    expect(mockMaxInflight).toBe(3);

    mockHttpResolvers.forEach(r => r());
    await synthPromise;
  });
});

// ── Test 2: Remotion — sceneTypeToCompositionId ───────────────────────────────
describe('remotionRenderer.sceneTypeToCompositionId() — all 7 scene types', () => {
  const { sceneTypeToCompositionId } = require('../services/remotionRenderer');

  const cases = [
    ['definition',    'Definition'],
    ['flowchart',     'Flowchart'],
    ['timeline',      'Timeline'],
    ['comparison',    'Comparison'],
    ['diagram',       'Diagram'],
    ['bar_chart',     'BarChart'],
    ['bullet_points', 'BulletPoints'],
  ];

  test.each(cases)('%s → %s', (type, expected) => {
    expect(sceneTypeToCompositionId(type)).toBe(expected);
  });

  test('unknown type throws a descriptive error', () => {
    expect(() => sceneTypeToCompositionId('unknown')).toThrow('Unknown scene_type');
  });
});

// ── Test 3: Pipeline method unit test ─────────────────────────────────────────
// Uses jest.doMock() (not hoisted) so we can build the ffmpeg mock with a local variable.
describe('QueueService.runElevenLabsRemotionPipeline() — stage ordering', () => {

  function setupMocks({ elevenLabsConfigured = true } = {}) {
    jest.resetModules();

    // jest.doMock() is NOT hoisted — safe to use local variables in factories
    // The ffmpeg instance must fire the 'end' event so concatVideos() resolves.
    jest.doMock('fluent-ffmpeg', () => {
      const mockInstance = {
        input: jest.fn().mockReturnThis(),
        // Fire 'end' callback immediately so the Promise inside concatVideos resolves
        on: jest.fn((event, cb) => {
          if (event === 'end') setImmediate(cb);
          return mockInstance;
        }),
        mergeToFile: jest.fn().mockReturnThis(),
      };
      const mockFfmpegFn = jest.fn(() => mockInstance);
      mockFfmpegFn.setFfmpegPath = jest.fn();
      return mockFfmpegFn;
    });
    jest.doMock('ffmpeg-static', () => '/usr/bin/ffmpeg');

    jest.doMock('../db/database', () => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      pool: { connect: jest.fn(), end: jest.fn() },
    }));

    jest.doMock('../services/elevenlabs', () => ({
      isConfigured: elevenLabsConfigured,
      synthesizeAllScenes: jest.fn().mockResolvedValue(['/tmp/a0.mp3', '/tmp/a1.mp3']),
    }));

    jest.doMock('../services/remotionRenderer', () => ({
      renderAllScenes: jest.fn().mockResolvedValue(['/tmp/s0.mp4', '/tmp/s1.mp4']),
      sceneTypeToCompositionId: jest.fn(),
    }));

    jest.doMock('../services/storage', () => ({
      uploadFile: jest.fn().mockResolvedValue('https://cdn.example.com/video.mp4'),
    }));

    jest.doMock('../services/scriptGenerator', () => ({
      generateStructuredScenes: jest.fn().mockResolvedValue([
        { scene_number: 1, title: 'S1', narration: 'N1', scene_type: 'bullet_points', visual: { data: {} } },
        { scene_number: 2, title: 'S2', narration: 'N2', scene_type: 'bullet_points', visual: { data: {} } },
      ]),
    }));

    jest.doMock('../services/creditService', () => ({ creditCredits: jest.fn() }));
    jest.doMock('../services/video', () => ({
      generateVideoFromScenes: jest.fn(),
      generateVideoFromTextFile: jest.fn(),
    }));
    jest.doMock('../utils/textFormatter', () => ({
      chunkScript: jest.fn(),
      stripMarkdown: jest.fn(t => t),
    }));
  }


  test('calls scriptGenerator → elevenlabs → remotion in order, returns .mp4 path', async () => {
    setupMocks({ elevenLabsConfigured: true });

    const queue      = require('../services/queue');
    const generator  = require('../services/scriptGenerator');
    const elevenlabs = require('../services/elevenlabs');
    const remotion   = require('../services/remotionRenderer');

    const result = await queue.runElevenLabsRemotionPipeline(
      'Test lecture script.',
      { resolution: '720p', mode: 'detailed', style: 'professor' },
      'job-unit-001',
      require('os').tmpdir()
    );

    // All three stages must have been called exactly once
    expect(generator.generateStructuredScenes).toHaveBeenCalledTimes(1);
    expect(elevenlabs.synthesizeAllScenes).toHaveBeenCalledTimes(1);
    expect(remotion.renderAllScenes).toHaveBeenCalledTimes(1);

    // ElevenLabs receives the scenes array
    expect(elevenlabs.synthesizeAllScenes).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ narration: 'N1' })]),
      expect.any(String) // outputDir
    );

    // Remotion receives scenes + audio paths
    expect(remotion.renderAllScenes).toHaveBeenCalledWith(
      expect.any(Array),
      ['/tmp/a0.mp3', '/tmp/a1.mp3'],
      expect.any(String) // outputDir
    );

    expect(result).toMatch(/\.mp4$/);
  }, 10000);

  test('throws if ELEVENLABS_API_KEY is not set (isConfigured=false)', async () => {
    setupMocks({ elevenLabsConfigured: false });

    const queue = require('../services/queue');
    await expect(
      queue.runElevenLabsRemotionPipeline('script', {}, 'job-x', require('os').tmpdir())
    ).rejects.toThrow('ELEVENLABS_API_KEY not set');
  }, 10000);
});
