import { API_BASE_URL } from "@/constants/config";
import {
  UploadResponse,
  LectureResponse,
  VideoGenerationOptions,
  VideoResponse,
  VideoHistoryResponse,
  Transaction,
  TransactionsResponse,
} from "@/types/api";

export type { Transaction };

export const api = {
  /**
   * Upload a document file
   */
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  /**
   * Generate lecture from uploaded document
   */
  async generateLecture(
    documentId: string,
    mode: 'summary' | 'detailed' | 'test',
    style: 'professor' | 'visual'
  ): Promise<LectureResponse> {
    const response = await fetch(`${API_BASE_URL}/lecture/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId, mode, style }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lecture generation failed');
    }

    return response.json();
  },

  /**
   * Generate video from text or documentId
   */
  async generateVideo(
    text: string,
    options?: VideoGenerationOptions
  ): Promise<VideoResponse> {
    const response = await fetch(`${API_BASE_URL}/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Video generation failed');
    }

    return response.json();
  },

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{ success: boolean; status: string; videoUrl?: string; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/video/status/${jobId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch job status');
    }
    
    return response.json();
  },

  /**
   * Get video generation history
   */
  async getVideoHistory(): Promise<VideoHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/video/history`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch video history');
    }
    
    return response.json();
  },

  /**
   * Check backend health
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  /**
   * Get transactions
   */
  async getTransactions(limit = 100, offset = 0): Promise<TransactionsResponse> {
    const response = await fetch(`${API_BASE_URL}/payments/history?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch transactions');
    }
    
    return response.json();
  },
};

