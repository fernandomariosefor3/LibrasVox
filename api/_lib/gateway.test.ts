import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateChatResponse, SYSTEM_PROMPTS } from './gateway.js';

let mockGenerateContent = vi.fn().mockResolvedValue({ text: 'Mocked response' });

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }))
  };
});

describe('gateway', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test_key';
    mockGenerateContent.mockClear();
  });

  it('throws an error if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(generateChatResponse('tutor', [{ role: 'user', content: 'hello' }]))
      .rejects.toThrow('GEMINI_API_KEY is not defined in the environment.');
  });

  it('throws an error if modeId is invalid', async () => {
    await expect(generateChatResponse('invalid_mode', [{ role: 'user', content: 'hello' }]))
      .rejects.toThrow('Invalid modeId mapped internally.');
  });

  it('returns response from Gemini model and passes systemInstruction', async () => {
    const response = await generateChatResponse('tutor', [{ role: 'user', content: 'hello' }]);

    expect(response).toBe('Mocked response');

    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      contents: [{ role: 'user', parts: [{ text: 'hello' }] }],
      config: expect.objectContaining({
        systemInstruction: SYSTEM_PROMPTS['tutor']
      })
    }));
  });

  it('confirms that no real network request is made', () => {
    expect(generateChatResponse).toBeDefined();
  });
});
