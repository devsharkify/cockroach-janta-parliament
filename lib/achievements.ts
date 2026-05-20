export interface Achievement {
  id: string
  emoji: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_vote',        emoji: '🗳️', name: 'First Vote',         description: 'Cast your first vote',                  rarity: 'common'    },
  { id: 'first_candidacy',   emoji: '🪳', name: 'Born Cockroach',     description: 'Filed your first candidacy',             rarity: 'common'    },
  { id: 'vote_10',           emoji: '🔟', name: 'Serial Voter',        description: 'Cast 10 votes in total',                 rarity: 'common'    },
  { id: 'vote_100',          emoji: '💯', name: 'Century Voter',       description: 'Cast 100 votes in total',                rarity: 'rare'      },
  { id: 'vote_1000',         emoji: '🌊', name: 'Naali Tsunami',       description: 'Cast 1,000 votes — no shame',           rarity: 'epic'      },
  { id: 'candidacy_3',       emoji: '📋', name: 'Filing Addict',       description: 'Filed 3 candidacies in a week',          rarity: 'rare'      },
  { id: 'share',             emoji: '📤', name: 'Viral Cockroach',     description: 'Shared your candidacy',                  rarity: 'common'    },
  { id: 'whatsapp_share',    emoji: '💚', name: 'WhatsApp Warrior',    description: 'Shared on WhatsApp',                     rarity: 'common'    },
  { id: 'level_3',           emoji: '🪳', name: 'Adult Roach',         description: 'Reached level 3 — full cockroach mode',  rarity: 'rare'      },
  { id: 'level_5',           emoji: '⚡', name: 'Samrat',              description: 'Reached level 5 — supreme power',        rarity: 'epic'      },
  { id: 'level_6',           emoji: '👑', name: 'Supreme Commander',   description: 'Maxed out — you ARE the parliament',     rarity: 'legendary' },
  { id: 'saturday_voter',    emoji: '🌙', name: 'Saturday Night Fever','description': 'Voted on a Saturday results night',     rarity: 'rare'      },
  { id: 'multi_seat',        emoji: '🗺️', name: 'Pan-India Roach',    description: 'Voted in 5 different seats',             rarity: 'epic'      },
  { id: 'winner',            emoji: '🏆', name: 'Winning Candidate',   description: 'Your candidate won a seat',              rarity: 'legendary' },
  { id: 'nominated',         emoji: '⭐', name: 'People\'s Choice',    description: 'Someone else voted for your candidate',  rarity: 'rare'      },
]

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':    return '#9ca3af'
    case 'rare':      return '#3b82f6'
    case 'epic':      return '#7F77DD'
    case 'legendary': return '#D4A017'
  }
}

export function computeAchievements(soul: {
  total_votes: number
  total_candidacies: number
  total_nominations: number
  level: number
  achievements?: Record<string, boolean>
}): Achievement[] {
  const earned: Achievement[] = []
  const manual = soul.achievements ?? {}

  if (soul.total_votes >= 1)    earned.push(ACHIEVEMENTS.find(a => a.id === 'first_vote')!)
  if (soul.total_votes >= 10)   earned.push(ACHIEVEMENTS.find(a => a.id === 'vote_10')!)
  if (soul.total_votes >= 100)  earned.push(ACHIEVEMENTS.find(a => a.id === 'vote_100')!)
  if (soul.total_votes >= 1000) earned.push(ACHIEVEMENTS.find(a => a.id === 'vote_1000')!)

  if (soul.total_candidacies >= 1) earned.push(ACHIEVEMENTS.find(a => a.id === 'first_candidacy')!)
  if (soul.total_candidacies >= 3) earned.push(ACHIEVEMENTS.find(a => a.id === 'candidacy_3')!)

  if (soul.total_nominations >= 1) earned.push(ACHIEVEMENTS.find(a => a.id === 'nominated')!)

  if (soul.level >= 3) earned.push(ACHIEVEMENTS.find(a => a.id === 'level_3')!)
  if (soul.level >= 5) earned.push(ACHIEVEMENTS.find(a => a.id === 'level_5')!)
  if (soul.level >= 6) earned.push(ACHIEVEMENTS.find(a => a.id === 'level_6')!)

  // Manual achievements (set by server/admin for special events)
  for (const id of Object.keys(manual)) {
    if (manual[id]) {
      const ach = ACHIEVEMENTS.find(a => a.id === id)
      if (ach && !earned.find(e => e.id === id)) earned.push(ach)
    }
  }

  return earned.filter(Boolean)
}
