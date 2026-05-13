-- Safe to run on existing database. Uses IF NOT EXISTS guards throughout.

-- Add missing columns to guides table if they don't exist
alter table guides add column if not exists slug text;
alter table guides add column if not exists intro text;
alter table guides add column if not exists final_notes text;
alter table guides add column if not exists updated_at timestamptz default now();
alter table guides add column if not exists cover_image_url text;
alter table guides add column if not exists read_time_minutes integer;

-- Structured Q&A sections table (linked to guides)
create table if not exists guide_sections (
  id uuid default gen_random_uuid() primary key,
  guide_id uuid not null references guides(id) on delete cascade,
  question text not null,
  answer text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Unique slug index (safe — only applies where slug is not null)
create unique index if not exists guides_slug_idx on guides (slug) where slug is not null;

-- Performance indexes
create index if not exists guides_unit_code_idx on guides (unit_code);
create index if not exists guides_published_idx on guides (published);
create index if not exists guide_sections_guide_id_idx on guide_sections (guide_id, display_order);

-- updated_at trigger for guides
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop and recreate trigger safely
drop trigger if exists guides_updated_at on guides;
create trigger guides_updated_at
  before update on guides
  for each row execute function update_updated_at();

-- RLS for guide_sections
alter table guide_sections enable row level security;

drop policy if exists "Public read guide sections" on guide_sections;
create policy "Public read guide sections"
  on guide_sections for select
  using (
    exists (
      select 1 from guides where guides.id = guide_sections.guide_id and guides.published = true
    )
  );

drop policy if exists "Admins manage guide sections" on guide_sections;
create policy "Admins manage guide sections"
  on guide_sections for all
  using (auth.role() = 'authenticated');

-- Backfill slugs for existing guides that have none
update guides
set slug = lower(
  regexp_replace(
    regexp_replace(unit_code || '-' || title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
where slug is null;
