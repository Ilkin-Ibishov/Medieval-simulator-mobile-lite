/**
 * Pure simulation engine. Kept separate from `run.ts` so that other tools (the balance
 * sweep) can import `runSimulation` without triggering the CLI report as a side effect.
 */
import { createGame, applyAction } from '../core/game';
import { computeBotActions } from '../ai/bot';
import { getOwnedRegionCount } from '../core/rules';
import { RULES, GameState } from '../core/types';
import { resolveRound, RoundOrders } from '../core/round';

/** Which turn model the simulation runs. */
export type TurnModel = 'sequential' | 'simultaneous';

export interface SimStats {
  totalGames: number;
  completedGames: number;
  earlyConquests: number;
  maxTurnResolutions: number;
  averageTurns: number;
  winsByPlayer: Record<number, number>;
  totalDurationMs: number;
  /** Average share of the map held by the leading player when the game ends (0..1). */
  averageLeaderShare: number;
  /** Average number of region ownership changes per game. High = conquests get undone (churn). */
  averageOwnershipFlips: number;
  /** Average number of players eliminated per game. */
  averageEliminations: number;
  /** Attacks launched per game against a province that actually had defenders. */
  averageContestedAttacks: number;
  /** Attacks per game against an EMPTY province (a walk-in, not a battle). */
  averageWalkIns: number;
  /** Share of contested attacks that were repelled, 0..1. */
  repelRate: number;
  /** Average share of a player's army sitting in border garrisons rather than manoeuvring. */
  averageArmyLocked: number;
  /** Average length of games that ended by CONQUEST (excludes timer resolutions).
   *  This is the length a player actually experiences in a decisive game — the overall
   *  average is dragged upward by the tail of games that run to the turn limit. */
  averageTurnsDecisive: number;
}

export function runSimulation(
  gameCount: number = 200,
  regionCount: number = 24,
  model: TurnModel = 'sequential'
): SimStats {
  const startTime = Date.now();
  let completed = 0;
  let earlyConquests = 0;
  let maxTurnResolutions = 0;
  let totalTurns = 0;
  let totalLeaderShare = 0;
  let totalFlips = 0;
  let totalEliminations = 0;
  let decisiveTurns = 0;
  let decisiveGames = 0;
  let contestedAttacks = 0;
  let walkIns = 0;
  let repelled = 0;
  let lockedSum = 0;
  let lockedSamples = 0;
  const wins: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (let seed = 1; seed <= gameCount; seed++) {
    let game = createGame({
      seed,
      playerCount: 4,
      regionCount,
      humanCount: 0, // All AI
      maxTurns: RULES.maxTurns,
    });

    let prevOwners = game.regionState.map((r) => r.owner);
    let flips = 0;

    let safety = 0;
    while (!game.isOver && safety < 1000) {
      safety++;

      if (model === 'sequential') {
        const botActions = computeBotActions(game, game.activePlayer);
        for (const act of botActions) {
          if (act.type !== 'MOVE') {
            game = applyAction(game, act);
            continue;
          }
          const attacker = game.activePlayer;
          const target = game.regionState[act.to];
          const wasEnemy = target.owner !== attacker;
          const wasDefended = wasEnemy && target.troops > 0;
          const ownerBefore = target.owner;
          if (wasEnemy) {
            if (wasDefended) contestedAttacks++;
            else walkIns++;
          }
          game = applyAction(game, act);
          // A contested attack that left ownership unchanged was thrown back.
          if (wasDefended && game.regionState[act.to].owner === ownerBefore) repelled++;
        }
      } else {
        // Every living player plans against the SAME round-start state, then all orders
        // resolve together. The bot is reused unchanged — it already returns an order list;
        // it only needs a view of the state in which it is the active player.
        const orders: RoundOrders = {};
        for (const p of game.players) {
          if (!p.isAlive) continue;
          const view: GameState = { ...game, activePlayer: p.id };
          orders[p.id] = computeBotActions(view, p.id);
        }
        game = resolveRound(game, orders);
      }

      // How much of each player's army is pinned in border provinces?
      for (const p of game.players) {
        if (!p.isAlive) continue;
        let total = 0;
        let border = 0;
        for (let i = 0; i < game.regionState.length; i++) {
          if (game.regionState[i].owner !== p.id) continue;
          total += game.regionState[i].troops;
          if (game.map.regions[i].neighbors.some((n) => game.regionState[n].owner !== p.id)) {
            border += game.regionState[i].troops;
          }
        }
        if (total > 0) {
          lockedSum += border / total;
          lockedSamples++;
        }
      }

      // Count how many regions changed hands
      for (let i = 0; i < game.regionState.length; i++) {
        if (game.regionState[i].owner !== prevOwners[i]) flips++;
        prevOwners[i] = game.regionState[i].owner;
      }
    }

    const finalCounts = game.players.map((p) => getOwnedRegionCount(game, p.id));
    totalLeaderShare += Math.max(...finalCounts) / regionCount;
    totalEliminations += game.players.filter((p) => !p.isAlive).length;
    totalFlips += flips;
    totalTurns += game.turn;
    if (game.isOver && game.winner !== null) {
      completed++;
      wins[game.winner] = (wins[game.winner] || 0) + 1;
      // Classify by the ACTUAL end condition, not by the turn number.
      //
      // `game.turn <= maxTurns` was a proxy, and it behaved differently in the two models:
      // resolveRound increments the turn BEFORE testing for a winner, so a conquest that
      // completed in the final round was counted as a timer resolution. That biased the
      // simultaneous model's conquest rate downward in every earlier comparison.
      const survivors = game.players.filter(
        (p) => p.isAlive && getOwnedRegionCount(game, p.id) > 0
      ).length;
      if (survivors <= 1) {
        earlyConquests++;
        decisiveTurns += game.turn;
        decisiveGames++;
      } else {
        maxTurnResolutions++;
      }
    }
  }

  const duration = Date.now() - startTime;

  return {
    totalGames: gameCount,
    completedGames: completed,
    earlyConquests,
    maxTurnResolutions,
    averageTurns: Math.round((totalTurns / gameCount) * 10) / 10,
    winsByPlayer: wins,
    totalDurationMs: duration,
    averageLeaderShare: Math.round((totalLeaderShare / gameCount) * 1000) / 1000,
    averageOwnershipFlips: Math.round((totalFlips / gameCount) * 10) / 10,
    averageEliminations: Math.round((totalEliminations / gameCount) * 100) / 100,
    averageContestedAttacks: Math.round((contestedAttacks / gameCount) * 10) / 10,
    averageWalkIns: Math.round((walkIns / gameCount) * 10) / 10,
    repelRate: contestedAttacks > 0 ? Math.round((repelled / contestedAttacks) * 1000) / 1000 : 0,
    averageArmyLocked: lockedSamples > 0 ? Math.round((lockedSum / lockedSamples) * 1000) / 1000 : 0,
    averageTurnsDecisive:
      decisiveGames > 0 ? Math.round((decisiveTurns / decisiveGames) * 10) / 10 : 0,
  };
}
