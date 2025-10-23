// Content validation and safety checks

export const validateContent = async (content) => {
  const issues = [];
  let passed = true;

  try {
    // Check content length
    if (!content || content.trim().length === 0) {
      issues.push("Content is empty");
      passed = false;
    }

    const words = content.split(/\s+/).length;

    if (words < 300) {
      issues.push("Content is too short (minimum 300 words)");
      passed = false;
    }

    if (words > 5000) {
      issues.push("Content is too long (maximum 5000 words)");
    }

    // Check for common profanity (basic list)
    const profanityList = ["damn", "hell", "crap"]; // Extend as needed
    const contentLower = content.toLowerCase();

    for (const word of profanityList) {
      if (contentLower.includes(word)) {
        issues.push(`Potentially inappropriate language detected: "${word}"`);
      }
    }

    // Check for suspicious patterns
    if (/<script/i.test(content)) {
      issues.push("Suspicious script tags detected");
      passed = false;
    }

    if (/javascript:/i.test(content)) {
      issues.push("Suspicious javascript: protocol detected");
      passed = false;
    }

    // Check for excessive capitalization
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.3) {
      issues.push("Excessive capitalization detected");
    }

    // Check for broken markdown
    const codeBlockCount = (content.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
      issues.push("Unmatched code block delimiters");
      passed = false;
    }

    const boldCount = (content.match(/\*\*/g) || []).length;
    if (boldCount % 2 !== 0) {
      issues.push("Unmatched bold markers");
    }

    // Check for duplicate content (basic)
    const sentences = content.split(/[.!?]+/);
    const uniqueSentences = new Set(
      sentences.map((s) => s.trim().toLowerCase())
    );
    const duplicateRatio = 1 - uniqueSentences.size / sentences.length;

    if (duplicateRatio > 0.3) {
      issues.push("High level of duplicate content detected");
    }

    return {
      passed,
      issues,
      stats: {
        words,
        characters: content.length,
        sentences: sentences.length,
        duplicateRatio: (duplicateRatio * 100).toFixed(2),
      },
    };
  } catch (error) {
    console.error("Validate content error:", error);
    return {
      passed: false,
      issues: ["Validation error: " + error.message],
    };
  }
};

export const sanitizeHTML = (html) => {
  try {
    // Basic HTML sanitization
    // In production, use a library like DOMPurify

    let sanitized = html;

    // Remove script tags
    sanitized = sanitized.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Remove iframe tags
    sanitized = sanitized.replace(
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      ""
    );

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");

    // Remove javascript: protocol
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "");

    return sanitized;
  } catch (error) {
    console.error("Sanitize HTML error:", error);
    return html;
  }
};

export const checkPlagiarism = async (content) => {
  try {
    // In production, integrate with plagiarism detection API
    // For now, return mock result

    return {
      checked: true,
      plagiarismScore: 0,
      sources: [],
      passed: true,
    };
  } catch (error) {
    console.error("Check plagiarism error:", error);
    return {
      checked: false,
      error: error.message,
    };
  }
};
