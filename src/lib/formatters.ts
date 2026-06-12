/**
 * Shared formatting utilities.
 * Previously inlined inside LectureModal.tsx.
 */

/**
 * Format a byte count into a human-readable string (B / KB / MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Format an ISO date string into a locale-appropriate date/time string.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
