export type PlanTier = "free" | "growth" | "scale" | "custom";

export interface Project {
  id: string;
  user_id?: string;
  name: string;
  domain: string;
  brand_name: string;
  description?: string;
  competitors?: string[];
  created_at?: string;
  updated_at?: string;
}
