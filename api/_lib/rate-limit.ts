import type { VercelRequest } from "@vercel/node";

interface RateLimitOptions {
  limit: number;
  window: string; // e.g. "1m", "10s"
}

// Simple in-memory store for MVP.
// Note: In Vercel serverless, this state is only shared across invocations of the SAME lambda instance.
// It is sufficient to deter basic abuse, but for distributed rate limiting, Upstash Redis should be used.
const ipCache = new Map<string, { count: number; resetAt: number }>();

function parseWindow(windowStr: string): number {
  if (windowStr.endsWith("m")) {
    return parseInt(windowStr.replace("m", "")) * 60 * 1000;
  }
  if (windowStr.endsWith("s")) {
    return parseInt(windowStr.replace("s", "")) * 1000;
  }
  return 60000; // default 1 minute
}

export async function checkRateLimit(req: VercelRequest, options: RateLimitOptions) {
  // Use x-forwarded-for for Vercel behind proxy
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress) || "127.0.0.1";
  
  const now = Date.now();
  const windowMs = parseWindow(options.window);

  let record = ipCache.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count += 1;
  ipCache.set(ip, record);

  // Periodic cleanup to prevent memory leaks in warm instances
  if (Math.random() < 0.1) {
    for (const [key, val] of ipCache.entries()) {
      if (now > val.resetAt) {
        ipCache.delete(key);
      }
    }
  }

  const success = record.count <= options.limit;
  
  return {
    success,
    remaining: Math.max(0, options.limit - record.count)
  };
}
