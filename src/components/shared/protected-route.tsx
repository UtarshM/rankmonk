"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Lock, ArrowRight, Bot, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, loginAsDemo } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Automatically redirect to login with return path
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || "/aeo")}`;
      router.replace(redirectUrl);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/20 animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-200" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Verifying workspace session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] p-4">
        <div className="w-full max-w-md p-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)] shadow-xl text-center space-y-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[var(--ink)]">
              Authentication Required
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              This module is part of the RankMonk AEO & GEO SaaS workspace. Please sign in to access your prompt scans, audits, and competitor matrices.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname || "/aeo")}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 active:scale-98 transition-all"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                loginAsDemo();
                toast.success("Signed in with Instant Demo Account");
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] hover:bg-[var(--line)] text-xs font-bold text-[var(--ink)] transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Continue with Instant Demo</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[var(--muted)]">
            <Link href="/" className="hover:underline">
              ← Return to RankMonk Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
