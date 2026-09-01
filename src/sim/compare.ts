/**
 * Faza S decision gate — runs the SAME games under both turn models and prints the
 * comparison against the thresholds written down in IMPLEMENTATION_PLAN.md before the
 * numbers were known.
 */
import { runSimulation, TurnModel, SimStats } from './engine';

// Seat-spread is a max-min-of-4-proportions statistic and converges far slower than
// conquest/turn/churn (measured: stable at N>=2500, still drifting at N=500-1000). See
// BALANCE.md "KRİTİK DÜZƏLİŞ" for the convergence table that justifies this.
const GAMES = 2500;

const TARGET_SEAT_SPREAD = 6; // percentage points
const TARGET_CONQUEST = 40; // %
const TARGET_CHURN = 120;

function seatSpread(stats: SimStats): number {
  const pct = [0, 1, 2, 3].map((i) => ((stats.winsByPlayer[i] || 0) / stats.totalGames) * 100);
  return Math.round((Math.max(...pct) - Math.min(...pct)) * 10) / 10;
}

function seatLine(stats: SimStats): string {
  return [0, 1, 2, 3]
    .map((i) => Math.round(((stats.winsByPlayer[i] || 0) / stats.totalGames) * 100) + '%')
    .join(' / ');
}

function row(label: string, seq: string, sim: string): string {
  return `${label.padEnd(30)}${seq.padStart(16)}${sim.padStart(18)}`;
}

const results: Record<TurnModel, SimStats> = {
  sequential: runSimulation(GAMES, 24, 'sequential'),
  simultaneous: runSimulation(GAMES, 24, 'simultaneous'),
};

const seq = results.sequential;
const sim = results.simultaneous;

const seqConquest = Math.round((seq.earlyConquests / seq.totalGames) * 100);
const simConquest = Math.round((sim.earlyConquests / sim.totalGames) * 100);
const seqSpread = seatSpread(seq);
const simSpread = seatSpread(sim);

console.log(`\n${'='.repeat(64)}`);
console.log(`FAZA S — QƏRAR QAPISI  (${GAMES} partiya, eyni seed-lər)`);
console.log(`${'='.repeat(64)}`);
console.log(row('', 'ARDICIL', 'SIMULTANEOUS'));
console.log('-'.repeat(64));
console.log(row('Fəthlə bitmə %', String(seqConquest), String(simConquest)));
console.log(row('Orta uzunluq (turn)', String(seq.averageTurns), String(sim.averageTurns)));
console.log(row('Qərarlı partiya (turn)', String(seq.averageTurnsDecisive), String(sim.averageTurnsDecisive)));
console.log(row('Churn', String(seq.averageOwnershipFlips), String(sim.averageOwnershipFlips)));
console.log(row('Liderin son payı %', String(Math.round(seq.averageLeaderShare * 100)), String(Math.round(sim.averageLeaderShare * 100))));
console.log(row('Eliminasiya / 3', String(seq.averageEliminations), String(sim.averageEliminations)));
console.log(row('Oturacaq paylanması', seatLine(seq), seatLine(sim)));
console.log(row('Oturacaq fərqi (bənd)', String(seqSpread), String(simSpread)));
console.log('-'.repeat(64));

const checks: [string, boolean, string][] = [
  ['Oturacaq fərqi < 6 bənd', simSpread < TARGET_SEAT_SPREAD, `${simSpread} (ardıcıl: ${seqSpread})`],
  ['Fəthlə bitmə >= 40%', simConquest >= TARGET_CONQUEST, `${simConquest}%`],
  ['Churn < 120', sim.averageOwnershipFlips < TARGET_CHURN, String(sim.averageOwnershipFlips)],
];

console.log('\nQƏRAR QAPISI (hədlər əvvəlcədən yazılıb):');
let passed = 0;
for (const [label, ok, value] of checks) {
  if (ok) passed++;
  console.log(`  ${ok ? '✅' : '❌'} ${label.padEnd(30)} → ${value}`);
}
console.log(`\n  Keçilən: ${passed}/3 ölçülə bilən hədd`);
console.log(`  4-cü hədd (oynanış hissi) yalnız oynanıla bilən prototiplə yoxlanır.`);
console.log(`${'='.repeat(64)}\n`);
