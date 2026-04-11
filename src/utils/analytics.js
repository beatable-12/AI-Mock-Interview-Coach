import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Maps an evaluation's improvements to a weakness category.
 * Uses simple keyword matching — no API calls required.
 */
export function categorizeWeakness(improvements = []) {
  const text = improvements.join(' ').toLowerCase();

  if (/technical|code|algorithm|syntax|implement|system|design/.test(text)) return 'technical';
  if (/filler|uh|um|pause|word|speech|clarity|articul/.test(text)) return 'communication';
  if (/confiden|assertive|tone|hesit|uncertain/.test(text)) return 'confidence';
  if (/structure|star|specific|example|detail|vague/.test(text)) return 'structure';
  return 'communication'; // default fallback
}

/**
 * Updates the user's analytics document after an interview.
 * Uses `increment()` so we never overwrite existing data.
 * 
 * @param {string} userId
 * @param {Array} evaluations - from the interview
 * @param {number} totalFillerCount 
 * @param {number} avgScore
 */
export async function updateUserAnalytics(userId, evaluations, totalFillerCount, avgScore) {
  try {
    const analyticsRef = doc(db, 'users', userId, 'analytics', 'summary');
    const docSnap = await getDoc(analyticsRef);

    // Build weakness deltas from this interview
    const weaknessDeltas = { communication: 0, technical: 0, confidence: 0, structure: 0 };
    evaluations.forEach((evalItem) => {
      if (!evalItem.skipped && evalItem.evaluation?.improvements) {
        const category = categorizeWeakness(evalItem.evaluation.improvements);
        weaknessDeltas[category] = (weaknessDeltas[category] || 0) + 1;
      }
    });

    const updatePayload = {
      totalInterviews: increment(1),
      totalFillerWords: increment(totalFillerCount),
      'weaknesses.communication': increment(weaknessDeltas.communication),
      'weaknesses.technical': increment(weaknessDeltas.technical),
      'weaknesses.confidence': increment(weaknessDeltas.confidence),
      'weaknesses.structure': increment(weaknessDeltas.structure),
    };

    if (docSnap.exists()) {
      await updateDoc(analyticsRef, updatePayload);
    } else {
      // First-time creation — set the initial document
      await setDoc(analyticsRef, {
        totalInterviews: 1,
        totalFillerWords: totalFillerCount,
        weaknesses: weaknessDeltas,
      });
    }
    return { error: null };
  } catch (error) {
    console.error('Analytics update error:', error);
    return { error: error.message };
  }
}

/**
 * Fetches the user's analytics summary from Firestore.
 */
export async function getUserAnalytics(userId) {
  try {
    const analyticsRef = doc(db, 'users', userId, 'analytics', 'summary');
    const docSnap = await getDoc(analyticsRef);
    if (docSnap.exists()) {
      return { analytics: docSnap.data(), error: null };
    }
    return { analytics: null, error: null };
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return { analytics: null, error: error.message };
  }
}

/**
 * Returns the top N weakness categories sorted by count.
 */
export function getTopWeaknesses(weaknessData, n = 3) {
  if (!weaknessData) return [];
  return Object.entries(weaknessData)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}
