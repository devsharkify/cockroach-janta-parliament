// Convenience row types re-exported from MongoDB document interfaces
export type { SeatDoc as Seat, PartyDoc as Party, CycleDoc as Cycle, CandidateDoc as Candidate, VoteDoc as Vote, SoulDoc as Soul } from './mongodb/collections'

export interface RecentFiling {
  id: string
  display_name: string
  created_at: string
  is_independent: boolean
  party_name: string | null
  party_color: string | null
  party_code: string | null
  seat_name: string
  state: string
  state_code: string
  seat_number: number
}

export const FOUNDING_PARTIES = [
  { code: 'CJP', name: 'Cockroach Janta Party',    color: '#7F77DD', tagline: 'Lazy, Loud, Lawful' },
  { code: 'CCP', name: 'Cockroach Congress Party',  color: '#D85A30', tagline: 'Old Roach Magic' },
  { code: 'ACP', name: 'Aam Cockroach Party',       color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki' },
  { code: 'RCP', name: 'Regional Cockroach Party',  color: '#D4537E', tagline: 'Apni Galli Apna Kachra' },
] as const

export const SOUL_LEVELS = [
  { level: 1, name: 'Egg',          xpRequired: 0    },
  { level: 2, name: 'Nymph',        xpRequired: 50   },
  { level: 3, name: 'Adult Roach',  xpRequired: 200  },
  { level: 4, name: 'Naali Naresh', xpRequired: 500  },
  { level: 5, name: 'Samrat',       xpRequired: 1500 },
  { level: 6, name: 'Supreme',      xpRequired: 5000 },
] as const

export const XP_REWARDS = {
  vote:                   1,
  read_manifesto:         2,
  share_candidate:        5,
  file_candidacy:         10,
  nominate_friend:        20,
  daily_quest:            15,
  streak_7day:            50,
  streak_30day:           200,
  candidate_crosses_1000: 50,
  candidate_wins_seat:    500,
} as const
