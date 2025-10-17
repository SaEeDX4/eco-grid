import { checkRateLimit } from "../services/antiSpamService.js";

export const createRateLimiter = (options = {}) => {
  const {
    maxAttempts = 5,
    windowMs = 60000,
    keyGenerator = (req) => req.ip,
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const result = checkRateLimit(key, maxAttempts, windowMs);

    // Set rate limit headers
    res.set("X-RateLimit-Limit", maxAttempts);
    res.set("X-RateLimit-Remaining", result.remaining);

    if (!result.allowed) {
      res.set("Retry-After", result.retryAfter);
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: result.retryAfter,
      });
    }

    next();
  };
};

// Preset rate limiters
export const contactFormLimiter = createRateLimiter({
  maxAttempts: 3,
  windowMs: 3600000, // 1 hour
  keyGenerator: (req) => req.ip,
});

export const chatLimiter = createRateLimiter({
  maxAttempts: 20,
  windowMs: 60000, // 1 minute
  keyGenerator: (req) => req.body.sessionId || req.ip,
});

export const authLimiter = createRateLimiter({
  maxAttempts: 5,
  windowMs: 900000, // 15 minutes
  keyGenerator: (req) => req.body.email || req.ip,
});
