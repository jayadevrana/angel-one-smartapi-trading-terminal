"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === "login" ? "demo@terminal.local" : "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(mode === "login" ? "demo1234" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "signup" ? { email, name, password } : { email, password }),
    });
    const json = await response.json();
    setLoading(false);
    if (!json.ok) return setError(json.error || "Authentication failed");
    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/10 bg-[#090d12] p-6">
      <div>
        <h1 className="text-2xl font-semibold">{mode === "login" ? "Log in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-slate-500">Angel credentials are configured server-side, so every user gets the same broker data layer without seeing secrets.</p>
      </div>
      <div className="mt-6 space-y-3">
        {mode === "signup" ? <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 outline-none focus:border-cyan-400/60" /> : null}
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 outline-none focus:border-cyan-400/60" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 outline-none focus:border-cyan-400/60" />
      </div>
      {error ? <div className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
      <button disabled={loading} className="mt-5 h-11 w-full rounded-md bg-cyan-400 font-semibold text-slate-950 disabled:opacity-60">{loading ? "Working..." : mode === "login" ? "Log in" : "Sign up"}</button>
    </form>
  );
}
