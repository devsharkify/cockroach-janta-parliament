// Convenience row types re-exported from MongoDB document interfaces
export type { SeatDoc as Seat, PartyDoc, CycleDoc as Cycle, CandidateDoc as Candidate, VoteDoc as Vote, SoulDoc as Soul } from './mongodb/collections'

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

export interface Party {
  code: string
  name: string
  color: string
  tagline: string
  is_founding: boolean
  symbol: string
  persona: string
}

export const ALL_PARTIES: Party[] = [
  // Founding parties
  { code: 'CJP',    name: 'Cockroach Janta Party',               color: '#7F77DD', tagline: 'Lazy, Loud, Lawful',                        is_founding: true,  symbol: '🪳',     persona: 'Sarkari Roach (lazy but connected)'         },
  { code: 'CCP',    name: 'Cockroach Congress Party',            color: '#D85A30', tagline: 'Old Roach Magic',                           is_founding: true,  symbol: '✋🪳',   persona: 'Khandaani Roach (old family, old drains)'   },
  { code: 'ACP',    name: 'Aam Cockroach Party',                 color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki',        is_founding: true,  symbol: '🧹🪳',   persona: 'Aam Roach (common naali dweller)'           },
  { code: 'RCP',    name: 'Regional Cockroach Party',            color: '#D4537E', tagline: 'Apni Galli Apna Kachra',                    is_founding: true,  symbol: '🏠🪳',   persona: 'Local Galli Roach (hyper-territorial)'      },
  // Established parties
  { code: 'TDP',    name: 'Trending Drainage Party',             color: '#00BCD4', tagline: 'Trending since last monsoon',               is_founding: false, symbol: '💧🪳',   persona: 'Drainage Activist Roach'                    },
  { code: 'TRS',    name: 'Trending Roach Sena',                 color: '#FF6F00', tagline: 'Roar of the Sewer',                         is_founding: false, symbol: '🦟🪳',   persona: 'Mosquito-allied Roach'                      },
  { code: 'BRS',    name: 'Bharatiya Roach Samhiti',             color: '#F57F17', tagline: 'Jai Roach Mata',                            is_founding: false, symbol: '🪷🪳',   persona: 'Patriotic Roach (very nationalistic)'       },
  { code: 'JSS',    name: 'Janata Sewer Sena',                   color: '#5D4037', tagline: 'Sewers for the People',                     is_founding: false, symbol: '✊🪳',   persona: 'Working-class Sewer Roach'                  },
  { code: 'AIMIM',  name: 'All India Machar Influence Movement', color: '#1B5E20', tagline: 'Machar Power Zindabad',                     is_founding: false, symbol: '⭐🪳',   persona: 'Influential Machar Roach'                   },
  { code: 'DMK',    name: 'Drainage Morcha Kendra',              color: '#880E4F', tagline: 'Naali ke Liye Ladenge',                     is_founding: false, symbol: '🌊🪳',   persona: 'Drain-rights Movement Roach'                },
  { code: 'AIADMK', name: 'All India Anti-Drainage Movement Kendra', color: '#004D40', tagline: 'Stop the Drain Menace',                is_founding: false, symbol: '🛡️🪳',  persona: 'Anti-Drain-Menace Roach'                    },
  { code: 'TMC',    name: 'The Machar Collective',               color: '#6A1B9A', tagline: 'United Roaches Rise',                       is_founding: false, symbol: '🔥🪳',   persona: 'Collective Uprising Roach'                  },
  { code: 'YSRC',   name: 'Youth Sewer Roach Congress Party',    color: '#0D47A1', tagline: 'Young Roaches, Old Drains',                 is_founding: false, symbol: '⚡🪳',   persona: 'Youth Sewer Roach (very online)'            },
  { code: 'NMF',    name: 'National Machar Front',               color: '#BF360C', tagline: 'Mosquitoes and Roaches United',             is_founding: false, symbol: '🦟🪳',   persona: 'Mosquito-Roach Alliance Member'             },
  { code: 'NDF',    name: 'National Drainage Federation',        color: '#37474F', tagline: 'Drains Belong to All',                      is_founding: false, symbol: '🏴🪳',   persona: 'Federation Bureaucrat Roach'                },
  { code: 'BSS',    name: 'Bharatiya Sewer Sangh',               color: '#4A148C', tagline: 'Sewer is Sacred',                           is_founding: false, symbol: '🪔🪳',   persona: 'Sacred Sewer Devotee'                       },
  { code: 'RSS_R',  name: 'Rashtriya Sewer Sangh',               color: '#B71C1C', tagline: 'Rashtra ka Naali',                          is_founding: false, symbol: '🏛️🪳',  persona: 'Rashtriya Naali Swayamsevak'                },
  { code: 'INC_R',  name: 'Indian Naala Congress',               color: '#1A237E', tagline: 'Naala Since 1885',                          is_founding: false, symbol: '👴🪳',   persona: 'Old Congress Roach (since 1885)'            },
  { code: 'NCSP',   name: 'National Comment Section Party',      color: '#F9A825', tagline: 'We Type Therefore We Govern',               is_founding: false, symbol: '💬🪳',   persona: 'Comment Section Roach'                      },
  { code: 'RWU',    name: 'Reel Workers Union',                  color: '#E91E63', tagline: 'Like Share Subscribe Vote',                 is_founding: false, symbol: '📱🪳',   persona: 'Reel-making Roach (highly viral)'           },
  { code: 'ARP',    name: 'Aam Roach Party',                     color: '#009688', tagline: 'Seedha Naali Se',                           is_founding: false, symbol: '🧔🪳',   persona: 'Aam Aadmi Roach (very frustrated)'          },
  { code: 'SKCP',   name: 'SHUU Karo Cockroach Party',           color: '#78909C', tagline: 'Bas Bahut Hogaya',                          is_founding: false, symbol: '🤫🪳',   persona: 'Done-with-everything Roach'                 },
  { code: 'TVKP',   name: 'Trending Virak Karo Party',           color: '#FF5722', tagline: 'Viral hona hai toh vote karo',              is_founding: false, symbol: '📢🪳',   persona: 'Trending Roach (15 mins of fame)'           },
  // Virtual — not seeded to DB
  { code: 'IND',    name: 'Independent',                         color: '#888888', tagline: 'No faction. Pure chaos.',                   is_founding: false, symbol: '🪳',     persona: 'Lone Wolf Roach (no allegiance)'            },
]

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
