"use client";

import Link from "next/link";
import { useState } from "react";
import type { Quote } from "@/types/trading";

export function WatchlistClient({ initialRows }: { initialRows: Quote[] }) {
  const [rows, setRows] = useState(initialRows);
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");

  async function add() {
    const response = await fetch("/api/watchlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol }) });
    const json = await response.json();
    if (json.ok) {
      setRows(json.data);
      setSymbol("");
      setError("");
    } else setError(json.error);
  }

  async function remove(target: string) {
    const response = await fetch(`/api/watchlist?symbol=${target}`, { method: "DELETE" });
    const json = await response.json();
    if (json.ok) setRows(json.data);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} placeholder="Add symbol e.g. ONGC" className="h-10 w-60 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none focus:border-cyan-400/60" />
        <button onClick={add} className="h-10 rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950">Add</button>
        <Link href="/scanner" className="h-10 rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">Scan watchlist</Link>
      </div>
      {error ? <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <div key={row.symbol} className="rounded-lg border border-white/10 bg-[#090d12] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-50">{row.symbol}</div>
                <div className="mt-1 text-xs text-slate-500">{row.companyName}</div>
              </div>
              <div className="text-right font-mono text-lg text-slate-50">Rs {row.price}</div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-slate-500">
              <span>O {row.open}</span><span>H {row.high}</span><span>L {row.low}</span><span>C {row.close}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/chart?symbol=${row.symbol}`} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/[0.06]">Open chart</Link>
              <button onClick={() => remove(row.symbol)} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/10">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
