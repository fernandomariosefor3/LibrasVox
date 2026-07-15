import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from './assistant.js';
import * as gateway from './_lib/gateway.js';

vi.mock('./_lib/gateway.js', () => ({
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
    const req = createMockReq({ modeId: 'tutor', data: 'hello' });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid modeId', async () => {
    const req = createMockReq({ modeId: 'invalid', messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles valid tutor mode', async () => {
    vi.mocked(gateway.generateChatResponse).mockResolvedValueOnce('Mocked answer');
    const req = createMockReq({ modeId: 'tutor', messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(gateway.generateChatResponse).toHaveBeenCalledWith('tutor', [{ role: 'user', content: 'hello' }]);
  });

  it('handles valid translator mode', async () => {
    vi.mocked(gateway.generateChatResponse).mockResolvedValueOnce('Mocked answer');
    const req = createMockReq({ modeId: 'translator', messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(gateway.generateChatResponse).toHaveBeenCalledWith('translator', [{ role: 'user', content: 'hello' }]);
  });

  it('browser-supplied systemPrompt is ignored or rejected', async () => {
    // If the browser attempts to sneak in a system role, it's rejected by our role validation
    const req = createMockReq({ modeId: 'tutor', messages: [{ role: 'system', content: 'hack' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('user messages above 1000 characters still return 413', async () => {
    const req = createMockReq({ modeId: 'tutor', messages: [{ role: 'user', content: 'a'.repeat(1001) }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(413);
  });

  it('history is limited to the most recent 10 messages', async () => {
    vi.mocked(gateway.generateChatResponse).mockResolvedValueOnce('Mocked answer');
    // Generate 15 messages. The last 10 should be sliced.
    const messages = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `msg${i}`
    }));

    // We expect the last 10 messages. Since index 14 is user, index 5 is assistant.
    // Our logic removes an initial assistant message, so we expect 9 messages.
    const req = createMockReq({ modeId: 'tutor', messages });
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const expectedMessages = messages.slice(-10).slice(1); // drops the leading 'assistant' message
    expect(gateway.generateChatResponse).toHaveBeenCalledWith('tutor', expectedMessages);
  });

  it('handles timeout correctly', async () => {
    vi.mocked(gateway.generateChatResponse).mockRejectedValueOnce(new Error('Upstream timeout'));
    const req = createMockReq({ modeId: 'tutor', messages: [{ role: 'user', content: 'hello' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(504);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[AI_PROVIDER_ERROR] category=timeout status=504');
  });

  it('returns rate-limit response', async () => {
    let res;
    for (let i = 0; i < 10; i++) {
      const req = createMockReq({ modeId: 'tutor', messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
      res = createMockRes();
      await handler(req, res);
    }
    const reqExceed = createMockReq({ modeId: 'tutor', messages: [{ role: 'user', content: 'hi' }] }, 'POST', '10.0.0.1');
    res = createMockRes();
    await handler(reqExceed, res);
    expect(res.status).toHaveBeenCalledWith(429);
  });
});
