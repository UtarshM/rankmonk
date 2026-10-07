-- ==============================================================================
-- RankMonk.ai — Production Database Schema Migration
-- Version: 20261007000000_core_schema.sql
-- Supports: Multi-tenancy, Organizations, AEO Scans, GEO Audits,
--           Autonomous Remediation Engine (ARE™), and AI Bot Traffic Logs.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ORGANIZATIONS (Workspaces for Multi-Tenancy & Agency Mode)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'enterprise', 'agency')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 3. ORGANIZATION MEMBERSHIPS (Role-Based Access Control)
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz default timezone('utc', now()),
  unique(organization_id, user_id)
);

-- 4. PROJECTS TABLE
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  domain text not null,
  brand_name text not null,
  description text default '',
  competitors text[] default '{}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 5. AEO PROMPTS
create table if not exists public.aeo_prompts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  topic text not null default 'General',
  prompt text not null,
  category text not null default 'default' check (category in ('default', 'Awareness', 'Evaluation', 'Comparison', 'Decision')),
  rationale text default '',
  is_active boolean not null default true,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 6. AEO SCAN RUNS & RESULTS
create table if not exists public.prompt_scan_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  brand_name text not null,
  models text[] not null default '{"chatgpt", "gemini", "claude", "perplexity"}',
  status text not null default 'completed' check (status in ('pending', 'running', 'completed', 'failed')),
  total_prompts int not null default 0,
  completed int not null default 0,
  raw_payload jsonb default '{}'::jsonb,
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

-- 7. AEO CITATIONS
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

-- 8. AEO SCAN SCHEDULES
create table if not exists public.aeo_scan_schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  frequency text not null default 'weekly' check (frequency in ('daily', 'weekly', 'monthly')),
  next_run timestamptz,
  last_run timestamptz,
  is_active boolean not null default true,
  created_at timestamptz default timezone('utc', now())
);

-- 9. AEO ANALYSES
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

-- 10. AEO CONTENT GAPS
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

-- 11. GEO AUDITS
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

-- 12. GEO SCORECARD TESTS
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

-- 13. AUTONOMOUS REMEDIATION RULES (ARE™ Engine)
create table if not exists public.remediation_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  domain text not null,
  title text not null,
  rule_type text not null check (rule_type in ('faq_schema', 'organization_schema', 'bluf_block', 'freshness_badge', 'meta_tags', 'robots_directive')),
  target_page text not null default '*',
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'injected', 'verified', 'rolled_back')),
  severity text not null default 'medium' check (severity in ('critical', 'high', 'medium', 'low')),
  estimated_impact int not null default 10,
  applied_at timestamptz,
  verified_at timestamptz,
  rolled_back_at timestamptz,
  created_at timestamptz default timezone('utc', now())
);

-- 14. AI BOT TRAFFIC LOGS (Server-Log & Edge Ingestion)
create table if not exists public.bot_hits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  domain text not null,
  bot_name text not null, -- 'GPTBot', 'ClaudeBot', 'PerplexityBot', etc.
  url text not null,
  user_agent text not null,
  ip_address text,
  status_code int default 200,
  timestamp timestamptz default timezone('utc', now())
);

-- 15. INDEXES
create index if not exists idx_org_members_user on public.organization_members(user_id);
create index if not exists idx_projects_org on public.projects(organization_id);
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_aeo_prompts_project on public.aeo_prompts(project_id);
create index if not exists idx_remediation_rules_domain on public.remediation_rules(domain);
create index if not exists idx_bot_hits_domain_ts on public.bot_hits(domain, timestamp desc);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
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
alter table public.remediation_rules enable row level security;
alter table public.bot_hits enable row level security;

-- Organizations Policy: Users can view organizations they belong to
create policy "users_access_own_organizations" on public.organizations
  for all using (
    id in (select organization_id from public.organization_members where user_id = auth.uid())
  );

-- Organization Members Policy
create policy "users_view_own_memberships" on public.organization_members
  for select using (
    user_id = auth.uid() or
    organization_id in (select organization_id from public.organization_members where user_id = auth.uid())
  );

-- Projects Policy: Members can view & owners/admins can edit
create policy "users_manage_own_projects" on public.projects
  for all using (
    user_id = auth.uid() or
    organization_id in (select organization_id from public.organization_members where user_id = auth.uid())
  );

-- Remediation Rules: Public read for client runtime SDK snippet by domain, full access for project owners
create policy "public_read_remediation_rules" on public.remediation_rules
  for select using (
    status in ('approved', 'injected', 'verified')
  );

create policy "users_manage_own_remediation_rules" on public.remediation_rules
  for all using (
    project_id in (select id from public.projects where user_id = auth.uid())
  );

-- AEO Prompts Policy
create policy "users_manage_own_prompts" on public.aeo_prompts
  for all using (
    project_id in (select id from public.projects where user_id = auth.uid())
  );

-- Bot Hits: Authenticated users can view bot hits for their projects
create policy "users_view_own_bot_hits" on public.bot_hits
  for select using (
    project_id in (select id from public.projects where user_id = auth.uid())
  );
