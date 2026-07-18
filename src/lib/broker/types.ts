import type { Candle, Quote, SymbolInfo, Timeframe } from "@/types/trading";

export interface BrokerMarketDataProvider {
  searchSymbols(query: string): Promise<SymbolInfo[]>;
  getQuote(symbol: SymbolInfo): Promise<Quote>;
  getHistoricalCandles(symbol: SymbolInfo, timeframe: Timeframe): Promise<Candle[]>;
}
