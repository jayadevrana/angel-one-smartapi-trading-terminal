import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#070a0f] px-4 text-slate-100">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-sm text-slate-500">Already have an account? <Link className="text-cyan-300" href="/login">Log in</Link></p>
      </div>
    </main>
  );
}
