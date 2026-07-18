import { getFundamentalsProvider } from "@/lib/fundamentals/provider";
import type { BrokerMarketDataProvider } from "@/lib/broker/types";
import type { ScannerResult, SymbolInfo } from "@/types/trading";

export const bookValueCondition = {
  key: "book_value_gt_cmp",
  expression: "book_value_per_share > current_market_price",
  label: "Book value per share > current market price",
};

export async function runBookValueScanner(symbols: SymbolInfo[], marketData: BrokerMarketDataProvider): Promise<ScannerResult[]> {
  const fundamentalsProvider = getFundamentalsProvider();
  const rows = await Promise.all(symbols.map(async (symbol) => {
    const [quote, fundamentals] = await Promise.all([
      marketData.getQuote(symbol),
      fundamentalsProvider.getFundamentals(symbol.symbol),
    ]);

    if (fundamentals.bookValuePerShare <= quote.price) return null;
    const difference = round(fundamentals.bookValuePerShare - quote.price);
    const discountPercent = round((difference / fundamentals.bookValuePerShare) * 100);

    return {
      id: `${symbol.symbol}-${Date.now()}`,
      ...quote,
      bookValuePerShare: fundamentals.bookValuePerShare,
      difference,
      discountPercent,
      recommendationStatus: "new" as const,
      reason: `This stock is trading below book value. Book value is Rs ${fundamentals.bookValuePerShare.toFixed(2)} and current market price is Rs ${quote.price.toFixed(2)}, implying a discount of ${discountPercent.toFixed(2)}%.`,
      scanDate: new Date().toISOString(),
    };
  }));

  return rows.filter(Boolean) as ScannerResult[];
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
