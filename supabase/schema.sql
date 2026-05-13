-- Events table
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  event_date timestamptz not null,
  end_date timestamptz,
  location text,
  address text,
  image_url text,
  registration_url text,
  registration_label text default 'Register Now',
  is_featured boolean default false,
  tags text[],
  capacity integer,
  price text default 'Free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on events
  for each row execute function update_updated_at();

-- Indexes
create index events_date_idx on events (event_date desc);
create index events_slug_idx on events (slug);

-- Unit survival guides (blog posts)
create table guides (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  unit_code text not null,
  unit_name text not null,
  content text,
  author text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  year_level integer,
  tags text[],
  published boolean default false,
  created_at timestamptz default now()
);

-- Cabinet members
create table cabinet (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  linkedin_url text,
  display_order integer default 0,
  year integer default 2025
);

-- Sponsors
create table sponsors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  website_url text,
  tier text check (tier in ('platinum', 'gold', 'silver', 'bronze')),
  display_order integer default 0,
  active boolean default true
);

-- Enable Row Level Security
alter table events enable row level security;
alter table guides enable row level security;
alter table cabinet enable row level security;
alter table sponsors enable row level security;

-- Public read policies
create policy "Public read events" on events for select using (true);
create policy "Public can read published guides" on guides for select using (published = true);
create policy "Public can read cabinet" on cabinet for select using (true);
create policy "Public can read active sponsors" on sponsors for select using (active = true);

-- Admin write policies (requires authenticated user)
create policy "Authenticated users can manage events" on events
  for all using (auth.role() = 'authenticated');

create policy "Admins can insert guides" on guides for insert with check (auth.role() = 'authenticated');
create policy "Admins can update guides" on guides for update using (auth.role() = 'authenticated');
create policy "Admins can delete guides" on guides for delete using (auth.role() = 'authenticated');
create policy "Admins can read all guides" on guides for select using (auth.role() = 'authenticated' or published = true);

create policy "Admins can manage cabinet" on cabinet for all using (auth.role() = 'authenticated');
create policy "Admins can manage sponsors" on sponsors for all using (auth.role() = 'authenticated');

-- Utility: generate a URL-safe slug from a title
-- Usage: select slugify('ASSOC Trivia Night 2025');
-- create or replace function slugify(text) returns text as $$
--   select lower(regexp_replace(regexp_replace($1, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
-- $$ language sql;
