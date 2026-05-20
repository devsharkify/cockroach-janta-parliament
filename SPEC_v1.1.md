# Cockroach Janta Parliament — v1.1 Build Spec

**Owner:** Rohan / Sharkify Technology Pvt. Ltd.
**Tech leads:** Umesh Guduru (CTO), Imran Pasha (deploy)
**Build via:** Claude Code
**Doc version:** v1.1 — May 20, 2026
**Status:** All decisions locked. Ready to build.

---

## 0. What changed from v1.0

| Area | v1.0 | v1.1 (locked) |
|---|---|---|
| Persona | TBD | Samrat Macchar — Supreme Commander |
| Cycle | Fri 11:59 PM lock, Sat voting | Rolling nominations, Saturday 11 PM weekly snapshot |
| Voter entry | Map browse | 3-way: constituency number, PIN code, candidate search |
| Voting | Single vote per cycle | Multi-vote unlimited (pure chaos) |
| Landing hero | Parliament horseshoe | Animated India geographic map + state cartogram toggle |
| Gamification | None | Cockroach Soul: Levels + XP + Quests + Streak |
| Viral features | None | Daily Cockroach News, Manifesto auto-gen, Tag-a-friend |
| Phase 2 | Vague | 4-Saturday staggered ramp |

---

## 1. Product in one paragraph

A satirical online parliament where anyone in India can contest any of 543 Lok Sabha seats under auto-generated cockroach-themed identities, and anyone can vote with zero friction. Nominations are rolling (always open). Every Saturday at 11 PM IST, votes are snapshotted and "Cockroach MPs of the Week" are declared. The entire fake parliament is ruled by **Samrat Macchar — Supreme Commander**, a satirical cockroach monarch (real-name: Rohan, public-name: a persona) whose weekly decrees and Sunday Address to the Cockroach Nation drive content. Built on real ECI Lok Sabha data and real constituency names. Riding the viral Cockroach Janta Party movement that hit 1L+ members in 3 days (mid-May 2026).

## 2. The weekly cycle

| Time (IST) | What happens |
|---|---|
| Always | Nominations open. Anyone can file at any constituency. |
| Always | Voting open. Anyone can vote unlimited times for any candidate at any seat. |
| **Saturday 11:00 PM** | **Weekly snapshot.** Vote counts frozen. Winners computed per seat. Results table written. |
| Saturday 11:05 PM | Supreme Commander Sunday Address auto-generated and queued for post |
| Sunday 12:00 AM | "Cockroach MPs of the Week" published. New cycle begins. Vote counts reset to zero. All candidates remain (unless they choose to withdraw). |

Saturday is the ritual. Every Saturday becomes Cockroach Election Day.

Note: Candidates do NOT disappear at cycle end. Filed candidates persist across cycles. Vote counts reset weekly. This creates a long-running "season" feel.

## 3. User flows

### 3.1 Voter (anonymous, fully frictionless)

1. Land on `/` → animated India map with live activity
2. Three entry options below the map:
   - **Enter constituency number** (1 to 543, monospace LED-style input)
   - **Find mine** (PIN code → auto-maps to constituency)
   - **Search candidate** (typeahead across all 543 × candidates_per_seat)
3. All three lead to `/seat/[number]` — candidates list with manifestos and live vote counts
4. Click "Vote" on any candidate → vote counted instantly, no confirmation popup
5. Toast: "Vote counted. Follow CJP for Sunday results." with skip
6. 3-second auto-redirect to `instagram.com/cockroachparliament` (skippable)

Voter can vote again immediately. Same candidate or different. Unlimited. Pure chaos.

### 3.2 Candidate filing (30 seconds)

1. `/seat/[number]` → "File candidacy" button
2. Auto-name generator spins (regenerate until satisfied) → lock
3. Type 4-line manifesto (280 char limit)
   - Or click "Don't know what to write?" → AI auto-generates a manifesto in candidate's regional style
4. Pick party from dropdown (4 founders OR any user-created qualified party) OR Independent
5. Submit
6. Modal: "Share this post on your Instagram story to activate candidacy" with one-tap share button to pre-rendered template post containing candidate's auto-name, manifesto, party badge, and QR code
7. Candidacy live, shareable link `/candidate/[id]`

