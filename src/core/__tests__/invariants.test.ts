import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { createGame, cloneGameState } from '../game';
import { RULES } from '../types';

describe('Project Non-Negotiable Architectural Invariants (I-1 to I-5)', () => {
  it('I-1 · Determinizm: src/core/ contains ZERO Math.random, Date.now, or setTimeout calls', () => {
    const coreDir = path.resolve(__dirname, '..');
    const files = fs.readdirSync(coreDir).filter((f) => f.endsWith('.ts') && !f.includes('.test.'));

    for (const file of files) {
      const code = fs.readFileSync(path.join(coreDir, file), 'utf8');

      expect(code.includes('Math.random('), `File ${file} contains Math.random!`).toBe(false);
      expect(code.includes('Date.now('), `File ${file} contains Date.now!`).toBe(false);
      expect(code.includes('new Date('), `File ${file} contains new Date!`).toBe(false);
      expect(code.includes('setTimeout('), `File ${file} contains setTimeout!`).toBe(false);
    }
  });

  it('I-2 · State Decoupling: cloneGameState produces completely independent deep copies', () => {
    const original = createGame({ seed: 42, playerCount: 3, regionCount: 16 });
    const cloned = cloneGameState(original);

    cloned.players[0].treasury = 9999;
    cloned.regionState[0].troops = 888;
    cloned.turn = 99;

    expect(original.players[0].treasury).not.toBe(9999);
    expect(original.regionState[0].troops).not.toBe(888);
    expect(original.turn).toBe(1);
  });

  it('I-3 · Balance Constants: RULES constants are strictly defined, positive and non-NaN', () => {
    expect(RULES.unitCost).toBeGreaterThan(0);
    expect(RULES.unitUpkeep).toBeGreaterThanOrEqual(0);
    expect(RULES.startingTreasury).toBeGreaterThan(0);
    expect(RULES.fortCost).toBeGreaterThan(0);
    expect(RULES.watchtowerCost).toBeGreaterThan(0);
    expect(RULES.pactCost).toBeGreaterThan(0);
    expect(RULES.pactDuration).toBeGreaterThan(0);
    expect(RULES.betrayalPenalty).toBeGreaterThan(0);
  });

  it('I-5 · Core Purity: src/core/ never imports from ui/, ai/, or sim/', () => {
    const coreDir = path.resolve(__dirname, '..');
    const files = fs.readdirSync(coreDir).filter((f) => f.endsWith('.ts') && !f.includes('.test.'));

    for (const file of files) {
      const code = fs.readFileSync(path.join(coreDir, file), 'utf8');

      expect(code.includes("from '../ui"), `File ${file} imports from ui!`).toBe(false);
      expect(code.includes("from '../ai"), `File ${file} imports from ai!`).toBe(false);
      expect(code.includes("from '../sim"), `File ${file} imports from sim!`).toBe(false);
      expect(code.includes("from './ui"), `File ${file} imports from ui!`).toBe(false);
      expect(code.includes("from './ai"), `File ${file} imports from ai!`).toBe(false);
    }
  });
});
