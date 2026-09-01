/**
 * Balance parameter sweep.
 *
 * Runs the full AI-vs-AI simulation across a grid of RULES values and prints one row
 * per combination, so balance decisions are made from measurements instead of intuition.
 *
 * RULES is patched in place and restored afterwards. That is safe here because the sweep
 * is strictly sequential and single-threaded, and it keeps I-3 intact: every number still
 * has exactly one home (`RULES` in core/types.ts) — the sweep only asks "what if".
 */
import { RULES, BalanceRules } from '../core/types';
import { BOT_CONFIG } from '../ai/bot';
import { runSimulation } from './engine';

interface SweepCase {
  label: string;
  patch: Partial<BalanceRules>;
  botPatch?: Partial<typeof BOT_CONFIG>;
}

// NOTE: 200 games is fine for conquest%/turn/churn (stable by N=200) but NOT enough for
// any seat-spread comparison — that statistic needs N>=2500 to converge. See BALANCE.md.
const GAMES = 200;

// Targets from IMPLEMENTATION_PLAN.md Faza 3
const TARGET_CONQUEST_PCT = 40;
const TARGET_TURNS = 35;
const TARGET_CHURN = 120;

function buildCases(): SweepCase[] {
  const cases: SweepCase[] = [];
  for (const maxTurns of [34, 36, 38, 40]) {
    for (const attLoss of [0.2, 0.15]) {
      for (const garrison of [4, 5]) {
        cases.push({
          label: `max${maxTurns} aL${attLoss} g${garrison}`,
          patch: { maxTurns, attackerLossRatio: attLoss },
          botPatch: { borderGarrison: garrison },
        });
      }
    }
  }
  return cases;
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

const original: BalanceRules = { ...RULES };
const originalBot = { ...BOT_CONFIG };
const cases = buildCases();

console.log(`\n============================================================================`);
console.log(`BALANS SWEEP — ${cases.length} kombinasiya × ${GAMES} partiya`);
console.log(`Hədəf: fəth ≥${TARGET_CONQUEST_PCT}%  ·  turn ≤${TARGET_TURNS}  ·  churn <${TARGET_CHURN}`);
console.log(`============================================================================`);
console.log(
  `${pad('Kombinasiya', 32)}${padL('fəth%', 7)}${padL('turn', 7)}${padL('qərarlı', 9)}${padL('churn', 8)}${padL('lider%', 8)}${padL('elim', 6)}  `
);
console.log('-'.repeat(82));

interface Row {
  label: string;
  conquestPct: number;
  turns: number;
  churn: number;
  leaderPct: number;
  elim: number;
  passes: number;
}

const rows: Row[] = [];

for (const c of cases) {
  Object.assign(RULES, original, c.patch);
  Object.assign(BOT_CONFIG, originalBot, c.botPatch);
  const stats = runSimulation(GAMES);
  const conquestPct = Math.round((stats.earlyConquests / stats.totalGames) * 100);
  const leaderPct = Math.round(stats.averageLeaderShare * 100);
  const passes =
    (conquestPct >= TARGET_CONQUEST_PCT ? 1 : 0) +
    (stats.averageTurns <= TARGET_TURNS ? 1 : 0) +
    (stats.averageOwnershipFlips < TARGET_CHURN ? 1 : 0);

  const row: Row = {
    label: c.label,
    conquestPct,
    turns: stats.averageTurns,
    churn: stats.averageOwnershipFlips,
    leaderPct,
    elim: stats.averageEliminations,
    passes,
  };
  rows.push(row);

  const w = stats.winsByPlayer;
  const wd = [0, 1, 2, 3]
    .map((i) => Math.round(((w[i] || 0) / stats.totalGames) * 100) + '%')
    .join('/');
  const mark = (passes === 3 ? ' ✅' : passes === 2 ? ' 🟨' : '  ') + '  qalib: ' + wd;
  console.log(
    `${pad(c.label, 32)}${padL(String(conquestPct), 7)}${padL(String(stats.averageTurns), 7)}${padL(String(stats.averageTurnsDecisive), 9)}${padL(
      String(stats.averageOwnershipFlips),
      8
    )}${padL(String(leaderPct), 8)}${padL(String(stats.averageEliminations), 6)}${mark}`
  );
}

Object.assign(RULES, original);
Object.assign(BOT_CONFIG, originalBot);

console.log('-'.repeat(82));
const best = [...rows].sort(
  (a, b) => b.passes - a.passes || b.conquestPct - a.conquestPct || a.churn - b.churn
)[0];
console.log(`\nƏn yaxşı: ${best.label}`);
console.log(
  `  fəth ${best.conquestPct}%  ·  turn ${best.turns}  ·  churn ${best.churn}  ·  lider ${best.leaderPct}%  ·  elim ${best.elim}/3`
);
console.log(`  keçilən hədəf: ${best.passes}/3`);
console.log(`============================================================================\n`);