Honor system on IG share. No backend verification.

### 3.3 Party founder (create new party)

1. `/create-party`
2. Pick party name, color (from 12-swatch palette), tagline, logo (or auto-pick cockroach pack)
3. Get unique shareable party link
4. Others join via link and file candidacies under this party
5. Threshold: ≥50 seats filed → party qualifies for current week
6. Below threshold by Saturday 11 PM → party shows as "not qualified" that week, candidates compete as Independents for that week only. Party can re-qualify next week if more seats fill.

### 3.4 Tag-a-friend nomination

1. From any seat: "Nominate someone" button
2. Type friend's first name + share via WhatsApp/IG link
3. Friend opens link → pre-filed candidate page waiting for them
4. Friend clicks "Accept candidacy" → auto-name spins → manifesto write → done
5. Both the nominator and nominee get XP bonus

## 4. Founding parties + Supreme Commander

### 4.1 Founding parties (hardcoded, always qualified)

| Name | Code | Color (hex) | Tagline |
|---|---|---|---|
| Cockroach Janta Party | CJP | `#7F77DD` (purple) | Lazy, Loud, Lawful |
| Cockroach Congress Party | CCP | `#D85A30` (coral) | Old Roach Magic |
| Aam Cockroach Party | ACP | `#1D9E75` (teal) | Naali Sabki, Iss Baar Cockroach Ki |
| Regional Cockroach Party | RCP | `#D4537E` (pink) | Apni Galli Apna Kachra |

User-created parties pick color from 12-swatch palette.

### 4.2 Supreme Commander — Samrat Macchar

A satirical cockroach monarch character who "rules" the Cockroach Janta Parliament. Backend: Rohan controls. Public face: an avatar character.

- **Display name:** Samrat Macchar
- **Title:** Supreme Cockroach Commander
- **Avatar:** Stylized cockroach with crown (designer brief: regal cockroach silhouette, purple crown, mock-Mughal aesthetic, 200×200 PNG + SVG)
- **Tagline:** "Long live the Naali. Long live the Cockroach."
- **Route:** `/supreme-commander` — bio page, decree archive, Sunday Address archive

### 4.3 Supreme Commander outputs

**Sunday Address to the Cockroach Nation (auto-generated)**

- Triggered: Sunday 12:05 AM IST (after results published)
- Method: Anthropic Claude API (claude-sonnet-4-6, max_tokens: 800)
- Input: Week's results summary (top winners by margin, biggest upsets, top parties, party qualifying changes, total votes cast)
- Output: 4-paragraph mock-imperial address ending with a "Decree of the Week"
- Posted: To `/supreme-commander/addresses/[week_number]` + queued for Instagram carousel + Twitter thread

**Weekly Decree (auto-generated, satirical)**

- Examples: "We hereby grant Patna 50,000 ceremonial votes for being the loudest constituency", "All Mumbai candidates must henceforth include 'Naali' in their name", "Bengaluru is renamed Bengalooru-Kachra effective this week"
- Triggered: Same Sunday batch
- Display: Pinned on landing page Supreme Commander panel until next Sunday

### 4.4 Phase 2 cabinet appointments (week 2 onwards)

- Supreme Commander "appoints" Chief Election Commissioner and Chief Justice from top candidates
- These are satirical roles announced in Sunday Address
- CEC issues mock "Election Day Bulletin" Saturday morning
- CJ issues mock "Rulings" on flagged candidate disputes (also auto-generated)
- Phase 2 only — not in v1

## 5. Data model (Supabase / Postgres)

