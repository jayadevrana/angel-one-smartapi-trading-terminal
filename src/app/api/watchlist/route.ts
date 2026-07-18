import { z } from "zod";
import { ok, fail } from "@/lib/api";
import { symbolUniverse } from "@/lib/demo-data";
import { getStore, getWatchlistQuotes } from "@/lib/server/store";

const schema = z.object({ symbol: z.string().min(1) });

export async function GET() {
  return ok(getWatchlistQuotes());
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Symbol is required.", 422);
  const symbol = parsed.data.symbol.toUpperCase();
  if (!symbolUniverse.some((item) => item.symbol === symbol)) return fail("Symbol not found in current universe.", 404);
  const store = getStore();
  if (!store.watchlist.includes(symbol)) store.watchlist.push(symbol);
  return ok(getWatchlistQuotes());
}

export async function DELETE(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol");
  if (!symbol) return fail("Symbol is required.", 422);
  const store = getStore();
  store.watchlist = store.watchlist.filter((item) => item !== symbol.toUpperCase());
  return ok(getWatchlistQuotes());
}
