const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:5000/api' 
  : '/api'; // Use Vite proxy in development

export interface UploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  textPreview: string;
  wordCount: number;
  message: string;
}

export interface LectureResponse {
  success: boolean;
  lecture: {
    documentId: string;
    mode: string;
    style: string;
    script: string;
    sceneBreakdown: string;
    wordCount: number;
    estimatedDuration: number;
  };
  message: string;
  next?: string;
}

export interface VideoGenerationOptions {
  provider?: 'did' | 'did-scene' | 'default';
  // D-ID specific options
  voiceId?: string;
  driverUrl?: string;
  ratio?: string;
  // Default provider options
  ttsProvider?: string;
  theme?: string;
  fps?: number;
  width?: number;
  height?: number;
  voice?: string;
  music?: string;
  font?: string;
  kenburns?: boolean;
}

export interface VideoResponse {
  success: boolean;
  videoPath: string;
  srtPath: string;
  videoUrl: string;
  srtUrl: string;
  message: string;
}

export interface VideoHistoryItem {
  id: string;
  filename: string;
  videoUrl: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export interface VideoHistoryResponse {
  success: boolean;
  videos: VideoHistoryItem[];
}

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
};
