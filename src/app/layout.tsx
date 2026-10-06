import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

export const metadata: Metadata = {
  title: "RankMonk — AI Search & Answer Engine Optimization (AEO/GEO) Platform | Sitefire Alternative",
  description: "Enterprise Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) SaaS. Track visibility across ChatGPT, Perplexity, Claude, Gemini, analyze 11-test GEO readiness, and benchmark competitors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] antialiased transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
