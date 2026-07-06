'use strict';
const db = require('../db/database');
const { randomUUID: uuidv4 } = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const storageService = require('./storage');
const creditService = require('./creditService');

const elevenlabsService = require('./elevenlabs'); // Phase 3: ElevenLabs TTS
const { renderAllScenes } = require('./remotionRenderer'); // Phase 3: Remotion renderer
const { chunkScript } = require('../utils/textFormatter');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const scriptGenerator = require('./scriptGenerator');

// Set fluent-ffmpeg to use the static binary we just installed
ffmpeg.setFfmpegPath(ffmpegStatic);

class QueueService extends EventEmitter {
  constructor() {
    super();
    this.isProcessing = false;
    setInterval(() => this.processNextJob(), 3000);
  }

  /**
   * Enqueue a new job
   */
  async addJob(type, data) {
    const jobId = uuidv4();
    await db.query(`
      INSERT INTO jobs (id, type, data, status)
      VALUES ($1, $2, $3, 'pending')
    `, [jobId, type, JSON.stringify(data)]);

    setTimeout(() => this.processNextJob(), 0);
    return jobId;
  }

  /**
   * Get job status
   */
  async getJob(jobId) {
    const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobResult.rows.length === 0) return null;
    const job = jobResult.rows[0];
    return {
      ...job,
      data: JSON.parse(job.data),
      result: job.result ? JSON.parse(job.result) : null
    };
  }

  /**
   * Update job and emit event
   */
  async updateJobStatus(jobId, status, result = null, error = null) {
    await db.query(`
      UPDATE jobs
      SET status = $1, result = $2, error = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [status, result ? JSON.stringify(result) : null, error, jobId]);

    this.emit('job_updated', { jobId, status, result, error });
  }

  /**
   * Concatenate multiple scene MP4s using ffmpeg concat
   */
  async concatVideos(videoPaths, outputPath) {
    return new Promise((resolve, reject) => {
      if (videoPaths.length === 1) {
        fs.copyFile(videoPaths[0], outputPath)
          .then(() => resolve(outputPath))
          .catch(reject);
        return;
      }

      const command = ffmpeg();
      videoPaths.forEach(vp => command.input(vp));

      command
        .on('error', (err) => reject(new Error(`FFmpeg concat error: ${err.message}`)))
        .on('end', () => resolve(outputPath))
        .mergeToFile(outputPath, path.dirname(outputPath));
    });
  }

  /**
   * PRIMARY PATH — ElevenLabs TTS + Remotion rendering
   *
   * 1. Generate structured scenes from the script (Groq)
   * 2. Synthesise audio for all scenes IN PARALLEL (ElevenLabs)
   * 3. Render all scenes IN PARALLEL (Remotion, up to 4 workers)
   * 4. Concatenate scene MP4s with FFmpeg
   *
   * If ElevenLabs is not configured, or if any step throws, the error
   * propagates to processNextJob() which runs the Python fallback.
   *
   * @param {string}   script   - Full lecture script
   * @param {object}   options  - Video options (resolution, mode, style, …)
   * @param {string}   jobId    - Used for temp file naming
   * @param {string}   outDir   - Directory for final output
   * @returns {Promise<string>} - Absolute path to final assembled MP4
   */
  async runElevenLabsRemotionPipeline(script, options, jobId, outDir) {
    if (!elevenlabsService.isConfigured) {
      throw new Error('ELEVENLABS_API_KEY not set — cannot use primary pipeline');
    }

    // ── Step 1: Generate structured scenes ──────────────────────────────────
    const scenes = await scriptGenerator.generateStructuredScenes(
      script,
      options.mode || 'detailed',
      options.style || 'professor'
    );

    const workDir = path.join(outDir, `job_${jobId}`);
    await fs.mkdir(workDir, { recursive: true });

    // ── Step 2: ElevenLabs TTS — all scenes in parallel ─────────────────────
    const audioDir = path.join(workDir, 'audio');
    const audioPaths = await elevenlabsService.synthesizeAllScenes(scenes, audioDir);

    // ── Step 3: Remotion rendering — all scenes in parallel ─────────────────
    const renderDir = path.join(workDir, 'scenes');
    const sceneMp4s = await renderAllScenes(scenes, audioPaths, renderDir);

    // ── Step 4: FFmpeg concat ────────────────────────────────────────────────
    const finalMp4 = path.join(outDir, `${jobId}_final.mp4`);
    await this.concatVideos(sceneMp4s, finalMp4);

    // Cleanup working directory (individual scene files)
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});

    console.log(JSON.stringify({
      event: 'ELEVENLABS_REMOTION_PIPELINE_COMPLETE',
      jobId,
      sceneCount: scenes.length,
    }));

    return finalMp4;
  }

  /**
   * Internal job processor
   */
  async processNextJob() {
    if (this.isProcessing) return;

    const jobResult = await db.query(`
      SELECT * FROM jobs
      WHERE status = 'pending'
      ORDER BY created_at ASC
      LIMIT 1
    `);

    if (jobResult.rows.length === 0) return;
    const job = jobResult.rows[0];

    this.isProcessing = true;
    await this.updateJobStatus(job.id, 'processing');
    const data = JSON.parse(job.data);

    try {
      let resultUrl = null;

      if (job.type === 'generate_video') {
        const { script, options, userId } = data;
        const outDir = path.join(__dirname, '..', 'outputs', 'videos');
        await fs.mkdir(outDir, { recursive: true });

        // ── Try primary pipeline (ElevenLabs + Remotion) ────────────────────
        const localFilePath = await this.runElevenLabsRemotionPipeline(script, options, job.id, outDir);
        console.log(JSON.stringify({ event: 'PIPELINE_PRIMARY_SUCCESS', jobId: job.id }));

        // Upload to Cloud Storage
        resultUrl = await storageService.uploadFile(localFilePath, 'video');

        // Cleanup local file after successful upload
        await fs.unlink(localFilePath).catch(() => {});
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      await this.updateJobStatus(job.id, 'completed', { videoUrl: resultUrl });

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      await this.updateJobStatus(job.id, 'failed', null, error.message);

      // Refund credits if this job was billed.
      // BUG-008 FIX: Read the exact amount debited from the job payload.
      // NEVER recompute the cost — the formula may have changed.
      if (data.userId) {
        try {
          const refundAmount = data.creditsDeducted;

          if (refundAmount == null) {
            console.error(JSON.stringify({
              event: 'REFUND_AMOUNT_MISSING',
              jobId: job.id,
              userId: data.userId,
              message: 'data.creditsDeducted missing — skipping refund. Manual review required.',
            }));
          } else {
            await creditService.creditCredits(
              data.userId,
              refundAmount,
              'REFUND',
              `Refund for failed video job ${job.id}`
            );
            console.log(JSON.stringify({
              event: 'REFUND_ISSUED',
              jobId: job.id,
              userId: data.userId,
              refundAmount,
            }));
          }
        } catch (refundErr) {
          console.error('[Queue] Failed to process refund:', refundErr);
        }
      }
    } finally {
      this.isProcessing = false;
      setTimeout(() => this.processNextJob(), 0);
    }
  }
}

module.exports = new QueueService();
