-- Tabela de tarefas
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  is_completed boolean default false,
  created_at timestamptz default now(),
  due_at timestamptz
);

-- Cada usuário só enxerga e manipula suas próprias tarefas
alter table tasks enable row level security;

create policy "tasks: select próprio" on tasks
  for select using (auth.uid() = user_id);

create policy "tasks: insert próprio" on tasks
  for insert with check (auth.uid() = user_id);

create policy "tasks: update próprio" on tasks
  for update using (auth.uid() = user_id);

create policy "tasks: delete próprio" on tasks
  for delete using (auth.uid() = user_id);

-- Tabela de configurações por usuário (título da lista)
create table user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  app_title text default ''
);

alter table user_settings enable row level security;

create policy "settings: select próprio" on user_settings
  for select using (auth.uid() = user_id);

create policy "settings: insert próprio" on user_settings
  for insert with check (auth.uid() = user_id);

create policy "settings: update próprio" on user_settings
  for update using (auth.uid() = user_id);
