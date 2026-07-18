import Link from "next/link";
import { Activity, BarChart3, BookOpenCheck, CandlestickChart, LayoutDashboard, List, Settings } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scanner", label: "Scanner", icon: Activity },
  { href: "/chart", label: "Charts", icon: CandlestickChart },
  { href: "/watchlist", label: "Watchlist", icon: List },
  { href: "/ledger", label: "Ledger", icon: BookOpenCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#090d12] px-4 py-5 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 text-slate-950">
          <BarChart3 size={20} />
        </div>
        <div>
          <div className="font-semibold text-slate-50">Angel Terminal</div>
          <div className="text-xs text-slate-500">Research workspace</div>
        </div>
      </Link>
      <nav className="mt-8 space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100">
            <link.icon size={17} />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
        Research only. System signals are not financial advice.
      </div>
    </aside>
  );
}
