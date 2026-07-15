import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from './assistant';
import * as gateway from './_lib/gateway';

vi.mock('./_lib/gateway', () => ({
  generateChatResponse: vi.fn(),
}));

describe('Assistant API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
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

  it('rejects empty messages array', async () => {
    const req = createMockReq({ messages: [] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects too many messages', async () => {
    const req = createMockReq({ messages: Array(25).fill({ role: 'user', content: 'a' }) });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('rejects oversized message', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'a'.repeat(2000) }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('rejects total payload too large', async () => {
    const messages = Array(15).fill({ role: 'user', content: 'a'.repeat(900) });
    const req = createMockReq({ messages });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('rejects invalid role', async () => {
    const req = createMockReq({ messages: [{ role: 'system', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects empty content', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: '   ' }] });
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
  });

  it('returns safe upstream error response', async () => {
    vi.mocked(gateway.generateChatResponse).mockRejectedValueOnce(new Error('Some weird stack trace error'));
    const req = createMockReq({ messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'O assistente está temporariamente indisponível. Tente novamente em alguns minutos.',
      code: 'AI_UNAVAILABLE'
    });
  });

  it('returns rate-limit response', async () => {
    let res;
    for (let i = 0; i < 10; i++) {
      const req = createMockReq({ messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
      res = createMockRes();
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    }
    const reqExceed = createMockReq({ messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
    res = createMockRes();
    await handler(reqExceed, res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(String));
  });

  it('returns successful mocked response', async () => {
    vi.mocked(gateway.generateChatResponse).mockResolvedValueOnce('Mocked answer');
    const req = createMockReq({ messages: [{ role: 'user', content: 'hello' }] }, 'POST', '192.168.1.1');
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: 'Mocked answer' });
  });
});
