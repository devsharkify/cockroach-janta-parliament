-- Cycle 1 — starts now, snapshot Saturday June 6 2026 23:00 IST, ends June 7 00:00 IST
-- IST = UTC+5:30, so 23:00 IST = 17:30 UTC, 00:00 IST next day = 18:30 UTC
insert into cycles (cycle_number, starts_at, snapshot_at, ends_at, status) values (
  1,
  '2026-05-20 00:00:00+05:30',   -- starts now (spec lock date)
  '2026-06-06 23:00:00+05:30',   -- Saturday 11 PM IST
  '2026-06-07 00:00:00+05:30',   -- Sunday 12 AM IST
  'live'
)
on conflict (cycle_number) do nothing;
