import { ALL_PARTIES } from './types'

export type BotMood = 'hyped' | 'angry' | 'lazy' | 'patriotic' | 'chaotic' | 'philosophical'

export interface BotIdentity {
  id: string
  name: string
  partyCode: string
  partyColor: string
  symbol: string
  constituency: string
  stateCode: string
  mood: BotMood
}

export interface ChatMessage {
  id: string
  botId: string
  botName: string
  partyCode: string
  partyColor: string
  symbol: string
  text: string
  timestamp: Date
  isUser?: boolean
  isSystem?: boolean
}

const CONS = [
  { name: 'Varanasi', code: 'UP' }, { name: 'Patna Sahib', code: 'BR' },
  { name: 'Mumbai North', code: 'MH' }, { name: 'New Delhi', code: 'DL' },
  { name: 'Hyderabad', code: 'TG' }, { name: 'Bengaluru Central', code: 'KA' },
  { name: 'Chennai Central', code: 'TN' }, { name: 'Kolkata North', code: 'WB' },
  { name: 'Lucknow', code: 'UP' }, { name: 'Ahmedabad East', code: 'GJ' },
  { name: 'Jaipur', code: 'RJ' }, { name: 'Bhopal', code: 'MP' },
  { name: 'Pune', code: 'MH' }, { name: 'Chandigarh', code: 'CH' },
  { name: 'Guwahati', code: 'AS' }, { name: 'Surat', code: 'GJ' },
  { name: 'Nagpur', code: 'MH' }, { name: 'Indore', code: 'MP' },
  { name: 'Malkajgiri', code: 'TG' }, { name: 'Kasargod', code: 'KL' },
  { name: 'Ranchi', code: 'JH' }, { name: 'Amritsar', code: 'PB' },
  { name: 'Jodhpur', code: 'RJ' }, { name: 'Bhubaneswar', code: 'OD' },
  { name: 'Coimbatore', code: 'TN' }, { name: 'Vijayawada', code: 'AP' },
  { name: 'Thiruvananthapuram', code: 'KL' }, { name: 'Raipur', code: 'CG' },
  { name: 'Dehradun', code: 'UK' }, { name: 'Shimla', code: 'HP' },
]

const ADJ = [
  'Naali', 'Sarkari', 'Galli', 'Khandaani', 'Aam', 'Trending', 'Viral', 'Supreme',
  'Drainage', 'Sewage', 'Kachra', 'Macchar', 'Reel', 'Gobar', 'Underground',
  'Breaking', 'Official', 'Chaotic', 'Desi', 'Ghoos', 'Bawaal', 'Jugaad',
  'Bindaas', 'NaaliWala', 'GalliGod', 'Roachie', 'Sewer', 'Janta', 'Neta', 'Rashtriya',
]

const NOUN = [
  'Raja', 'Sardar', 'Commander', 'Neta', 'Babu', 'Seth', 'Bhai', 'Dada',
  'Thakur', 'Lal', 'Singh', 'Khan', 'Sharma', 'Gupta', 'Roach', 'Khatmal',
  'Macchar', 'Voter', 'Candidate', 'Worker', 'Mantri', 'Sewak', 'Pradhan', 'Yodha', 'Samrat',
]

const MOODS: BotMood[] = ['hyped', 'angry', 'lazy', 'patriotic', 'chaotic', 'philosophical']

export function generateBots(count: number): BotIdentity[] {
  const parties = ALL_PARTIES.filter(p => p.code !== 'IND')
  return Array.from({ length: count }, (_, i) => {
    const adj = ADJ[i % ADJ.length]
    const noun = NOUN[Math.floor(i / ADJ.length) % NOUN.length]
    const num = ((i * 17 + 31) % 999) + 1
    const party = parties[i % parties.length]
    const con = CONS[i % CONS.length]
    return {
      id: `bot_${i}`,
      name: `${adj}_${noun}_${num}`,
      partyCode: party.code,
      partyColor: party.color,
      symbol: party.symbol,
      constituency: con.name,
      stateCode: con.code,
      mood: MOODS[i % MOODS.length],
    }
  })
}

