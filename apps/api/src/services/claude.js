// apps/api/src/services/claude.js
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Ensure .env is loaded correctly even if server.js misses it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 🧠 Singleton client to avoid re-creation
let anthropicClient = null;

/**
 * Lazily initializes the Anthropic client using the env key.
 * Works even if dotenv wasn't loaded elsewhere.
 */
function getAnthropicClient() {
  if (anthropicClient) return anthropicClient;

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !key.startsWith("sk-ant-")) {
    console.warn(
      "❌ Anthropic API key missing or invalid. Claude not initialized."
    );
    return null;
  }

  try {
    anthropicClient = new Anthropic({ apiKey: key });
    console.log("🤖 Claude client initialized successfully.");
    return anthropicClient;
  } catch (err) {
    console.error("❌ Error initializing Claude client:", err.message);
    return null;
  }
}

class ClaudeAdapter {
  constructor() {
    this.client = getAnthropicClient();
  }

  async complete(prompt, options = {}) {
    this.client = this.client || getAnthropicClient();
    if (!this.client) {
      console.warn(
        "⚠️ AI service unavailable — Claude client not initialized or invalid."
      );
      return "";
    }

    try {
      const response = await this.client.messages.create({
        // ✅ Stable public model that works for all keys
        model: options.model || "claude-sonnet-4-5-20250929",
        max_tokens: options.maxTokens || 1000,
        messages: [{ role: "user", content: prompt }],
      });
      return response?.content?.[0]?.text ?? "";
    } catch (err) {
      console.error("⚠️ Claude API call failed:", err.message);
      return "";
    }
  }

  async chat(messages, options = {}) {
    this.client = this.client || getAnthropicClient();
    if (!this.client) {
      console.warn(
        "⚠️ AI service unavailable — Claude client not initialized or invalid."
      );
      return "Claude AI unavailable.";
    }

    try {
      const response = await this.client.messages.create({
        // ✅ Stable public model that works for all keys
        model: options.model || "claude-sonnet-4-5-20250929",
        max_tokens: options.maxTokens || 1000,
        messages,
      });
      return response?.content?.[0]?.text ?? "";
    } catch (err) {
      console.error("⚠️ Claude chat failed:", err.message);
      return "";
    }
  }
}

export default ClaudeAdapter;
