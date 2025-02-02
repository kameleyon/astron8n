-- Create API Keys table
create table if not exists public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  api_key text unique not null,
  name text,
  enabled boolean default true,
  rate_limit integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  last_used timestamp with time zone,
  usage_count bigint default 0
);

-- Create API Usage tracking
create table if not exists public.api_usage (
  id uuid default gen_random_uuid() primary key,
  api_key_id uuid references api_keys(id),
  endpoint text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()),
  success boolean default true
);

-- Set up RLS policies
alter table public.api_keys enable row level security;
alter table public.api_usage enable row level security;

-- Users can only see their own API keys
create policy "Users can view their own API keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

-- Users can only insert their own API keys
create policy "Users can insert their own API keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

-- Users can only update their own API keys
create policy "Users can update their own API keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

-- API usage tracking is insert-only
create policy "API usage is insert-only"
  on public.api_usage for insert
  with check (true);

-- Users can only view their own API usage
create policy "Users can view their own API usage"
  on public.api_usage for select
  using (
    exists (
      select 1 from public.api_keys
      where api_keys.id = api_usage.api_key_id
      and api_keys.user_id = auth.uid()
    )
  );
