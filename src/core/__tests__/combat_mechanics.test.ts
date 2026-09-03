import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { previewCombat, canApplyAction, getReadyTroops } from '../rules';
import { RULES } from '../types';

describe('Combat Mechanics & Tactical Resolution', () => {
  it('strictly validates mathematical combat outcomes', () => {
    // Standard combat: defenderPower = 4 * 1.5 = 6
    // Attacker with 7 > 6 -> Victory
    const win = previewCombat(7, 4);
    expect(win.willWin).toBe(true);
    expect(win.defenderLosses).toBe(4);
    expect(win.defenderSurviving).toBe(0);
    expect(win.attackerLosses).toBe(Math.round(4 * RULES.attackerLossRatio));
    expect(win.attackerSurviving).toBe(7 - win.attackerLosses);

    // Attacker with 6 <= 6 -> Defeat
    const loss = previewCombat(6, 4);
    expect(loss.willWin).toBe(false);
    expect(loss.attackerLosses).toBe(6);
    expect(loss.defenderLosses).toBe(Math.min(4, Math.round(6 * RULES.defenderLossRatio)));
    expect(loss.defenderSurviving).toBe(Math.max(1, 4 - loss.defenderLosses));
  });

  it('verifies fort bonus increases effective defender troops by fortDefenseBonus (+2)', () => {
    // 3 defenders with Fort = (3 + 2) * 1.5 = 7.5 defense power
    const withoutFort = previewCombat(7, 3, { hasFort: false });
    const withFort = previewCombat(7, 3, { hasFort: true });

    expect(withoutFort.willWin).toBe(true);  // 7 > 3 * 1.5 (4.5) -> Win
    expect(withFort.willWin).toBe(false);   // 7 <= (3 + 2) * 1.5 (7.5) -> Loss
  });

  it('disallows moving troops to non-adjacent regions', () => {
    const game = createGame({ seed: 50, playerCount: 2, regionCount: 16 });
    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);
    expect(p0Reg).toBeGreaterThanOrEqual(0);

    const neighbors = new Set(game.map.regions[p0Reg].neighbors);
    let nonNeighbor = -1;
    for (let i = 0; i < game.map.regions.length; i++) {
      if (i !== p0Reg && !neighbors.has(i)) {
        nonNeighbor = i;
        break;
      }
    }

    expect(nonNeighbor).toBeGreaterThanOrEqual(0);
    const canJump = canApplyAction(game, { type: 'MOVE', from: p0Reg, to: nonNeighbor, count: 1 }, 0);
    expect(canJump).toBe(false);
  });

  it('disallows moving 0 or negative troops', () => {
    const game = createGame({ seed: 50, playerCount: 2, regionCount: 16 });
    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);
    const neighbor = game.map.regions[p0Reg].neighbors[0];

    expect(canApplyAction(game, { type: 'MOVE', from: p0Reg, to: neighbor, count: 0 }, 0)).toBe(false);
    expect(canApplyAction(game, { type: 'MOVE', from: p0Reg, to: neighbor, count: -5 }, 0)).toBe(false);
  });

  it('marks moved troops as exhausted to prevent infinite daisy-chain marching in a single turn', () => {
    let game = createGame({ seed: 777, playerCount: 2, regionCount: 16 });
    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);
    const friendlyNeighbor = game.map.regions[p0Reg].neighbors.find(
      (n) => game.regionState[n].owner === 0
    );

    expect(friendlyNeighbor).toBeDefined();

    game.regionState[p0Reg].troops = 8;
    game.regionState[p0Reg].exhaustedTroops = 0;

    game = applyAction(game, {
      type: 'MOVE',
      from: p0Reg,
      to: friendlyNeighbor!,
      count: 6,
    });

    expect(game.regionState[friendlyNeighbor!].exhaustedTroops).toBeGreaterThanOrEqual(6);

    const ready = getReadyTroops(game, friendlyNeighbor!);
    const total = game.regionState[friendlyNeighbor!].troops;
    expect(ready).toBe(total - game.regionState[friendlyNeighbor!].exhaustedTroops);
  });
});
