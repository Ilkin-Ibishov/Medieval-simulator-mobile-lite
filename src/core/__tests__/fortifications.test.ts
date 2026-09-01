import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { canApplyAction, getRegionVisibility, previewCombat } from '../rules';
import { RULES } from '../types';

describe('Fortifications System (Forts & Watchtowers)', () => {
  it('allows building a watchtower with sufficient treasury and deducts cost', () => {
    const game = createGame({ seed: 12345, regionCount: 16 });
    const p0 = game.players[0];
    p0.treasury = 50;

    const p0Region = game.regionState.findIndex((r) => r.owner === 0);
    expect(p0Region).toBeGreaterThanOrEqual(0);

    const canBuild = canApplyAction(game, { type: 'BUILD', regionId: p0Region, building: 'WATCHTOWER' }, 0);
    expect(canBuild).toBe(true);

    const next = applyAction(game, { type: 'BUILD', regionId: p0Region, building: 'WATCHTOWER' });
    expect(next.players[0].treasury).toBe(50 - RULES.watchtowerCost);
    expect(next.regionState[p0Region].building).toBe('WATCHTOWER');
  });

  it('allows building a fort and grants +2 defense bonus in combat preview and battle', () => {
    const game = createGame({ seed: 12345, regionCount: 16 });
    const p0 = game.players[0];
    p0.treasury = 50;

    const p0Region = game.regionState.findIndex((r) => r.owner === 0);
    const next = applyAction(game, { type: 'BUILD', regionId: p0Region, building: 'FORT' });
    expect(next.regionState[p0Region].building).toBe('FORT');

    // Defender with 4 troops + Fort (bonus 2) = 6 effective * 1.5 ratio = 9 defense power
    const previewWithFort = previewCombat(8, 4, { hasFort: true });
    expect(previewWithFort.willWin).toBe(false); // 8 <= 9 -> Defeat

    const previewWithoutFort = previewCombat(8, 4, { hasFort: false });
    expect(previewWithoutFort.willWin).toBe(true); // 8 > 6 -> Victory
  });

  it('watchtower expands Fog of War visibility to 2 hops', () => {
    const game = createGame({ seed: 12345, regionCount: 24, fogOfWar: true });
    const p0Region = game.regionState.findIndex((r) => r.owner === 0);
    const neighbors = game.map.regions[p0Region].neighbors;

    // Find a truly FOGGED region that is distance 2 from p0Region
    let twoHopRegion = null;
    for (const n of neighbors) {
      for (const n2 of game.map.regions[n].neighbors) {
        if (getRegionVisibility(game, 0, n2) === 'FOGGED') {
          twoHopRegion = n2;
          break;
        }
      }
      if (twoHopRegion !== null) break;
    }

    if (twoHopRegion !== null) {
      expect(getRegionVisibility(game, 0, twoHopRegion)).toBe('FOGGED');

      // With watchtower on p0Region, twoHopRegion becomes BORDER (2-hop reconnaissance)
      game.players[0].treasury = 50;
      const gameWithTower = applyAction(game, { type: 'BUILD', regionId: p0Region, building: 'WATCHTOWER' });
      expect(getRegionVisibility(gameWithTower, 0, twoHopRegion)).toBe('BORDER');
    }
  });

  it('razes fortification when enemy conquers the province', () => {
    const game = createGame({ seed: 12345, regionCount: 16 });
    const p0Region = game.regionState.findIndex((r) => r.owner === 0);
    game.regionState[p0Region].building = 'FORT';
    game.regionState[p0Region].troops = 2;

    // Find an enemy neighbor to attack p0Region
    const neighborId = game.map.regions[p0Region].neighbors[0];
    const enemyOwner = 1;
    game.regionState[neighborId].owner = enemyOwner;
    game.regionState[neighborId].troops = 20;
    game.regionState[neighborId].exhaustedTroops = 0;
    game.activePlayer = enemyOwner;

    const conquestGame = applyAction(game, {
      type: 'MOVE',
      from: neighborId,
      to: p0Region,
      count: 18,
    });

    expect(conquestGame.regionState[p0Region].owner).toBe(enemyOwner);
    expect(conquestGame.regionState[p0Region].building).toBeUndefined();
  });
});
