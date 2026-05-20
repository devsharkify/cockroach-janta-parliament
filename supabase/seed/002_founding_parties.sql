-- Founding parties — always qualified, hardcoded
insert into parties (code, name, color, tagline, is_founding) values
  ('CJP', 'Cockroach Janta Party',   '#7F77DD', 'Lazy, Loud, Lawful',                      true),
  ('CCP', 'Cockroach Congress Party', '#D85A30', 'Old Roach Magic',                          true),
  ('ACP', 'Aam Cockroach Party',      '#1D9E75', 'Naali Sabki, Iss Baar Cockroach Ki',       true),
  ('RCP', 'Regional Cockroach Party', '#D4537E', 'Apni Galli Apna Kachra',                   true)
on conflict (code) do nothing;
