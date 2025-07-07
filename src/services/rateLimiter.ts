import { useSettingsStore } from "../stores/settingsStore";

interface RateLimitInfo {
  count: number;
  resetTime: number;
  windowStart: number;
}

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

class RateLimiter {
  private limits: Map<string, RateLimitInfo> = new Map();
  private defaultOptions: RateLimiterOptions = {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  };

  constructor(options?: Partial<RateLimiterOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  private getKey(identifier: string): string {
    return this.defaultOptions.keyGenerator
      ? this.defaultOptions.keyGenerator(identifier)
      : identifier;
  }

  private cleanupExpiredLimits(): void {
    const now = Date.now();
    for (const [key, info] of this.limits.entries()) {
      if (now > info.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  async checkLimit(
    identifier: string,
    options?: Partial<RateLimiterOptions>,
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const opts = { ...this.defaultOptions, ...options };
    const key = this.getKey(identifier);
    const now = Date.now();

    // Clean up expired limits
    this.cleanupExpiredLimits();

    // Get or create limit info
    let limitInfo = this.limits.get(key);

    if (!limitInfo || now > limitInfo.resetTime) {
      // Create new window
      limitInfo = {
        count: 0,
        resetTime: now + opts.windowMs,
        windowStart: now,
      };
      this.limits.set(key, limitInfo);
    }

    // Check if limit is exceeded
    if (limitInfo.count >= opts.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: limitInfo.resetTime,
        retryAfter: Math.ceil((limitInfo.resetTime - now) / 1000),
      };
    }

    // Increment counter
    limitInfo.count++;
    this.limits.set(key, limitInfo);

    return {
      allowed: true,
      remaining: opts.maxRequests - limitInfo.count,
      resetTime: limitInfo.resetTime,
    };
  }

  async waitForLimit(
    identifier: string,
    options?: Partial<RateLimiterOptions>,
  ): Promise<void> {
    const result = await this.checkLimit(identifier, options);

    if (!result.allowed && result.retryAfter) {
      console.log(
        `Rate limit exceeded for ${identifier}. Waiting ${result.retryAfter} seconds...`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, result.retryAfter! * 1000),
      );
      // Recursively wait until we can proceed
      return this.waitForLimit(identifier, options);
    }
  }

  getLimitInfo(identifier: string): RateLimitInfo | null {
    const key = this.getKey(identifier);
    return this.limits.get(key) || null;
  }

  clearLimit(identifier: string): void {
    const key = this.getKey(identifier);
    this.limits.delete(key);
  }

  clearAllLimits(): void {
    this.limits.clear();
  }

  getActiveCount(): number {
    this.cleanupExpiredLimits();
    return this.limits.size;
  }
}

// Create rate limiter instances for different services
export const apiRateLimiter = new RateLimiter();

export const whopApiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (identifier) => `whop:${identifier}`,
});

export const supabaseRateLimiter = new RateLimiter({
  maxRequests: 200,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (identifier) => `supabase:${identifier}`,
});

// Rate limiter with user settings
export const createUserRateLimiter = (userId: string): RateLimiter => {
  const settings = useSettingsStore.getState().integrations;
  const maxRequests = settings.rateLimitPerMinute || 60;

  return new RateLimiter({
    maxRequests,
    windowMs: 60 * 1000,
    keyGenerator: (identifier) => `user:${userId}:${identifier}`,
  });
};

// Utility functions
export const rateLimitUtils = {
  async withRateLimit<T>(
    rateLimiter: RateLimiter,
    identifier: string,
    operation: () => Promise<T>,
    options?: Partial<RateLimiterOptions>,
  ): Promise<T> {
    await rateLimiter.waitForLimit(identifier, options);
    return operation();
  },

  async batchWithRateLimit<T, R>(
    rateLimiter: RateLimiter,
    identifier: string,
    items: T[],
    operation: (item: T) => Promise<R>,
    options?: Partial<RateLimiterOptions>,
  ): Promise<R[]> {
    const results: R[] = [];

    for (const item of items) {
      const result = await this.withRateLimit(
        rateLimiter,
        identifier,
        () => operation(item),
        options,
      );
      results.push(result);
    }

    return results;
  },

  createDelayedExecutor(
    rateLimiter: RateLimiter,
    identifier: string,
    options?: Partial<RateLimiterOptions>,
  ) {
    return async <T>(operation: () => Promise<T>): Promise<T> => {
      return this.withRateLimit(rateLimiter, identifier, operation, options);
    };
  },
};

export default RateLimiter;
