import { demoRecommendations, demoUserId, getMockQuote, symbolUniverse } from "@/lib/demo-data";
import type { ChartDrawing, Recommendation, ScannerResult } from "@/types/trading";

type Store = {
  users: Array<{ id: string; email: string; name: string; passwordHash: string }>;
  watchlist: string[];
  scannerResults: ScannerResult[];
  recommendations: Recommendation[];
  drawings: ChartDrawing[];
};

declare global {
  var __angelTerminalStore: Store | undefined;
}

export function getStore(): Store {
  if (!globalThis.__angelTerminalStore) {
    globalThis.__angelTerminalStore = {
      users: [],
      watchlist: ["TATASTEEL", "ONGC", "SAIL", "ITC"],
      scannerResults: [],
      recommendations: [...demoRecommendations],
      drawings: [],
    };
  }
  return globalThis.__angelTerminalStore;
}

export function getWatchlistQuotes() {
  const store = getStore();
  return store.watchlist
    .map((symbol) => symbolUniverse.find((item) => item.symbol === symbol))
    .filter(Boolean)
    .map((item) => getMockQuote(item!));
}

export const defaultUser = { id: demoUserId, email: "demo@terminal.local", name: "Demo Trader" };
