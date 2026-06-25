module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { domainName } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Generate 10 NREMT-style EMT certification exam questions for the domain: "${domainName}".

Return ONLY a JSON array with no preamble or markdown. Each object must have:
- "question": string
- "options": array of exactly 4 strings (A, B, C, D answer text only, no letter prefix)
- "correct": number (0-3, index of correct answer)
- "explanation": string (1-2 sentences explaining why the answer is correct)

Make questions realistic, clinical, and at EMT certification difficulty level.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', data);
      return res.status(500).json({ error: 'API error', detail: data });
    }

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: err.message });
  }
};