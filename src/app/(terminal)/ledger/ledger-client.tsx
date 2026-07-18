"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LedgerRow } from "@/types/trading";

export function LedgerClient({ rows }: { rows: LedgerRow[] }) {
  const [items, setItems] = useState(rows);
  const [filter, setFilter] = useState("");

  async function closeRecommendation(id: string) {
    await fetch(`/api/recommendations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "closed", closedAt: new Date().toISOString() } : item));
  }

  const filtered = items.filter((item) => `${item.symbol} ${item.companyName}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4">
      <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter ledger" className="h-10 w-full max-w-xs rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none focus:border-cyan-400/60" />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#090d12]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr><th className="px-4 py-3">Date</th><th>Symbol</th><th>Rec price</th><th>Live price</th><th>Qty</th><th>P&L</th><th>P&L %</th><th>High/Low</th><th>Days</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="font-semibold text-slate-50">{row.symbol}</td>
                  <td className="font-mono">Rs {row.recommendedPrice}</td>
                  <td className="font-mono">Rs {row.currentPrice}</td>
                  <td className="font-mono text-slate-400">{row.quantity || "-"}</td>
                  <td className={`font-mono ${row.pnlPercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{row.pnl == null ? "-" : `Rs ${row.pnl}`}</td>
                  <td className={`font-mono ${row.pnlPercent >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{row.pnlPercent}%</td>
                  <td className="font-mono text-xs text-slate-400">{row.highestPrice}/{row.lowestPrice}</td>
                  <td>{row.daysSinceRecommendation}</td>
                  <td><StatusBadge tone={row.status === "active" ? "accent" : "neutral"}>{row.status}</StatusBadge></td>
                  <td><button onClick={() => closeRecommendation(row.id)} disabled={row.status !== "active"} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/[0.06] disabled:opacity-40">Close</button></td>
                </tr>
              ))}
              {!filtered.length ? <tr><td colSpan={11} className="px-4 py-12 text-center text-slate-500">No recommendations in the ledger yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
