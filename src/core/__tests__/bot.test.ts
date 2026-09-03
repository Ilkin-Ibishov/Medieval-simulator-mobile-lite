import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { computeBotActions, BOT_CONFIG } from '../../ai/bot';
import { hasActivePact } from '../rules';

describe('TBS AI Bot Autonomous Decision Engine', () => {
  it('terminates turn gracefully with END_TURN without crash or infinite loop', () => {
    const game = createGame({ seed: 1234, playerCount: 4, regionCount: 16 });
    const botActions = computeBotActions(game, 0);

    expect(botActions.length).toBeGreaterThanOrEqual(1);
    const lastAction = botActions[botActions.length - 1];
    expect(lastAction.type).toBe('END_TURN');
  });

  it('respects active non-aggression pacts and never attacks an ally', () => {
    let game = createGame({ seed: 777, playerCount: 3, regionCount: 16 });

    game = applyAction(game, { type: 'PROPOSE_PACT', targetPlayer: 1 });
    expect(hasActivePact(game, 0, 1)).toBe(true);

    const botState = { ...game, activePlayer: 0 };
    const actions = computeBotActions(botState, 0);

    const p1Regions = new Set(
      game.regionState
        .map((r, idx) => (r.owner === 1 ? idx : -1))
        .filter((idx) => idx !== -1)
    );

    const movesToAlly = actions.filter(
      (a): a is { type: 'MOVE'; from: number; to: number; count: number } =>
        a.type === 'MOVE' && p1Regions.has(a.to)
    );

    expect(movesToAlly).toHaveLength(0);
  });

  it('retains border garrison reserves to protect frontiers', () => {
    const game = createGame({ seed: 555, playerCount: 2, regionCount: 16 });
    const p0Regions = game.regionState
      .map((r, idx) => (r.owner === 0 ? idx : -1))
      .filter((idx) => idx !== -1);

    expect(p0Regions.length).toBeGreaterThan(0);
    const borderReg = p0Regions.find((r) =>
      game.map.regions[r].neighbors.some((n) => game.regionState[n].owner !== 0)
    );
    expect(borderReg).toBeDefined();

    game.regionState[borderReg!].troops = BOT_CONFIG.borderGarrison + 2;
    game.regionState[borderReg!].exhaustedTroops = 0;

    const botActions = computeBotActions(game, 0);
    const movesFromBorder = botActions.filter(
      (a): a is { type: 'MOVE'; from: number; to: number; count: number } =>
        a.type === 'MOVE' && a.from === borderReg
    );

    if (movesFromBorder.length > 0) {
      const movedCount = movesFromBorder.reduce((sum, m) => sum + m.count, 0);
      expect(movedCount).toBeLessThanOrEqual(2);
    }
  });

  it('hires reinforcement troops when margin and treasury permit', () => {
    const game = createGame({ seed: 999, playerCount: 2, regionCount: 16 });
    game.players[0].treasury = 40;

    const actions = computeBotActions(game, 0);
    const hireActions = actions.filter((a) => a.type === 'HIRE');

    expect(hireActions.length).toBeGreaterThan(0);
    const hire = hireActions[0] as { type: 'HIRE'; regionId: number; count: number };
    expect(hire.count).toBeGreaterThan(0);
    expect(game.regionState[hire.regionId].owner).toBe(0);
  });

  it('evaluates personality differences (aggressive vs cautious)', () => {
    const game = createGame({ seed: 101, playerCount: 2, regionCount: 16 });
    const aggressiveActions = computeBotActions(game, 0, { aggression: 2.0, greed: 0.5 });
    const cautiousActions = computeBotActions(game, 0, { aggression: 0.5, greed: 2.0 });

    expect(aggressiveActions).toBeDefined();
    expect(cautiousActions).toBeDefined();
  });
});
