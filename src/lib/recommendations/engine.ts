import { bookValueCondition } from "@/lib/scanner/engine";
import type { Recommendation, RecommendationType, ScannerResult } from "@/types/trading";

export function createRecommendationFromScannerResult(result: ScannerResult, userId: string, type: RecommendationType = "VALUE_PICK"): Recommendation {
  return {
    id: `rec-${result.symbol}-${Date.now()}`,
    userId,
    symbol: result.symbol,
    tradingSymbol: result.tradingSymbol,
    companyName: result.companyName,
    exchange: result.exchange,
    token: result.token,
    type,
    recommendedPrice: result.price,
    currentPriceAtRecommendation: result.price,
    bookValue: result.bookValuePerShare,
    reason: result.reason,
    scannerCondition: bookValueCondition.expression,
    initialOhlcSnapshot: {
      open: result.open,
      high: result.high,
      low: result.low,
      close: result.close,
      volume: result.volume,
    },
    status: "active",
    createdAt: new Date().toISOString(),
  };
}
