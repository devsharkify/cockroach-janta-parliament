/**
 * Cockroach Janta Parliament — Candidate Name Generator
 *
 * Auto-generates satirical regional-flavor candidate names like:
 * - Mumbai_Kachra_official
 * - Macchar Raja
 * - Bandra Naala Wala
 * - Khatmal_OG
 * - Don of Hyderabad Galli
 * - Naali Sardar
 *
 * Also supports hyper-local viral name generation:
 *   [VIRAL_WORD]_[CONSTITUENCY_NICK]_[ROACH_WORD]
 *   e.g.  Trending_Malka_DumpYard  |  Naala_Kashi_GhatRoach
 *
 * Total unique combinations: ~7 lakh.
 * Server enforces per-seat uniqueness — collision triggers regenerate.
 */

import { getConstituencyVibe, pickRandom } from './constituencyIssues'

export const TITLES = [
  'Raja', 'Rani', 'Bhai', 'Don', 'Anna', 'Sahab', 'Master',
  'Sardar', 'Bossman', 'Netaji', 'Maharaj', 'Dada', 'Pradhan',
  'Tycoon', 'Sheikh', 'Babu', 'Tau', 'Mama'
];

export const REGIONS = [
  'Mumbai', 'Delhi', 'Hyderabad', 'Patna', 'Lucknow', 'Indore',
  'Pune', 'Chennai', 'Kolkata', 'Surat', 'Jaipur', 'Ranchi',
  'Vizag', 'Bhopal', 'Nagpur', 'Goa', 'Bhubaneswar', 'Kanpur',
  'Agra', 'Varanasi', 'Coimbatore', 'Vadodara', 'Ludhiana', 'Amritsar'
];

export const SUBAREAS = [
  'Bandra', 'Andheri', 'Karol Bagh', 'Chandni Chowk', 'Banjara Hills',
  'Boring Road', 'Anna Nagar', 'T Nagar', 'Park Street', 'Civil Lines',
  'Hazratganj', 'Camp', 'Charminar', 'Kalkaji', 'Versova', 'Adyar'
];

export const CORES = [
  'Kachra', 'Macchar', 'Naala', 'Naali', 'Keeda', 'Chuha',
  'Galli', 'Garbage', 'Khatmal', 'Pesticide', 'Andhera', 'Manhole',
  'Cobweb', 'Gobar', 'Bin', 'Pankha', 'Mooli', 'Bhusa'
];

