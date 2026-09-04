import { describe, it, expect } from 'vitest';
import { createGame, getDoziaMapData, getRegionVisibility, isRegionDiscovered } from '../';

describe('Fog of War & Frontier Reconnaissance', () => {
  it('calculates 3-tier visibility correctly in Grand Campaign (Dozia)', () => {
    const game = createGame({
      seed: 42,
      mapData: getDoziaMapData(),
      chosenKingdomId: 8, // Mamatihalia (Player 0)
      fogOfWar: true,
    });

    const owned = game.map.regions.filter((_, i) => game.regionState[i].owner === 0);
    expect(owned.length).toBe(38);

    // 1. Every owned region MUST be VISIBLE
    owned.forEach((r) => {
      expect(getRegionVisibility(game, 0, r.id)).toBe('VISIBLE');
      expect(isRegionDiscovered(game, 0, r.id)).toBe(true);
    });

    // 2. Discover all frontier border regions
    const ownedIds = new Set(owned.map((r) => r.id));
    const frontierIds = new Set<number>();
    owned.forEach((r) => {
      r.neighbors.forEach((nId) => {
        if (!ownedIds.has(nId)) frontierIds.add(nId);
      });
    });

    expect(frontierIds.size).toBeGreaterThan(0);
    frontierIds.forEach((fId) => {
      expect(getRegionVisibility(game, 0, fId)).toBe('BORDER');
      expect(isRegionDiscovered(game, 0, fId)).toBe(true);
    });

    // 3. Deep regions far from Mamatihalia (e.g. northern islands or eastern coast) MUST be FOGGED
    const deepRegions = game.map.regions.filter(
      (r) => !ownedIds.has(r.id) && !frontierIds.has(r.id)
    );
    expect(deepRegions.length).toBeGreaterThan(0);
    deepRegions.forEach((d) => {
      expect(getRegionVisibility(game, 0, d.id)).toBe('FOGGED');
      expect(isRegionDiscovered(game, 0, d.id)).toBe(false);
    });
  });

  it('reveals new frontiers when player conquers an adjacent territory', () => {
    const game = createGame({
      seed: 100,
      fogOfWar: true,
      regionCount: 24,
      playerCount: 4,
    });

    const humanId = 0;
    const initialOwned = game.map.regions.filter((_, i) => game.regionState[i].owner === humanId);
    const initialOwnedIds = new Set(initialOwned.map((r) => r.id));

    // Find a neighbor of player 0
    let targetNeighbor = -1;
    for (const r of initialOwned) {
      for (const nId of r.neighbors) {
        if (!initialOwnedIds.has(nId)) {
          targetNeighbor = nId;
          break;
        }
      }
      if (targetNeighbor !== -1) break;
    }

    expect(targetNeighbor).toBeGreaterThanOrEqual(0);
    expect(getRegionVisibility(game, humanId, targetNeighbor)).toBe('BORDER');

    // Simulate conquest of targetNeighbor
    game.regionState[targetNeighbor].owner = humanId;

    // targetNeighbor is now VISIBLE
    expect(getRegionVisibility(game, humanId, targetNeighbor)).toBe('VISIBLE');

    // Any neighbor of targetNeighbor that was FOGGED must now become BORDER
    const newNeighbors = game.map.regions[targetNeighbor].neighbors;
    newNeighbors.forEach((nId) => {
      const vis = getRegionVisibility(game, humanId, nId);
      expect(['VISIBLE', 'BORDER']).toContain(vis);
    });
  });

  it('disables fog when fogOfWar is false', () => {
    const game = createGame({
      seed: 42,
      mapData: getDoziaMapData(),
      fogOfWar: false,
    });

    game.map.regions.forEach((r) => {
      expect(getRegionVisibility(game, 0, r.id)).toBe('VISIBLE');
      expect(isRegionDiscovered(game, 0, r.id)).toBe(true);
    });
  });
});
