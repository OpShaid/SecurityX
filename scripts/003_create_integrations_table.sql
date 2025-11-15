-- Create integrations table to store user's configured integrations
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  integration_name text not null,
  credentials jsonb not null default '{}',
  connected boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, integration_name)
);

-- Enable RLS
alter table public.integrations enable row level security;

-- RLS Policies
create policy "Users can view their own integrations"
  on public.integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own integrations"
  on public.integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
  on public.integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own integrations"
  on public.integrations for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index integrations_user_id_idx on public.integrations(user_id);
