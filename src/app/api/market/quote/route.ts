import { ok, fail } from "@/lib/api";
import { getMarketDataProvider } from "@/lib/broker";
import { symbolUniverse } from "@/lib/demo-data";

export async function GET(request: Request) {
  try {
    const symbol = new URL(request.url).searchParams.get("symbol") || "TATASTEEL";
    const info = symbolUniverse.find((item) => item.symbol === symbol) || symbolUniverse[0];
    return ok(await getMarketDataProvider().getQuote(info));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Quote failed", 502);
  }
}
