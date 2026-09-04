import { describe, it, expect } from 'vitest';
import { generateProceduralMap } from '../mapgen';
import { getDoziaMapData } from '../index';

describe('Map Generator Integrity & Topological Invariants', () => {
  it('fuzzes 30 seeds: ensures every Voronoi map is a single connected graph', () => {
    for (let seed = 1000; seed < 1030; seed++) {
      const map = generateProceduralMap({ seed, regionCount: 20 });
      expect(map.regions.length).toBe(20);

      const visited = new Set<number>();
      const queue = [0];
      visited.add(0);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const n of map.regions[curr].neighbors) {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }

      expect(visited.size).toBe(20);
    }
  });

  it('guarantees bidirectional adjacency symmetry (A ~ B <=> B ~ A)', () => {
    const testSeeds = [42, 123, 777, 9999];
    for (const seed of testSeeds) {
      const map = generateProceduralMap({ seed, regionCount: 16 });

      for (const r of map.regions) {
        expect(r.neighbors).not.toContain(r.id);

        for (const n of r.neighbors) {
          const neighborRegion = map.regions[n];
          expect(neighborRegion).toBeDefined();
          expect(neighborRegion.neighbors).toContain(r.id);
        }
      }
    }
  });

  it('guarantees valid non-NaN coordinates and bounding box compliance', () => {
    const map = generateProceduralMap({ seed: 8888, regionCount: 24, width: 800, height: 600 });

    for (const r of map.regions) {
      expect(Number.isNaN(r.center[0])).toBe(false);
      expect(Number.isNaN(r.center[1])).toBe(false);
      expect(r.center[0]).toBeGreaterThanOrEqual(0);
      expect(r.center[0]).toBeLessThanOrEqual(800);
      expect(r.center[1]).toBeGreaterThanOrEqual(0);
      expect(r.center[1]).toBeLessThanOrEqual(600);
    }
  });

  it('validates Dozia 97-province master map topological perfection', () => {
    const dozia = getDoziaMapData();
    expect(dozia.regions).toHaveLength(97);

    for (const r of dozia.regions) {
      expect(r.neighbors.length).toBeGreaterThan(0);
      expect(r.neighbors).not.toContain(r.id);

      for (const n of r.neighbors) {
        const neighbor = dozia.regions[n];
        expect(neighbor).toBeDefined();
        expect(neighbor.neighbors).toContain(r.id);
      }
    }
  });
});
