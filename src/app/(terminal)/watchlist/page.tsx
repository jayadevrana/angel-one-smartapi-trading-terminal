import { WatchlistClient } from "@/app/(terminal)/watchlist/watchlist-client";
import { getWatchlistQuotes } from "@/lib/server/store";

export default function WatchlistPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Watchlist</h1>
        <p className="mt-2 text-sm text-slate-500">Add stocks, monitor live prices, open charts, or run the scanner on this focused universe.</p>
      </header>
      <WatchlistClient initialRows={getWatchlistQuotes()} />
    </div>
  );
}
