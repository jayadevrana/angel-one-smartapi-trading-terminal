import { getMarketDataProvider } from "@/lib/broker";
import { buildLedgerRow } from "@/lib/calculations";
import type { LedgerRow, Recommendation } from "@/types/trading";

export async function buildLedger(recommendations: Recommendation[]): Promise<LedgerRow[]> {
  const marketData = getMarketDataProvider();
  return Promise.all(recommendations.map(async (recommendation) => {
    const quote = await marketData.getQuote(recommendation);
    return buildLedgerRow(recommendation, quote.price);
  }));
}
