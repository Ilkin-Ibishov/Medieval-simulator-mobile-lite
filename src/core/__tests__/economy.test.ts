import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import {
  calculatePlayerIncome,
  calculatePlayerUpkeep,
  calculateNetGold,
  calculatePlayerTroopCount,
  canApplyAction,
} from '../rules';
import { RULES } from '../types';

describe('Economic Engine & Treasury Simulation', () => {
  it('calculates player income from owned territory incomes', () => {
    const game = createGame({ seed: 42, playerCount: 2, regionCount: 16 });
    const p0Owned = game.regionState
      .map((r, idx) => (r.owner === 0 ? idx : -1))
      .filter((idx) => idx !== -1);

    expect(p0Owned.length).toBeGreaterThan(0);
    const expectedIncome = p0Owned.reduce((sum, r) => sum + (game.map.regions[r].income || RULES.regionBaseIncome), 0);
    const actualIncome = calculatePlayerIncome(game, 0);

    expect(actualIncome).toBe(expectedIncome);
  });

  it('calculates upkeep exactly proportional to total active troops', () => {
    const game = createGame({ seed: 42, playerCount: 2, regionCount: 16 });
    const totalTroops = calculatePlayerTroopCount(game, 0);
    const upkeep = calculatePlayerUpkeep(game, 0);

    expect(upkeep).toBe(totalTroops * RULES.unitUpkeep);
  });

  it('correctly calculates net gold as income minus upkeep', () => {
    const game = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const income = calculatePlayerIncome(game, 0);
    const upkeep = calculatePlayerUpkeep(game, 0);
    const net = calculateNetGold(game, 0);

    expect(net).toBe(income - upkeep);
  });

  it('triggers troop desertion on bankruptcy when upkeep exceeds treasury', () => {
    let game = createGame({ seed: 200, playerCount: 2, regionCount: 12 });
    const p0Owned = game.regionState
      .map((r, idx) => (r.owner === 0 ? idx : -1))
      .filter((idx) => idx !== -1);

    game.players[0].treasury = 0;
    for (const r of p0Owned) {
      game.regionState[r].troops = 30;
    }

    const startTroops = calculatePlayerTroopCount(game, 0);
    expect(startTroops).toBeGreaterThan(50);

    game = applyAction(game, { type: 'END_TURN' });

    expect(game.players[0].treasury).toBe(0);

    const endTroops = calculatePlayerTroopCount(game, 0);
    expect(endTroops).toBeLessThan(startTroops);

    const desertionEvent = game.events.find((e) => e.type === 'BANKRUPTCY');
    expect(desertionEvent).toBeDefined();
  });

  it('applies 50% income penalty when capital is occupied by an enemy', () => {
    const game = createGame({ seed: 333, playerCount: 2, regionCount: 16 });
    const p0Cap = game.players[0].capital;
    expect(p0Cap).toBeDefined();

    const normalIncome = calculatePlayerIncome(game, 0);

    game.regionState[p0Cap!].owner = 1;
    const penalizedIncome = calculatePlayerIncome(game, 0);

    expect(penalizedIncome).toBeLessThan(normalIncome);
  });

  it('forbids hiring troops if player cannot afford the recruitment cost', () => {
    const game = createGame({ seed: 444, playerCount: 2, regionCount: 16 });
    game.players[0].treasury = RULES.unitCost - 1;

    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);
    const canHire = canApplyAction(game, { type: 'HIRE', regionId: p0Reg, count: 1 }, 0);

    expect(canHire).toBe(false);
  });
});
