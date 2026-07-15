import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateChatResponse } from './gateway.js';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Mocked response'
        })
      }
    }))
  };
});

describe('gateway', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test_key';
  });

  it('throws an error if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generateChatResponse([{ role: 'user', content: 'hello' }]))
      .rejects.toThrow('GEMINI_API_KEY is not defined in the environment.');
  });

  it('returns response from Gemini model', async () => {
    const response = await generateChatResponse([{ role: 'user', content: 'hello' }]);
    expect(response).toBe('Mocked response');
  });
});
