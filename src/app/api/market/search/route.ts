import { ok, fail } from "@/lib/api";
import { getMarketDataProvider } from "@/lib/broker";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("q") || "";
    return ok(await getMarketDataProvider().searchSymbols(query));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Symbol search failed", 502);
  }
}
