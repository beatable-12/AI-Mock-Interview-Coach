const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Helper to call the Gemini API
 */
async function callGemini(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env.local file.');
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    }
  };

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
     const text = await response.text();
     throw new Error(`Gemini API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error('Failed to parse response from Gemini API.');
  }
  
  return JSON.parse(textResponse);
}

/**
 * Generate N questions based on role and interview type
 */
export async function generateQuestions(role, type, count) {
  const systemPrompt = `You are an expert technical and HR recruiter.
Your goal is to generate ${count} mock interview questions for a candidate applying for the role of "${role}".
The interview type is: "${type}".
If returning multiple categories, ensure a good mix.

Return the questions strictly as a JSON array of objects.
Each object must have:
- "question": string (the interview question)
- "category": string ("HR", "Technical", or "Behavioral")
- "difficulty": string ("Easy", "Medium", or "Hard")

DO NOT return any markdown formatting outside of the json payload. Return valid JSON only.`;

  const userPrompt = `Generate the ${count} questions.`;
  return await callGemini(systemPrompt, userPrompt);
}

/**
 * Evaluate an answer
 */
export async function evaluateAnswer(question, answer) {
  const systemPrompt = `You are an expert recruiter evaluating an interview response.
Question: "${question}"
Candidate's Answer: "${answer}"

Provide constructive feedback.
Return strictly as a JSON object with the following fields:
- "score": number (1-10)
- "headline": string (5-8 words summarizing the assessment)
- "summary": string (2-3 sentences of detailed feedback)
- "strengths": array of strings (2-3 short tags, max 3 words each)
- "improvements": array of strings (2-3 short tags, max 3 words each)
- "usesSTAR": boolean (does the answer follow Situation, Task, Action, Result format?)

DO NOT return any markdown formatting outside of the json payload. Return valid JSON only.`;

  const userPrompt = `Evaluate the candidate's answer.`;
  return await callGemini(systemPrompt, userPrompt);
}
