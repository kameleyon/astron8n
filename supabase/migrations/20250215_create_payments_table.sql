-- Create payments table
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  stripe_session_id text not null,
  payment_intent text,
  amount integer not null,
  status text not null,
  report_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.payments enable row level security;

-- Create policies
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Service role can insert payments"
  on public.payments for insert
  with check (true);

-- Create index
create index payments_user_id_idx on public.payments(user_id);
create index payments_stripe_session_id_idx on public.payments(stripe_session_id);
