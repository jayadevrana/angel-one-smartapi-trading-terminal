import type { Candle, Fundamentals, Quote, Recommendation, SymbolInfo } from "@/types/trading";

export const demoUserId = "demo-user";

export const symbolUniverse: SymbolInfo[] = [
  { symbol: "TATASTEEL", tradingSymbol: "TATASTEEL-EQ", companyName: "Tata Steel", exchange: "NSE", token: "3499" },
  { symbol: "ONGC", tradingSymbol: "ONGC-EQ", companyName: "Oil and Natural Gas Corporation", exchange: "NSE", token: "2475" },
  { symbol: "SAIL", tradingSymbol: "SAIL-EQ", companyName: "Steel Authority of India", exchange: "NSE", token: "2963" },
  { symbol: "VEDL", tradingSymbol: "VEDL-EQ", companyName: "Vedanta", exchange: "NSE", token: "3063" },
  { symbol: "ITC", tradingSymbol: "ITC-EQ", companyName: "ITC", exchange: "NSE", token: "1660" },
  { symbol: "INFY", tradingSymbol: "INFY-EQ", companyName: "Infosys", exchange: "NSE", token: "1594" },
  { symbol: "HDFCBANK", tradingSymbol: "HDFCBANK-EQ", companyName: "HDFC Bank", exchange: "NSE", token: "1333" },
];

const basePrices: Record<string, number> = {
  TATASTEEL: 142.4,
  ONGC: 238.7,
  SAIL: 119.15,
  VEDL: 454.35,
  ITC: 438.9,
  INFY: 1468.2,
  HDFCBANK: 1538.65,
};

const fundamentals: Record<string, Fundamentals> = {
  TATASTEEL: { symbol: "TATASTEEL", bookValuePerShare: 978.4, pbRatio: 0.52, debtToEquity: 0.76, roe: 12.4, source: "mock-fundamentals", asOf: "2026-04-26" },
  ONGC: { symbol: "ONGC", bookValuePerShare: 268.1, pbRatio: 0.89, debtToEquity: 0.05, roe: 15.1, source: "mock-fundamentals", asOf: "2026-04-26" },
  SAIL: { symbol: "SAIL", bookValuePerShare: 156.6, pbRatio: 0.76, debtToEquity: 0.61, roe: 8.2, source: "mock-fundamentals", asOf: "2026-04-26" },
  VEDL: { symbol: "VEDL", bookValuePerShare: 366.2, pbRatio: 1.24, debtToEquity: 1.39, roe: 17.8, source: "mock-fundamentals", asOf: "2026-04-26" },
  ITC: { symbol: "ITC", bookValuePerShare: 66.9, pbRatio: 6.55, debtToEquity: 0.01, roe: 28.1, source: "mock-fundamentals", asOf: "2026-04-26" },
  INFY: { symbol: "INFY", bookValuePerShare: 226.3, pbRatio: 6.49, debtToEquity: 0, roe: 31.4, source: "mock-fundamentals", asOf: "2026-04-26" },
  HDFCBANK: { symbol: "HDFCBANK", bookValuePerShare: 650.2, pbRatio: 2.36, debtToEquity: 0, roe: 16.8, source: "mock-fundamentals", asOf: "2026-04-26" },
};

export function getMockQuote(symbolInfo: SymbolInfo): Quote {
  const base = basePrices[symbolInfo.symbol] ?? 100;
  const drift = Math.sin(Date.now() / 900000 + symbolInfo.symbol.length) * base * 0.006;
  const price = round(base + drift);
  return {
    ...symbolInfo,
    price,
    open: round(base * 0.992),
    high: round(base * 1.018),
    low: round(base * 0.981),
    close: round(base * 0.998),
    volume: Math.round(250000 + base * 3800),
    capturedAt: new Date().toISOString(),
  };
}

export function getMockCandles(symbol: string, timeframe: string): Candle[] {
  const base = basePrices[symbol] ?? 100;
  const intervalSeconds = timeframe === "1m" ? 60 : timeframe === "5m" ? 300 : timeframe === "15m" ? 900 : timeframe === "1h" ? 3600 : timeframe === "1W" ? 604800 : 86400;
  const points = timeframe === "1D" || timeframe === "1W" ? 130 : 180;
  const now = Math.floor(Date.now() / 1000);

  return Array.from({ length: points }, (_, index) => {
    const t = now - (points - index) * intervalSeconds;
    const wave = Math.sin(index / 8) * base * 0.025 + Math.cos(index / 21) * base * 0.018;
    const open = base + wave;
    const close = open + Math.sin(index / 3) * base * 0.006;
    const high = Math.max(open, close) + base * (0.006 + (index % 5) * 0.001);
    const low = Math.min(open, close) - base * (0.005 + (index % 3) * 0.001);
    return { time: new Date(t * 1000).toISOString(), open: round(open), high: round(high), low: round(low), close: round(close), volume: Math.round(90000 + index * 875 + base * 600) };
  });
}

export function getMockFundamentals(symbol: string): Fundamentals {
  return fundamentals[symbol] ?? { symbol, bookValuePerShare: 0, source: "mock-fundamentals", asOf: "2026-04-26" };
}

export const demoRecommendations: Recommendation[] = [
  {
    id: "rec-tata",
    userId: demoUserId,
    symbol: "TATASTEEL",
    tradingSymbol: "TATASTEEL-EQ",
    companyName: "Tata Steel",
    exchange: "NSE",
    token: "3499",
    type: "VALUE_PICK",
    recommendedPrice: 139.8,
    currentPriceAtRecommendation: 139.8,
    bookValue: 978.4,
    reason: "This stock is trading below book value. Book value is Rs 978.40 and current market price is Rs 139.80, implying a discount of 85.71%.",
    scannerCondition: "book_value_per_share > current_market_price",
    initialOhlcSnapshot: { open: 137.4, high: 142.8, low: 136.2, close: 139.8, volume: 859430 },
    status: "active",
    quantity: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

export function round(value: number) {
  return Math.round(value * 100) / 100;
}
