import type { ReactNode } from "react";

export function Metric({ label, value, tone = "neutral", detail }: { label: string; value: ReactNode; tone?: "neutral" | "profit" | "loss" | "accent"; detail?: string }) {
  const toneClass = {
    neutral: "text-slate-50",
    profit: "text-emerald-300",
    loss: "text-rose-300",
    accent: "text-cyan-300",
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className={`mt-3 text-2xl font-semibold ${toneClass}`}>{value}</div>
      {detail ? <div className="mt-2 text-sm text-slate-500">{detail}</div> : null}
    </div>
  );
}
