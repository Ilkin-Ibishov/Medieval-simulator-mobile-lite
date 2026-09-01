import { describe, it, expect } from 'vitest';
import { createGame } from '../game';
import { resolveRound } from '../round';

describe('Capital & Realm Collapse Mechanics', () => {
  it('assigns unique and valid starting capitals to all players', () => {
    const g = createGame({ seed: 42, playerCount: 4, regionCount: 24 });
    const capitals = g.players.map((p) => p.capital);

    // Each player has a defined capital
    expect(capitals).toHaveLength(4);
    for (let p = 0; p < 4; p++) {
      expect(capitals[p]).toBeGreaterThanOrEqual(0);
      expect(capitals[p]).toBeLessThan(24);
      expect(g.regionState[capitals[p]].owner).toBe(p);
      expect(g.players[p].capitalLostTurns).toBe(0);
    }

    // All capitals are distinct
    const unique = new Set(capitals);
    expect(unique.size).toBe(4);
  });

  it('increments capitalLostTurns when capital is occupied by an enemy', () => {
    let g = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const p1Cap = g.players[1].capital;

    // Simulate Player 0 conquering Player 1's capital
    g.regionState[p1Cap].owner = 0;
    g.regionState[p1Cap].troops = 5;

    // Resolve Round 1
    g = resolveRound(g, {
      0: [{ type: 'END_TURN' }],
      1: [{ type: 'END_TURN' }],
    });

    expect(g.players[1].capitalLostTurns).toBe(1);
    expect(g.players[1].isAlive).toBe(true);

    const warning = g.events.find((e) => e.playerId === 1 && e.description.includes('Paytaxt işğaldadır'));
    expect(warning).toBeDefined();
    expect(warning?.description).toContain('4 raund qaldı');
  });

  it('resets capitalLostTurns to 0 when capital is liberated before 5 turns', () => {
    let g = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const p1Cap = g.players[1].capital;

    // Player 1 lost capital 3 turns ago
    g.regionState[p1Cap].owner = 0;
    g.players[1].capitalLostTurns = 3;

    // Player 1 retakes it
    g.regionState[p1Cap].owner = 1;

    g = resolveRound(g, {
      0: [{ type: 'END_TURN' }],
      1: [{ type: 'END_TURN' }],
    });

    expect(g.players[1].capitalLostTurns).toBe(0);
    const restored = g.events.find((e) => e.playerId === 1 && e.description.includes('Paytaxt azad edildi'));
    expect(restored).toBeDefined();
  });

  it('collapses the realm into neutral territory if capital remains lost for 5 turns', () => {
    let g = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const p1Cap = g.players[1].capital;

    // Player 1 capital occupied for 4 turns already
    g.regionState[p1Cap].owner = 0;
    g.players[1].capitalLostTurns = 4;

    // Player 1 still owns some other non-capital region
    const otherRegion = g.regionState.findIndex((r, idx) => r.owner === 1 && idx !== p1Cap);
    expect(otherRegion).toBeGreaterThanOrEqual(0);

    g = resolveRound(g, {
      0: [{ type: 'END_TURN' }],
      1: [{ type: 'END_TURN' }],
    });

    // After turn 5 of occupation: Player 1 is eliminated and territories collapse
    expect(g.players[1].capitalLostTurns).toBe(5);
    expect(g.players[1].isAlive).toBe(false);

    // The other region owned by Player 1 should now be neutral (-1) with 1 troop
    expect(g.regionState[otherRegion].owner).toBe(-1);
    expect(g.regionState[otherRegion].troops).toBe(1);

    const elim = g.events.find((e) => e.playerId === 1 && e.type === 'ELIMINATION');
    expect(elim).toBeDefined();
    expect(elim?.description).toContain('taxtı çökdü');
  });
});
