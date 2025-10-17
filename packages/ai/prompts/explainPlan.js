export const generateExplainPlanPrompt = (plan) => {
  return `You are an energy optimization assistant. Translate this technical optimization plan into friendly, easy-to-understand steps.

Optimization Plan:
${JSON.stringify(plan, null, 2)}

Provide:
1. A simple summary (1 sentence) of what this plan does
2. 3-5 easy-to-follow action steps in plain language
3. Expected savings in CAD and CO₂
4. One small improvement suggestion

Be encouraging and clear. Use everyday language, not technical jargon.`;
};
