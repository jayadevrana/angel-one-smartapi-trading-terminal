import Link from "next/link";
import { Metric } from "@/components/ui/metric";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWatchlistQuotes, getStore } from "@/lib/server/store";
import { buildLedger } from "@/lib/ledger/ledger";

export default async function DashboardPage() {
  const store = getStore();
  const ledger = await buildLedger(store.recommendations);
  const totalPnl = ledger.reduce((sum, item) => sum + (item.pnl || 0), 0);
  const best = [...ledger].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
  const worst = [...ledger].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];
  const watchlist = getWatchlistQuotes();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Trading research dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">Live Angel SmartAPI-ready scanner, recommendations, charts, watchlist, and ledger performance in one workspace.</p>
        </div>
        <Link href="/scanner" className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Run scanner</Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total recommendations" value={store.recommendations.length} detail="System-generated research signals" />
        <Metric label="Active" value={store.recommendations.filter((item) => item.status === "active").length} tone="accent" detail="Currently tracked in ledger" />
        <Metric label="Closed" value={store.recommendations.filter((item) => item.status === "closed").length} detail="Archived outcomes" />
        <Metric label="Total live P&L" value={`Rs ${totalPnl.toFixed(2)}`} tone={totalPnl >= 0 ? "profit" : "loss"} detail="Uses quantity when available" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-[#090d12]">
          <div className="border-b border-white/10 px-4 py-3">
            <h2 className="font-medium">Latest scanner results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr><th className="px-4 py-3">Symbol</th><th>Price</th><th>Book value</th><th>Discount</th><th>Status</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {(store.scannerResults.length ? store.scannerResults : []).slice(0, 6).map((row) => (
                  <tr key={row.id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-medium text-slate-100">{row.symbol}</td>
                    <td>Rs {row.price}</td>
                    <td>Rs {row.bookValuePerShare}</td>
                    <td className="text-emerald-300">{row.discountPercent}%</td>
                    <td><StatusBadge tone="accent">{row.recommendationStatus}</StatusBadge></td>
                    <td className="max-w-md truncate text-slate-500">{row.reason}</td>
                  </tr>
                ))}
                {!store.scannerResults.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No scanner run yet. Start with the book-value scanner.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-[#090d12] p-4">
            <h2 className="font-medium">Performance extremes</h2>
            <div className="mt-4 grid gap-3">
              <Metric label="Best" value={best ? `${best.symbol} ${best.pnlPercent}%` : "None"} tone="profit" />
              <Metric label="Worst" value={worst ? `${worst.symbol} ${worst.pnlPercent}%` : "None"} tone="loss" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#090d12] p-4">
            <h2 className="font-medium">Watchlist summary</h2>
            <div className="mt-3 space-y-3">
              {watchlist.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.symbol}</span>
                  <span className="font-mono text-slate-100">Rs {item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
