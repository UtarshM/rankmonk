"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sparkles, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  ChevronDown, 
  Plus, 
  Activity,
  Layers,
  FileCode2,
  ExternalLink,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Menu,
  X,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  onOpenWizard?: () => void;
  onOpenLlmsModal?: () => void;
}

export function AppHeader({ onOpenWizard, onOpenLlmsModal }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeProject, projects, selectActiveProject } = useProjects();
  const { user, isAuthenticated, logout } = useAuth();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated
    ? [
        { href: "/aeo", label: "AEO Engine", icon: Sparkles, active: pathname.startsWith("/aeo") },
        { href: "/geo", label: "GEO & Actions Queue", icon: ShieldCheck, active: pathname.startsWith("/geo") },
        { href: "/competitors", label: "Competitors", icon: Users, active: pathname.startsWith("/competitors") },
        { href: "/traffic", label: "AI Traffic", icon: TrendingUp, active: pathname.startsWith("/traffic") },
        { href: "/content-gaps", label: "Content Gaps", icon: Target, active: pathname.startsWith("/content-gaps") },
        { href: "/pricing", label: "Pricing", icon: DollarSign, active: pathname.startsWith("/pricing") },
      ]
    : [
        { href: "/", label: "Overview", icon: Layers, active: pathname === "/" },
        { href: "/pricing", label: "Pricing", icon: DollarSign, active: pathname.startsWith("/pricing") },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href={isAuthenticated ? "/aeo" : "/"} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#120d18] rounded-[10px] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg text-[var(--ink)]">
                    RankMonk
                  </span>
                  <span className="hidden min-[400px]:inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                    AEO & GEO
                  </span>
                </div>
                <p className="text-[11px] text-[var(--muted)] font-medium -mt-0.5 hidden md:block">
                  AI Answer & Generative Engine Optimization
                </p>
              </div>
            </Link>

            {/* Navigation Pills (Desktop: lg and up) */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-2)] border border-[var(--line)]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      link.active
                        ? "bg-[var(--panel)] text-[var(--ink)] shadow-sm font-bold border border-[var(--line)]"
                        : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--panel)]/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${link.active ? "text-purple-600" : ""}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Active Project Selector (Only when logged in) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-[11px] sm:text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
                  title="Switch tracked project"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="max-w-[70px] sm:max-w-[120px] truncate">{activeProject?.domain || "Select"}</span>
                  <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
                </button>

                {projectDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProjectDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-xl z-50 py-1.5 text-xs animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--line)] mb-1">
                        Tracked Domains
                      </div>
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            selectActiveProject(p.id);
                            setProjectDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--bg-2)] transition-colors ${
                            p.id === activeProject?.id ? "font-bold text-purple-600 bg-purple-500/5" : "text-[var(--ink)]"
                          }`}
                        >
                          <span className="truncate">{p.domain}</span>
                          {p.id === activeProject?.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                        </button>
                      ))}
                      {onOpenWizard && (
                        <div className="pt-1 border-t border-[var(--line)] mt-1">
                          <button
                            onClick={() => {
                              setProjectDropdownOpen(false);
                              onOpenWizard();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 font-semibold transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New Domain</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* llms.txt quick action (Desktop: md and up) */}
            {isAuthenticated && onOpenLlmsModal && (
              <button
                onClick={onOpenLlmsModal}
                title="Generate and inspect llms.txt protocol"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink-2)] transition-colors shadow-sm"
              >
                <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>llms.txt</span>
              </button>
            )}

            {/* Launch Scan / Wizard CTA (Desktop: sm and up; on mobile lives in drawer) */}
            {isAuthenticated && onOpenWizard && (
              <button
                onClick={onOpenWizard}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New AI Scan</span>
              </button>
            )}

            {/* User Session Profile Badge (Authenticated) */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-[11px] flex items-center justify-center uppercase">
                    {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate text-[11px]">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  <ChevronDown className="hidden sm:inline w-3 h-3 text-[var(--muted)]" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--line)] bg-[var(--panel)] shadow-xl z-50 p-2 text-xs animate-in fade-in zoom-in-95 space-y-2">
                      <div className="p-2 rounded-lg bg-[var(--bg-2)]/60 border border-[var(--line)] space-y-0.5">
                        <div className="font-bold text-[var(--ink)] truncate">{user.name}</div>
                        <div className="text-[11px] text-[var(--muted)] font-mono truncate">{user.email}</div>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-extrabold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            {user.plan} Plan
                          </span>
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Session
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          toast.info("Signed out of RankMonk");
                          router.push("/login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-500/10 rounded-lg font-semibold transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                >
                  <span>Start Free</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle (Below lg breakpoint) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Below lg breakpoint) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[var(--line)] space-y-2 animate-in slide-in-from-top-2 duration-150">
            {/* Mobile CTAs for Authenticated Users */}
            {isAuthenticated && (
              <div className="space-y-1.5 pb-2 border-b border-[var(--line)]">
                {onOpenWizard && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWizard();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-98 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch New AI Scan</span>
                  </button>
                )}
                {onOpenLlmsModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLlmsModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--bg-2)] transition-colors"
                  >
                    <FileCode2 className="w-4 h-4 text-emerald-500" />
                    <span>Generate llms.txt File</span>
                  </button>
                )}
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      link.active
                        ? "bg-purple-600/10 text-purple-600 font-bold border border-purple-500/20"
                        : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--panel)]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.active ? "text-purple-600" : ""}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Auth Button / User Info */}
            <div className="pt-2 border-t border-[var(--line)]">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-2)]/60 border border-[var(--line)] text-xs text-[var(--muted)] flex items-center justify-between">
                    <span className="truncate max-w-[180px] font-medium text-[var(--ink)]">{user.email}</span>
                    <span className="text-[10px] font-extrabold text-purple-600 uppercase bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {user.plan}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      toast.info("Signed out");
                      router.push("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm"
                  >
                    Sign In to Workspace
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
