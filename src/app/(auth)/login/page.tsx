import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#070a0f] px-4 text-slate-100">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-slate-500">New here? <Link className="text-cyan-300" href="/signup">Create an account</Link></p>
      </div>
    </main>
  );
}
