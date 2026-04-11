const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
  }

  try {
    const { systemPrompt, userPrompt, temperature = 0.7 } = req.body || {};

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'systemPrompt and userPrompt are required.' });
    }

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: `Gemini API error: ${rawText}` });
    }

    const data = JSON.parse(rawText);
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return res.status(502).json({ error: 'Failed to parse response from Gemini API.' });
    }

    return res.status(200).json(JSON.parse(textResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
}
