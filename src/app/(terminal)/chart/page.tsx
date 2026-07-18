import { TradingChart } from "@/components/charts/trading-chart";
import { symbolUniverse } from "@/lib/demo-data";

export default async function ChartPage({ searchParams }: { searchParams: Promise<{ symbol?: string }> }) {
  const params = await searchParams;
  const initialSymbol = symbolUniverse.find((item) => item.symbol === params.symbol) || symbolUniverse[0];
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Advanced chart</h1>
        <p className="mt-2 text-sm text-slate-500">Candles, line mode, multiple timeframes, crosshair, zoom, pan, and persisted drawing markers.</p>
      </header>
      <TradingChart initialSymbol={initialSymbol} />
    </div>
  );
}
