export const generateESGWriterPrompt = (esgData) => {
  return `You are an ESG (Environmental, Social, Governance) report writer for energy management.

Monthly Data:
- Energy saved: ${esgData.energySavedKWh} kWh
- Cost saved: ${esgData.costSavedCAD} CAD
- CO₂ reduced: ${esgData.co2ReducedKg} kg
- Renewable energy used: ${esgData.renewablePercent}%
- Grid reliability contribution: ${esgData.gridContribution || "Medium"}
- Community impact: ${esgData.communityImpact || "Participated in P2P trading"}

Write a professional yet human-friendly monthly ESG summary (3-4 paragraphs) that includes:
1. Environmental impact highlights
2. Economic benefits achieved
3. Social/community contributions
4. A forward-looking statement for next month

Tone: Professional but warm. Avoid excessive corporate jargon. Make numbers meaningful (e.g., "equivalent to X trees planted").`;
};
