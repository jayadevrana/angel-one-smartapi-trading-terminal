import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function TerminalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#070a0f] text-slate-100">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="border-b border-white/10 bg-[#090d12]/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="font-semibold">Angel Terminal</div>
          <div className="text-xs text-slate-500">Dashboard, scanner, charts, ledger</div>
        </div>
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
