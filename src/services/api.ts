import { config } from '@/config/env';

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const fetchFromGrokAI = async (
  systemPrompt: string,
  userPrompt: string,
  apiKey: string = config.grokApiKey
): Promise<string> => {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "grok-beta",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Grok AI');
  }

  const data: GrokResponse = await response.json();
  return data.choices[0]?.message?.content || '';
};