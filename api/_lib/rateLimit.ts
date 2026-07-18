/**
 * Rate limit em memória por chave (tipicamente IP). Proteção básica em
 * ambiente serverless — cada instância mantém seu próprio estado, então
 * um limite estrito exigiria um cache distribuído (fora de escopo desta
 * fase). Fábrica em vez de módulo com estado global para permitir testes
 * isolados sem vazamento entre casos de teste.
 */

const DEFAULT_MAX = 10;
const DEFAULT_WINDOW_MS = 60000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export interface RateLimiterOptions {
  max?: number;
  windowMs?: number;
}

export type RateLimitChecker = (key: string) => RateLimitResult;

export function createRateLimiter(options: RateLimiterOptions = {}): RateLimitChecker {
  const max = options.max ?? parseInt(process.env.ASSISTANT_RATE_LIMIT_MAX || String(DEFAULT_MAX), 10);
  const windowMs = options.windowMs ?? parseInt(process.env.ASSISTANT_RATE_LIMIT_WINDOW_MS || String(DEFAULT_WINDOW_MS), 10);
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function checkRateLimit(key: string): RateLimitResult {
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (entry.count >= max) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    return { allowed: true };
  };
}
