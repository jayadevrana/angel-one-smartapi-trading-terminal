import type { ReactNode } from "react";

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "profit" | "loss" | "accent" }) {
  const tones = {
    neutral: "border-slate-700 bg-slate-900 text-slate-300",
    profit: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    loss: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    accent: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