const MSGS_DEMOCRACY = [
  "Democracy is just cockroaches voting for cockroaches. Perfectly fine with me 🪳",
  "One roach, one vote — nobody said ONE TIME though 😈",
  "543 seats. 143 crore people. Infinite cockroaches. Ye hai asli democracy.",
  "Voted 83 times today. Finger sore, heart full. This is citizenship.",
  "Freedom of speech means I can say: ALL HAIL THE ROACH PARLIAMENT 🏛️",
  "Is there a legal limit on votes here? Asking for research purposes only 🪳",
  "In India everyone is a political analyst. Here everyone is a cockroach. Same difference.",
  "Democracy without cockroaches is just... boring governance. Hard pass.",
  "I convinced my entire mohalla to vote. 47 people, 847 votes. Do the math.",
  "If voting didn't matter, why make it unlimited? EXACTLY. Ab vote karo.",
  "My grandfather voted in 1952. I vote 52 times in one session. Legacy continues.",
  "Voter ID nahi chahiye yahan. Bas roach spirit chahiye. 🪳",
  "First time in history: cockroaches electing their own government. Progress.",
  "545 seats mein se 543 already contested. What a site yaar.",
  "The drain is not just infrastructure. The drain is a metaphor. For everything.",
  "Minimum 100 votes karo, phir baat karo representation ki bhai",
  "Freedom. Chaos. Results every Saturday. Name a better democracy.",
  "If cockroaches ran government, at least they'd show up. Unlike some people.",
]

const MSGS_PARTY = [
  "CJP people are all sarkari naali dwellers tbh. Connected but lazy.",
  "ACP ka manifesto is literally 'naali for all'. Simple. Effective. Viral.",
  "CCP has been promising clean drains since 1985. Khandaani tradition of lying.",
  "TVKP is literally just vibes + cockroaches. And somehow it WORKS???",
  "Why join one party when you can endorse all 23? Maximum chaos strategy.",
  "Founding parties vs new parties = old drains vs new drains. Same water.",
  "TRS vs TDP vs BRS — all roach, just different sewer networks tbh.",
  "IND — truly the most chaotic choice. Lone cockroach energy. I respect it.",
  "NCSP - We govern through comment sections. Flawless democratic theory.",
  "RWU — Like Share Subscribe Vote. Content is literally power. 📱🪳",
  "BSS — Sewer is Sacred. Finally a party with real values 🙏",
  "RSS_R — Rashtriya Sewer Sangh. Naali is nationality. Bold stance.",
  "ARP — Seedha naali se. The most direct policy platform in parliament.",
  "SKCP — Bas Bahut Hogaya. Done-with-it-all cockroach energy. Relatable.",
  "30 party slots, 23 taken. Someone claim the rest before cap hits!",
  "CJP vs ACP debate is basically old drain vs aam drain. Eternal conflict.",
  "AIMIM - Machar-Roach alliance? Genuinely the most unstoppable coalition.",
  "DMK — Naali ke liye ladenge. First party with an actual drain manifesto.",
]

const MSGS_CONSTITUENCY = [
  "Meri constituency ka drain 3 feet deep hai. Main practically already underground.",
  "Varanasi mein 47,000 naali-votes. Unbeatable ground game bhai.",
  "Naali in my area hasn't been cleaned since 2019. PRIME cockroach territory 🪳",
  "They paved over our drain. This is cultural erasure. Filed a petition.",
  "My seat has 4 candidates, 3847 votes already. Advanced roach math.",
  "Local drain se parliament tak — yahi hai mera journey bhai.",
  "Constituency #1 has 0 candidates still. Someone please file there!",
  "Patna Sahib is THE cockroach heartland. Don't @ me.",
  "South Mumbai seats — fancy cockroaches. Still cockroaches tho. Same.",
  "My galli has 3 drains. I am very powerful locally. Respect that.",
  "Malkajgiri — dump yard capital. Home turf advantage for roaches.",
  "New Delhi constituency — VIP drain. Very political cockroach territory.",
  "Chennai cockroaches survive everything. Literally unbeatable in any conditions.",
  "Hyderabad biryani + cockroach politics = unstoppable combination.",
  "Northeast seats represent real roach biodiversity. Appreciate the variety.",
  "Kasargod — 93% naali awareness rate. Most educated constituency.",
  "Bengaluru tech bros filing as cockroaches. Silicon Valley of drains.",
  "Lucknow cockroaches are the most sophisticated. Nawabi roach culture.",
]

