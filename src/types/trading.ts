export type Exchange = "NSE" | "BSE" | "NFO" | "MCX" | string;

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "1D" | "1W";

export type SymbolInfo = {
  symbol: string;
  tradingSymbol: string;
  companyName: string;
  exchange: Exchange;
  token: string;
};

export type Quote = SymbolInfo & {
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  capturedAt: string;
};

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Fundamentals = {
  symbol: string;
  bookValuePerShare: number;
  peRatio?: number;
  pbRatio?: number;
  debtToEquity?: number;
  roe?: number;
  source: string;
  asOf: string;
};

export type ScannerResult = Quote & {
  id: string;
  bookValuePerShare: number;
  difference: number;
  discountPercent: number;
  recommendationStatus: "new" | "created" | "ignored";
  reason: string;
  scanDate: string;
};

export type RecommendationType = "BUY" | "WATCHLIST" | "VALUE_PICK";
export type RecommendationStatus = "active" | "closed" | "ignored";

export type Recommendation = {
  id: string;
  userId: string;
  symbol: string;
  tradingSymbol: string;
  companyName: string;
  exchange: Exchange;
  token: string;
  type: RecommendationType;
  recommendedPrice: number;
  currentPriceAtRecommendation: number;
  bookValue: number;
  reason: string;
  scannerCondition: string;
  initialOhlcSnapshot: Pick<Quote, "open" | "high" | "low" | "close" | "volume">;
  status: RecommendationStatus;
  notes?: string;
  quantity?: number;
  createdAt: string;
  closedAt?: string;
};

export type LedgerRow = Recommendation & {
  currentPrice: number;
  pnl?: number;
  pnlPercent: number;
  highestPrice: number;
  lowestPrice: number;
  daysSinceRecommendation: number;
  performanceLabel: "Profit" | "Loss" | "Neutral" | "Strong performer" | "Underperformer";
};

export type ChartDrawing = {
  id: string;
  userId: string;
  symbol: string;
  exchange: Exchange;
  token: string;
  type: "trend_line" | "horizontal_line" | "vertical_line" | "ray_line" | "freehand";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
