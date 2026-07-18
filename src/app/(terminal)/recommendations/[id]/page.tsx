import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStore } from "@/lib/server/store";

export default async function RecommendationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recommendation = getStore().recommendations.find((item) => item.id === id);
  if (!recommendation) {
    return <div className="rounded-lg border border-white/10 bg-[#090d12] p-8 text-slate-400">Recommendation not found.</div>;
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{recommendation.symbol} recommendation</h1>
          <p className="mt-2 text-sm text-slate-500">{recommendation.companyName}</p>
        </div>
        <StatusBadge tone={recommendation.status === "active" ? "accent" : "neutral"}>{recommendation.status}</StatusBadge>
      </header>
      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-lg border border-white/10 bg-[#090d12] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Recommendation</div>
          <div className="mt-3 text-3xl font-semibold text-cyan-300">{recommendation.type}</div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Recommended price</dt><dd>Rs {recommendation.recommendedPrice}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Book value</dt><dd>Rs {recommendation.bookValue}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Created</dt><dd>{new Date(recommendation.createdAt).toLocaleString()}</dd></div>
          </dl>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#090d12] p-5">
          <h2 className="font-medium">Explainability</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{recommendation.reason}</p>
          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-3 font-mono text-xs text-slate-400">{recommendation.scannerCondition}</div>
          <Link href="/ledger" className="mt-5 inline-flex rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">View ledger</Link>
        </div>
      </section>
    </div>
  );
}
