/**
 * Strip markdown formatting from text to produce clean plain text
 * suitable for text-to-speech engines.
 */
function stripMarkdown(text) {
  if (!text) return '';

  return text
    // Remove bold/italic (***, **, *, __, _)
    .replace(/(\*\*|\*|__|_)(.*?)\1/g, '$2')
    // Remove headers (# Header)
    .replace(/^#+\s+/gm, '')
    // Remove lists (- item, * item, 1. item)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove inline code (`code`)
    .replace(/`(.*?)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove links [text](url) -> text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove images ![alt](url) -> alt
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    // Remove blockquotes (> text)
    .replace(/^>\s+/gm, '')
    // Collapse multiple newlines into single spaces
    // TTS prefers continuous text rather than hard breaks
    // but we can preserve single newlines or double newlines as pauses
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Chunk a long script into smaller parts under a specific character limit.
 * Tries to chunk on sentence boundaries to avoid cutting mid-word.
 */
function chunkScript(script, maxChars = 8000) {
  if (script.length <= maxChars) {
    return [script];
  }

  const chunks = [];
  let currentPos = 0;

  while (currentPos < script.length) {
    // If remaining is smaller than max, take it all
    if (script.length - currentPos <= maxChars) {
      chunks.push(script.substring(currentPos).trim());
      break;
    }

    // Try to find a sentence break (. ? !) within the max window
    // Look backwards from maxChars
    const window = script.substring(currentPos, currentPos + maxChars);
    const lastPunctuation = Math.max(
      window.lastIndexOf('. '),
      window.lastIndexOf('? '),
      window.lastIndexOf('! '),
      window.lastIndexOf('\n')
    );

    if (lastPunctuation > 0) {
      // Found a clean break
      chunks.push(window.substring(0, lastPunctuation + 1).trim());
      currentPos += lastPunctuation + 1;
    } else {
      // Fallback: no punctuation found, find the last space
      const lastSpace = window.lastIndexOf(' ');
      if (lastSpace > 0) {
        chunks.push(window.substring(0, lastSpace).trim());
        currentPos += lastSpace + 1;
      } else {
        // Absolute worst case, hard cut
        chunks.push(window.substring(0, maxChars));
        currentPos += maxChars;
      }
    }
  }

  return chunks;
}

module.exports = {
  stripMarkdown,
  chunkScript
};
