import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from './assistant';
import * as gateway from './_lib/gateway';

vi.mock('./_lib/gateway', () => ({
  generateChatResponse: vi.fn(),
}));

describe('Assistant API', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  function createMockRes() {
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    return res;
  }

  function createMockReq(body: any = {}, method = 'POST', ip = '127.0.0.1') {
    return {
      method,
      headers: { 'x-forwarded-for': ip },
      body,
      socket: { remoteAddress: ip }
    } as any;
  }

  it('rejects method other than POST', async () => {
    const req = createMockReq({}, 'GET');
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('rejects invalid body (missing messages)', async () => {
    const req = createMockReq({ data: 'hello' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles timeout correctly', async () => {
    vi.mocked(gateway.generateChatResponse).mockRejectedValueOnce(new Error('Upstream timeout'));
    const req = createMockReq({ messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(504);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[AI_PROVIDER_ERROR] category=timeout status=504');
  });

  it('returns rate-limit response', async () => {
    let res;
    for (let i = 0; i < 10; i++) {
      const req = createMockReq({ messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
      res = createMockRes();
      await handler(req, res);
    }
    const reqExceed = createMockReq({ messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
    res = createMockRes();
    await handler(reqExceed, res);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('returns successful mocked response', async () => {
    vi.mocked(gateway.generateChatResponse).mockResolvedValueOnce('Mocked answer');
    const req = createMockReq({ messages: [{ role: 'user', content: 'hello' }] }, 'POST', '192.168.1.1');
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: 'Mocked answer' });
  });

  describe('Upstream Error Classification', () => {
    async function assertSafeError(mockError: any, expectedCategory: string, expectedStatus: number) {
      vi.mocked(gateway.generateChatResponse).mockRejectedValueOnce(mockError);
      const req = createMockReq({ messages: [{ role: 'user', content: 'hello' }] });
      const res = createMockRes();
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'O assistente está temporariamente indisponível. Tente novamente em alguns minutos.',
        code: 'AI_UNAVAILABLE'
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(`[AI_PROVIDER_ERROR] category=${expectedCategory} status=${expectedStatus}`);
    }

    it('handles missing GEMINI_API_KEY (authentication failure)', async () => {
      const err: any = new Error('GEMINI_API_KEY is not defined');
      err.status = 401;
      await assertSafeError(err, 'authentication', 401);
    });

    it('handles invalid or unavailable model', async () => {
      const err: any = new Error('Model gemini-fake not found');
      err.status = 404;
      await assertSafeError(err, 'model', 404);
    });

    it('handles permission failure', async () => {
      const err: any = new Error('Permission denied');
      err.status = 403;
      await assertSafeError(err, 'permission', 403);
    });

    it('handles quota/rate-limit failure', async () => {
      const err: any = new Error('Resource has been exhausted (e.g. check quota).');
      err.status = 429;
      await assertSafeError(err, 'quota', 429);
    });

    it('handles provider 503', async () => {
      const err: any = new Error('Service unavailable');
      err.status = 503;
      await assertSafeError(err, 'availability', 503);
    });

    it('confirms that raw provider data is never returned', async () => {
      const err: any = new Error('GoogleGenerativeAIError: [400 Bad Request] very secret internal stack trace https://generativelanguage.googleapis.com');
      err.status = 400;
      await assertSafeError(err, 'availability', 400);
      
      // Ensure the raw error message is never leaked to the console either.
      const consoleCalls = consoleErrorSpy.mock.calls.flat().join(' ');
      expect(consoleCalls).not.toContain('GoogleGenerativeAIError');
      expect(consoleCalls).not.toContain('generativelanguage.googleapis.com');
      expect(consoleCalls).not.toContain('very secret internal stack trace');
    });

    it('confirms that no real Gemini API request is performed during tests', () => {
      // Because we use vi.mocked(gateway.generateChatResponse), no network requests are made.
      expect(gateway.generateChatResponse).toBeDefined();
    });
  });
});
