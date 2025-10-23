export const calculateReadingTime = (content) => {
  if (!content) return 0;

  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes;
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

  // Get first paragraph
  const firstParagraph = plainText.split("\n\n")[0];

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength - 3).trim() + "...";
};

export const countWords = (content) => {
  if (!content) return 0;
  return content.trim().split(/\s+/).length;
};

export const estimateReadingTime = (wordCount) => {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
};
