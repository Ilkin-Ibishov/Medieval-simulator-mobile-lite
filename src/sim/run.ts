import { runSimulation } from './engine';

// Run if called directly
const args = process.argv.slice(2);
let gamesToRun = 200;
const gamesIdx = args.indexOf('--games');
if (gamesIdx >= 0 && args[gamesIdx + 1]) {
  gamesToRun = parseInt(args[gamesIdx + 1], 10) || 200;
}

console.log(`\n======================================================`);
console.log(`🏰 MEDIEVAL SIM MOBILE LITE — SIMULATION REPORT`);
console.log(`======================================================`);
console.log(`Qaçırılan partiya sayı: ${gamesToRun}`);

const stats = runSimulation(gamesToRun);

console.log(`Tamamlanan partiyalar: ${stats.completedGames} (${Math.round((stats.completedGames / stats.totalGames) * 100)}%)`);
console.log(`Erkən fəthlə bitən partiyalar (Total Domination): ${stats.earlyConquests} (${Math.round((stats.earlyConquests / stats.totalGames) * 100)}%)`);
console.log(`Maksimum turn həlli ilə bitən partiyalar: ${stats.maxTurnResolutions} (${Math.round((stats.maxTurnResolutions / stats.totalGames) * 100)}%)`);
console.log(`Orta partiya uzunluğu: ${stats.averageTurns} turn`);
console.log(`------------------------------------------------------`);
console.log(`SAĞLAMLIQ METRİKLƏRİ (hədəf → faktiki):`);
const conquestPct = Math.round((stats.earlyConquests / stats.totalGames) * 100);
const flag = (ok: boolean) => (ok ? '✅' : '❌');
console.log(`  ${flag(conquestPct >= 40)} Fəthlə bitmə:        hədəf ≥40%  → ${conquestPct}%`);
console.log(`  ${flag(stats.averageTurns <= 35)} Orta uzunluq:        hədəf ≤35   → ${stats.averageTurns} turn`);
console.log(`  ${flag(stats.averageOwnershipFlips < 120)} Sahiblik dəyişməsi:  hədəf <120  → ${stats.averageOwnershipFlips} (churn)`);
console.log(`     Liderin son payı:                → ${Math.round(stats.averageLeaderShare * 100)}%`);
console.log(`     Eliminasiya / partiya:           → ${stats.averageEliminations} / 3`);
console.log(`------------------------------------------------------`);
console.log(`İcra müddəti: ${stats.totalDurationMs}ms (${Math.round(stats.totalGames / (stats.totalDurationMs / 1000))} games/sec)`);
console.log(`Qalibiyyət paylanması:`);
Object.entries(stats.winsByPlayer).forEach(([pId, count]) => {
  console.log(`  Oyunçu ${pId}: ${count} qələbə (${Math.round((count / stats.totalGames) * 100)}%)`);
});
console.log(`======================================================\n`);
