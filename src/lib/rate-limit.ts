import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "securegate",
  });
}

const ratelimit = createRatelimit();

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  if (!ratelimit) {
    return { success: true, remaining: 999 };
  }

  try {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
    };
  } catch {
    console.warn("Rate limit check failed, allowing request");
    return { success: true, remaining: 999 };
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}
