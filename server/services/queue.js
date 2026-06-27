const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const didService = require('./did.cjs');
const storageService = require('./storage');
const videoService = require('./video');

class QueueService {
  constructor() {
    this.isProcessing = false;
    // Start polling loop
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
    
    // Trigger processing immediately in background
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
    
    try {
      // Mark as processing
      db.prepare("UPDATE jobs SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(job.id);
      
      const data = JSON.parse(job.data);
      let resultUrl = null;

      if (job.type === 'generate_video') {
        const { script, options } = data;
        const outDir = path.join(__dirname, '..', 'outputs', 'videos');
        await fs.mkdir(outDir, { recursive: true });

        let localFilePath = null;

        if (options.provider === 'did') {
          const apiKey = process.env.DID_API_KEY;
          if (!apiKey) throw new Error('DID_API_KEY is missing');
          
          localFilePath = await didService.generateDidVideo({
            text: script,
            voiceId: options.voiceId,
            driverUrl: options.driverUrl,
            ratio: options.ratio
          }, outDir, apiKey);
        } else {
          // Fallback to python generator
          const tempTxt = path.join(outDir, `temp_${job.id}.txt`);
          await fs.writeFile(tempTxt, script);
          const { outMp4 } = await videoService.generateVideoFromTextFile(tempTxt, options);
          localFilePath = outMp4;
        }

        // Upload to Cloud Storage
        resultUrl = await storageService.uploadFile(localFilePath, 'video');

        // Cleanup local files after successful upload to save disk space
        if (localFilePath) {
          try {
            await fs.unlink(localFilePath);
            // Try to clean up associated SRT if it exists
            const srtPath = localFilePath.replace(/\.mp4$/i, '.srt');
            await fs.unlink(srtPath).catch(() => {});
          } catch (cleanupErr) {
            console.error('Failed to cleanup local file:', cleanupErr);
          }
        }
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      // Mark completed
      db.prepare("UPDATE jobs SET status = 'completed', result = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(JSON.stringify({ videoUrl: resultUrl }), job.id);

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      db.prepare("UPDATE jobs SET status = 'failed', error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(error.message, job.id);
    } finally {
      this.isProcessing = false;
      // Check for more jobs
      setTimeout(() => this.processNextJob(), 0);
    }
  }
}

module.exports = new QueueService();
