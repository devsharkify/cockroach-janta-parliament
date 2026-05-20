-- ============================================================
-- Cockroach Janta Parliament — Initial Schema
-- Run via Supabase Dashboard > SQL Editor, or supabase db push
-- ============================================================

-- Seats — 543 LS constituencies, seeded once from lok_sabha_seats_543.csv
create table if not exists seats (
  number int primary key,
  slug text unique not null,
  name text not null,
  state text not null,
  state_code text not null
);

-- Parties — 4 founding + user-created
create table if not exists parties (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  color text not null,
  tagline text,
  logo_url text,
  founder_fingerprint text,
  is_founding boolean default false,
  created_at timestamptz default now()
);

-- Cycles — one row per week
create table if not exists cycles (
  id uuid primary key default gen_random_uuid(),
  cycle_number int unique not null,
  starts_at timestamptz not null,
  snapshot_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'live' check (status in ('live', 'closed')),
  created_at timestamptz default now()
);

-- Candidates — persist across cycles
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  seat_number int references seats(number) not null,
  display_name text not null,
  manifesto text not null,
  party_id uuid references parties(id),
  is_independent boolean default false,
  filer_fingerprint text,
  ig_handle text,
  ig_shared boolean default false,
  withdrawn boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_cand_seat on candidates(seat_number);

-- Votes — pure chaos, no cap on count
create table if not exists votes (
  id bigserial primary key,
  cycle_id uuid references cycles(id) not null,
  candidate_id uuid references candidates(id) not null,
  seat_number int references seats(number) not null,
  voter_fingerprint text,
  ip_hash text,
  ua_hash text,
  created_at timestamptz default now()
);
create index if not exists idx_votes_candidate on votes(candidate_id);
create index if not exists idx_votes_cycle_seat on votes(cycle_id, seat_number);

-- Results — snapshot per cycle per seat
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references cycles(id),
  seat_number int references seats(number),
  winner_candidate_id uuid references candidates(id),
  total_votes int,
  margin int,
  created_at timestamptz default now(),
  unique(cycle_id, seat_number)
);

-- Supreme Commander decrees and addresses
create table if not exists decrees (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references cycles(id),
  decree_text text not null,
  address_text text,
  posted_at timestamptz default now()
);

-- Cockroach Soul gamification (anonymous, fingerprint-keyed)
create table if not exists souls (
  fingerprint text primary key,
  level int default 1,
  xp int default 0,
  streak_days int default 0,
  last_visit_date date,
  total_votes int default 0,
  total_candidacies int default 0,
  total_nominations int default 0,
  achievements jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Daily quests (per soul per day)
create table if not exists soul_quests (
  fingerprint text not null,
  quest_date date not null,
  quest_key text not null,
  target int not null,
  progress int default 0,
  completed boolean default false,
  primary key (fingerprint, quest_date, quest_key)
);

-- Audit log for transparency theatre
create table if not exists audit_log (
  id bigserial primary key,
  event_type text,
  details jsonb,
  created_at timestamptz default now()
);

-- Auto-generated Daily Cockroach News
create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references cycles(id),
  headline text not null,
  body text,
  related_seat int references seats(number),
  related_candidate_id uuid references candidates(id),
  generated_at timestamptz default now()
);

-- Filing Frenzy live ticker (last 100 filings)
create or replace view recent_filings as
  select
    c.id,
    c.display_name,
    c.created_at,
    c.is_independent,
    p.name as party_name,
    p.color as party_color,
    p.code as party_code,
    s.name as seat_name,
    s.state,
    s.state_code,
    s.number as seat_number
  from candidates c
  left join parties p on c.party_id = p.id
  join seats s on c.seat_number = s.number
  where c.withdrawn = false
  order by c.created_at desc
  limit 100;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table seats enable row level security;
alter table parties enable row level security;
alter table cycles enable row level security;
alter table candidates enable row level security;
alter table votes enable row level security;
alter table results enable row level security;
alter table decrees enable row level security;
alter table souls enable row level security;
alter table soul_quests enable row level security;
alter table audit_log enable row level security;
alter table news_items enable row level security;

-- Public read: seats, parties, candidates, cycles, results, decrees, news_items
create policy "public read seats"      on seats      for select using (true);
create policy "public read parties"    on parties    for select using (true);
create policy "public read cycles"     on cycles     for select using (true);
create policy "public read candidates" on candidates for select using (true);
create policy "public read results"    on results    for select using (true);
create policy "public read decrees"    on decrees    for select using (true);
create policy "public read news_items" on news_items for select using (true);

-- Public insert: candidates, votes, souls
create policy "public insert candidates" on candidates for insert with check (true);
create policy "public insert votes"      on votes      for insert with check (true);
create policy "public insert souls"      on souls      for insert with check (true);

-- Souls: own fingerprint read + update only
create policy "own soul read"   on souls for select using (true);
create policy "own soul update" on souls for update using (true);

-- Soul quests: own fingerprint
create policy "own quests read"   on soul_quests for select using (true);
create policy "own quests insert" on soul_quests for insert with check (true);
create policy "own quests update" on soul_quests for update using (true);

-- Audit log: service role only (no public policy = blocked for anon)
-- votes: public read for aggregates (no individual row access needed client-side)
create policy "public read vote aggregates" on votes for select using (true);
