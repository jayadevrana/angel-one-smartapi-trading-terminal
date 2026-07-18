import type { LedgerRow, Recommendation } from "@/types/trading";

export function calculatePnl(recommendationPrice: number, currentPrice: number, quantity?: number) {
  const pnlPercent = recommendationPrice === 0 ? 0 : ((currentPrice - recommendationPrice) / recommendationPrice) * 100;
  const pnl = quantity ? (currentPrice - recommendationPrice) * quantity : undefined;
  return { pnl: pnl == null ? undefined : round(pnl), pnlPercent: round(pnlPercent) };
}

export function performanceLabel(pnlPercent: number): LedgerRow["performanceLabel"] {
  if (pnlPercent >= 15) return "Strong performer";
  if (pnlPercent <= -10) return "Underperformer";
  if (pnlPercent > 0.25) return "Profit";
  if (pnlPercent < -0.25) return "Loss";
  return "Neutral";
}

export function daysSince(dateIso: string, now = new Date()) {
  return Math.max(0, Math.floor((now.getTime() - new Date(dateIso).getTime()) / 86400000));
}

export function buildLedgerRow(recommendation: Recommendation, currentPrice: number): LedgerRow {
  const pnl = calculatePnl(recommendation.recommendedPrice, currentPrice, recommendation.quantity);
  return {
    ...recommendation,
    currentPrice,
    ...pnl,
    highestPrice: Math.max(currentPrice, recommendation.currentPriceAtRecommendation),
    lowestPrice: Math.min(currentPrice, recommendation.currentPriceAtRecommendation),
    daysSinceRecommendation: daysSince(recommendation.createdAt),
    performanceLabel: performanceLabel(pnl.pnlPercent),
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
