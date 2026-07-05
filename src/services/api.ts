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

// ── Auth helpers ──────────────────────────────────────────────────────────────
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
  "Content-Type": "application/json",
});

export const api = {
  /** Upload a document file */
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }
    return response.json();
  },

  /** Upload raw text notes */
  async uploadText(text: string, title?: string): Promise<UploadResponse> {
    const response = await fetch(`${API_BASE_URL}/upload/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, title }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload text failed");
    }
    return response.json();
  },

  /** Generate lecture from uploaded document */
  async generateLecture(
    documentId: string,
    mode: "summary" | "detailed" | "test",
    style: "professor" | "visual"
  ): Promise<LectureResponse> {
    const response = await fetch(`${API_BASE_URL}/lecture/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, mode, style }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Lecture generation failed");
    }
    return response.json();
  },

  /** Generate video from script text */
  async generateVideo(
    text: string,
    options?: VideoGenerationOptions
  ): Promise<VideoResponse> {
    const response = await fetch(`${API_BASE_URL}/video/generate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ script: text, options }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Video generation failed");
    }
    return response.json();
  },

  /** Get job status */
  async getJobStatus(
    jobId: string
  ): Promise<{ success: boolean; status: string; videoUrl?: string; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/video/status/${jobId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch job status");
    }
    return response.json();
  },

  /** Get video generation history */
  async getVideoHistory(): Promise<VideoHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/video/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch video history");
    }
    return response.json();
  },

  /** Check backend health */
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // ── Credits API ─────────────────────────────────────────────────────────────

  /** Get current user credit balance */
  async getBalance(): Promise<{ success: boolean; balance: number }> {
    const response = await fetch(`${API_BASE_URL}/credits/balance`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch balance");
    }
    return response.json();
  },

  /**
   * Get credit transaction history.
   * FIX: was previously pointing at /payments/history which is payment records,
   * not the credit ledger. Now correctly hits /credits/transactions.
   */
  async getTransactions(limit = 100, offset = 0): Promise<TransactionsResponse> {
    const response = await fetch(
      `${API_BASE_URL}/credits/transactions?limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch transactions");
    }
    return response.json();
  },

  /** Calculate credit cost for a given script + options (for quote display) */
  async calculateCost(params: {
    wordCount?: number;
    durationMinutes?: number;
    resolution?: string;
    premiumTTS?: boolean;
    customMusic?: boolean;
    aiEnhancement?: boolean;
  }): Promise<{
    success: boolean;
    cost: { total: number; breakdown: Record<string, number>; durationMinutes: number };
    userBalance: number;
    canAfford: boolean;
    creditsNeeded: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/credits/calculate-cost`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to calculate cost");
    }
    return response.json();
  },

  /** Get available credit packages */
  async getCreditPackages(): Promise<{ success: boolean; packages: unknown[] }> {
    const response = await fetch(`${API_BASE_URL}/credits/packages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch packages");
    }
    return response.json();
  },
};
