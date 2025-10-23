// MDX rendering utilities
export const calculateReadingTime = (content) => {
  if (!content) return 0;

  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes;
};

export const extractHeadings = (content) => {
  if (!content) return [];

  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ level, text, slug });
  }

  return headings;
};

export const generateExcerpt = (content, maxLength = 200) => {
  if (!content) return "";

  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();

  if (plainText.length <= maxLength) return plainText;

  return plainText.substring(0, maxLength).trim() + "...";
};

export const sanitizeContent = (content) => {
  if (!content) return "";

  // Basic sanitization - in production, use a library like DOMPurify
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

export const validateMDX = (content) => {
  const errors = [];

  // Check for unmatched code blocks
  const codeBlocks = content.match(/```/g);
  if (codeBlocks && codeBlocks.length % 2 !== 0) {
    errors.push("Unmatched code block delimiters");
  }

  // Check for unmatched bold/italic
  const boldMatches = content.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    errors.push("Unmatched bold markers");
  }

  const italicMatches = content.match(/(?<!\*)\*(?!\*)/g);
  if (italicMatches && italicMatches.length % 2 !== 0) {
    errors.push("Unmatched italic markers");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
