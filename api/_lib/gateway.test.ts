import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateChatResponse } from './gateway';

// Mock the GoogleGenerativeAI library
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        startChat: vi.fn().mockReturnValue({
          sendMessage: vi.fn().mockResolvedValue({
            response: { text: () => 'Mocked response' }
          })
        })
      })
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
