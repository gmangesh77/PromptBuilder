-- PromptBuilder — initial schema for Issue #6 (User Accounts & Auth)
--
-- Run this once against your Supabase project via the SQL Editor:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Creates four tables keyed to auth.users:
--   profiles    — minimal user profile (one row per user)
--   preferences — mirrors the client-side preferencesStore shape
--   history     — mirrors the client-side historyStore shape
--   feedback    — mirrors the client-side feedbackStore shape
--
-- Every table is protected by Row-Level Security so users can only read
-- and write their own rows. A trigger on auth.users auto-creates a
-- profiles row on signup.

create extension if not exists "uuid-ossp";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ---------- preferences ----------
create table if not exists public.preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_platform text not null default 'chatgpt',
  default_instruction_suffix text not null default '',
  favorite_domains text[] not null default '{}',
  clarification_mode text not null default 'auto'
    check (clarification_mode in ('auto', 'always', 'never')),
  updated_at timestamptz not null default now()
);

alter table public.preferences enable row level security;

drop policy if exists "preferences_select_own" on public.preferences;
create policy "preferences_select_own" on public.preferences
  for select using (auth.uid() = user_id);

drop policy if exists "preferences_insert_own" on public.preferences;
create policy "preferences_insert_own" on public.preferences
  for insert with check (auth.uid() = user_id);

drop policy if exists "preferences_update_own" on public.preferences;
create policy "preferences_update_own" on public.preferences
  for update using (auth.uid() = user_id);

drop policy if exists "preferences_delete_own" on public.preferences;
create policy "preferences_delete_own" on public.preferences
  for delete using (auth.uid() = user_id);

-- ---------- history ----------
create table if not exists public.history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_input text not null,
  generated_prompt text not null,
  platform text not null,
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists history_user_created_idx
  on public.history (user_id, created_at desc);

alter table public.history enable row level security;

drop policy if exists "history_select_own" on public.history;
create policy "history_select_own" on public.history
  for select using (auth.uid() = user_id);

drop policy if exists "history_insert_own" on public.history;
create policy "history_insert_own" on public.history
  for insert with check (auth.uid() = user_id);

drop policy if exists "history_update_own" on public.history;
create policy "history_update_own" on public.history
  for update using (auth.uid() = user_id);

drop policy if exists "history_delete_own" on public.history;
create policy "history_delete_own" on public.history
  for delete using (auth.uid() = user_id);

-- ---------- feedback ----------
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rating text not null check (rating in ('up', 'down')),
  comment text,
  platform text not null,
  domain text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_created_idx
  on public.feedback (user_id, created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own" on public.feedback
  for select using (auth.uid() = user_id);

drop policy if exists "feedback_insert_own" on public.feedback;
create policy "feedback_insert_own" on public.feedback
  for insert with check (auth.uid() = user_id);

-- ---------- auto-create profile on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