export const SUFFIXES = [
  '_official', '_wala', '_bhai', '_OG', '_2026', '_no_1',
  '_ka_baap', '_zindabad', '_live', '_xpress', '_da_real', '_ki_jai'
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

type Pattern = {
  label: string;
  gen: () => string;
};

export const PATTERNS: Pattern[] = [
  {
    label: 'region + theme + suffix',
    gen: () => `${pick(REGIONS)}_${pick(CORES)}${pick(SUFFIXES)}`,
  },
  {
    label: 'theme + title',
    gen: () => `${pick(CORES)} ${pick(TITLES)}`,
  },
  {
    label: 'subarea + theme wala',
    gen: () => `${pick(SUBAREAS)} ${pick(CORES)} Wala`,
  },
  {
    label: 'theme + suffix',
    gen: () => `${pick(CORES)}${pick(SUFFIXES)}`,
  },
  {
    label: 'title of region theme',
    gen: () => `${pick(TITLES)} of ${pick(REGIONS)} ${pick(CORES)}`,
  },
  {
    label: 'theme + region + suffix',
    gen: () => `${pick(CORES)}_${pick(REGIONS)}_${pick(SUFFIXES).replace(/^_/, '')}`,
  },
];

/**
 * Generate one candidate name using a random pattern.
 */
export function generateCandidateName(): { name: string; pattern: string } {
  const p = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  return { name: p.gen(), pattern: p.label };
}

/**
 * Generate a unique candidate name not in the provided exclusion set.
 * Tries up to maxAttempts times before giving up and appending a counter.
 *
 * @param existing - Set of names already taken at this seat
 * @param maxAttempts - Max regeneration attempts before fallback
 */
export function generateUniqueName(
  existing: Set<string>,
  maxAttempts: number = 50
): { name: string; pattern: string } {
  for (let i = 0; i < maxAttempts; i++) {
    const result = generateCandidateName();
    if (!existing.has(result.name)) {
      return result;
    }
  }
  // Fallback: append a counter to the last generated name
  const fallback = generateCandidateName();
  let counter = 2;
  let candidateName = `${fallback.name}_${counter}`;
  while (existing.has(candidateName)) {
    counter++;
    candidateName = `${fallback.name}_${counter}`;
  }
  return { name: candidateName, pattern: fallback.pattern + ' + counter' };
}

/**
 * Generate a batch of names (for showing options or seeding).
 */
export function generateBatch(count: number = 6): Array<{ name: string; pattern: string }> {
  const seen = new Set<string>();
  const results: Array<{ name: string; pattern: string }> = [];
  let attempts = 0;
  while (results.length < count && attempts < count * 10) {
    const r = generateCandidateName();
    if (!seen.has(r.name)) {
      seen.add(r.name);
      results.push(r);
    }
    attempts++;
  }
  return results;
}

/**
 * Total theoretical unique combinations across all patterns.
 * Useful for sanity checks and capacity planning.
 */
export const TOTAL_COMBINATIONS =
  REGIONS.length * CORES.length * SUFFIXES.length +
  CORES.length * TITLES.length +
  SUBAREAS.length * CORES.length +
  CORES.length * SUFFIXES.length +
  TITLES.length * REGIONS.length * CORES.length +
  CORES.length * REGIONS.length * SUFFIXES.length;

// ── Hyper-local name generation ───────────────────────────────────────────────
// Formula: [VIRAL_WORD]_[CONSTITUENCY_NICK]_[ROACH_WORD]
// Example: Trending_Malka_DumpYard | Naala_Kashi_GhatRoach | Reel_Gorakh_NaaliRaja

/** First distinctive word per party code — used as the "viral prefix" in names */
const PARTY_VIRAL_WORDS: Record<string, string> = {
  CJP:    'Sarkari',
  CCP:    'Khandaani',
  ACP:    'Aam',
  RCP:    'Galli',
  TDP:    'Drainage',
  TRS:    'Trending',
  BRS:    'Bharatiya',
  JSS:    'Janata',
  AIMIM:  'Machar',
  DMK:    'Morcha',
  AIADMK: 'AntiDrain',
  TMC:    'Collective',
  YSRC:   'Youth',
  NMF:    'National',
  NDF:    'Federation',
  BSS:    'Sewer',
  RSS_R:  'Rashtriya',
  INC_R:  'Naala',
  NCSP:   'Comment',
  RWU:    'Reel',
  ARP:    'AamRoach',
  SKCP:   'Shuu',
  TVKP:   'Trending',
  IND:    'Aam',
}

const VIRAL_STOP_WORDS = new Set([
  'the', 'of', 'and', 'or', 'a', 'an', 'party', 'india', 'indian',
  'all', 'karo', 'cockroach', 'roach', 'sena', 'sangh', 'congress',
])

/** Fall back: pull first meaningful word out of a party name */
function extractViralWordFromName(partyName: string): string {
  const words = partyName.split(/\s+/)
  for (const w of words) {
    if (w.length >= 3 && !VIRAL_STOP_WORDS.has(w.toLowerCase())) {
      return w.replace(/[^a-zA-Z0-9]/g, '')
    }
  }
  return 'Roach'
}

/**
 * Generate a hyper-local candidate name.
 * Format: [PARTY_VIRAL_WORD]_[CONSTITUENCY_NICK]_[ISSUE_ROACH_WORD]
 *
 * @param partyCode       e.g. 'TVKP'
 * @param partyName       e.g. 'Trending Virak Karo Party'
 * @param constituencyName e.g. 'Malkajgiri'
 * @param state           e.g. 'Telangana' (optional, for state-level fallback)
 */
export function generateHyperLocalName(
  partyCode: string,
  partyName: string,
  constituencyName: string,
  state?: string,
): { name: string; pattern: string } {
  const vibe = getConstituencyVibe(constituencyName, state)
  const viralWord = PARTY_VIRAL_WORDS[partyCode] ?? extractViralWordFromName(partyName)
  const roachWord = pickRandom(vibe.roachWords)
  const name = `${viralWord}_${roachWord}`
  return { name, pattern: 'hyper-local: party+issue' }
}
