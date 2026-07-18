import { ScannerClient } from "@/app/(terminal)/scanner/scanner-client";
import { getStore } from "@/lib/server/store";

export default function ScannerPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Market scanner</h1>
        <p className="mt-2 text-sm text-slate-500">Primary rule: book_value_per_share &gt; current_market_price. Fundamentals are mocked behind an interface until a fundamentals API is connected.</p>
      </header>
      <ScannerClient initialResults={getStore().scannerResults} />
    </div>
  );
}
