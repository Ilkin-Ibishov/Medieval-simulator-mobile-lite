import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { computeBotActions } from '../../ai/bot';

describe('Deterministic Simulation Parity', () => {
  it('generates 100% identical games with the same seed', () => {
    const gameA = createGame({ seed: 777, playerCount: 4, regionCount: 20 });
    const gameB = createGame({ seed: 777, playerCount: 4, regionCount: 20 });

    expect(gameA.map.regions).toEqual(gameB.map.regions);
    expect(gameA.regionState).toEqual(gameB.regionState);
    expect(gameA.players).toEqual(gameB.players);
  });

  it('runs identical bot trajectories for identical seeds', () => {
    let gA = createGame({ seed: 999, playerCount: 4, regionCount: 16, humanCount: 0 });
    let gB = createGame({ seed: 999, playerCount: 4, regionCount: 16, humanCount: 0 });

    for (let step = 0; step < 15; step++) {
      if (gA.isOver) break;
      const actionsA = computeBotActions(gA, gA.activePlayer);
      const actionsB = computeBotActions(gB, gB.activePlayer);

      expect(actionsA).toEqual(actionsB);

      for (const act of actionsA) {
        gA = applyAction(gA, act);
      }
      for (const act of actionsB) {
        gB = applyAction(gB, act);
      }

      expect(gA.turn).toBe(gB.turn);
      expect(gA.activePlayer).toBe(gB.activePlayer);
      expect(gA.regionState).toEqual(gB.regionState);
    }
  });
});