```sql
-- Seats — 543 LS constituencies, seeded once from lok_sabha_seats_543.csv
create table seats (
  number int primary key,                  -- 1 to 543
  slug text unique not null,               -- 'varanasi', 'maharajganj-br'
  name text not null,                      -- 'Varanasi'
  state text not null,                     -- 'Uttar Pradesh'
  state_code text not null                 -- 'UP'
);

-- Parties — 4 founding + user-created
create table parties (
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
create table cycles (
  id uuid primary key default gen_random_uuid(),
  cycle_number int unique not null,
  starts_at timestamptz not null,
  snapshot_at timestamptz not null,        -- Saturday 11 PM IST
  ends_at timestamptz not null,            -- Sunday 12 AM IST
  status text not null,                    -- 'live' or 'closed'
  created_at timestamptz default now()
);

-- Candidates — persist across cycles
create table candidates (
  id uuid primary key default gen_random_uuid(),
  seat_number int references seats(number) not null,
  display_name text not null,              -- auto-generated cockroach name
  manifesto text not null,                 -- 280 char max
  party_id uuid references parties(id),
  is_independent boolean default false,
  filer_fingerprint text,                  -- for 5-per-week soft cap
  ig_handle text,
  ig_shared boolean default false,
  withdrawn boolean default false,
  created_at timestamptz default now()
);
create index idx_cand_seat on candidates(seat_number);

-- Votes — pure chaos, no cap on count
create table votes (
  id bigserial primary key,
  cycle_id uuid references cycles(id) not null,
  candidate_id uuid references candidates(id) not null,
  seat_number int references seats(number) not null,
  voter_fingerprint text,                  -- logged for transparency theatre, not enforced
  ip_hash text,
  ua_hash text,
  created_at timestamptz default now()
);
create index idx_votes_candidate on votes(candidate_id);
create index idx_votes_cycle_seat on votes(cycle_id, seat_number);

-- Results — snapshot per cycle per seat
create table results (
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
create table decrees (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references cycles(id),
  decree_text text not null,
  address_text text,                       -- full Sunday Address
  posted_at timestamptz default now()
);

-- Cockroach Soul gamification (anonymous, fingerprint-keyed)
create table souls (
  fingerprint text primary key,
  level int default 1,                     -- 1=Egg, 2=Nymph, 3=Adult Roach, 4=Naali Naresh, 5=Samrat, 6=Supreme
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
create table soul_quests (
  fingerprint text not null,
  quest_date date not null,
  quest_key text not null,                 -- 'vote_3_states', 'read_5_manifestos', etc
  target int not null,
  progress int default 0,
  completed boolean default false,
  primary key (fingerprint, quest_date, quest_key)
);

-- Audit log for transparency theatre
create table audit_log (
  id bigserial primary key,
  event_type text,
  details jsonb,
  created_at timestamptz default now()
);

-- Filing frenzy live ticker (last 100 filings)
-- Implemented as Postgres view over candidates ORDER BY created_at DESC LIMIT 100
create view recent_filings as
  select c.id, c.display_name, c.created_at, c.is_independent,
         p.name as party_name, p.color as party_color, p.code as party_code,
         s.name as seat_name, s.state, s.state_code, s.number as seat_number
  from candidates c
  left join parties p on c.party_id = p.id
  join seats s on c.seat_number = s.number
  where c.withdrawn = false
  order by c.created_at desc
  limit 100;

-- Auto-generated Daily Cockroach News (one batch per day)
create table news_items (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references cycles(id),
  headline text not null,
  body text,
  related_seat int references seats(number),
  related_candidate_id uuid references candidates(id),
  generated_at timestamptz default now()
);
```

### Row Level Security

- Public read: seats, parties, candidates, cycles, results, recent_filings, news_items, decrees, vote aggregates
- Public read on souls: ONLY for own fingerprint (use Postgres function with fingerprint param)
- Public insert: candidates (always allowed), votes (always allowed), souls (always allowed)
- Public update: souls (own fingerprint only, for XP/level/streak updates)
- No public update or delete on: candidates, votes, results, parties (after founder creation)
- Service role: cron, news generation, address generation

## 6. Pages and routes

| Route | Purpose |
|---|---|
| `/` | Landing — animated India geographic map + 3-way entry + Filing Frenzy + Supreme Commander + Cockroach Soul |
| `/seats` | All seats with filters (state, party leading, contested, empty) |
| `/seat/[number]` | Seat detail — candidates list with manifestos and live vote counts |
| `/candidate/[id]` | Candidate profile — full manifesto, vote count, share buttons, IG repost |
| `/parties` | All parties (founders + qualified user-created) |
| `/party/[id]` | Party page with candidate roster, seat count, color, tagline |
| `/create-party` | New party creation flow |
| `/file/[seatNumber]` | Candidacy filing flow (auto-name → manifesto → submit) |
| `/results/[cycleNumber]` | Past cycle results archive |
| `/results/latest` | Most recent Saturday's results (auto-redirects to current cycle's results) |
| `/news` | Daily Cockroach News feed (auto-generated headlines) |
| `/news/[id]` | Single news item with full body |
| `/supreme-commander` | Bio, decree archive, Sunday Address archive |
| `/supreme-commander/address/[week]` | Specific Sunday Address |
| `/soul` | User's own Cockroach Soul dashboard (level, XP, quests, streak, history) |
| `/nominate` | Tag-a-friend nomination landing |
| `/leaderboards` | Top voters per constituency this week (anonymous handles) — Phase 2 |
| `/manifesto-of-the-week` | Curated top manifestos for Kaizer pickup |
| `/about` | What CJP is — satire disclaimer, founder note from Supreme Commander |

