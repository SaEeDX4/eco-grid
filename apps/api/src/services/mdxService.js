import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

export const processMDX = async (content) => {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify);

    const file = await processor.process(content);

    return {
      success: true,
      content: String(file),
    };
  } catch (error) {
    console.error("Process MDX error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const extractMetadata = (content) => {
  try {
    // Extract headings
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        slug: match[2]
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
      });
    }

    // Extract links
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
      });
    }

    // Extract code blocks
    const codeBlocks = [];
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;

    while ((match = codeRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || "text",
        code: match[2],
      });
    }

    // Calculate statistics
    const words = content.split(/\s+/).length;
    const characters = content.length;
    const readingTime = Math.ceil(words / 200);

    return {
      headings,
      links,
      codeBlocks,
      stats: {
        words,
        characters,
        readingTime,
        headingCount: headings.length,
        linkCount: links.length,
        codeBlockCount: codeBlocks.length,
      },
    };
  } catch (error) {
    console.error("Extract metadata error:", error);
    return null;
  }
};

export const sanitizeMDX = (content) => {
  try {
    // Remove potentially dangerous patterns
    let sanitized = content;

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
    sanitized = sanitized.replace(/javascript:/gi, "");

    return sanitized;
  } catch (error) {
    console.error("Sanitize MDX error:", error);
    return content;
  }
};
