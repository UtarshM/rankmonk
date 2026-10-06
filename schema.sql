-- ==============================================================================
-- SoloSpider AEO & GEO Engine — Standalone Supabase Schema
-- Includes tables, indexes, and Row Level Security for Answer Engine Optimization
-- (AEO) and Generative Engine Optimization (GEO).
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROJECTS TABLE (Standalone project entity for AEO & GEO tracking)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  domain text not null,
  brand_name text not null,
  description text default '',
  competitors text[] default '{}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 3. AEO PROMPTS (Buyer queries, conversational intent, competitor comparison queries)
create table if not exists public.aeo_prompts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  topic text not null default 'General',
  prompt text not null,
  category text not null default 'default',
  rationale text default '',
  is_active boolean not null default true,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 4. AEO SCAN RUNS & RESULTS
create table if not exists public.prompt_scan_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  brand_name text not null,
  models text[] not null default '{"chatgpt", "gemini", "claude", "deepseek"}',
  status text not null default 'completed',
  total_prompts int not null default 0,
  completed int not null default 0,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists public.aeo_prompt_scan_results (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references public.aeo_prompts(id) on delete cascade not null,
  run_id uuid references public.prompt_scan_runs(id) on delete cascade,
  model text not null,
  rank int default null,
  cited boolean not null default false,
  source_urls text[] default '{}',
  snippet text default '',
  sentiment text check (sentiment in ('Positive', 'Neutral', 'Negative')) default 'Neutral',
  competitor_mentions text[] default '{}',
  created_at timestamptz default timezone('utc', now())
);

-- 5. AEO CITATIONS (Where AI models reference or link to the domain)
create table if not exists public.aeo_citations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  prompt_id uuid references public.aeo_prompts(id) on delete set null,
  model text default 'chatgpt',
  domain text not null,
  url text not null,
  count int not null default 1,
  snippet text default '',
  last_seen timestamptz default timezone('utc', now()),
  created_at timestamptz default timezone('utc', now())
);

-- 6. AEO SCAN SCHEDULES
create table if not exists public.aeo_scan_schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  frequency text not null default 'weekly', -- 'daily', 'weekly', 'monthly'
  next_run timestamptz,
  last_run timestamptz,
  is_active boolean not null default true,
  created_at timestamptz default timezone('utc', now())
);

-- 7. AEO ANALYSES (Aggregated metrics, model distribution, actionable suggestions)
create table if not exists public.aeo_analyses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  overall_score int not null default 0,
  providers jsonb not null default '[]'::jsonb,
  category_scores jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  prompt_suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 8. AEO CONTENT GAPS (High priority AI query opportunities where competitors rank higher)
create table if not exists public.aeo_content_gaps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  topic text not null,
  prompt text not null,
  competitor text default '',
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')) default 'medium',
  action_plan text default '',
  created_at timestamptz default timezone('utc', now())
);

-- 9. GEO AUDITS (Generative Engine Optimization & EEAT Audits)
create table if not exists public.geo_audits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  domain text not null,
  target_url text not null,
  overall_score int not null default 0,
  eeat_scores jsonb not null default '{}'::jsonb,
  checklist jsonb not null default '{}'::jsonb,
  ai_crawlers jsonb not null default '{"gptbot": true, "claudebot": true, "perplexitybot": true, "google_extended": true, "bytespider": true}'::jsonb,
  has_llms_txt boolean not null default false,
  llms_txt_summary text default '',
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now())
);

-- 10. GEO SCORECARD TESTS (11-Test GEO Scorecard benchmarks)
create table if not exists public.geo_scores (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  domain text not null,
  test_name text not null,
  score int not null default 0,
  status text not null check (status in ('passed', 'warning', 'failed')) default 'passed',
  evidence text default '',
  recommendation text default '',
  updated_at timestamptz default timezone('utc', now())
);

-- 11. INDEXES
create index if not exists idx_aeo_prompts_project_id on public.aeo_prompts(project_id);
create index if not exists idx_aeo_citations_project_id on public.aeo_citations(project_id);
create index if not exists idx_aeo_analyses_project_id on public.aeo_analyses(project_id);
create index if not exists idx_geo_audits_domain on public.geo_audits(domain);
create index if not exists idx_geo_scores_domain on public.geo_scores(domain);

-- 12. ROW LEVEL SECURITY (RLS)
alter table public.projects enable row level security;
alter table public.aeo_prompts enable row level security;
alter table public.prompt_scan_runs enable row level security;
alter table public.aeo_prompt_scan_results enable row level security;
alter table public.aeo_citations enable row level security;
alter table public.aeo_scan_schedules enable row level security;
alter table public.aeo_analyses enable row level security;
alter table public.aeo_content_gaps enable row level security;
alter table public.geo_audits enable row level security;
alter table public.geo_scores enable row level security;

-- Policies
create policy "users_manage_own_projects" on public.projects
  for all using (auth.uid() is null or user_id = auth.uid());

create policy "users_manage_own_aeo_prompts" on public.aeo_prompts
  for all using (
    auth.uid() is null or
    project_id in (select id from public.projects where user_id = auth.uid())
  );

create policy "users_manage_own_aeo_citations" on public.aeo_citations
  for all using (
    auth.uid() is null or
    project_id in (select id from public.projects where user_id = auth.uid())
  );

create policy "users_manage_own_aeo_analyses" on public.aeo_analyses
  for all using (
    auth.uid() is null or
    project_id in (select id from public.projects where user_id = auth.uid())
  );

create policy "users_manage_own_geo_audits" on public.geo_audits
  for all using (
    auth.uid() is null or
    project_id is null or
    project_id in (select id from public.projects where user_id = auth.uid())
  );

create policy "users_manage_own_geo_scores" on public.geo_scores
  for all using (
    auth.uid() is null or
    project_id is null or
    project_id in (select id from public.projects where user_id = auth.uid())
  );
