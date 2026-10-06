"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, CheckCircle2, Bot, LogOut, Check } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/aeo";

  const { user, login, loginAsDemo, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated and visiting /login directly, give them option to proceed or sign out
  const handleProceed = () => {
    router.push(redirectTarget);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your work email");
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        toast.success(`Welcome back! Session active for ${email}`);
        router.push(redirectTarget);
      } else {
        toast.error("Sign in failed. Please verify credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    toast.success("Signed in with Instant Demo Account (Founder tier)");
    router.push(redirectTarget);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#120d18] rounded-[10px] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <span className="font-extrabold tracking-tight text-2xl text-[var(--ink)]">
            RankMonk
          </span>
        </Link>

        <h1 className="text-xl font-extrabold tracking-tight mt-2">
          Sign in to your AEO & GEO Workspace
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Autonomous AI search visibility, citation monitoring & generative audits
        </p>

        {searchParams.get("redirect") && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-semibold mt-1">
            <Lock className="w-3 h-3" />
            <span>Sign in required to access {searchParams.get("redirect")}</span>
          </div>
        )}
      </div>

      {/* Card Form */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-xl space-y-5">
        {isAuthenticated && user ? (
          <div className="space-y-4 py-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">Currently Signed In</div>
              <div className="text-xs text-[var(--muted)] font-mono mt-0.5">{user.email}</div>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {user.plan} tier
              </span>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleProceed}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-purple-600/20 text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Continue to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={async () => {
                  await logout();
                  toast.info("Signed out successfully");
                }}
                className="w-full py-2 rounded-xl border border-[var(--line)] hover:bg-[var(--bg-2)] text-[var(--muted)] hover:text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[var(--muted)]">
                    Password
                  </label>
                  <span className="text-[10px] text-[var(--muted)] font-medium">
                    (Default: any password)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-purple-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[var(--line)]"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Instant Access
              </span>
              <div className="flex-grow border-t border-[var(--line)]"></div>
            </div>

            {/* 1-Click Demo Sandbox Login */}
            <button
              onClick={handleDemoSignIn}
              className="w-full py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] hover:bg-[var(--bg)] text-[var(--ink)] font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Launch Instant Demo Account</span>
            </button>
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-[var(--muted)] space-y-2">
        <div>
          Want to see all tier details?{" "}
          <Link href="/pricing" className="font-bold text-purple-600 hover:underline">
            View SaaS Pricing & Plans
          </Link>
        </div>
        <div>
          <Link href="/" className="hover:underline">
            ← Return to RankMonk Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[var(--bg)] text-[var(--ink)]">
      <Suspense fallback={<div className="text-xs text-[var(--muted)]">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
