import { LedgerClient } from "@/app/(terminal)/ledger/ledger-client";
import { buildLedger } from "@/lib/ledger/ledger";
import { getStore } from "@/lib/server/store";

export default async function LedgerPage() {
  const rows = await buildLedger(getStore().recommendations);
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Recommendation ledger</h1>
        <p className="mt-2 text-sm text-slate-500">Tracks live price, quantity-aware P&L, percent return, highest/lowest observed price, days active, and status.</p>
      </header>
      <LedgerClient rows={rows} />
    </div>
  );
}
