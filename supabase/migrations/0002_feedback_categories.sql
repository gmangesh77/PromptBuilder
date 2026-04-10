-- PromptBuilder — Issue #10 schema extension for richer feedback.
--
-- Run this once against your Supabase project via the SQL Editor:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Extends public.feedback (created in 0001_init.sql) with:
--   stars       — optional 1–5 star rating alongside the existing thumbs
--   categories  — optional multi-select of {accuracy,usefulness,clarity,tone}
--
-- `domain` already exists from 0001 and is reused (no change needed).
-- RLS policies from 0001 still cover the new columns (they are column-level
-- additions on an already-protected table).

alter table public.feedback
  add column if not exists stars smallint check (stars between 1 and 5),
  add column if not exists categories text[] not null default '{}';

-- Optional: a GIN index on categories to make "which prompts had accuracy
-- issues" queries fast once the analytics dashboard (#9) lands.
create index if not exists feedback_categories_idx
  on public.feedback using gin (categories);