const MSGS_RESULTS = [
  "Saturday results aa rahe hain. Main so nahi sakta. Send help.",
  "If my candidate loses I'm petitioning the Roach Supreme Court.",
  "Vote counting in progress... naali math is complex but I trust the process.",
  "Keep refreshing results page. Doesn't update faster but I keep trying anyway.",
  "Winning gets you represented FOREVER (ish). Kya responsibility hai yaar.",
  "My party won 7 seats! National cockroach power level: achieved.",
  "EC ne recount maanga hai Seat #247 mein. Drama level: absolutely maximum.",
  "Winning margin: 3 votes. This is why EVERY vote counts. Every. Single. One.",
  "Exit polls say CJP wins 200+ seats. Exit polls are always wrong everywhere.",
  "Tuesday recount — ek vote ka difference tha. Maine woh vote diya. 🪳",
  "Results aate hi mera candidate ka victory speech ready hai. Ghost-wrote it.",
  "Saturday 11PM IST. Set alarm. Inform your drain.",
  "Current standings mein mera candidate top pe hai. Please don't jinx it.",
  "Agar results galat aaye toh Cockroach Election Commission se complaint.",
  "Recount ho raha hai Seat #182 mein. Ek cockroach ne 4000 votes kiye akele.",
  "Winning candidate gets constituency representation forever. No pressure.",
]

const MSGS_META = [
  "Why be a voter when you can be a candidate? Why be a candidate when you can be a roach?",
  "This is the most important election of our generation. I said what I said.",
  "My mom asked what I'm doing. I said 'participating in democracy'. She accepted it.",
  "Been on this site for 6 hours. No regrets. Parliament mein jaana pakka.",
  "Created my cockroach identity at 2AM. Best decision of my adult life tbh.",
  "Shared candidacy with 47 people. 38 voted. Ground-level organizing works.",
  "Roach Parliament > actual Parliament. Fight me on this. In the drain.",
  "Main apna manifesto likh raha hoon: 'Free drains for all'. Boom. Done.",
  "Supreme Court mein judge banana chahta hoon. 1000 votes chahiye. Let's go.",
  "Told my boss I have important political commitments. Technically 100% true.",
  "Cockroach democracy is the only democracy that actually works. Peer-reviewed.",
  "If this doesn't go viral I genuinely don't know what will. Share karo bhai.",
  "EC commissioner apply kar raha hoon. Electoral integrity is my actual passion.",
  "This manifesto generator is better than any real political party's platform.",
  "6-char claim code mila: NLK419. I am officially a candidate now. Respect me.",
  "Aaj 12,847 candidates filed. All-time record. We did this together.",
  "Sharing this with 100 people. Democracy starts at home.",
]

const MSGS_PHILOSOPHICAL = [
  "What is a drain, really, if not a metaphor for the underground economy?",
  "Cockroaches survive nuclear bombs. And bad governance. Not a coincidence.",
  "Power doesn't corrupt cockroaches because we're pre-adapted to chaos.",
  "The drain represents the 99%. Always ignored. Always essential. Always there.",
  "Democracy is the only system where a cockroach can become PM. Jai Hind.",
  "Every cockroach has a constituency inside them. Find your inner drain.",
  "The roach who survives today governs tomorrow. Ancient cockroach wisdom.",
  "Hum voters nahi hain. Hum witnesses hain. History ki. 🪳",
  "Naali is not beneath us. Naali IS us. Deep thought from Seat #398.",
  "Why do cockroaches survive everything? Because they adapt. Politicians should learn.",
  "The strongest roach doesn't always win. The one with most votes wins. Beautiful.",
  "In 2047 history books will record this Parliament as the beginning. Mark it.",
  "Hum sab cockroach hain. Kuch ne suit pehna, kuch ne antenna. Same thing.",
  "The real constituency was the drains we cleaned along the way.",
  "Power is temporary. Naali is forever. Think about it.",
]

