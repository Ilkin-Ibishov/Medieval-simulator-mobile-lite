import { describe, it, expect } from 'vitest';
import { createGame } from '../game';
import { resolveRound, RoundOrders } from '../round';
import { previewCombat } from '../rules';
import { GameState, RULES } from '../types';

/**
 * Builds a small deterministic scenario by overwriting region ownership directly.
 * `layout` maps regionId -> [owner, troops].
 */
function scenario(layout: Record<number, [number, number]>, playerCount = 2): GameState {
  const g = createGame({ seed: 4242, playerCount, regionCount: 16, humanCount: 0 });
  for (let i = 0; i < g.regionState.length; i++) {
    g.regionState[i] = { owner: -1, troops: 0, exhaustedTroops: 0 };
  }
  for (const key of Object.keys(layout)) {
    const id = Number(key);
    const [owner, troops] = layout[id];
    g.regionState[id] = { owner, troops, exhaustedTroops: 0 };
  }
  return g;
}

/** Finds an ordered pair of regions that actually share a border. */
function findEdge(g: GameState): [number, number] {
  for (const r of g.map.regions) {
    if (r.neighbors.length > 0) return [r.id, r.neighbors[0]];
  }
  throw new Error('map has no edges');
}

describe('Simultaneous round adjudication', () => {
  it('R1: departures happen before arrivals — two armies marching past each other swap provinces', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);
    const g = scenario({ [a]: [0, 5], [b]: [1, 5] });

    const orders: RoundOrders = {
      0: [{ type: 'MOVE', from: a, to: b, count: 5 }],
      1: [{ type: 'MOVE', from: b, to: a, count: 5 }],
    };

    const next = resolveRound(g, orders);

    // Both provinces were empty on arrival, so both marches succeeded.
    expect(next.regionState[b].owner).toBe(0);
    expect(next.regionState[a].owner).toBe(1);
    expect(next.regionState[b].troops).toBe(5);
    expect(next.regionState[a].troops).toBe(5);
  });

  it('R2: one player attacking from two provinces fights as a single merged army', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    // find a region with at least two neighbours
    const target = g0.map.regions.find((r) => r.neighbors.length >= 2)!;
    const [s1, s2] = target.neighbors;

    const g = scenario({ [target.id]: [1, 6], [s1]: [0, 5], [s2]: [0, 5] });

    // 5 alone loses (needs > 6 * 1.5 = 9). Merged 10 wins.
    expect(previewCombat(5, 6).willWin).toBe(false);
    expect(previewCombat(10, 6).willWin).toBe(true);

    const next = resolveRound(g, {
      0: [
        { type: 'MOVE', from: s1, to: target.id, count: 5 },
        { type: 'MOVE', from: s2, to: target.id, count: 5 },
      ],
      1: [],
    });

    expect(next.regionState[target.id].owner).toBe(0);
  });

  it('R3: the owner\'s own arrivals reinforce the defence', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const target = g0.map.regions.find((r) => r.neighbors.length >= 2)!;
    const [ally, foe] = target.neighbors;

    const g = scenario({ [target.id]: [1, 1], [ally]: [1, 8], [foe]: [0, 6] });

    // Without help: 6 vs 1 -> attacker wins. With 8 reinforcing: 6 vs 9 -> repelled.
    expect(previewCombat(6, 1).willWin).toBe(true);
    expect(previewCombat(6, 9).willWin).toBe(false);

    const next = resolveRound(g, {
      0: [{ type: 'MOVE', from: foe, to: target.id, count: 6 }],
      1: [{ type: 'MOVE', from: ally, to: target.id, count: 8 }],
    });

    expect(next.regionState[target.id].owner).toBe(1);
  });

  it('R4: with three-way contention the strongest force takes the province', () => {
    const g0 = createGame({ seed: 4242, playerCount: 3, regionCount: 16, humanCount: 0 });
    const target = g0.map.regions.find((r) => r.neighbors.length >= 2)!;
    const [s1, s2] = target.neighbors;

    const g = scenario({ [target.id]: [-1, 0], [s1]: [0, 5], [s2]: [1, 9] }, 3);

    const next = resolveRound(g, {
      0: [{ type: 'MOVE', from: s1, to: target.id, count: 5 }],
      1: [{ type: 'MOVE', from: s2, to: target.id, count: 9 }],
      2: [],
    });

    expect(next.regionState[target.id].owner).toBe(1);
    // The winner also paid for beating the rival army, not just the (empty) garrison.
    const losses = Math.round(5 * RULES.attackerLossRatio);
    expect(next.regionState[target.id].troops).toBe(9 - losses);
  });

  it('reduces exactly to previewCombat when a single attacker faces a defender', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);

    for (const [att, def] of [
      [10, 3],
      [4, 6],
      [12, 7],
      [2, 1],
    ]) {
      const g = scenario({ [a]: [0, att], [b]: [1, def] });
      const expected = previewCombat(att, def);
      const next = resolveRound(g, { 0: [{ type: 'MOVE', from: a, to: b, count: att }], 1: [] });

      if (expected.willWin) {
        expect(next.regionState[b].owner).toBe(0);
        expect(next.regionState[b].troops).toBe(expected.attackerSurviving);
      } else {
        expect(next.regionState[b].owner).toBe(1);
        expect(next.regionState[b].troops).toBe(expected.defenderSurviving);
      }
    }
  });

  it('newly hired troops defend but cannot march in the same round', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);
    const g = scenario({ [a]: [0, 2], [b]: [1, 1] });
    g.players[0].treasury = 100;

    const next = resolveRound(g, {
      0: [
        { type: 'HIRE', regionId: a, count: 5 },
        // Ordering 7 out, but only 2 were present when the round began.
        { type: 'MOVE', from: a, to: b, count: 7 },
      ],
      1: [],
    });

    // Only the 2 round-start troops marched; the 5 hired stayed behind.
    expect(next.regionState[a].troops).toBe(5);
  });

  it('is deterministic — same state and orders always give the same result', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);
    const g = scenario({ [a]: [0, 9], [b]: [1, 4] });
    const orders: RoundOrders = { 0: [{ type: 'MOVE', from: a, to: b, count: 9 }], 1: [] };

    expect(resolveRound(g, orders).regionState).toEqual(resolveRound(g, orders).regionState);
  });

  it('R4: ties between equal-strength attackers resolve deterministically without hardcoded player ID bias', () => {
    const g0 = createGame({ seed: 4242, playerCount: 3, regionCount: 16, humanCount: 0 });
    const target = g0.map.regions.find((r) => r.neighbors.length >= 2)!;
    const [s1, s2] = target.neighbors;

    const g = scenario({ [target.id]: [-1, 0], [s1]: [0, 5], [s2]: [1, 5] }, 3);
    const orders: RoundOrders = {
      0: [{ type: 'MOVE', from: s1, to: target.id, count: 5 }],
      1: [{ type: 'MOVE', from: s2, to: target.id, count: 5 }],
      2: [],
    };

    const res1 = resolveRound(g, orders);
    const res2 = resolveRound(g, orders);

    expect(res1.regionState[target.id].owner).toBeGreaterThanOrEqual(0);
    expect(res1.regionState[target.id].owner).toBe(res2.regionState[target.id].owner);
    expect(res1.regionState[target.id].troops).toBe(res2.regionState[target.id].troops);
  });

  it('respects fortification defense bonus during simultaneous round combat', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);

    // Defender at b has 3 troops + FORT = (3 + 2) * 1.5 = 7.5 defense power
    // Attacker at a attacks with 7 troops (7 <= 7.5 -> Defeat)
    const g = scenario({ [a]: [0, 7], [b]: [1, 3] });
    g.regionState[b].building = 'FORT';

    const next = resolveRound(g, {
      0: [{ type: 'MOVE', from: a, to: b, count: 7 }],
      1: [],
    });

    // Defender holds because fort provided +2 defense power!
    expect(next.regionState[b].owner).toBe(1);
    expect(next.regionState[b].building).toBe('FORT');
  });

  it('processes Phase 1 BUILD actions before Phase 2 troop movements', () => {
    const g0 = createGame({ seed: 4242, playerCount: 2, regionCount: 16, humanCount: 0 });
    const [a, b] = findEdge(g0);
    const g = scenario({ [a]: [0, 8], [b]: [1, 3] });
    g.players[1].treasury = 50;

    // Player 1 builds FORT in phase 1, Player 0 attacks in phase 2 with 7 troops
    const next = resolveRound(g, {
      0: [{ type: 'MOVE', from: a, to: b, count: 7 }],
      1: [{ type: 'BUILD', regionId: b, building: 'FORT' }],
    });

    // Fort was constructed before combat occurred, saving the province!
    expect(next.regionState[b].owner).toBe(1);
    expect(next.regionState[b].building).toBe('FORT');
    const netGold = RULES.regionBaseIncome - next.regionState[b].troops * RULES.unitUpkeep;
    expect(next.players[1].treasury).toBe(50 - RULES.fortCost + netGold);
  });
});

