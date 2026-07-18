import { ok, fail } from "@/lib/api";
import { getMarketDataProvider } from "@/lib/broker";
import { symbolUniverse } from "@/lib/demo-data";
import { runBookValueScanner } from "@/lib/scanner/engine";
import { getStore } from "@/lib/server/store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const store = getStore();
    const universe = body.scope === "watchlist"
      ? symbolUniverse.filter((item) => store.watchlist.includes(item.symbol))
      : symbolUniverse;
    const results = await runBookValueScanner(universe, getMarketDataProvider());
    store.scannerResults = results;
    return ok(results);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Scanner run failed", 502);
  }
}
