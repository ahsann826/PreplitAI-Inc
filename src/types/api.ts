/**
 * Shared TypeScript types for API requests and responses.
 * Previously scattered as inline exports inside src/services/api.ts.
 */

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

/** Lecture generation modes */
export type LectureMode = 'summary' | 'detailed' | 'test';

/** Lecture presentation styles */
export type LectureStyle = 'professor' | 'visual';

/** Lecture data as returned from the generate endpoint */
export interface LectureData {
  mode: string;
  style: string;
  script: string;
  sceneBreakdown: string;
  wordCount: number;
  estimatedDuration: number;
}
