/**
 * SIMULTANEOUS ROUND RESOLUTION (Faza S — evaluation only, opt-in).
 *
 * Every player submits orders for the same round; all orders resolve together. This exists
 * alongside the sequential `applyAction` path, it does not replace it — the two are compared
 * by measurement (see IMPLEMENTATION_PLAN.md → Faza S decision gate).
 *
 * ADJUDICATION RULES (the four open cases from the plan, decided):
 *
 *  R1 · Departures happen before arrivals.
 *       Every marching army leaves its province at the start of the round. So a province
 *       whose garrison marched out IS empty when someone else arrives, and two armies that
 *       march past each other both reach their target (they swap). Attacking therefore
 *       carries real risk to your own rear — which is the point.
 *
 *  R2 · One army per player per destination.
 *       Orders from the same player into the same province are merged into a single force
 *       BEFORE any fighting. This is what finally makes concentrating force possible.
 *
 *  R3 · Reinforcements defend.
 *       Arrivals from the province's own owner join the garrison and fight on its side.
 *
 *  R4 · Strongest force takes the province.
 *       Defender power = (garrison + reinforcements) x defenderAdvantageRatio.
 *       Each attacker's power = its merged troop count.
 *       Highest power wins; everyone else loses everything they committed there.
 *       The winner's losses are attackerLossRatio (or defenderLossRatio when the defender
 *       holds) applied to the total force it defeated.
 *
 *       With exactly one attacker this reduces EXACTLY to `previewCombat`, so the familiar
 *       1-v-1 maths is unchanged and the combat preview stays truthful.
 *
 *  Hiring resolves BEFORE movement, so freshly hired troops defend their province this
 *  round — but move orders are validated against round-start troops, so they cannot march
 *  on the turn they were bought (the existing "summoning sickness" rule is preserved).
 */
import { GameState, PlayerId, Action, RULES } from './types';
import { getOwnedRegionCount, getDiplomacyKey, canProposePact, hasActivePact } from './rules';
import { cloneGameState } from './game';

/** One player's submitted orders for a round. */
export type RoundOrders = Record<PlayerId, Action[]>;

interface Force {
  playerId: PlayerId;
  troops: number;
  /** Where the troops came from, for reporting. */
  origins: number[];
}

/** Losses the winner of a contest takes, given the total strength it defeated. */
function winnerLosses(winnerTroops: number, defeatedTroops: number, ratio: number): number {
  return Math.min(winnerTroops - 1, Math.round(defeatedTroops * ratio));
}

/**
 * Resolves one simultaneous round: economy, then all movement at once, then income/upkeep.
 * Pure and deterministic — same state + same orders always yields the same result.
 */
