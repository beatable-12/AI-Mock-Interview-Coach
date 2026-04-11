/**
 * Detects filler words in a transcript string.
 * Runs entirely client-side with no API calls.
 */
const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'right', 'so'];

const FILLER_REGEX = /\b(um|uh|like|you know|basically|literally)\b/gi;

/**
 * @param {string} transcript
 * @returns {{ count: number, breakdown: Record<string, number> }}
 */
export function detectFillerWords(transcript) {
  if (!transcript) return { count: 0, breakdown: {} };

  const breakdown = {};
  let totalCount = 0;

  FILLER_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = transcript.match(regex) || [];
    if (matches.length > 0) {
      breakdown[word] = matches.length;
      totalCount += matches.length;
    }
  });

  return { count: totalCount, breakdown };
}

/**
 * Returns a human-friendly message based on filler count.
 */
export function getFillerFeedback(count) {
  if (count === 0) return null;
  if (count <= 2) return `You used ${count} filler word${count > 1 ? 's' : ''} — great job keeping it clean!`;
  if (count <= 5) return `You used ${count} filler words — try to reduce them for a more polished delivery.`;
  return `You used ${count} filler words — this significantly impacts your confidence score. Practice pausing instead.`;
}
