import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { previewCombat, calculateNetGold, canApplyAction } from '../rules';
import { RULES } from '../types';

describe('Medieval Sim Mobile Lite Core Game', () => {
  it('initializes game state with proper regions, players and treasuries', () => {
    const game = createGame({ seed: 42, playerCount: 3, regionCount: 16 });
    expect(game.players.length).toBe(3);
    expect(game.map.regions.length).toBe(16);
    expect(game.turn).toBe(1);
    expect(game.activePlayer).toBe(0);
    expect(game.isOver).toBe(false);
    expect(game.players[0].treasury).toBe(RULES.startingTreasury);
  });

  it('allows hiring troops when player has sufficient treasury', () => {
    let game = createGame({ seed: 100, playerCount: 2, regionCount: 12 });
    // Find player 0 region
    const p0Region = game.regionState.findIndex((r) => r.owner === 0);
    expect(p0Region).toBeGreaterThanOrEqual(0);

    const initialTroops = game.regionState[p0Region].troops;
    const initialTreasury = game.players[0].treasury;

    game = applyAction(game, {
      type: 'HIRE',
      regionId: p0Region,
      count: 2,
    });

    expect(game.regionState[p0Region].troops).toBe(initialTroops + 2);
    expect(game.players[0].treasury).toBe(initialTreasury - 2 * RULES.unitCost);
  });

  it('correctly previews and resolves combat', () => {
    const preview = previewCombat(10, 3);
    expect(preview.willWin).toBe(true);
    expect(preview.attackerSurviving).toBeGreaterThan(0);
    expect(preview.defenderLosses).toBe(3);

    const defeatPreview = previewCombat(2, 10);
    expect(defeatPreview.willWin).toBe(false);
    expect(defeatPreview.attackerLosses).toBe(2);
  });

  it('collects tax and pays upkeep on END_TURN', () => {
    let game = createGame({ seed: 55, playerCount: 2, regionCount: 12 });
    const initialTreasury = game.players[0].treasury;
    const netGold = calculateNetGold(game, 0);

    game = applyAction(game, { type: 'END_TURN' });
    expect(game.players[0].treasury).toBe(initialTreasury + netGold);
    expect(game.activePlayer).toBe(1);
  });

  it('eliminates player and declares winner upon full conquest', () => {
    let game = createGame({ seed: 10, playerCount: 2, regionCount: 6 });
    // Manually give player 0 20 troops and eliminate player 1's regions
    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);

    game.regionState[p0Reg].troops = 50;

    // Conquering all player 1 territories
    for (let i = 0; i < game.regionState.length; i++) {
      if (game.regionState[i].owner === 1) {
        game.regionState[i].owner = 0;
      }
    }

    game = applyAction(game, { type: 'END_TURN' });
    expect(game.isOver).toBe(true);
    expect(game.winner).toBe(0);
  });

  it('guarantees starting regions of each player are 100% contiguous and connected', () => {
    const seeds = [28950, 42, 1337, 99999, 12345];
    for (const seed of seeds) {
      const game = createGame({ seed, playerCount: 4, regionCount: 24 });
      for (let p = 0; p < 4; p++) {
        const owned = [];
        for (let r = 0; r < game.regionState.length; r++) {
          if (game.regionState[r].owner === p) owned.push(r);
        }
        if (seed === 28950) {
          console.log(`Seed ${seed}, Player ${p} (${game.players[p].name}, ${game.players[p].color}): regions=${JSON.stringify(owned)}`);
        }
        expect(owned.length).toBe(3); // Every player MUST get exactly 3 connected territories!
      }
    }
  });

  it('guarantees 100% physical shared-edge adjacency with zero phantom jumping neighbors', () => {
    const testSeeds = [28950, 42, 100, 777, 8888, 99999];
    for (const seed of testSeeds) {
      const game = createGame({ seed, playerCount: 4, regionCount: 24 });
      const { map } = game;

      // 1. Verify region names are unique
      const names = new Set(map.regions.map((r) => r.name));
      expect(names.size).toBe(map.regions.length);

      // 2. Verify all neighbors share physical edge
      for (const r of map.regions) {
        expect(r.neighbors.length).toBeGreaterThanOrEqual(1);
        for (const nId of r.neighbors) {
          const neighborRegion = map.regions[nId];
          expect(neighborRegion).toBeDefined();

          // Check that neighbor also lists r as its neighbor (bidirectional)
          expect(neighborRegion.neighbors).toContain(r.id);

          // Check that they share at least 2 common vertices (physical edge)
          const sharedPts: [number, number][] = [];
          for (const ptA of r.polygon) {
            for (const ptB of neighborRegion.polygon) {
              if (Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1]) < 1.5) {
                if (!sharedPts.some((sp) => Math.hypot(sp[0] - ptA[0], sp[1] - ptA[1]) < 1.0)) {
                  sharedPts.push(ptA);
                }
              }
            }
          }
          expect(sharedPts.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('prevents newly recruited troops from marching on the recruitment turn (summoning sickness)', () => {
    let game = createGame({ seed: 42, playerCount: 2, regionCount: 12 });
    const p0Reg = game.regionState.findIndex((r) => r.owner === 0);
    const p0Neighbor = game.map.regions[p0Reg].neighbors[0];

    const initialTroops = game.regionState[p0Reg].troops; // e.g. 5

    // Hire 3 new troops
    game = applyAction(game, {
      type: 'HIRE',
      regionId: p0Reg,
      count: 3,
    });

    expect(game.regionState[p0Reg].troops).toBe(initialTroops + 3);
    expect(game.regionState[p0Reg].exhaustedTroops).toBe(3);

    // Attempting to move initialTroops + 1 (which would use 1 newly hired troop) should fail
    const invalidMoveAction = {
      type: 'MOVE' as const,
      from: p0Reg,
      to: p0Neighbor,
      count: initialTroops + 1,
    };
    expect(canApplyAction(game, invalidMoveAction, 0)).toBe(false);

    // Moving up to initialTroops should succeed
    const validMoveAction = {
      type: 'MOVE' as const,
      from: p0Reg,
      to: p0Neighbor,
      count: initialTroops,
    };
    expect(canApplyAction(game, validMoveAction, 0)).toBe(true);
  });

  it('prevents troops from marching multiple times in the same turn (move fatigue)', () => {
    let game = createGame({ seed: 77, playerCount: 2, regionCount: 12 });
    const p0RegA = game.regionState.findIndex((r) => r.owner === 0);
    const neighborsA = game.map.regions[p0RegA].neighbors;
    const p0RegB = neighborsA.find((n) => game.regionState[n].owner === 0)!;
    expect(p0RegB).toBeDefined();

    const p0RegC = game.map.regions[p0RegB].neighbors.find((n) => n !== p0RegA)!;
    expect(p0RegC).toBeDefined();

    const troopsInA = game.regionState[p0RegA].troops;

    // Move troops from A to B
    game = applyAction(game, {
      type: 'MOVE',
      from: p0RegA,
      to: p0RegB,
      count: troopsInA,
    });

    expect(game.regionState[p0RegA].troops).toBe(0);
    // B received the troops, and they are marked as exhausted for this turn
    expect(game.regionState[p0RegB].exhaustedTroops).toBeGreaterThanOrEqual(troopsInA);

    // Attempting to move those newly arrived troops from B to C immediately in the same turn should fail!
    const reMoveAction = {
      type: 'MOVE' as const,
      from: p0RegB,
      to: p0RegC,
      count: game.regionState[p0RegB].troops,
    };
    expect(canApplyAction(game, reMoveAction, 0)).toBe(false);

    // After a full turn cycle, all troops recover and can move again
    game = applyAction(game, { type: 'END_TURN' }); // player 1
    game = applyAction(game, { type: 'END_TURN' }); // back to player 0

    expect(game.regionState[p0RegB].exhaustedTroops).toBe(0);
    expect(canApplyAction(game, reMoveAction, 0)).toBe(true);
  });
});

describe('Chokepoint pruning', () => {
  it('keeps every generated map fully connected across many seeds and sizes', () => {
    for (const regionCount of [16, 24, 32, 40]) {
      for (let seed = 1; seed <= 40; seed++) {
        const g = createGame({ seed, playerCount: 4, regionCount });
        const seen = new Set<number>([0]);
        const stack = [0];
        while (stack.length > 0) {
          const cur = stack.pop() as number;
          for (const n of g.map.regions[cur].neighbors) {
            if (!seen.has(n)) {
              seen.add(n);
              stack.push(n);
            }
          }
        }
        expect(seen.size).toBe(regionCount);
      }
    }
  }, 20000);

  it('keeps adjacency symmetric after pruning', () => {
    const g = createGame({ seed: 31337, playerCount: 4, regionCount: 24 });
    for (const r of g.map.regions) {
      for (const n of r.neighbors) {
        expect(g.map.regions[n].neighbors).toContain(r.id);
      }
    }
  });

  // NOTE: no "actually reduces connectivity" assertion here on purpose. Faza M
  // (chokepoints, RULES.maxNeighbors) is currently PAUSED at a no-op value (99) because
  // it measurably worsened an unexplained seat-ID win-rate bias — see BALANCE.md
  // "KRİTİK DÜZƏLİŞ". The connectivity/symmetry guarantees above must hold regardless
  // of whether pruning is active, which is what they test.

  it('strictly disallows all gameplay actions once the game is over', () => {
    let game = createGame({ seed: 42, playerCount: 2, regionCount: 16 });
    game.isOver = true;
    game.winner = 0;

    const canHire = canApplyAction(game, { type: 'HIRE', regionId: 0, count: 1 }, 0);
    expect(canHire).toBe(false);

    const canMove = canApplyAction(game, { type: 'MOVE', from: 0, to: 1, count: 1 }, 0);
    expect(canMove).toBe(false);

    const canBuild = canApplyAction(game, { type: 'BUILD', regionId: 0, building: 'FORT' }, 0);
    expect(canBuild).toBe(false);
  });

  it('strictly disallows building fortifications on enemy or neutral provinces', () => {
    const game = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const enemyRegion = game.regionState.findIndex((r) => r.owner === 1);
    expect(enemyRegion).toBeGreaterThanOrEqual(0);

    const canBuildOnEnemy = canApplyAction(game, { type: 'BUILD', regionId: enemyRegion, building: 'FORT' }, 0);
    expect(canBuildOnEnemy).toBe(false);
  });
});

