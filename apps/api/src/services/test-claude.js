import dotenv from "dotenv";
dotenv.config({ path: "C:/ME/ECO_GRID/apps/api/.env" }); // ✅ Force-load .env

import ClaudeAdapter from "../../../../packages/ai/adapters/claude.js";

console.log(
  "Loaded key prefix:",
  process.env.ANTHROPIC_API_KEY?.slice(0, 10) || "❌ not found"
);

async function testClaude() {
  try {
    const claude = new ClaudeAdapter(process.env.ANTHROPIC_API_KEY);

    console.log("🤖 Testing Claude API...");
    const response = await claude.complete("Say hello in one short sentence.");

    console.log("✅ Claude API Response:");
    console.log(response);
  } catch (err) {
    console.error("❌ Claude test failed:", err);
  }
}

testClaude();
