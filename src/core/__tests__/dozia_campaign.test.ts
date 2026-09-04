import { describe, it, expect } from 'vitest';
import { createGame, getDoziaMapData, resolveRound, RoundOrders, RULES } from '../index';
import { computeBotActions } from '../../ai/bot';
import { calculatePlayerIncome, calculatePlayerUpkeep } from '../rules';

describe('Dozia Grand Campaign Mode', () => {
  it('loads Dozia master map with 97 consolidated provinces and 9 kingdoms', () => {
    const map = getDoziaMapData();
    expect(map.regions.length).toBe(97);
    expect(map.width).toBe(1536);
    expect(map.height).toBe(730);

    // Every province has valid neighbors, center, and income
    for (const r of map.regions) {
      expect(r.center[0]).toBeGreaterThan(0);
      expect(r.center[1]).toBeGreaterThan(0);
      expect(r.neighbors.length).toBeGreaterThan(0);
      expect(r.income).toBeGreaterThan(0);
      expect(r.svgPath).toBeDefined();
    }
  });

  it('initializes authentic 9-kingdom campaign with human player and AI bots', () => {
    const map = getDoziaMapData();
    const game = createGame({
      seed: 4242,
      mapData: map,
      chosenKingdomId: 1, // Tamcauyenia
      maxTurns: 60,
      humanCount: 1,
    });

    expect(game.players.length).toBe(9);
    expect(game.regionState.length).toBe(97);

    // Player 0 (chosen kingdom) is human
    expect(game.players[0].isAi).toBe(false);
    expect(game.players[0].name).toContain('(Sən)');

    // Other 8 players are AI
    for (let i = 1; i < 9; i++) {
      expect(game.players[i].isAi).toBe(true);
      expect(game.players[i].isAlive).toBe(true);
      expect(game.players[i].treasury).toBe(RULES.startingTreasury);
    }

    // Every province is owned by one of the 9 kingdoms
    for (let i = 0; i < game.regionState.length; i++) {
      const owner = game.regionState[i].owner;
      expect(owner).toBeGreaterThanOrEqual(0);
      expect(owner).toBeLessThan(9);
      expect(game.regionState[i].troops).toBeGreaterThanOrEqual(4);
    }

    // Income calculation works
    const income = calculatePlayerIncome(game, 0);
    const upkeep = calculatePlayerUpkeep(game, 0);
    expect(income).toBeGreaterThan(0);
    expect(upkeep).toBeGreaterThan(0);
  });

  it('allows bots and human to simulate 5 consecutive rounds without errors', () => {
    const map = getDoziaMapData();
    let game = createGame({
      seed: 12345,
      mapData: map,
      chosenKingdomId: 1,
      maxTurns: 60,
      humanCount: 1,
    });

    for (let round = 1; round <= 5; round++) {
      const orders: RoundOrders = {};

      for (let pIdx = 0; pIdx < game.players.length; pIdx++) {
        if (!game.players[pIdx].isAlive) continue;
        const playerState = { ...game, activePlayer: pIdx };
        const botActions = computeBotActions(playerState, pIdx);
        orders[pIdx] = botActions;
      }

      game = resolveRound(game, orders);
      expect(game.turn).toBe(round + 1);
    }

    expect(game.turn).toBe(6);
  });
});