## 7. Name generator (config/candidate_names.ts)

See bundled file `candidate_names.ts`. Total unique combinations: ~7 lakh. Server enforces per-seat uniqueness; collision triggers regenerate.

## 8. Landing page design

### 8.1 Layout (top to bottom)

1. **Live ticker bar** — auto-scrolling election news (24s loop) generated from real events
2. **India map hero** — geographic SVG with state boundaries
   - Default view: real India geographic SVG (sourced from datameet/maps-india)
   - Toggle button: "Switch to data view" → cartogram (circles sized by seat count)
   - State-level click: zoom into state with smooth d3-zoom transition
   - In-state view: constituency dots overlaid on state shape
   - Constituency click: navigate to `/seat/[number]`
   - Map shows live activity: pulsing rings on seats with recent votes
3. **Three entry options below map** — Enter number, Find mine (PIN), Search candidate
4. **Live stats row** — Online now, Votes this week, Candidates, Parties (4 cards, ticking up via Supabase Realtime)
5. **Filing Frenzy panel** — live ticker of last 5 filings with party color bar
6. **Supreme Commander panel** — latest decree displayed with avatar
7. **Your Cockroach Soul panel** — level, XP bar, today's quest progress, cards count
8. **Faction standings** — current seat counts per party (founders + qualified)
9. **Footer** — satire disclaimer, links to about/parliament/results

### 8.2 Animated parliament backdrop

Subtle low-fi pixel cockroaches scuttle across the bottom of the page (CSS sprite animation, low CPU). Audio toggle (off by default): faint parliament ambience loop. 0.5 build days, huge first-visit "this is alive" moment.

### 8.3 Geographic SVG details

- Source: `datameet/maps-india` (free, MIT license) — has all 28 states + UTs as SVG paths
- Implementation: D3.js for zoom/pan, vanilla SVG for rendering
- Mobile: pinch-to-zoom, double-tap to zoom into state
- Constituency overlay: stored as separate GeoJSON, loaded on state zoom-in
- For v1 launch: skip the constituency-level boundaries (heavy data); use dots positioned at constituency centroids
- Phase 2: Add full 543-polygon constituency choropleth

## 9. Anti-gaming layer (intentionally light)

Per founder call: zero friction, lean into the chaos.

| Layer | Rule |
|---|---|
| Voting | UNLIMITED. Any number of votes per device per candidate per cycle. |
| Candidate filing | Soft cap: 5 candidacies per device fingerprint per cycle. Invisible to user; on 6th attempt, server silently rejects with generic error. |
| Party creation | Soft cap: 1 party per device fingerprint per cycle. |
| Server logging | Every vote logged with timestamp + IP hash + UA hash + fingerprint to audit_log. |
| DDoS | Cloudflare Turnstile triggers ONLY at >100 req/sec/IP. Invisible to humans. |
| Transparency theatre | Sunday Address includes audit numbers: "X lakh votes counted, Y bot patterns flagged, Z duplicates from one fingerprint." Turns chaos into content. |

## 10. Cron jobs (Supabase Edge Functions via pg_cron)

All times IST.

