// Anti-spam utilities

const spamTracking = new Map();

export const checkRateLimit = (
  identifier,
  maxAttempts = 3,
  windowMs = 60000,
) => {
  const now = Date.now();
  const key = identifier;

  if (!spamTracking.has(key)) {
    spamTracking.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  const record = spamTracking.get(key);
  const timeSinceFirst = now - record.firstAttempt;

  // Reset if window has passed
  if (timeSinceFirst > windowMs) {
    spamTracking.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  // Increment attempts
  record.attempts++;

  if (record.attempts > maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((windowMs - timeSinceFirst) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.attempts,
  };
};

export const containsProfanity = (text) => {
  // Basic profanity check - in production, use a comprehensive library
  const profanityList = [
    "spam",
    "scam",
    "fake",
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations you won",
    "click here now",
  ];

  const lowerText = text.toLowerCase();
  return profanityList.some((word) => lowerText.includes(word));
};

export const detectSpamPatterns = (message) => {
  const spamIndicators = [];

  // Check for excessive capitalization
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (capsRatio > 0.5 && message.length > 20) {
    spamIndicators.push("excessive_caps");
  }

  // Check for excessive links
  const linkCount = (message.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    spamIndicators.push("excessive_links");
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(message)) {
    spamIndicators.push("repetitive_chars");
  }

  // Check for common spam phrases
  const spamPhrases = [
    "click here",
    "act now",
    "limited time",
    "free money",
    "you have won",
    "congratulations",
    "claim your prize",
  ];

  const lowerMessage = message.toLowerCase();
  spamPhrases.forEach((phrase) => {
    if (lowerMessage.includes(phrase)) {
      spamIndicators.push("spam_phrase");
    }
  });

  return {
    isSpam: spamIndicators.length >= 2,
    indicators: spamIndicators,
  };
};

export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .substring(0, 2000); // Max length
};

export const redactPII = (text) => {
  // Redact email addresses
  let redacted = text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[EMAIL_REDACTED]",
  );

  // Redact phone numbers (various formats)
  redacted = redacted.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    "[PHONE_REDACTED]",
  );

  // Redact credit card numbers
  redacted = redacted.replace(
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    "[CC_REDACTED]",
  );

  // Redact social security numbers
  redacted = redacted.replace(
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    "[SSN_REDACTED]",
  );

  return redacted;
};

// Cleanup old tracking data periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour

  for (const [key, record] of spamTracking.entries()) {
    if (now - record.firstAttempt > maxAge) {
      spamTracking.delete(key);
    }
  }
}, 300000); // Run every 5 minutes
