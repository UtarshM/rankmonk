"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Project, PlanTier } from "@/types/project";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const ACTIVE_PROJECT_KEY = "rankmonk.activeProjectId";
const STORED_PROJECTS_KEY = "rankmonk.projects";

const DEFAULT_PROJECT: Project = {
  id: "demo-project-id",
  name: "My Brand",
  brand_name: "My Brand",
  domain: "mybrand.com",
  description: "Enterprise Digital Intelligence & Optimization",
  competitors: ["competitor-a.com", "competitor-b.com"],
};

interface ProjectsContextType {
  projects: Project[];
  activeProject: Project;
  activeProjectId: string | null;
  selectActiveProject: (projectId: string) => void;
  isLoading: boolean;
  addProject: {
    mutateAsync: (input: { name: string; domain: string; brand_name: string; description?: string }) => Promise<Project>;
    isPending: boolean;
  };
  currentPlan: PlanTier;
  projectLimit: number;
  canAddProject: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(STORED_PROJECTS_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [DEFAULT_PROJECT];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(ACTIVE_PROJECT_KEY) || DEFAULT_PROJECT.id;
    }
    return DEFAULT_PROJECT.id;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    async function loadProjectsFromSupabase() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url || url.includes("placeholder")) return;

      try {
        setIsLoading(true);
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setProjects(data as Project[]);
          if (!activeProjectId || !data.some((p: any) => p.id === activeProjectId)) {
            setActiveProjectId(data[0].id);
          }
        }
      } catch (err) {
        console.warn("[useProjects] Supabase fetch fallback to local:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjectsFromSupabase();
  }, []);

  // Sync to localStorage as persistent offline cache
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORED_PROJECTS_KEY, JSON.stringify(projects));
      if (activeProjectId) {
        window.localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
      }
    }
  }, [projects, activeProjectId]);

  const selectActiveProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECT;
  }, [projects, activeProjectId]);

  const addProjectMutation = async (input: { name: string; domain: string; brand_name: string; description?: string }): Promise<Project> => {
    setIsPending(true);
    try {
      const cleanDomainName = input.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const newProj: Project = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`,
        name: input.name,
        domain: cleanDomainName,
        brand_name: input.brand_name,
        description: input.description || "",
        created_at: new Date().toISOString(),
      };

      // Persist to Supabase if configured
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (url && !url.includes("placeholder")) {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data: userRes } = await supabase.auth.getUser();
          const { data: inserted, error } = await supabase
            .from("projects")
            .insert({
              name: input.name,
              domain: cleanDomainName,
              brand_name: input.brand_name,
              description: input.description || "",
              user_id: userRes?.user?.id || null,
            })
            .select()
            .single();

          if (!error && inserted) {
            newProj.id = inserted.id;
          }
        } catch (err) {
          console.warn("[useProjects] Supabase insert fallback:", err);
        }
      }

      setProjects((prev) => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      return newProj;
    } finally {
      setIsPending(false);
    }
  };

  const value: ProjectsContextType = {
    projects,
    activeProject,
    activeProjectId,
    selectActiveProject,
    isLoading,
    addProject: {
      mutateAsync: addProjectMutation,
      isPending,
    },
    currentPlan: "growth",
    projectLimit: 25,
    canAddProject: true,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