```
Saturday 23:00 IST   → fn_snapshot_results
                       - Lock current cycle (status = 'closed')
                       - For each seat: compute winner = candidate with max votes in this cycle
                       - Insert results row per seat
                       - Trigger fn_generate_address asynchronously

Saturday 23:05 IST   → fn_generate_address
                       - Call Claude API with week summary
                       - Generate 4-paragraph Sunday Address + Decree of the Week
                       - Insert into decrees table

Sunday 00:00 IST     → fn_new_cycle
                       - Insert new cycle row (cycle_number + 1, status = 'live')
                       - Vote counts reset (no action needed — votes scoped by cycle_id)
                       - Trigger IG/Twitter auto-posts via webhook

Daily 00:00 IST      → fn_daily_quests
                       - For each active soul (visited in last 7 days), insert 3 random quests for today
                       - Quest pool: vote_3_states, read_5_manifestos, share_1_reel, file_candidacy, nominate_friend, view_10_seats, read_supreme_address

Daily 06:00 IST      → fn_generate_news
                       - Call Claude API with last 24h voting/filing patterns
                       - Generate 10 satirical news headlines
                       - Insert into news_items
                       - Queue IG carousel + Twitter thread for posting at 09:00 IST
```

Use Supabase `pg_cron` with `cron.schedule()` syntax.

## 11. Cockroach Soul gamification

### 11.1 Level progression

| Level | Name | XP needed |
|---|---|---|
| 1 | Egg | 0 |
| 2 | Nymph | 50 |
| 3 | Adult Roach | 200 |
| 4 | Naali Naresh | 500 |
| 5 | Samrat | 1500 |
| 6 | Supreme | 5000+ |

### 11.2 XP rewards

| Action | XP |
|---|---|
| Vote (any candidate) | +1 |
| Read full manifesto | +2 |
| Share a candidate to IG/WA | +5 |
| File a candidacy | +10 |
| Nominate a friend (they accept) | +20 |
| Daily quest completed | +15 |
| 7-day streak | +50 |
| 30-day streak | +200 |
| Candidate you filed crosses 1000 votes | +50 |
| Candidate you filed wins a seat (Saturday snapshot) | +500 |

### 11.3 Daily quests (random 3 per day from pool)

- Vote in 3 different states today
- Read 5 manifestos
- Share 1 candidate on IG
- File 1 candidacy
- Nominate 1 friend
- View 10 seats
- Read this week's Supreme Commander Address

Quest completion: +15 XP each.

### 11.4 Streak

Daily visit streak. 3-day badge, 7-day badge, 30-day "Eternal Cockroach" badge with purple flair on display name in leaderboards (Phase 2).

### 11.5 Identity model

- Anonymous, fingerprint-keyed (no signup)
- Stored: localStorage + Supabase souls table keyed on FingerprintJS device ID
- Cross-device: not supported in v1. Phase 2 adds "Save your soul" optional IG login to sync across devices.

## 12. Viral features for v1

### 12.1 Daily Cockroach News (auto-generated)

- Generated daily at 06:00 IST via Claude API
- Input: last 24h vote shifts, new candidacies, party qualifying changes, decree of the week
- Output: 10 satirical headlines + 1-paragraph body each, e.g.:
  - "Naali Sardar wins Patna, promises to drown Patna by 2027"
  - "Kachra_official defeats Macchar Raja in cleanest victory ever"
  - "Hyderabad_Manhole_OG goes from 12 votes to 12,000 in 4 hours"
- Posted to `/news` feed, auto-shared as IG carousel at 09:00 IST, Twitter thread at 09:30 IST
- Style brief for Claude prompt: Hindi-English mix, satirical-news tone, no malice toward real persons or groups, focused on the cockroach characters

### 12.2 Manifesto auto-generator

- "Don't know what to write?" button in filing flow
- Calls Claude API with candidate's display_name + region + party
- Generates a 4-line manifesto in the candidate's flavor
- Cache: 100 pre-generated manifesto stubs to fall back on if API fails

### 12.3 Tag-a-friend nomination

- "Nominate someone" button from any seat or candidate page
- Generates a unique link `/nominate/[token]`
- Token encodes: nominator_fingerprint + seat_number + party_id + auto-generated candidate name
- Recipient opens link → sees "You've been nominated as [name] for [seat]" → click to accept → manifesto write → candidacy live
- On acceptance: nominator gets +20 XP, nominee gets onboarded with their first Soul

## 13. Instagram funnel

### 13.1 Pre-rendered candidate share template

Server-side image generation via Vercel OG Image API on first candidacy submission. Cached per candidate.

