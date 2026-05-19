-- Agentic AI Lab — initial schema.
--
-- Tables: profiles, tools, patterns, projects, roadmaps, bookmarks, workflows,
-- radar_items, skill_marks. pgvector is enabled for semantic search.
--
-- Conventions:
--  * row-level security enabled on every user-scoped table
--  * default policies are "own rows only"
--  * timestamps in UTC; created_at + updated_at on every table

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- =========================================================
-- profiles (linked to auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text,                                 -- e.g. "AI Architect"
  level text,                                -- "Beginner" | "Intermediate" | ...
  org text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- =========================================================
-- ecosystem catalog (public read, admin write)
-- =========================================================
create table if not exists public.tools (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text not null,
  tagline text not null,
  description text,
  capabilities jsonb not null default '[]'::jsonb,
  maturity text,
  learning_curve text,
  pricing text,
  community jsonb not null default '{}'::jsonb,
  docs_url text,
  tags text[] not null default '{}',
  trending boolean not null default false,
  released_year int,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tools_category_idx on public.tools (category);
create index if not exists tools_tags_idx on public.tools using gin (tags);
create index if not exists tools_embedding_idx on public.tools
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.tools enable row level security;
create policy "Tools are publicly readable" on public.tools for select using (true);

-- =========================================================
-- patterns (public read)
-- =========================================================
create table if not exists public.patterns (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text not null,
  summary text,
  components jsonb not null default '[]'::jsonb,
  flows jsonb not null default '[]'::jsonb,
  tool_stack text[] not null default '{}',
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  when_to_use text[] not null default '{}',
  enterprise_implications text[] not null default '{}',
  scalability text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
alter table public.patterns enable row level security;
create policy "Patterns are publicly readable" on public.patterns for select using (true);

-- =========================================================
-- projects (public read)
-- =========================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  domain text not null,
  complexity text not null,
  business_problem text,
  outcomes text[] not null default '{}',
  architecture jsonb not null default '{}'::jsonb,
  tool_stack text[] not null default '{}',
  build_phases jsonb not null default '[]'::jsonb,
  cost_min int,
  cost_max int,
  sample_prompts text[] not null default '{}',
  deployment text[] not null default '{}',
  risks text[] not null default '{}',
  governance text[] not null default '{}',
  enterprise_readiness int not null default 0,
  tags text[] not null default '{}',
  embedding vector(1536),
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Projects are publicly readable" on public.projects for select using (true);

-- =========================================================
-- bookmarks (user-scoped)
-- =========================================================
create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,                        -- 'tool' | 'pattern' | 'project' | 'radar'
  slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, slug)
);
alter table public.bookmarks enable row level security;
create policy "Own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- skill marks (per-user proficiency on a topic)
-- =========================================================
create table if not exists public.skill_marks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  score int not null check (score between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, topic)
);
alter table public.skill_marks enable row level security;
create policy "Own skill marks" on public.skill_marks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- workflows (saved designer graphs)
-- =========================================================
create table if not exists public.workflows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  graph jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.workflows enable row level security;
create policy "Own workflows" on public.workflows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- radar items (ingested by scheduled jobs)
-- =========================================================
create table if not exists public.radar_items (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  title text not null,
  source text not null,
  url text,
  summary text,
  published_at timestamptz not null,
  tags text[] not null default '{}',
  signal int not null default 3,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
alter table public.radar_items enable row level security;
create policy "Radar publicly readable" on public.radar_items for select using (true);

-- =========================================================
-- vector match RPC (used by /api/search when embeddings are populated)
-- =========================================================
create or replace function public.match_tools (
  query_embedding vector(1536),
  match_count int default 10,
  similarity_threshold float default 0.2
)
returns table (
  slug text,
  name text,
  category text,
  similarity float
) language sql stable as $$
  select
    slug,
    name,
    category,
    1 - (tools.embedding <=> query_embedding) as similarity
  from public.tools
  where tools.embedding is not null
    and 1 - (tools.embedding <=> query_embedding) > similarity_threshold
  order by tools.embedding <=> query_embedding
  limit match_count;
$$;
