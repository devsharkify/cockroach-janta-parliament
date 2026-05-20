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
 * Total unique combinations: ~7 lakh.
 * Server enforces per-seat uniqueness — collision triggers regenerate.
 */

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
