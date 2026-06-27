const request = require('supertest');
const express = require('express');
const videoRoutes = require('../routes/video');

// Mock dependencies
jest.mock('../services/queue', () => ({
  addJob: jest.fn().mockReturnValue('mock-job-123'),
  getJob: jest.fn().mockImplementation((id) => {
    if (id === 'mock-job-123') return { status: 'completed', result: { videoUrl: 'http://cloudinary.com/video.mp4' } };
    return null;
  })
}));

const app = express();
app.use(express.json());
// Mock auth middleware for testing
app.use((req, res, next) => {
  req.userId = 1;
  next();
});
app.use('/api/video', videoRoutes);

describe('Video Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should queue a video generation job', async () => {
    const res = await request(app)
      .post('/api/video/generate')
      .send({ script: 'Hello world' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('jobId', 'mock-job-123');
    expect(res.body.success).toBe(true);
  });

  it('should require a script to generate video', async () => {
    const res = await request(app)
      .post('/api/video/generate')
      .send({});
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get job status', async () => {
    const res = await request(app)
      .get('/api/video/status/mock-job-123');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('completed');
    expect(res.body.videoUrl).toBe('http://cloudinary.com/video.mp4');
  });

  it('should return 404 for unknown job', async () => {
    const res = await request(app)
      .get('/api/video/status/invalid-id');
    
    expect(res.statusCode).toEqual(404);
  });
});
