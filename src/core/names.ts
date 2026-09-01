// Procedural Medieval Names

export const PREFIXES = [
  'Val', 'Ash', 'Gren', 'Oakh', 'Raven', 'Iron', 'Storm', 'Winter', 'Sun', 'High',
  'Stone', 'Frost', 'Deep', 'Black', 'Silver', 'Gold', 'Crown', 'Falcon', 'Wolf',
  'Dragon', 'River', 'Sea', 'North', 'South', 'East', 'West', 'Shadow', 'Bright'
];

export const SUFFIXES = [
  'dale', 'ford', 'march', 'haven', 'crest', 'hold', 'gard', 'vale', 'fell', 'peak',
  'shire', 'land', 'wick', 'bury', 'port', 'cross', 'cliff', 'wood', 'keep', 'moor',
  'brook', 'fort', 'point', 'reach', 'bay', 'gate', 'stone', 'ridge'
];

export function generateRegionName(index: number, seed: number): string {
  // 28 * 28 = 784 unique permutations
  const seedOffset = Math.abs(seed) % 784;
  const combined = (index * 137 + seedOffset) % 784;
  const pIdx = Math.floor(combined / SUFFIXES.length) % PREFIXES.length;
  const sIdx = combined % SUFFIXES.length;
  return `${PREFIXES[pIdx]}${SUFFIXES[sIdx]}`;
}
