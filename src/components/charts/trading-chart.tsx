"use client";

import { createChart, ColorType, CrosshairMode, CandlestickSeries, LineSeries, type IChartApi, type CandlestickData, type LineData, type UTCTimestamp } from "lightweight-charts";
import { Eraser, Minus, MousePointer2, Pencil, Slash, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Candle, ChartDrawing, SymbolInfo, Timeframe } from "@/types/trading";

const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "1D", "1W"];
type ChartMode = "Candles" | "Line";
type Tool = "cursor" | "trend_line" | "horizontal_line" | "vertical_line" | "ray_line" | "freehand";

export function TradingChart({ initialSymbol }: { initialSymbol: SymbolInfo }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<unknown>(null);
  const [symbol, setSymbol] = useState(initialSymbol.symbol);
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const [mode, setMode] = useState<ChartMode>("Candles");
  const [tool, setTool] = useState<Tool>("cursor");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [drawings, setDrawings] = useState<ChartDrawing[]>([]);

  useEffect(() => {
    async function load() {
      const [candleResponse, drawingResponse] = await Promise.all([
        fetch(`/api/market/candles?symbol=${symbol}&timeframe=${timeframe}`).then((res) => res.json()),
        fetch(`/api/chart/drawings?symbol=${symbol}`).then((res) => res.json()),
      ]);
      setCandles(candleResponse.data || []);
      setDrawings(drawingResponse.data || []);
    }
    load();
  }, [symbol, timeframe]);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height: 560,
      layout: { background: { type: ColorType.Solid, color: "#070a0f" }, textColor: "#94a3b8" },
      grid: { vertLines: { color: "rgba(148, 163, 184, 0.08)" }, horzLines: { color: "rgba(148, 163, 184, 0.08)" } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "rgba(148, 163, 184, 0.18)" },
      timeScale: { borderColor: "rgba(148, 163, 184, 0.18)", timeVisible: true },
    });
    chartRef.current = chart;
    const chartAny = chart as unknown as {
      addCandlestickSeries?: (options: Record<string, unknown>) => { setData: (data: CandlestickData[]) => void };
      addLineSeries?: (options: Record<string, unknown>) => { setData: (data: LineData[]) => void };
      addSeries?: (series: unknown, options: Record<string, unknown>) => { setData: (data: CandlestickData[] | LineData[]) => void };
    };
    const series = (mode === "Candles"
      ? (chartAny.addCandlestickSeries?.({ upColor: "#22c55e", downColor: "#ef4444", wickUpColor: "#22c55e", wickDownColor: "#ef4444", borderVisible: false })
        || chartAny.addSeries!(CandlestickSeries, { upColor: "#22c55e", downColor: "#ef4444", wickUpColor: "#22c55e", wickDownColor: "#ef4444", borderVisible: false }))
      : (chartAny.addLineSeries?.({ color: "#22d3ee", lineWidth: 2 })
        || chartAny.addSeries!(LineSeries, { color: "#22d3ee", lineWidth: 2 }))) as { setData: (data: CandlestickData[] | LineData[]) => void };
    seriesRef.current = series;
    const data = candles.map((item) => ({
      time: Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      value: item.close,
    })) as (CandlestickData | LineData)[];
    if (mode === "Candles") series.setData(data as CandlestickData[]);
    else series.setData(data as LineData[]);
    chart.timeScale().fitContent();
    const resize = () => chart.applyOptions({ width: containerRef.current?.clientWidth || 900 });
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      try {
        chart.remove();
      } catch {
        // Lightweight Charts may already be disposed during React dev remounts.
      }
      if (chartRef.current === chart) chartRef.current = null;
    };
  }, [candles, mode]);

  const last = candles.at(-1);
  const drawingIcons = useMemo(() => [
    { tool: "cursor" as const, icon: MousePointer2, label: "Cursor" },
    { tool: "trend_line" as const, icon: TrendingUp, label: "Trend" },
    { tool: "horizontal_line" as const, icon: Minus, label: "Support" },
    { tool: "vertical_line" as const, icon: Slash, label: "Vertical" },
    { tool: "freehand" as const, icon: Pencil, label: "Freehand" },
  ], []);

  async function saveSyntheticDrawing() {
    if (tool === "cursor") return;
    const payload = { anchorTime: last?.time, anchorPrice: last?.close, viewport: "chart", note: `${tool} draft` };
    const response = await fetch("/api/chart/drawings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, exchange: initialSymbol.exchange, token: initialSymbol.token, type: tool, payload }),
    });
    const json = await response.json();
    if (json.data) setDrawings((items) => [...items, json.data]);
  }

  async function clearDrawings() {
    await fetch("/api/chart/drawings", { method: "DELETE" });
    setDrawings([]);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#090d12]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <input value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} className="h-9 w-36 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm outline-none focus:border-cyan-400/60" />
          <div className="flex rounded-md border border-white/10 bg-white/[0.03] p-1">
            {timeframes.map((item) => (
              <button key={item} onClick={() => setTimeframe(item)} className={`h-7 rounded px-2 text-xs ${timeframe === item ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-slate-100"}`}>{item}</button>
            ))}
          </div>
          <button onClick={() => setMode(mode === "Candles" ? "Line" : "Candles")} className="h-9 rounded-md border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/[0.06]">{mode}</button>
        </div>
        <div className="flex items-center gap-1">
          {drawingIcons.map((item) => (
            <button key={item.tool} title={item.label} onClick={() => setTool(item.tool)} className={`grid h-9 w-9 place-items-center rounded-md border border-white/10 ${tool === item.tool ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"}`}>
              <item.icon size={16} />
            </button>
          ))}
          <button title="Save drawing marker" onClick={saveSyntheticDrawing} className="h-9 rounded-md bg-cyan-400 px-3 text-sm font-medium text-slate-950">Save</button>
          <button title="Delete drawings" onClick={clearDrawings} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-400 hover:bg-white/[0.06]"><Eraser size={16} /></button>
        </div>
      </div>
      <div className="relative">
        <div ref={containerRef} className="h-[560px] w-full" />
        {drawings.length ? (
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
            {drawings.length} saved drawing{drawings.length > 1 ? "s" : ""} for {symbol}
          </div>
        ) : null}
      </div>
    </section>
  );
}
