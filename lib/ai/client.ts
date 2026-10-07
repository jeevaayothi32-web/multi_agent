import { cleanAndParseJson } from '../utils/helpers';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Pool of confirmed-free models on OpenRouter
const FREE_MODEL_POOL = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-2.6b:free',
];

// Shuffle array so each parallel agent call picks a different model first
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function callModelOnce(apiKey: string, model: string, messages: ChatMessage[]): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://multi-agent-innovation.vercel.app',
      'X-Title': 'AI Multi-Agent Innovation Analyzer',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[${response.status}] ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`[empty] Model ${model} returned no content`);
  }

  return content;
}

export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const preferredModel = process.env.OPENROUTER_MODEL;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in your environment.');
  }

  // Shuffle the pool so 7 parallel agents spread across different models
  const pool = shuffled(FREE_MODEL_POOL.filter((m) => m !== preferredModel));
  const modelsToTry = preferredModel ? [preferredModel, ...pool] : pool;

  let lastError: Error = new Error('No models available');

  for (const model of modelsToTry) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const result = await callModelOnce(apiKey, model, messages);
      console.log(`[AI] Success with model: ${model}`);
      return result;
    } catch (err: any) {
      console.warn(`[AI] Model ${model} failed: ${err.message.substring(0, 100)}`);
      lastError = err;
      // Retry on: rate limit, not found, empty response, upstream errors
      const msg = err.message;
      const isRetryable =
        msg.includes('429') ||
        msg.includes('404') ||
        msg.includes('[empty]') ||
        msg.includes('upstream') ||
        msg.includes('Provider returned error');
      if (!isRetryable) break;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError.message}`);
}

export async function runAgentWithPrompt<T>(systemPrompt: string, userIdea: string): Promise<T> {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Please analyze this business/technical idea and respond with ONLY a valid JSON object, no extra text, no markdown, no explanation before or after the JSON:\n\n"${userIdea}"`,
    },
  ];

  const rawResponse = await callOpenRouter(messages);
  return cleanAndParseJson<T>(rawResponse);
}
