import ClaudeAdapter from "./claude.js";

// Factory function to get AI adapter
export const getAIAdapter = (provider = "claude", apiKey = null) => {
  switch (provider.toLowerCase()) {
    case "claude":
      return new ClaudeAdapter(apiKey);
    // Future: Add OpenAI, Gemini, etc.
    default:
      return new ClaudeAdapter(apiKey);
  }
};

export { ClaudeAdapter };