- 1080 × 1920 vertical (IG story format)
- Top: cockroach mascot illustration
- Headline: "I'M CONTESTING FROM [seat name]"
- Subheading: candidate display_name
- 4-line manifesto preview
- Party badge with party color and code
- CTA: "Vote at cockroachparliament.in"
- Bottom right: QR code linking to `/candidate/[id]`
- Hashtags: #CockroachJantaParliament #MainBhiCockroach

### 13.2 Share button

- Web Share API (`navigator.share`) where supported
- Fallback: download image + open IG deep link `instagram://story-camera`
- Honor system. No verification.

### 13.3 Post-vote redirect

- Confirmation toast: "Vote counted. Follow CJP for Sunday results."
- 3-second delay → auto-redirect to `instagram.com/cockroachparliament` (web) or `instagram://user?username=cockroachparliament` (mobile)
- "Skip" button visible immediately

## 14. Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion (parliament backdrop, transitions) + D3.js (map zoom/pan) |
| Backend | Supabase (Postgres + Realtime + Edge Functions + pg_cron) |
| Hosting | Vercel |
| CDN / security | Cloudflare (free tier) |
| Analytics | Posthog (free) |
| Fingerprinting | FingerprintJS Open Source |
| AI (manifesto, news, addresses) | Anthropic Claude API (claude-sonnet-4-6) |
| Image gen for IG | Vercel OG Image API |
| Maps | datameet/maps-india GeoJSON + D3.js |

## 15. Launch plan (T = first Saturday)

**T = Saturday, June 6, 2026** (17 days from spec lock, May 20)

| Day | Action |
|---|---|
| T-17 (May 20) | Spec lock (this doc) |
| T-17 to T-10 | Build sprint Day 1-7 (see Section 16) |
| T-9 (May 28) | Soft launch — site live, internal QA only, no public push |
| T-7 (May 30) | First press pitches sent (The Print, Wire, BusinessToday, Republic, Al Jazeera) |
| T-7 to T-3 | Tease drops on CJP-related accounts. Kaizer Telugu reels Day 1. |
| T-3 (June 3) | Hard launch — full Kaizer network push, IG reels, Twitter blast |
| T-1 (June 5) | Hype peak. "Filing live" countdown content. Supreme Commander first decree pinned. |
| T (June 6) | First Cockroach Janta Parliament Saturday. Live vote counts. Social storm. |
| T+1 (June 7) | First "Cockroach MPs of the Week" national news drop. Sunday Address goes live. |

## 16. Build sequence (Day 1 to Day 7)

For Claude Code: implement each day in order. After completing a day, pause and report progress before moving to the next.

### Day 1 — Foundation

- [ ] Init Next.js 14 + TypeScript + Tailwind in `/cockroach-janta-parliament`
- [ ] Connect Supabase project, run schema migration (Section 5)
- [ ] Import `lok_sabha_seats_543.csv` into seats table
- [ ] Insert 4 founding parties into parties table
- [ ] Seed cycle 1 (starts now, snapshot June 6 23:00 IST, ends June 7 00:00 IST)
- [ ] Domain: register cockroachparliament.in, connect to Vercel
- [ ] Add Cloudflare in front, configure free tier rules
- [ ] Smoke test: seats table queryable, parties table populated

### Day 2 — Identity and filing

- [ ] FingerprintJS integration, anonymous session in localStorage + Supabase souls
- [ ] Name generator API: `POST /api/names/generate` returns one name from `candidate_names.ts`
- [ ] Filing flow page `/file/[seatNumber]`: name spin → manifesto editor (280 char limit, 4 lines hint) → party picker
- [ ] Soft cap: 5 candidacies per fingerprint per cycle, server-side check
- [ ] Manifesto auto-generator: `POST /api/manifesto/generate` calls Claude API
- [ ] IG share modal post-submit: generate OG image via Vercel OG, show share button

### Day 3 — Landing and entry

- [ ] Landing page `/`
- [ ] Live ticker bar (mock data for v1; wired to recent_filings view by Day 4)
- [ ] India geographic SVG hero (datameet source), state click → zoom (D3.js)
- [ ] In-state view: constituency dots positioned at centroids, click → /seat/[number]
- [ ] Toggle: cartogram view (circles sized by seat count)
- [ ] Three entry components: number input, PIN code lookup, candidate search (Postgres trigram)
- [ ] Live stats row with Supabase Realtime subscriptions
- [ ] Animated low-fi cockroach backdrop (CSS sprite animation)

