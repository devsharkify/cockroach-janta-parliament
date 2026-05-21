/**
 * Deterministic mock candidate generator.
 * Given a seat number, always returns the same set of candidates
 * so every constituency looks unique without a database.
 */
import { ALL_PARTIES } from './types'

const PARTIES = ALL_PARTIES.filter(p => p.code !== 'IND')
const IND_PARTY = ALL_PARTIES.find(p => p.code === 'IND')!

// Seeded PRNG (mulberry32) — deterministic for a given seat
function seeded(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ADJECTIVES = [
  'Naali', 'Sarkari', 'Galli', 'Khandaani', 'Aam', 'Trending', 'Viral', 'Supreme',
  'Drainage', 'Sewage', 'Kachra', 'Macchar', 'Reel', 'Gobar', 'Underground',
  'Breaking', 'Desi', 'Ghoos', 'Jugaad', 'Bindaas', 'Bawaal', 'Sewer',
  'Janta', 'Neta', 'Rashtriya', 'Lok', 'Jan', 'Drain', 'Cockroach',
]

const NOUNS = [
  'Raja', 'Sardar', 'Commander', 'Neta', 'Babu', 'Seth', 'Bhai', 'Dada',
  'Thakur', 'Lal', 'Singh', 'Khan', 'Sharma', 'Gupta', 'Queen', 'King',
  'Macchar', 'Voter', 'Mantri', 'Sewak', 'Pradhan', 'Yodha', 'Samrat',
  'Leader', 'Candidate', 'Worker', 'Agent', 'Sarkar', 'Official',
]

const MANIFESTOS_BY_PARTY: Record<string, string[]> = {
  CJP: [
    "Free naali for all. Brooms banned. Vote or don't, I survive either way.",
    "Sarkari cockroach with sarkari connections. Your drain is my mandate.",
    "Lazy but connected. Naali infrastructure coming in 5-7 business decades.",
    "Main toh sarkari hoon. Kaam hoga, slowly, but surely. Naali first.",
  ],
  CCP: [
    "Old money, old drains. We've been here before your grandfather's grandfather.",
    "Khandaani cockroach. Legacy candidate. The drain runs in my blood.",
    "Congress ke baad cockroach. Continuity is our policy.",
    "Old roach magic is real. 1885 se naali ka saath. Trust the process.",
  ],
  ACP: [
    "Naali sabki iss baar cockroach ki. Your garbage is my palace.",
    "Aam cockroach, extraordinary dreams. One drain per household.",
    "Common roach for common drain. No VIP naali under my watch.",
    "Seedha naali se seedha Parliament. No detours, no corruption.",
  ],
  RCP: [
    "My galli, my drain, my rules. Regional pride over national nonsense.",
    "Apni galli apna kachra. Local roach for local problems.",
    "Hyper-territorial and proud. This drain belongs to us alone.",
    "Regional cockroach knows regional drains best. Simple logic.",
  ],
  TDP: [
    "Trending since last monsoon. Drainage activism is the new politics.",
    "Every flood is an opportunity. Infrastructure cockroach reporting.",
    "Water logging? My constituency. My domain. My campaign issue.",
    "Drain rights are human rights. I said what I said.",
  ],
  TRS: [
    "Roar of the sewer, voice of the gutter. We rise from the drain.",
    "Mosquito-roach alliance is unbreakable. United we bite.",
    "Sewage solidarity. All underground creatures must unite.",
    "The streets may ignore us, Parliament cannot.",
  ],
  BRS: [
    "Jai Roach Mata. Nationalism starts at the naali.",
    "Patriotic roach, serving the nation's drainage needs since forever.",
    "Bharat Mata ki jai aur naali ki bhi jai. Both equally sacred.",
    "National drain, national pride. Vote for soil and sewage.",
  ],
  JSS: [
    "Sewers for the people, by the people. Working-class cockroach.",
    "No VIP drain. One naali, one nation, one cockroach.",
    "Labour rights start underground. Sewer workers, unite!",
    "The forgotten drain-dweller finally has a voice. Vote for the sewer.",
  ],
  AIMIM: [
    "Machar power zindabad. All India influence, one naali at a time.",
    "United cockroach front for drain rights. No compromise.",
    "Influence is built in the gutter, not in glass towers.",
    "Representation for every roach, every drain, every mohalla.",
  ],
  DMK: [
    "Naali ke liye ladenge, naali ke liye jiyenge. Drain first.",
    "Drainage rights movement is not a movement, it's a revolution.",
    "South drain, north drain — all drains are equal under cockroach law.",
    "Justice for every clogged drain. I will unclog the system.",
  ],
  AIADMK: [
    "Stop the drain menace. I will bring order to the naali chaos.",
    "Anti-corruption. Anti-clogging. Anti-everything that blocks the drain.",
    "Strong hand, clean drain. No nonsense cockroach governance.",
    "Control the drain, control the city. Strategic cockroach thinking.",
  ],
  TMC: [
    "United roaches rise. Collective power of the naali.",
    "Together we block the drain, together we unblock it. Solidarity.",
    "Fire cockroach energy. We burn bright, we survive everything.",
    "Collective uprising from the sewers. The drain shall inherit the earth.",
  ],
  YSRC: [
    "Young roaches, old drains. We have energy, we have vision.",
    "Youth sewer roach congress: very online, very angry, very right.",
    "Generation Z of cockroaches. Digital drain rights activist.",
    "Old drains need new cockroaches. Fresh ideas from the gutter.",
  ],
  NMF: [
    "Mosquitoes and cockroaches united. The ultimate alliance.",
    "National machar front: when mosquito meets roach, Parliament shakes.",
    "Cross-species democracy. Insects of all types deserve representation.",
    "Machar-Roach coalition: combined annoyance is unstoppable.",
  ],
  NDF: [
    "Drains belong to all, governed by federation. Bureaucratic cockroach.",
    "Federation rules, drain regulations, cockroach compliance. By the book.",
    "National drainage federation: paperwork done, manifesto filed.",
    "Process-oriented roach. Forms submitted, democracy served.",
  ],
  BSS: [
    "Sewer is sacred. Do not question the sanctity of the drain.",
    "Sacred sewer devotee. Naali is temple, cockroach is priest.",
    "Spiritual cockroach. Every drain is a pilgrimage site.",
    "Dharma of the drain. Sacred sewage for sacred cockroaches.",
  ],
  RSS_R: [
    "Rashtra ka naali, rashtra ka cockroach. Naali swayamsevak.",
    "National drain seva. Voluntarily cleaning what no one else will.",
    "Rashtriya sewer sangh: organized, disciplined, cockroach.",
    "Discipline + drain + dedication = cockroach governance.",
  ],
  INC_R: [
    "Naala since 1885. Legacy drain politician. Old Congress roach.",
    "We built the drains of this nation. Figuratively. Mostly figuratively.",
    "Old India, old cockroach, old drain. Continuity of the naali.",
    "Grand old party cockroach. We have been here since independence.",
  ],
  NCSP: [
    "We type therefore we govern. Comment section cockroach.",
    "Policy through posts. Governance through replies. Democracy 2.0.",
    "My manifesto is a Twitter thread. 47 tweets, all drain-related.",
    "Social media cockroach: if it's not posted, it didn't happen.",
  ],
  RWU: [
    "Like Share Subscribe Vote. Content is literally power, bhai.",
    "Reel-making roach with 2.3M followers and zero policy experience.",
    "Views > votes (but I'll take both). Viral cockroach running for office.",
    "Creating content about drain issues. Parliament is just another collab.",
  ],
  ARP: [
    "Seedha naali se. Aam aadmi roach, very frustrated, very running.",
    "Common roach energy. I am you. You are me. We are the drain.",
    "Frustrated roach finally doing something about it. Vote for anger.",
    "Enough is enough. The aam roach has had enough of fancy drains.",
  ],
  SKCP: [
    "Bas bahut hogaya. Done with everything, still running for office.",
    "SHUU karo cockroach party: silence is our loudest policy.",
    "No promises. No manifesto. Just tired cockroach vibes.",
    "I have given up on explanation. Just vote if you want. Or don't.",
  ],
  TVKP: [
    "Viral hona hai toh vote karo. Trending cockroach for trending times.",
    "15 minutes of fame? I want 5 years of Parliament. Vote karo.",
    "Trend setter roach. My campaign went viral before I even filed.",
    "TVKP: where every vote is content and every candidate is a creator.",
  ],
}

const IND_MANIFESTOS = [
  "No party. No agenda. Just vibes and survival instinct.",
  "Lone cockroach. No alliance. Pure independent chaos energy.",
  "They wouldn't give me a ticket. So I'm running myself. Watch.",
  "Independent because every party rejected me. Their loss.",
  "Free agent cockroach. No commitments. No manifesto. Just me.",
  "I am the party. I am the candidate. I am the drain.",
  "Zero funding. Zero party. Maximum cockroach confidence.",
]

function pickManifesto(partyCode: string | null, rng: () => number): string {
  if (!partyCode) {
    return IND_MANIFESTOS[Math.floor(rng() * IND_MANIFESTOS.length)]
  }
  const list = MANIFESTOS_BY_PARTY[partyCode]
  if (!list) return "Cockroach candidate with strong naali values and weak manifesto."
  return list[Math.floor(rng() * list.length)]
}

export type MockCandidate = {
  id: string
  displayName: string
  partyCode: string | null
  partyColor: string | null
  partyName: string | null
  partySymbol: string | null
  isIndependent: boolean
  manifesto: string
  voteCount: number
  createdAt: string
}

export function getMockCandidates(seatNumber: number): MockCandidate[] {
  const rng = seeded(seatNumber * 31337)

  // How many candidates for this seat (2–5)
  const count = 2 + Math.floor(rng() * 4)

  // Pick `count` distinct parties (last slot may be Independent)
  const usedIndices = new Set<number>()
  const picks: Array<{ partyCode: string | null; partyColor: string | null; partyName: string | null; symbol: string | null }> = []

  for (let i = 0; i < count; i++) {
    if (i === count - 1 && rng() < 0.35) {
      // Independent
      picks.push({ partyCode: null, partyColor: IND_PARTY.color, partyName: 'Independent', symbol: IND_PARTY.symbol })
    } else {
      let idx: number
      do { idx = Math.floor(rng() * PARTIES.length) } while (usedIndices.has(idx))
      usedIndices.add(idx)
      const p = PARTIES[idx]
      picks.push({ partyCode: p.code, partyColor: p.color, partyName: p.name, symbol: p.symbol })
    }
  }

  // Assign vote counts — highest to first, descending with variance
  const baseVotes = 200 + Math.floor(rng() * 800)
  const voteCounts: number[] = picks.map((_, i) => {
    const share = 1 - i * (0.15 + rng() * 0.15)
    return Math.max(10, Math.floor(baseVotes * share * (0.8 + rng() * 0.4)))
  })
  // Sort descending
  const sorted = voteCounts.slice().sort((a, b) => b - a)

  const now = Date.now()

  return picks.map((p, i) => {
    const adj = ADJECTIVES[Math.floor(rng() * ADJECTIVES.length)]
    const noun = NOUNS[Math.floor(rng() * NOUNS.length)]
    const num = Math.floor(rng() * 999) + 1
    const name = `${adj}_${noun}_${num}`
    const hoursAgo = 6 + Math.floor(rng() * 42)

    return {
      id: `mock-seat${seatNumber}-${i}`,
      displayName: name,
      partyCode: p.partyCode,
      partyColor: p.partyColor,
      partyName: p.partyName,
      partySymbol: p.symbol,
      isIndependent: !p.partyCode,
      manifesto: pickManifesto(p.partyCode, rng),
      voteCount: sorted[i],
      createdAt: new Date(now - hoursAgo * 3600000).toISOString(),
    }
  })
}
