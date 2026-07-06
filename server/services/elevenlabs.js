'use strict';
/**
 * ElevenLabs TTS Service
 *
 * Converts scene narration text to audio files using the ElevenLabs API.
 * All scenes are dispatched IN PARALLEL via Promise.all, not sequentially,
 * to keep total job latency proportional to the slowest single scene rather
 * than the sum of all scenes.
 *
 * Environment variables:
 *   ELEVENLABS_API_KEY  — required for production; service degrades gracefully if absent
 *   ELEVENLABS_VOICE_ID — ElevenLabs voice ID (default: Rachel = 21m00Tcm4TlvDq8ikWAM)
 *
 * Output: one MP3 file per scene saved to outputDir/scene_<N>.mp3
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

/**
 * Fetch audio from ElevenLabs REST API without a heavy SDK dependency.
 * Uses the /v1/text-to-speech/{voice_id} endpoint.
 *
 * @param {string} text       - The narration text to synthesize
 * @param {string} apiKey     - ElevenLabs API key
 * @param {string} voiceId    - ElevenLabs voice ID
 * @returns {Promise<Buffer>} - Raw MP3 audio buffer
 */
function fetchAudio(text, apiKey, voiceId) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Accept: 'audio/mpeg',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        let errBody = '';
        res.on('data', (d) => { errBody += d.toString(); });
        res.on('end', () => reject(new Error(`ElevenLabs API error ${res.statusCode}: ${errBody}`)));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || null;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  }

  get isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Synthesize audio for a single scene narration.
   * Saves the audio file to <outputDir>/scene_<sceneIndex>.mp3.
   *
   * @param {string} narration    - Scene narration text
   * @param {number} sceneIndex   - 0-based scene index (used for filename)
   * @param {string} outputDir    - Directory to write the audio file
   * @returns {Promise<string>}   - Absolute path to the written MP3 file
   */
  async synthesizeScene(narration, sceneIndex, outputDir) {
    if (!this.isConfigured) {
      throw new Error('ELEVENLABS_API_KEY is not set. Cannot synthesize audio.');
    }

    const audioBuffer = await fetchAudio(narration, this.apiKey, this.voiceId);
    const audioPath = path.join(outputDir, `scene_${sceneIndex}.mp3`);
    await fs.writeFile(audioPath, audioBuffer);
    return audioPath;
  }

  /**
   * Synthesize audio for ALL scenes IN PARALLEL (Promise.all).
   * This is the primary entry point used by the queue processor.
   *
   * @param {Array<{narration: string}>} scenes - Array of scene objects
   * @param {string} outputDir                  - Directory to write audio files
   * @returns {Promise<string[]>}               - Array of audio file paths, in scene order
   */
  async synthesizeAllScenes(scenes, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });

    // Dispatch ALL scenes in parallel — not sequentially
    const audioPaths = await Promise.all(
      scenes.map((scene, i) => this.synthesizeScene(scene.narration, i, outputDir))
    );

    console.log(JSON.stringify({
      event: 'ELEVENLABS_SYNTHESIS_COMPLETE',
      sceneCount: scenes.length,
      voiceId: this.voiceId,
    }));

    return audioPaths;
  }
}

module.exports = new ElevenLabsService();
