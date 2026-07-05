/**
 * Unit + Integration Tests for creditService
 *
 * Tests cover:
 *  - calculateCost() with all options, rounding, invalid inputs
 *  - WORDS_PER_MINUTE constant
 *
 * Note: Integration tests (debit/refund/concurrency) require a real DB
 * connection and are in creditService.integration.test.js
 */

'use strict';

// creditService uses require('dotenv') indirectly via db, so ensure DATABASE_URL
// is set to something non-empty (the pool won't actually be exercised by unit tests)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost/test_placeholder';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// We must mock the DB module so unit tests don't attempt a real connection
jest.mock('../db/database', () => ({
  query: jest.fn(),
  pool: {
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

const creditService = require('../services/creditService');

// ── calculateCost() unit tests ────────────────────────────────────────────────

describe('creditService.calculateCost()', () => {
  // ── Base resolution pricing ──────────────────────────────────────────────

  test('720p, 1 minute → 5 credits base', () => {
    const result = creditService.calculateCost({ durationMinutes: 1, resolution: '720p' });
    expect(result.total).toBe(5);
    expect(result.breakdown.video).toBe(5);
    expect(result.durationMinutes).toBe(1);
  });

  test('1080p, 1 minute → 8 credits base', () => {
    const result = creditService.calculateCost({ durationMinutes: 1, resolution: '1080p' });
    expect(result.total).toBe(8);
    expect(result.breakdown.video).toBe(8);
  });

  test('720p, 3 minutes → 15 credits', () => {
    const result = creditService.calculateCost({ durationMinutes: 3, resolution: '720p' });
    expect(result.total).toBe(15);
  });

  // ── Add-on flags individually ────────────────────────────────────────────

  test('premiumTTS adds 3 credits', () => {
    const without = creditService.calculateCost({ durationMinutes: 1, resolution: '720p' });
    const with_ = creditService.calculateCost({ durationMinutes: 1, resolution: '720p', premiumTTS: true });
    expect(with_.total - without.total).toBe(3);
    expect(with_.breakdown.tts).toBe(3);
  });

  test('customMusic adds 2 credits', () => {
    const without = creditService.calculateCost({ durationMinutes: 1, resolution: '720p' });
    const with_ = creditService.calculateCost({ durationMinutes: 1, resolution: '720p', customMusic: true });
    expect(with_.total - without.total).toBe(2);
    expect(with_.breakdown.music).toBe(2);
  });

  test('aiEnhancement adds 4 credits', () => {
    const without = creditService.calculateCost({ durationMinutes: 1, resolution: '720p' });
    const with_ = creditService.calculateCost({ durationMinutes: 1, resolution: '720p', aiEnhancement: true });
    expect(with_.total - without.total).toBe(4);
    expect(with_.breakdown.enhancement).toBe(4);
  });

  test('all add-ons combined: 1min 720p = 5+3+2+4 = 14', () => {
    const result = creditService.calculateCost({
      durationMinutes: 1,
      resolution: '720p',
      premiumTTS: true,
      customMusic: true,
      aiEnhancement: true
    });
    expect(result.total).toBe(14);
    expect(result.breakdown).toEqual({ video: 5, tts: 3, music: 2, enhancement: 4 });
  });

  test('all add-ons with 1080p: 1min = 8+3+2+4 = 17', () => {
    const result = creditService.calculateCost({
      durationMinutes: 1,
      resolution: '1080p',
      premiumTTS: true,
      customMusic: true,
      aiEnhancement: true
    });
    expect(result.total).toBe(17);
  });

  // ── Fractional durations — must round UP ────────────────────────────────

  test('fractional duration 1.1 min rounds up to 2 min', () => {
    const result = creditService.calculateCost({ durationMinutes: 1.1, resolution: '720p' });
    expect(result.durationMinutes).toBe(2);
    expect(result.breakdown.video).toBe(10); // 2 × 5
  });

  test('exactly 2.0 min does NOT round up', () => {
    const result = creditService.calculateCost({ durationMinutes: 2.0, resolution: '720p' });
    expect(result.durationMinutes).toBe(2);
  });

  test('0.1 min rounds up to minimum of 1 min', () => {
    const result = creditService.calculateCost({ durationMinutes: 0.1, resolution: '720p' });
    expect(result.durationMinutes).toBe(1);
    expect(result.breakdown.video).toBe(5);
  });

  // ── Word count input ─────────────────────────────────────────────────────

  test('wordCount / WORDS_PER_MINUTE drives duration', () => {
    const wpm = require('../services/creditService').WORDS_PER_MINUTE;
    expect(wpm).toBe(130);
    // 130 words = exactly 1 min → 5 credits at 720p
    const result = creditService.calculateCost({ wordCount: 130, resolution: '720p' });
    expect(result.durationMinutes).toBe(1);
    expect(result.total).toBe(5);
  });

  test('260 words at 130 WPM = 2 min → 10 credits at 720p', () => {
    const result = creditService.calculateCost({ wordCount: 260, resolution: '720p' });
    expect(result.durationMinutes).toBe(2);
    expect(result.total).toBe(10);
  });

  test('131 words rounds up to 2 min (ceil)', () => {
    const result = creditService.calculateCost({ wordCount: 131, resolution: '720p' });
    expect(result.durationMinutes).toBe(2);
  });

  // ── Invalid inputs — must throw ──────────────────────────────────────────

  test('throws on zero duration', () => {
    expect(() => creditService.calculateCost({ durationMinutes: 0 })).toThrow();
  });

  test('throws on negative duration', () => {
    expect(() => creditService.calculateCost({ durationMinutes: -1 })).toThrow();
  });

  test('throws on NaN duration', () => {
    expect(() => creditService.calculateCost({ durationMinutes: NaN })).toThrow();
  });

  test('throws when neither wordCount nor durationMinutes provided', () => {
    expect(() => creditService.calculateCost({})).toThrow();
  });

  test('throws on null durationMinutes when wordCount also null', () => {
    expect(() => creditService.calculateCost({ durationMinutes: null, wordCount: null })).toThrow();
  });

  // ── Default values ───────────────────────────────────────────────────────

  test('defaults to 720p when resolution not specified', () => {
    const result = creditService.calculateCost({ durationMinutes: 1 });
    expect(result.resolution).toBe('720p');
    expect(result.breakdown.video).toBe(5);
  });

  test('false add-on flags cost 0', () => {
    const result = creditService.calculateCost({
      durationMinutes: 1,
      resolution: '720p',
      premiumTTS: false,
      customMusic: false,
      aiEnhancement: false
    });
    expect(result.breakdown.tts).toBe(0);
    expect(result.breakdown.music).toBe(0);
    expect(result.breakdown.enhancement).toBe(0);
  });
});

// ── WORDS_PER_MINUTE export ───────────────────────────────────────────────────

describe('creditService.WORDS_PER_MINUTE', () => {
  test('is exported and equals 130', () => {
    const { WORDS_PER_MINUTE } = require('../services/creditService');
    expect(WORDS_PER_MINUTE).toBe(130);
  });
});