export function resolveRound(prevState: GameState, orders: RoundOrders): GameState {
  if (prevState.isOver) return prevState;

  const next = cloneGameState(prevState);
  const regionCount = next.regionState.length;
  if (!next.diplomacy) next.diplomacy = {};

  // Troop counts as they stood when the round began. Move orders are validated against
  // these, so newly hired troops cannot also march.
  const startTroops = prevState.regionState.map((r) => r.troops);

  const livingPlayers = next.players.filter((p) => p.isAlive).map((p) => p.id);

  // ---------------------------------------------------------------- Phase 1: economy & diplomacy
  for (const pid of livingPlayers) {
    const player = next.players[pid];
    for (const action of orders[pid] ?? []) {
      if (action.type === 'HIRE') {
        const reg = next.regionState[action.regionId];
        if (!reg || reg.owner !== pid || action.count <= 0) continue;
        const cost = action.count * RULES.unitCost;
        if (player.treasury < cost) continue;
        player.treasury -= cost;
        reg.troops += action.count;
      } else if (action.type === 'BUILD') {
        const reg = next.regionState[action.regionId];
        if (!reg || reg.owner !== pid || reg.building === action.building) continue;
        if (action.building === 'WATCHTOWER') {
          if (player.treasury < RULES.watchtowerCost) continue;
          player.treasury -= RULES.watchtowerCost;
          reg.building = 'WATCHTOWER';
        } else if (action.building === 'FORT') {
          if (player.treasury < RULES.fortCost) continue;
          player.treasury -= RULES.fortCost;
          reg.building = 'FORT';
        } else {
          reg.building = 'NONE';
        }
      } else if (action.type === 'DISBAND') {
        const reg = next.regionState[action.regionId];
        if (!reg || reg.owner !== pid || action.count <= 0) continue;
        const count = Math.min(action.count, reg.troops);
        reg.troops -= count;
        player.treasury += Math.floor(count * (RULES.unitCost / 2));
      } else if (action.type === 'PROPOSE_PACT') {
        const target = next.players[action.targetPlayer];
        if (!target || !target.isAlive) continue;
        if (player.treasury < RULES.pactCost) continue;
        player.treasury -= RULES.pactCost;

        const check = canProposePact(prevState, pid, action.targetPlayer);
        const isAccepted = !target.isAi || check.acceptScore >= 50;
        const key = getDiplomacyKey(pid, action.targetPlayer);

        if (isAccepted) {
          next.diplomacy[key] = {
            status: 'PACT',
            pactTurnsRemaining: RULES.pactDuration,
            cooldownTurnsRemaining: 0,
          };
          next.events.push({
            turn: next.turn,
            playerId: pid,
            type: 'PACT_FORMED',
            description: `🤝 ${player.name} və ${target.name} arasında 3-raundluq Qeyri-Hücum Paktı bağlandı!`,
          });
        } else {
          next.events.push({
            turn: next.turn,
            playerId: pid,
            type: 'BATTLE',
            description: `📜 ${target.name} ${player.name} tərəfindən göndərilən pakt təklifini rədd etdi.`,
          });
        }
      } else if (action.type === 'SEND_TRIBUTE') {
        const target = next.players[action.targetPlayer];
        if (!target || !target.isAlive) continue;
        if (player.treasury < RULES.tributeCost) continue;
        player.treasury -= RULES.tributeCost;
        target.treasury += RULES.tributeCost;
        next.events.push({
          turn: next.turn,
          playerId: pid,
          type: 'TRIBUTE_SENT',
          description: `💰 ${player.name} ${target.name} xəzinəsinə ${RULES.tributeCost}G töhfə göndərdi!`,
        });
      } else if (action.type === 'BREAK_PACT') {
        const target = next.players[action.targetPlayer];
        if (!target) continue;
        const key = getDiplomacyKey(pid, action.targetPlayer);
        next.diplomacy[key] = {
          status: 'COOLDOWN',
          pactTurnsRemaining: 0,
          cooldownTurnsRemaining: RULES.pactCooldown * 2,
        };
        player.treasury = Math.max(0, player.treasury - RULES.betrayalPenalty);
        next.events.push({
          turn: next.turn,
          playerId: pid,
          type: 'PACT_BROKEN',
          description: `⚡ XƏYANƏT: ${player.name} ${target.name} ilə olan paktı vaxtından əvvəl pozdu! (-${RULES.betrayalPenalty}G cərimə)`,
        });
      }
    }
  }

  // ---------------------------------------------------------------- Phase 2: departures (R1)
  // Validate every march against round-start troops, then remove the marchers at once.
  const departedFrom = new Array<number>(regionCount).fill(0);
  const incoming = new Map<number, Force[]>();

  for (const pid of livingPlayers) {
    for (const action of orders[pid] ?? []) {
      if (action.type !== 'MOVE') continue;
      const from = next.regionState[action.from];
      const toRegion = next.map.regions[action.to];
      if (!from || !toRegion || action.count <= 0) continue;
      if (from.owner !== pid) continue;
      if (!next.map.regions[action.from].neighbors.includes(action.to)) continue;

      const available = startTroops[action.from] - departedFrom[action.from];
      const count = Math.min(action.count, available);
      if (count <= 0) continue;

      departedFrom[action.from] += count;
      from.troops -= count;

      const list = incoming.get(action.to) ?? [];
      const existing = list.find((f) => f.playerId === pid);
      if (existing) {
        // R2 — merge this player's separate columns into one army before fighting.
        existing.troops += count;
        existing.origins.push(action.from);
      } else {
        list.push({ playerId: pid, troops: count, origins: [action.from] });
      }
      incoming.set(action.to, list);
    }
  }

  // ---------------------------------------------------------------- Phase 3: arrivals
  for (const [regionId, forces] of incoming) {
    const reg = next.regionState[regionId];
    const defenderId = reg.owner;

    // R3 — the owner's own arrivals reinforce rather than attack.
    const reinforcements = forces.filter((f) => f.playerId === defenderId);
    const attackers = forces.filter((f) => f.playerId !== defenderId);

    for (const r of reinforcements) reg.troops += r.troops;

    if (attackers.length === 0) continue;

    // Check if any attacker betrayed an active pact with the defender
    if (defenderId >= 0) {
      for (const att of attackers) {
        if (hasActivePact(next, att.playerId, defenderId)) {
          const key = getDiplomacyKey(att.playerId, defenderId);
          next.diplomacy[key] = {
            status: 'COOLDOWN',
            pactTurnsRemaining: 0,
            cooldownTurnsRemaining: RULES.pactCooldown * 2,
          };
          const betrayer = next.players[att.playerId];
          if (betrayer) {
            betrayer.treasury = Math.max(0, betrayer.treasury - RULES.betrayalPenalty);
            next.events.push({
              turn: next.turn,
              playerId: att.playerId,
              type: 'PACT_BROKEN',
              description: `⚡ XƏYANƏT HÜCUMU: ${betrayer.name} paktı pozaraq ${next.players[defenderId].name} torpaqlarına basqın etdi! (-${RULES.betrayalPenalty}G cərimə)`,
            });
          }
        }
      }
    }

    const garrison = reg.troops;
    const isCapitalDef = defenderId >= 0 && next.players[defenderId]?.capital === regionId;
    const hasFort = reg.building === 'FORT';
    const defBonus = (isCapitalDef ? RULES.capitalDefenseBonus : 0) + (hasFort ? RULES.fortDefenseBonus : 0);
    const defPower = defenderId >= 0 ? (garrison + defBonus) * RULES.defenderAdvantageRatio : garrison;

    // R4 — strongest force takes the province. Ties between equal-strength top attackers
    // are resolved deterministically using the game seed, round turn, and region index,
    // ensuring perfect seat fairness without player ID bias.
    const maxTroops = Math.max(...attackers.map((a) => a.troops));
    const topAttackers = attackers.filter((a) => a.troops === maxTroops);
    let strongestAttacker: Force;
    if (topAttackers.length > 1) {
      const hash = Math.abs(next.seed * 31 + next.turn * 17 + regionId) % topAttackers.length;
      strongestAttacker = topAttackers[hash];
    } else {
      strongestAttacker = topAttackers[0];
    }
    const totalAttacking = attackers.reduce((sum, a) => sum + a.troops, 0);

    if (strongestAttacker.troops > defPower) {
      // Province falls. The winner fought everyone else present: the garrison plus every
      // rival attacker who also marched here.
      const defeated = garrison + (totalAttacking - strongestAttacker.troops);
      const losses = winnerLosses(strongestAttacker.troops, defeated, RULES.attackerLossRatio);
      const survivors = Math.max(1, strongestAttacker.troops - losses);

      const previousOwner = reg.owner;
      reg.owner = strongestAttacker.playerId;
      reg.troops = survivors;
      reg.building = undefined; // Fortifications razed on conquest

      next.events.push({
        turn: next.turn,
        playerId: strongestAttacker.playerId,
        type: 'CONQUEST',
        description:
          attackers.length > 1
            ? `${next.players[strongestAttacker.playerId].name} ${next.map.regions[regionId].name} uğrunda çoxtərəfli döyüşü udu!`
            : `${next.players[strongestAttacker.playerId].name} ${next.map.regions[regionId].name} əyalətini fəth etdi!`,
        fromRegion: strongestAttacker.origins[0],
        toRegion: regionId,
        attackerLosses: losses,
        defenderLosses: defeated,
        winner: strongestAttacker.playerId,
      });

      if (previousOwner >= 0 && getOwnedRegionCount(next, previousOwner) === 0) {
        next.players[previousOwner].isAlive = false;
        next.events.push({
          turn: next.turn,
          playerId: previousOwner,
          type: 'ELIMINATION',
          description: `${next.players[previousOwner].name} süqut etdi!`,
        });
      }
    } else {
      // Province holds against everything thrown at it this round.
      const losses = Math.min(garrison, Math.round(totalAttacking * RULES.defenderLossRatio));
      reg.troops = defenderId >= 0 ? Math.max(1, garrison - losses) : Math.max(0, garrison - losses);

      next.events.push({
        turn: next.turn,
        playerId: strongestAttacker.playerId,
        type: 'BATTLE',
        description: `${next.map.regions[regionId].name} yaxınlığında hücum dəf edildi.`,
        fromRegion: strongestAttacker.origins[0],
        toRegion: regionId,
        attackerLosses: totalAttacking,
        defenderLosses: losses,
      });
    }
  }

  // ---------------------------------------------------------------- Phase 4: income & upkeep
  for (const pid of livingPlayers) {
    const player = next.players[pid];
    if (!player.isAlive) continue;

    let income = 0;
    let troops = 0;
    for (let i = 0; i < regionCount; i++) {
      if (next.regionState[i].owner === pid) {
        income += next.map.regions[i].income;
        troops += next.regionState[i].troops;
      }
    }
    player.treasury += income - troops * RULES.unitUpkeep;

    if (player.treasury < 0) {
      let deficit = -player.treasury;
      player.treasury = 0;

      const owned: number[] = [];
      for (let i = 0; i < regionCount; i++) {
        if (next.regionState[i].owner === pid) owned.push(i);
      }
      owned.sort((a, b) => next.regionState[b].troops - next.regionState[a].troops);

      let deserted = 0;
      for (const idx of owned) {
        if (deficit <= 0) break;
        const reg = next.regionState[idx];
        const spare = Math.max(0, reg.troops - 1);
        const toDesert = Math.min(spare, Math.ceil(deficit / RULES.unitUpkeep));
        reg.troops -= toDesert;
        deficit -= toDesert * RULES.unitUpkeep;
        deserted += toDesert;
      }

      if (deserted > 0) {
        next.events.push({
          turn: next.turn,
          playerId: pid,
          type: 'BANKRUPTCY',
          description: `Xəzinə boşaldı: ${player.name} ordusundan ${deserted} əsgər dağıldı!`,
        });
      }
    }
  }

  // ---------------------------------------------------------------- Phase 5: round end & capital countdown
  // Process capital occupation countdown & realm collapse
  for (const pl of next.players) {
    if (!pl.isAlive) continue;
    const capOwner = next.regionState[pl.capital]?.owner;
    if (capOwner === pl.id) {
      if (pl.capitalLostTurns > 0) {
        next.events.push({
          turn: next.turn,
          playerId: pl.id,
          type: 'CONQUEST',
          description: `${pl.name}: Paytaxt azad edildi — sayğac sıfırlandı!`,
        });
      }
      pl.capitalLostTurns = 0;
    } else {
      pl.capitalLostTurns++;
      const left = RULES.capitalReconquestTurns - pl.capitalLostTurns;
      if (left > 0) {
        next.events.push({
          turn: next.turn,
          playerId: pl.id,
          type: 'BATTLE',
          description: `👑 ${pl.name}: Paytaxt işğaldadır! (${left} raund qaldı)`,
        });
      } else {
        pl.isAlive = false;
        next.events.push({
          turn: next.turn,
          playerId: pl.id,
          type: 'ELIMINATION',
          description: `☠️ ${pl.name} taxtı çökdü! Paytaxt ${RULES.capitalReconquestTurns} raund ərzində azad edilmədi.`,
        });
        // Neutralize remaining territories
        for (let r = 0; r < regionCount; r++) {
          if (next.regionState[r].owner === pl.id) {
            next.regionState[r].owner = -1;
            next.regionState[r].troops = 1;
          }
        }
      }
    }
  }

  for (let i = 0; i < regionCount; i++) {
    next.regionState[i].exhaustedTroops = 0;
  }

  // Process diplomacy counters
  if (next.diplomacy) {
    for (const key of Object.keys(next.diplomacy)) {
      const rel = next.diplomacy[key];
      if (rel.status === 'PACT') {
        rel.pactTurnsRemaining--;
        if (rel.pactTurnsRemaining <= 0) {
          rel.status = 'COOLDOWN';
          rel.cooldownTurnsRemaining = RULES.pactCooldown;
          next.events.push({
            turn: next.turn,
            playerId: 0,
            type: 'PACT_EXPIRED',
            description: `⌛ Pakt Müddəti Bitdi: Dövlətlər arasındakı sülh müqaviləsi başa çatdı.`,
          });
        }
      } else if (rel.status === 'COOLDOWN') {
        rel.cooldownTurnsRemaining--;
        if (rel.cooldownTurnsRemaining <= 0) {
          rel.status = 'WAR';
        }
      }
    }
  }

  next.turn++;

  for (const p of next.players) {
    if (p.isAlive && getOwnedRegionCount(next, p.id) === 0) p.isAlive = false;
  }

  const alive = next.players.filter((p) => p.isAlive && getOwnedRegionCount(next, p.id) > 0);
  if (alive.length === 1) {
    next.isOver = true;
    next.winner = alive[0].id;
  } else if (alive.length === 0) {
    next.isOver = true;
    next.winner = null;
  } else if (next.turn > next.maxTurns) {
    let topPlayer = alive[0].id;
    let topScore = -1;
    for (const p of alive) {
      const score = getOwnedRegionCount(next, p.id) * 100 + p.treasury;
      if (score > topScore) {
        topScore = score;
        topPlayer = p.id;
      }
    }
    next.isOver = true;
    next.winner = topPlayer;
  }

  return next;
}
