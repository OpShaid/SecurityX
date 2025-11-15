-- Create chat messages table to store user conversations
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.chat_messages enable row level security;

-- RLS Policies
create policy "Users can view their own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own messages"
  on public.chat_messages for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index chat_messages_user_id_idx on public.chat_messages(user_id, created_at desc);
