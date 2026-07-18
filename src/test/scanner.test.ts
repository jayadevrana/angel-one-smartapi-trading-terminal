import { describe, expect, it } from "vitest";
import { runBookValueScanner } from "@/lib/scanner/engine";
import type { BrokerMarketDataProvider } from "@/lib/broker/types";
import type { SymbolInfo } from "@/types/trading";

const symbol: SymbolInfo = { symbol: "TATASTEEL", tradingSymbol: "TATASTEEL-EQ", companyName: "Tata Steel", exchange: "NSE", token: "3499" };

describe("book value scanner", () => {
  it("returns matches when book value per share is greater than current market price", async () => {
    const market: BrokerMarketDataProvider = {
      searchSymbols: async () => [symbol],
      getHistoricalCandles: async () => [],
      getQuote: async () => ({ ...symbol, price: 10, open: 9, high: 11, low: 8, close: 10, volume: 1000, capturedAt: new Date().toISOString() }),
    };

    const results = await runBookValueScanner([symbol], market);
    expect(results).toHaveLength(1);
    expect(results[0].symbol).toBe("TATASTEEL");
    expect(results[0].bookValuePerShare).toBeGreaterThan(results[0].price);
  });
});
