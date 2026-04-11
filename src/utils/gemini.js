const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SERVER_GEMINI_ENDPOINT = '/api/gemini';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Personality tone injections for the AI prompts
 */
const PERSONALITY_TONES = {
  strict: `Your interviewing style is STRICT and CRITICAL. Ask sharp, challenging questions. Do not soften your language. Point out gaps immediately. Be direct, concise, and unforgiving of vague answers.`,
  friendly: `Your interviewing style is WARM and ENCOURAGING. Guide the candidate gently. Use supportive language. Acknowledge what the candidate does well before pointing out gaps.`,
  'rapid-fire': `Your interviewing style is RAPID-FIRE. Questions must be SHORT (max 1 sentence). Fast-paced. Do not explain. Jump between topics quickly. Keep the candidate on their toes.`,
  normal: `Your interviewing style is BALANCED and PROFESSIONAL. Ask clear, well-structured questions appropriate for the role.`,
};

/**
 * Helper to call the Gemini API
 */
async function callGemini(systemPrompt, userPrompt, temperature = 0.7) {
  const response = await fetch(SERVER_GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt, temperature }),
  });

  if (response.ok) {
    return response.json();
  }

  if (!GEMINI_API_KEY) {
    const text = await response.text();
    throw new Error(`Gemini request failed: ${response.status} - ${text}`);
  }

  // Local development fallback when no server function is available.
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n' + userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
    },
  };

  const directResponse = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!directResponse.ok) {
    const text = await directResponse.text();
    throw new Error(`Gemini API error: ${directResponse.status} - ${text}`);
  }

  const data = await directResponse.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  return JSON.parse(textResponse);
}

/**
 * Generate the FIRST question of an interview.
 * Subsequent questions use generateFollowUpQuestion().
 */
export async function generateFirstQuestion(role, type, personality = 'normal', resumeText = '') {
  const tone = PERSONALITY_TONES[personality] || PERSONALITY_TONES.normal;

  let systemPrompt = `You are an expert ${type} recruiter conducting a live mock interview for a "${role}" position.
${tone}`;

  if (resumeText) {
    systemPrompt += `\n\nThe candidate has uploaded their resume. Use it to personalise the first question.
Resume Context:\n"""\n${resumeText}\n"""`;
  }

  systemPrompt += `\n\nReturn a single JSON object with:
- "question": string (the interview question)
- "category": string ("HR", "Technical", or "Behavioral")
- "difficulty": string ("Easy", "Medium", or "Hard")

Return valid JSON only. No markdown.`;

  return await callGemini(systemPrompt, 'Generate the opening interview question.');
}

/**
 * Generate a smart follow-up question based on conversation history.
 * @param {string} role
 * @param {string} type
 * @param {string} personality
 * @param {Array} history - last 3 Q&A pairs: [{ question, answer }, ...]
 */
export async function generateFollowUpQuestion(role, type, personality = 'normal', history = []) {
  const tone = PERSONALITY_TONES[personality] || PERSONALITY_TONES.normal;

  const historyText = history
    .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
    .join('\n\n');

  const systemPrompt = `You are an expert ${type} recruiter conducting a live mock interview for a "${role}" position.
${tone}

Here is the conversation so far:
${historyText}

Based on the candidate's last answer, generate a relevant, probing follow-up question. 
- It should dig deeper into a gap or interesting part of their response.
- Do NOT repeat a previous question.
- Keep it fresh and contextually relevant.

Return a single JSON object with:
- "question": string (the follow-up question)
- "category": string ("HR", "Technical", or "Behavioral")
- "difficulty": string ("Easy", "Medium", or "Hard")

Return valid JSON only. No markdown.`;

  return await callGemini(systemPrompt, 'Generate the next follow-up question.', 0.8);
}

/**
 * Evaluate an answer — now includes idealAnswer and weaknessCategory.
 */
export async function evaluateAnswer(question, answer, personality = 'normal') {
  const tone = PERSONALITY_TONES[personality] || PERSONALITY_TONES.normal;

  const systemPrompt = `You are an expert recruiter evaluating an interview response.
${tone}

Question: "${question}"
Candidate's Answer: "${answer}"

Provide constructive feedback. Return strictly as a JSON object with these fields:
- "score": number (1-10)
- "headline": string (5-8 words summarizing the assessment)
- "summary": string (2-3 sentences of detailed feedback, matching your personality tone)
- "strengths": array of strings (2-3 short bullet points)
- "improvements": array of strings (2-3 short bullet points)
- "usesSTAR": boolean (does the answer follow Situation, Task, Action, Result format?)
- "idealAnswer": string (A model answer of 3-5 sentences using the STAR method — show what a perfect response looks like)
- "weaknessCategory": string (one of: "communication", "technical", "confidence", "structure")

Return valid JSON only. No markdown.`;

  return await callGemini(systemPrompt, "Evaluate the candidate's answer.", 0.6);
}
