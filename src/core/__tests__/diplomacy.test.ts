import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../game';
import { resolveRound } from '../round';
import { canProposePact, hasActivePact, getDiplomaticRelation, canSendTribute } from '../rules';
import { RULES } from '../types';

describe('Tactical Pacts & Lightweight Diplomacy System', () => {
  it('allows proposing and forming a 3-turn Non-Aggression Pact', () => {
    let g = createGame({ seed: 42, playerCount: 3, regionCount: 16 });
    expect(g.diplomacy).toBeDefined();

    const check = canProposePact(g, 0, 1);
    expect(check.allowed).toBe(true);
    expect(check.acceptScore).toBeGreaterThan(0);

    const startTreasury = g.players[0].treasury;
    g = applyAction(g, { type: 'PROPOSE_PACT', targetPlayer: 1 });

    expect(g.players[0].treasury).toBe(startTreasury - RULES.pactCost);
    expect(hasActivePact(g, 0, 1)).toBe(true);
    expect(hasActivePact(g, 1, 0)).toBe(true);

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

    // Explicitly configure two adjacent provinces for Player 0 and Player 1
    const p0Reg = 0;
    const p1Reg = g.map.regions[p0Reg].neighbors[0];
    expect(p1Reg).toBeDefined();

    g.regionState[p0Reg].owner = 0;
    g.regionState[p0Reg].troops = 10;
    g.regionState[p0Reg].exhaustedTroops = 0;

    g.regionState[p1Reg].owner = 1;
    g.regionState[p1Reg].troops = 2;

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

  it('strictly forbids proposing pact to self or to eliminated players', () => {
    const g = createGame({ seed: 42, playerCount: 3, regionCount: 16 });

    // Proposing to self
    expect(canProposePact(g, 0, 0).allowed).toBe(false);

    // Proposing to eliminated player
    g.players[2].isAlive = false;
    expect(canProposePact(g, 0, 2).allowed).toBe(false);
  });

  it('forbids proposing a pact during active cooldown or while active pact is in place', () => {
    let g = createGame({ seed: 42, playerCount: 2, regionCount: 16 });
    g = applyAction(g, { type: 'PROPOSE_PACT', targetPlayer: 1 });

    // Cannot propose another pact while pact is active
    expect(canProposePact(g, 0, 1).allowed).toBe(false);

    // Fast-forward to cooldown
    g = resolveRound(g, { 0: [], 1: [] });
    g = resolveRound(g, { 0: [], 1: [] });
    g = resolveRound(g, { 0: [], 1: [] }); // now COOLDOWN

    expect(getDiplomaticRelation(g, 0, 1).status).toBe('COOLDOWN');
    expect(canProposePact(g, 0, 1).allowed).toBe(false);
  });

  it('strictly forbids sending tribute to self or dead player', () => {
    const g = createGame({ seed: 42, playerCount: 3, regionCount: 16 });
    expect(canSendTribute(g, 0, 0).allowed).toBe(false);

    g.players[2].isAlive = false;
    expect(canSendTribute(g, 0, 2).allowed).toBe(false);
  });
});