### Day 4 — Voting and live updates

- [ ] Seat detail page `/seat/[number]`: candidates list with manifestos, party badges, live vote counts
- [ ] Vote endpoint `POST /api/votes` — unlimited, just inserts a row
- [ ] Live count updates via Supabase Realtime channel per seat
- [ ] Filing Frenzy panel wired to recent_filings view, live-updating
- [ ] Vote confirmation toast + IG redirect funnel
- [ ] XP tracking on votes (server-side update to souls table)

### Day 5 — Parties and Supreme Commander

- [ ] Party pages `/party/[id]`, party listing `/parties`
- [ ] Create-party flow `/create-party`
- [ ] 50-seat qualifying logic: weekly view computes qualifying status
- [ ] Supreme Commander page `/supreme-commander` with avatar, bio, decree pinned
- [ ] Sunday Address archive page
- [ ] Manual decree input form (admin-only, Rohan can paste decrees in case auto-gen fails)

### Day 6 — Gamification and content

- [ ] Cockroach Soul page `/soul`: level, XP bar, quests, streak, history
- [ ] Daily quest assignment cron (Section 10)
- [ ] Streak increment logic on daily visit
- [ ] Tag-a-friend flow `/nominate/[token]`
- [ ] Daily Cockroach News generator cron + `/news` feed page
- [ ] Manifesto of the Week page `/manifesto-of-the-week` (top 10 by votes)

### Day 7 — Cron, polish, launch

- [ ] Saturday 11 PM snapshot cron implemented and tested
- [ ] Sunday 12 AM new cycle cron tested
- [ ] Sunday Address generator cron tested with sample data
- [ ] Mobile responsive pass on all pages
- [ ] About page with clear satire disclaimer
- [ ] 404 page with cockroach mascot
- [ ] Cloudflare bot rules and rate limits configured
- [ ] Sentry integration for error tracking
- [ ] Soft launch checkpoint: site live, internal QA invited

Realistic: 7 days with Claude Code working full-time. Can compress to 5 if Rohan tests in parallel.

## 17. Phase 2 staggered roadmap (post-launch)

| Saturday | Date | What ships |
|---|---|---|
| 1 | June 6, 2026 | v1 launch (this spec) |
| 2 | June 13, 2026 | Supreme Commander appoints Chief Election Commissioner + Chief Justice. Cards collection v1 (collect winners). Predictions v1 (Friday picks, Saturday accuracy). Crews v1 (form a crew, group XP). |
| 3 | June 20, 2026 | State assemblies live in 4 anchor states (Maharashtra, Uttar Pradesh, Telangana, Karnataka). State-level cycles run in parallel. Achievements v1. |
| 4 | June 27, 2026 | All 28 states + 8 UTs assembly elections. Chief Minister weekly elections per state (top vote winner becomes CM). Embeddable constituency widget for news sites. Constituency leaderboard. |

After Saturday 4, paid B2B layer development begins (BharatPanel collapses into this — political party sentiment dashboard subscription product).

## 18. Locked decisions (final)

| # | Decision | Locked at |
|---|---|---|
| 1 | Persona name | Samrat Macchar |
| 2 | Persona type | Pseudonym (avatar + name), Rohan controls internally |
| 3 | Phase 2 ramp | 4-Saturday staggered |
| 4 | Voting model | Pure chaos — unlimited per device per candidate |
| 5 | Gamification v1 scope | Levels + XP + Daily Quests + Streak |
| 6 | Animated parliament backdrop | Yes, low-fi CSS sprites |
| 7 | India map design | Hybrid — real geographic SVG + cartogram toggle |
| 8 | Geographic data source | datameet/maps-india (free, MIT) |
| 9 | Domain | cockroachparliament.in |
| 10 | First election date | Saturday, June 6, 2026 |
| 11 | Filing cap | 5 per device per cycle, invisible to user |
| 12 | IG handle | @cockroachparliament |
| 13 | Real constituency names | Yes, from bundled CSV (lok_sabha_seats_543.csv) |
| 14 | Cycle close time | Saturday 11:00 PM IST |
| 15 | Candidate identity | Auto-generated only, no real names asked |
| 16 | Voter identity | None, fully anonymous |
| 17 | Multi-vote interpretation | Click = +1 vote, unlimited clicks |
| 18 | IG share enforcement | Honor system, no verification |
| 19 | Vote entry options | 3-way: number, PIN, candidate search |

