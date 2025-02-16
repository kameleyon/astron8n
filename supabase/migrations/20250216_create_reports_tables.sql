-- Create user_data table if it doesn't exist
create table if not exists public.user_data (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  birth_chart jsonb,
  human_design jsonb,
  numerology jsonb,
  life_path jsonb,
  cardology jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_reports table if it doesn't exist
create table if not exists public.user_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  report_type text not null,
  file_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_data enable row level security;
alter table public.user_reports enable row level security;

-- Create policies for user_data
create policy "Users can view their own data"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "Users can update their own data"
  on public.user_data for update
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

-- Create policies for user_reports
create policy "Users can view their own reports"
  on public.user_reports for select
  using (auth.uid() = user_id);

create policy "Service role can insert reports"
  on public.user_reports for insert
  with check (true);

-- Create indexes
create index user_data_user_id_idx on public.user_data(user_id);
create index user_reports_user_id_idx on public.user_reports(user_id);
create index user_reports_created_at_idx on public.user_reports(created_at);

-- Create storage bucket for reports if it doesn't exist
insert into storage.buckets (id, name)
values ('reports', 'reports')
on conflict (id) do nothing;

-- Enable RLS for storage bucket
create policy "Users can view their own report files"
  on storage.objects for select
  using (bucket_id = 'reports' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Service role can upload report files"
  on storage.objects for insert
  with check (bucket_id = 'reports');
