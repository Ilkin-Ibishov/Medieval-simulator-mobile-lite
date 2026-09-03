import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { resolveRound } from '../round';
import { canProposePact, hasActivePact, getDiplomaticRelation, canSendTribute } from '../rules';
import { RULES } from '../types';

describe('Tactical Pacts & Lightweight Diplomacy System', () => {
  it('allows proposing and forming a 3-turn Non-Aggression Pact', () => {
    let g = createGame({ seed: 42, playerCount: 3, regionCount: 16 });
    expect(g.diplomacy).toBeDefined();

    // Check proposing pact between Player 0 and Player 1
    const check = canProposePact(g, 0, 1);
    expect(check.allowed).toBe(true);
    expect(check.acceptScore).toBeGreaterThan(0);

    // Player 0 proposes pact to Player 1
    const startTreasury = g.players[0].treasury;
    g = applyAction(g, { type: 'PROPOSE_PACT', targetPlayer: 1 });

    expect(g.players[0].treasury).toBe(startTreasury - RULES.pactCost);
    expect(hasActivePact(g, 0, 1)).toBe(true);
    expect(hasActivePact(g, 1, 0)).toBe(true); // Symmetric

    const rel = getDiplomaticRelation(g, 0, 1);
    expect(rel.status).toBe('PACT');
    expect(rel.pactTurnsRemaining).toBe(RULES.pactDuration);

    const formedEvent = g.events.find((e) => e.type === 'PACT_FORMED');
    expect(formedEvent).toBeDefined();
  });

  it('correctly transfers tribute between kingdoms', () => {
    let g = createGame({ seed: 100, playerCount: 2, regionCount: 16 });
    const p0Start = g.players[0].treasury;
    const p1Start = g.players[1].treasury;

    expect(canSendTribute(g, 0, 1).allowed).toBe(true);

    g = applyAction(g, { type: 'SEND_TRIBUTE', targetPlayer: 1 });
    expect(g.players[0].treasury).toBe(p0Start - RULES.tributeCost);
    expect(g.players[1].treasury).toBe(p1Start + RULES.tributeCost);

    const tributeEvent = g.events.find((e) => e.type === 'TRIBUTE_SENT');
    expect(tributeEvent).toBeDefined();
  });

  it('triggers betrayal penalties and cooldown when attacking an ally', () => {
    let g = createGame({ seed: 777, playerCount: 2, regionCount: 16 });
    g = applyAction(g, { type: 'PROPOSE_PACT', targetPlayer: 1 });
    expect(hasActivePact(g, 0, 1)).toBe(true);

    // Find border between Player 0 and Player 1
    let p0Reg = -1;
    let p1Reg = -1;
    for (let r = 0; r < g.regionState.length; r++) {
      if (g.regionState[r].owner === 0) {
        const neighbor = g.map.regions[r].neighbors.find((n) => g.regionState[n].owner === 1);
        if (neighbor !== undefined) {
          p0Reg = r;
          p1Reg = neighbor;
          break;
        }
      }
    }

    if (p0Reg >= 0 && p1Reg >= 0) {
      g.regionState[p0Reg].troops = 10;
      const preTreasury = g.players[0].treasury;

      // Player 0 attacks Player 1 (Treason!)
      g = applyAction(g, { type: 'MOVE', from: p0Reg, to: p1Reg, count: 5 });

      expect(hasActivePact(g, 0, 1)).toBe(false);
      const rel = getDiplomaticRelation(g, 0, 1);
      expect(rel.status).toBe('COOLDOWN');
      expect(rel.cooldownTurnsRemaining).toBe(RULES.pactCooldown * 2);
      expect(g.players[0].treasury).toBe(Math.max(0, preTreasury - RULES.betrayalPenalty));

      const treasonEvent = g.events.find((e) => e.type === 'PACT_BROKEN');
      expect(treasonEvent).toBeDefined();
    }
  });

  it('decrements pact duration each round and enters cooldown upon expiration', () => {
    let g = createGame({ seed: 1234, playerCount: 2, regionCount: 16 });
    g = applyAction(g, { type: 'PROPOSE_PACT', targetPlayer: 1 });
    expect(getDiplomaticRelation(g, 0, 1).pactTurnsRemaining).toBe(3);

    // Round 1 -> Round 2
    g = resolveRound(g, { 0: [], 1: [] });
    expect(getDiplomaticRelation(g, 0, 1).pactTurnsRemaining).toBe(2);

    // Round 2 -> Round 3
    g = resolveRound(g, { 0: [], 1: [] });
    expect(getDiplomaticRelation(g, 0, 1).pactTurnsRemaining).toBe(1);

    // Round 3 -> Round 4 (Expires!)
    g = resolveRound(g, { 0: [], 1: [] });
    const rel = getDiplomaticRelation(g, 0, 1);
    expect(rel.status).toBe('COOLDOWN');
    expect(rel.cooldownTurnsRemaining).toBe(RULES.pactCooldown);
    expect(hasActivePact(g, 0, 1)).toBe(false);

    const expiredEvent = g.events.find((e) => e.type === 'PACT_EXPIRED');
    expect(expiredEvent).toBeDefined();
  });
});