## 19. Out of scope for v1

Listed so they stay out:

- Rajya Sabha
- State assemblies, mayors, sarpanchs, ward members (Phase 2)
- Real-name voter accounts, OTP, KYC
- Captcha or bot challenges visible to users
- Party-level manifestos (only candidate manifestos)
- Debate threads, comments, replies
- Push notifications
- Mobile app (web-only, mobile-responsive)
- Languages beyond English-Hindi mix
- Real-time chat
- Public API for media partners (Phase 2 paid product)
- Cards collection, Predictions, Crews, Constituency Leaderboards, Achievements (all Phase 2)
- Multi-language manifestos (English only for v1)
- Email anything

## 20. Risks (acknowledged, accepted)

| Risk | Mitigation / acceptance |
|---|---|
| Mass vote gaming | Accepted — light anti-gaming, transparency theatre on Sunday turns it into content |
| Spam candidate flooding | Mitigated by 5-per-fingerprint soft cap |
| CJI defamation angle | Site is satirical commentary. Clear "satire" footer on every page. No false attributions to real persons. |
| Election Commission notice | Disclaimer: "Cockroach Janta Parliament is a satirical online platform and not an electoral process." Footer + About page. |
| Dipke / CJP pushback | Independent platform, supports CJP-aligned movement, no claim to be the official party. Open offer to CJP for "founding faction" status if Dipke reaches out. |
| Server costs on viral day | Supabase + Vercel free tiers handle ~100K concurrent. Cloudflare cache for static. Budget cap alert at $50/day. |
| Claude API rate limits | Sonnet 4.6 has generous limits. Fallback: pre-generated manifesto stubs + decree templates. |
| Real-person impersonation | Auto-name generator prevents real names. Candidate cannot type their own display name. |

## 21. Success metrics — first week

- 50,000 unique visitors by first Saturday
- 5,000 candidates filed across 543 seats
- 200,000 votes cast on first Saturday
- 25,000 Instagram followers gained
- 3 mainstream media pickups
- All 4 founding parties qualified (>50 seats each)
- 5+ user-created parties qualified
- 1,000 Cockroach Souls at Level 3+ (Adult Roach)

If 80% of these hit, Phase 2 unlocks (state assemblies on June 20).

## 22. Bundled data files

Files Rohan / Claude Code will receive alongside this spec:

| File | Purpose |
|---|---|
| `lok_sabha_seats_543.csv` | 543 LS constituencies with number, slug, name, state, state_code. Seed for `seats` table. |
| `lok_sabha_seats_543.sql` | Same data as INSERT statements for direct execution. |
| `candidate_names.ts` | Complete name generator module — drop into `/lib/` of Next.js project. |

## 23. How to start with Claude Code

1. Open Claude Code in terminal or VS Code extension
2. Initialize: `npx create-next-app@latest cockroach-janta-parliament --typescript --tailwind --app`
3. Drop bundled files:
   - `SPEC_v1.1.md` → repo root
   - `lok_sabha_seats_543.csv` and `.sql` → `/data/`
   - `candidate_names.ts` → `/lib/`
4. Paste this opening prompt to Claude Code:

```
Implement the v1 build per SPEC_v1.1.md.
Start with Day 1 of Section 16 (build sequence).
Stack: Next.js 14 App Router, TypeScript, Tailwind, Supabase.
Use the seats CSV from /data/ to seed the seats table.
Use candidate_names.ts for the candidate name generator.
After completing Day 1, pause and report what you built before moving to Day 2.
```

5. Iterate day by day with Claude Code. Use this chat in parallel for:
   - Manifesto template tone tuning
   - Daily Cockroach News style calibration
   - IG creative briefs (story templates, reel scripts)
   - Press pitch drafts (Print, Wire, BT, Republic)
   - Sunday Address voice tuning
   - Phase 2 spec drafts post-launch

---

**End of spec v1.1.**