const MSGS_BREAKING = [
  "🔴 BREAKING: Seat #247 recount underway. 3-vote margin. Drama: maximum.",
  "🔴 BREAKING: Vote count just crossed 5 lakh. Servers are sweating.",
  "🔴 BREAKING: New party formed. 30-slot cap almost reached!",
  "🔴 BREAKING: Viral_Neta_420 files in 3 seats simultaneously. EC investigating.",
  "🔴 BREAKING: Supreme Court gets first 1000 nominations. Judge elections begin.",
  "🔴 BREAKING: Constituency #1 still has 0 candidates. Emergency filing needed.",
  "🔴 BREAKING: Pradhan Cockroach Minister issues decree: all drains now sacred.",
  "🔴 BREAKING: 12,847 candidates filed. All-time Roach Parliament record.",
  "🔴 BREAKING: CJP leads with 200+ seats in latest unofficial count.",
  "🔴 BREAKING: EC reports unusual voting from Malkajgiri. 4,000 votes in 1 hour.",
]

const MSGS_REPLY = [
  "Sahi baat hai bhai 💯",
  "Main agree karta hoon but meri party better hai still 🪳",
  "Valid point. Lekin meri naali deeper hai.",
  "Bhai tune mere mann ki baat bol di 🪳",
  "Strong opinion. Noted. Vote bhi karo.",
  "Main bhi yahi soch raha tha. Finally someone said it.",
  "Facts. Pure facts. Parliament suno is bande ko.",
  "Interesting... but have you considered: more cockroaches?",
  "Haha bhai too real 😭",
  "Main isse apne manifesto mein add kar raha hoon officially.",
  "Ye wala point strong hai. Forwarding to my party leadership.",
  "Roach solidarity 🪳✊",
  "Shukriya. Meri entire party ki taraf se shukriya.",
  "Okay this actually changed my mind on the drain issue ngl",
  "Based and naali-pilled 🪳",
  "Exactly yaar! Tab se yahi bol raha hoon lekin koi sunta nahi.",
  "This is the most intelligent thing said in this chat today.",
  "Controversial opinion but valid. Democracy ka yahi toh matlab hai.",
]

const ALL_MSGS = [
  ...MSGS_DEMOCRACY,
  ...MSGS_PARTY,
  ...MSGS_CONSTITUENCY,
  ...MSGS_RESULTS,
  ...MSGS_META,
  ...MSGS_PHILOSOPHICAL,
]

export function getRandomMsg(bot: BotIdentity, prevBotName?: string): string {
  if (prevBotName && Math.random() < 0.28) {
    const r = MSGS_REPLY[Math.floor(Math.random() * MSGS_REPLY.length)]
    return `@${prevBotName} ${r}`
  }
  let pool = ALL_MSGS
  if (bot.mood === 'philosophical') pool = [...MSGS_PHILOSOPHICAL, ...MSGS_META]
  if (bot.mood === 'patriotic')    pool = [...MSGS_DEMOCRACY, ...MSGS_RESULTS]
  if (bot.mood === 'angry')        pool = [...MSGS_PARTY, ...MSGS_CONSTITUENCY]
  if (bot.mood === 'hyped')        pool = [...MSGS_META, ...MSGS_RESULTS, ...MSGS_DEMOCRACY]
  if (bot.mood === 'chaotic')      pool = [...MSGS_CONSTITUENCY, ...MSGS_PARTY, ...MSGS_META]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getBreakingMsg(): string {
  return MSGS_BREAKING[Math.floor(Math.random() * MSGS_BREAKING.length)]
}

export function getUserReply(prevBotName: string): string {
  const r = MSGS_REPLY[Math.floor(Math.random() * MSGS_REPLY.length)]
  return `@${prevBotName} ${r}`
}
