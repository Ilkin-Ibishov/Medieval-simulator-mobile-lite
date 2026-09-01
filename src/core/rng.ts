// Deterministic Mulberry32 Random Number Generator

export interface Rng {
  next(): number;          // [0, 1)
  nextInt(min: number, max: number): number; // [min, max] inclusive
  shuffle<T>(array: T[]): T[];
  choice<T>(array: T[]): T;
}

export function createRng(seed: number): Rng {
  let s = Math.floor(seed) >>> 0;
  if (s === 0) s = 1337;

  function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function shuffle<T>(array: T[]): T[] {
    const res = [...array];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      const tmp = res[i];
      res[i] = res[j];
      res[j] = tmp;
    }
    return res;
  }

  function choice<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Cannot pick choice from empty array');
    return array[nextInt(0, array.length - 1)];
  }

  return {
    next,
    nextInt,
    shuffle,
    choice,
  };
}
