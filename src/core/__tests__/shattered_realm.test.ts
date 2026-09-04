import { describe, it, expect } from 'vitest';
import { createGame, getDoziaMapData, applyAction, resolveRound } from '../index';
import { computeBotActions } from '../../ai/bot';
import { RULES } from '../types';

describe('Shattered Realm (Sındırılmış Dünya) Campaign Scenario', () => {
  it('correctly initializes shattered realm with exactly 9 player capitals and 105 neutral baronies', () => {
    const doziaMap = getDoziaMapData();
    const game = createGame({
      seed: 42424,
      mapData: doziaMap,
      scenario: 'SHATTERED',
      chosenKingdomId: 10, // Qin Guo
      fogOfWar: false,
    });

    expect(game.scenario).toBe('SHATTERED');
    expect(game.players.length).toBe(9);
    expect(game.regionState.length).toBe(114);

    // Count owned vs neutral regions
    let ownedCount = 0;
    let neutralCount = 0;
    const playerOwnedMap = new Map<number, number>();

    for (let i = 0; i < game.regionState.length; i++) {
      const rSt = game.regionState[i];
      if (rSt.owner === -1) {
        neutralCount++;
        expect(rSt.troops).toBe(2);
      } else {
        ownedCount++;
        playerOwnedMap.set(rSt.owner, (playerOwnedMap.get(rSt.owner) || 0) + 1);
        // Starting capital has starting troops + 3 (e.g. 5 + 3 = 8)
        expect(rSt.troops).toBe(RULES.startingTroops + 3);
      }
    }

    expect(ownedCount).toBe(9);
    expect(neutralCount).toBe(105);

    // Every player owns exactly 1 capital province
    for (let pIdx = 0; pIdx < 9; pIdx++) {
      expect(playerOwnedMap.get(pIdx)).toBe(1);
    }
  });

  it('allows human player to conquer adjacent neutral baronies', () => {
    const doziaMap = getDoziaMapData();
    const game = createGame({
      seed: 55555,
      mapData: doziaMap,
      scenario: 'SHATTERED',
      chosenKingdomId: 10, // Qin Guo
      fogOfWar: false,
    });

    // Player 0 capital
    const p0Capital = game.regionState.findIndex((r) => r.owner === 0);
    expect(p0Capital).toBeGreaterThanOrEqual(0);

    const neighbors = game.map.regions[p0Capital].neighbors;
    const neutralNeighbor = neighbors.find((n) => game.regionState[n].owner === -1);
    expect(neutralNeighbor).toBeDefined();

    // March 6 troops to conquer neutral barony (which has 2 troops)
    const afterMove = applyAction(game, {
      type: 'MOVE',
      from: p0Capital,
      to: neutralNeighbor!,
      count: 6,
    });

    expect(afterMove.regionState[neutralNeighbor!].owner).toBe(0);
    expect(afterMove.regionState[neutralNeighbor!].troops).toBeGreaterThanOrEqual(1);
  });

  it('guarantees AI bots actively expand and conquer neutral baronies in simultaneous rounds', () => {
    const doziaMap = getDoziaMapData();
    let current = createGame({
      seed: 99911,
      mapData: doziaMap,
      scenario: 'SHATTERED',
      chosenKingdomId: 10,
      fogOfWar: false,
    });

    // Run 3 simultaneous rounds where bots compute their actions
    for (let round = 1; round <= 3; round++) {
      const orders: Record<number, any[]> = { 0: [] };
      for (const p of current.players) {
        if (p.isAi && p.isAlive) {
          const view = { ...current, activePlayer: p.id };
          orders[p.id] = computeBotActions(view, p.id);
        }
      }
      current = resolveRound(current, orders);
    }

    // After 3 rounds, AI bots should have conquered multiple neutral provinces
    let totalBotProvinces = 0;
    for (const r of current.regionState) {
      if (r.owner > 0) {
        totalBotProvinces++;
      }
    }

    // 9 AI kingdoms initially owned 9 provinces. They should now own significantly more (> 12)
    expect(totalBotProvinces).toBeGreaterThan(12);
  });
});
