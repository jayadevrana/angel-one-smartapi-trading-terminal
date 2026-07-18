import { StatusBadge } from "@/components/ui/status-badge";

export default function SettingsPage() {
  const hasAngel = Boolean(process.env.ANGEL_API_KEY && process.env.ANGEL_CLIENT_CODE);
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Broker credentials are intentionally server-side env vars. Users manage watchlists and recommendations, not shared API secrets.</p>
      </header>
      <section className="rounded-lg border border-white/10 bg-[#090d12] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Angel One SmartAPI</h2>
            <p className="mt-1 text-sm text-slate-500">Configure ANGEL_API_KEY, ANGEL_CLIENT_CODE, ANGEL_PASSWORD, and ANGEL_TOTP_SECRET in the server environment.</p>
          </div>
          <StatusBadge tone={hasAngel ? "profit" : "accent"}>{hasAngel ? "Configured" : "Mock mode"}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {["ANGEL_API_KEY", "ANGEL_CLIENT_CODE", "ANGEL_PASSWORD", "ANGEL_TOTP_SECRET"].map((key) => (
            <div key={key} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{key}</div>
              <div className="mt-2 font-mono text-sm text-slate-300">{process.env[key] ? "set" : "not set"}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
        This platform is for research and analysis only. Recommendations are system-generated based on user-defined conditions and should not be treated as financial advice.
      </section>
    </div>
  );
}
