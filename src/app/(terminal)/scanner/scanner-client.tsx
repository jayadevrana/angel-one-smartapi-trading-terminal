"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ScannerResult } from "@/types/trading";

export function ScannerClient({ initialResults }: { initialResults: ScannerResult[] }) {
  const [results, setResults] = useState(initialResults);
  const [scope, setScope] = useState<"all" | "watchlist">("all");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  async function runScanner() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/scanner/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope }),
    });
    const json = await response.json();
    setLoading(false);
    if (!json.ok) return setError(json.error || "Scanner failed");
    setResults(json.data);
  }

  async function createRecommendation(resultId: string) {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultId }),
    });
    const json = await response.json();
    if (json.ok) {
      setResults((rows) => rows.map((row) => row.id === resultId ? { ...row, recommendationStatus: "created" } : row));
    } else {
      setError(json.error || "Recommendation failed");
    }
  }

  const filtered = results.filter((row) => `${row.symbol} ${row.companyName}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#090d12] p-3">
        <div className="flex flex-wrap items-center gap-2">
          <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search results" className="h-10 w-56 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none focus:border-cyan-400/60" />
          <select value={scope} onChange={(event) => setScope(event.target.value as "all" | "watchlist")} className="h-10 rounded-md border border-white/10 bg-[#0e141d] px-3 text-sm text-slate-200 outline-none">
            <option value="all">Full universe</option>
            <option value="watchlist">Watchlist only</option>
          </select>
        </div>
        <button onClick={runScanner} disabled={loading} className="h-10 rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 disabled:opacity-60">{loading ? "Scanning..." : "Run book-value scan"}</button>
      </div>
      {error ? <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#090d12]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Symbol</th><th>Company</th><th>CMP</th><th>Book value</th><th>Diff</th><th>Discount</th><th>Volume</th><th>O/H/L/C</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-3 font-semibold text-slate-50">{row.symbol}</td>
                  <td className="text-slate-300">{row.companyName}</td>
                  <td className="font-mono">Rs {row.price}</td>
                  <td className="font-mono">Rs {row.bookValuePerShare}</td>
                  <td className="font-mono text-emerald-300">Rs {row.difference}</td>
                  <td className="font-mono text-emerald-300">{row.discountPercent}%</td>
                  <td className="font-mono text-slate-400">{row.volume.toLocaleString()}</td>
                  <td className="font-mono text-xs text-slate-400">{row.open}/{row.high}/{row.low}/{row.close}</td>
                  <td><StatusBadge tone={row.recommendationStatus === "created" ? "profit" : "accent"}>{row.recommendationStatus}</StatusBadge></td>
                  <td><button onClick={() => createRecommendation(row.id)} disabled={row.recommendationStatus === "created"} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] disabled:opacity-40">Recommend</button></td>
                </tr>
              ))}
              {!filtered.length ? <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">No matches yet. Run the scanner to find stocks where book value per share exceeds CMP.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
