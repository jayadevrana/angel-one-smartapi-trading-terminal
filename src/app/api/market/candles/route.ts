import { ok, fail } from "@/lib/api";
import { getMarketDataProvider } from "@/lib/broker";
import { symbolUniverse } from "@/lib/demo-data";
import type { Timeframe } from "@/types/trading";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const symbol = params.get("symbol") || "TATASTEEL";
    const timeframe = (params.get("timeframe") || "1D") as Timeframe;
    const info = symbolUniverse.find((item) => item.symbol === symbol) || symbolUniverse[0];
    return ok(await getMarketDataProvider().getHistoricalCandles(info, timeframe));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Candle fetch failed", 502);
  }
}
