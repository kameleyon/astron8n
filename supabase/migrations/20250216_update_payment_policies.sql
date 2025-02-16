-- Drop existing policies
drop policy if exists "Users can view their own payments" on public.payments;
drop policy if exists "Service role can insert payments" on public.payments;
drop policy if exists "Allow webhook to insert payments" on public.payments;
drop policy if exists "Allow webhook to update payments" on public.payments;

-- Create new policies
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Allow webhook to insert payments"
  on public.payments for insert
  with check (true);

create policy "Allow webhook to update payments"
  on public.payments for update
  using (true);
