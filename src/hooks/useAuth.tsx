"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "rankmonk.auth_user";
const AUTH_COOKIE_NAME = "rankmonk_auth";

function setAuthCookie(user: AuthUser) {
  if (typeof document === "undefined") return;
  const cookieValue = encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name }));
  document.cookie = `${AUTH_COOKIE_NAME}=${cookieValue}; path=/; max-age=2592000; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setAuthCookie(parsed);
          setLoading(false);
          return;
        }

        // Check if cookie exists
        const match = document.cookie.match(new RegExp(`(^| )${AUTH_COOKIE_NAME}=([^;]+)`));
        if (match && match[2]) {
          try {
            const cookieData = JSON.parse(decodeURIComponent(match[2]));
            const restoredUser: AuthUser = {
              id: cookieData.id || "usr_restored",
              email: cookieData.email || "user@rankmonk.ai",
              name: cookieData.name || cookieData.email?.split("@")[0] || "RankMonk User",
              plan: "growth",
            };
            setUser(restoredUser);
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(restoredUser));
            setLoading(false);
            return;
          } catch {}
        }
      }

      // Check Supabase if configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = getSupabaseBrowserClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) {
            const authUser: AuthUser = {
              id: data.user.id,
              email: data.user.email || "user@rankmonk.ai",
              name: (data.user.user_metadata as any)?.name || data.user.email?.split("@")[0] || "Operator",
              plan: "growth",
            };
            setUser(authUser);
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            setAuthCookie(authUser);
          }
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    try {
      // If real Supabase instance configured with credentials, try auth
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || "demo-password-123",
        });

        if (!error && data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: (data.user.user_metadata as any)?.name || email.split("@")[0],
            plan: "growth",
          };
          setUser(authUser);
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          setAuthCookie(authUser);
          return true;
        }
      }

      // Standalone SaaS fallback authentication
      const cleanEmail = email.trim();
      const derivedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const capitalizedName = derivedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const localUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: capitalizedName || "Workspace Member",
        plan: "growth",
      };

      setUser(localUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
        setAuthCookie(localUser);
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    const demoUser: AuthUser = {
      id: "usr_demo_founder",
      email: "founder@rankmonk.ai",
      name: "RankMonk Founder",
      plan: "growth",
      isDemo: true,
    };
    setUser(demoUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      setAuthCookie(demoUser);
    }
  };

  const logout = async () => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
    } catch {}

    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      clearAuthCookie();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
