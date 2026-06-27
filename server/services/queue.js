const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const didService = require('./did.cjs');
const storageService = require('./storage');
const videoService = require('./video');
const creditService = require('./creditService');
const { chunkScript } = require('../utils/textFormatter');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

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
  addJob(type, data) {
    const jobId = uuidv4();
    db.prepare(`
      INSERT INTO jobs (id, type, data, status)
      VALUES (?, ?, ?, 'pending')
    `).run(jobId, type, JSON.stringify(data));
    
    setTimeout(() => this.processNextJob(), 0);
    return jobId;
  }

  /**
   * Get job status
   */
  getJob(jobId) {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
    if (!job) return null;
    return {
      ...job,
      data: JSON.parse(job.data),
      result: job.result ? JSON.parse(job.result) : null
    };
  }

  /**
   * Update job and emit event
   */
  updateJobStatus(jobId, status, result = null, error = null) {
    db.prepare(`
      UPDATE jobs 
      SET status = ?, result = ?, error = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, result ? JSON.stringify(result) : null, error, jobId);

    this.emit('job_updated', { jobId, status, result, error });
  }

  /**
   * Concatenate multiple videos using ffmpeg
   */
  async concatVideos(videoPaths, outputPath) {
    return new Promise((resolve, reject) => {
      // If only one video, just copy it
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
   * Internal processor
   */
  async processNextJob() {
    if (this.isProcessing) return;
    
    const job = db.prepare(`
      SELECT * FROM jobs 
      WHERE status = 'pending' 
      ORDER BY created_at ASC 
      LIMIT 1
    `).get();

    if (!job) return;

    this.isProcessing = true;
    this.updateJobStatus(job.id, 'processing');
    const data = JSON.parse(job.data);
    
    try {
      let resultUrl = null;

      if (job.type === 'generate_video') {
        const { script, options, transactionId, userId } = data;
        const outDir = path.join(__dirname, '..', 'outputs', 'videos');
        await fs.mkdir(outDir, { recursive: true });

        let localFilePath = null;
        let filesToCleanup = [];

        if (options.provider === 'did') {
          const apiKey = process.env.DID_API_KEY;
          if (!apiKey) throw new Error('DID_API_KEY is missing');
          
          // Chunk the script if it exceeds D-ID limits
          const chunks = chunkScript(script, 8000);
          console.log(`[Queue] Script split into ${chunks.length} chunks`);
          
          const chunkPaths = [];
          for (let i = 0; i < chunks.length; i++) {
            console.log(`[Queue] Generating chunk ${i+1}/${chunks.length}...`);
            const chunkPath = await didService.generateDidVideo({
              text: chunks[i],
              voiceId: options.voiceId,
              driverUrl: options.driverUrl,
              ratio: options.ratio
            }, outDir, apiKey);
            chunkPaths.push(chunkPath);
            filesToCleanup.push(chunkPath);
          }

          // Merge chunks
          localFilePath = path.join(outDir, `final_${job.id}.mp4`);
          console.log('[Queue] Merging video chunks...');
          await this.concatVideos(chunkPaths, localFilePath);
          filesToCleanup.push(localFilePath);
          
        } else {
          // Fallback Python generator (also safe to chunk if needed, but handled inside python mostly)
          const tempTxt = path.join(outDir, `temp_${job.id}.txt`);
          await fs.writeFile(tempTxt, script);
          filesToCleanup.push(tempTxt);
          
          const { outMp4, outSrt } = await videoService.generateVideoFromTextFile(tempTxt, options);
          localFilePath = outMp4;
          filesToCleanup.push(outMp4);
          if (outSrt) filesToCleanup.push(outSrt);
        }

        // Upload to Cloud Storage
        resultUrl = await storageService.uploadFile(localFilePath, 'video');

        // Cleanup local files after successful upload
        for (const file of filesToCleanup) {
          await fs.unlink(file).catch(() => {});
        }
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      this.updateJobStatus(job.id, 'completed', { videoUrl: resultUrl });

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      this.updateJobStatus(job.id, 'failed', null, error.message);
      
      // Refund credits if this job was billed
      if (data.transactionId && data.userId) {
        try {
          // Note: In a real app we'd need the videoGenerationId, but for now
          // we can just issue a direct credit refund for the calculated cost
          const cost = creditService.calculateCost({ durationMinutes: data.script.length / 1000 }).total;
          creditService.creditCredits(data.userId, cost, 'REFUND', `Refund for failed video job ${job.id}`);
          console.log(`[Queue] Refunded ${cost} credits to user ${data.userId}`);
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
