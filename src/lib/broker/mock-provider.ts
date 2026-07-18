import { getMockCandles, getMockQuote, symbolUniverse } from "@/lib/demo-data";
import type { BrokerMarketDataProvider } from "@/lib/broker/types";
import type { SymbolInfo, Timeframe } from "@/types/trading";

export class MockMarketDataProvider implements BrokerMarketDataProvider {
  async searchSymbols(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return symbolUniverse;
    return symbolUniverse.filter((item) =>
      [item.symbol, item.tradingSymbol, item.companyName].some((value) => value.toLowerCase().includes(normalized)),
    );
  }

  async getQuote(symbol: SymbolInfo) {
    return getMockQuote(symbol);
  }

  async getHistoricalCandles(symbol: SymbolInfo, timeframe: Timeframe) {
    return getMockCandles(symbol.symbol, timeframe);
  }
}
