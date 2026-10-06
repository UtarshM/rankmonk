"use client";

import { useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { AeoWorkspace } from "@/components/aeo/aeo-workspace";
import { AeoWizardModal } from "@/components/aeo/aeo-wizard-modal";
import { LlmsTxtGeneratorModal } from "@/components/geo/llmstxt-generator-modal";

import { ProtectedRoute } from "@/components/shared/protected-route";

export default function AeoPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLlmsOpen, setIsLlmsOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <AppHeader 
          onOpenWizard={() => setIsWizardOpen(true)}
          onOpenLlmsModal={() => setIsLlmsOpen(true)}
        />
        <main className="flex-1">
          <AeoWorkspace />
        </main>
        <AppFooter />

        <AeoWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
        />

        <LlmsTxtGeneratorModal
          isOpen={isLlmsOpen}
          onClose={() => setIsLlmsOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
