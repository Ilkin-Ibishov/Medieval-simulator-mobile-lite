import {
  GameState,
  PlayerId,
  Action,
  RULES,
  PLAYER_PALETTES,
  BotPersonality,
} from '../core/types';
import {
  calculatePlayerIncome,
  calculatePlayerUpkeep,
  previewCombat,
  getReadyTroops,
  hasActivePact,
  canProposePact,
} from '../core/rules';

export { type BotPersonality };

/**
 * Tunable AI behaviour. Kept out of `RULES` on purpose: these are not game balance
 * constants (I-3), they describe how the bot plays. The balance sweep may patch them.
 */
export const BOT_CONFIG = {
  /**
   * Troops a bot always leaves behind in a region that borders someone else.
   */
  borderGarrison: 4,
};

export function computeBotActions(
  state: GameState,
  botId: PlayerId,
  customPersonality?: BotPersonality
): Action[] {
  if (state.isOver || state.activePlayer !== botId) return [{ type: 'END_TURN' }];

  const personality: BotPersonality =
    customPersonality ??
    PLAYER_PALETTES[botId % PLAYER_PALETTES.length]?.personality ?? {
      aggression: 1.0,
      greed: 1.0,
    };

  const actions: Action[] = [];
  const player = state.players[botId];
  if (!player || !player.isAlive || state.activePlayer !== botId) return [{ type: 'END_TURN' }];

  let virtualTreasury = player.treasury;

  const ownedRegions: number[] = [];
  for (let i = 0; i < state.regionState.length; i++) {
    if (state.regionState[i].owner === botId) {
      ownedRegions.push(i);
    }
  }

  if (ownedRegions.length === 0) return [{ type: 'END_TURN' }];

  // 1. First: Evaluate Strategic Recruitment (Hiring)
  const projectedIncome = calculatePlayerIncome(state, botId);
  const currentUpkeep = calculatePlayerUpkeep(state, botId);
  const currentMargin = projectedIncome - currentUpkeep;

  // Find most threatened border region to reinforce
  let mostThreatenedRegion = ownedRegions[0];
  let maxThreat = -1;

  for (const r of ownedRegions) {
    let threat = 0;
    const neighbors = state.map.regions[r].neighbors;
    for (const n of neighbors) {
      const nState = state.regionState[n];
      if (nState.owner !== botId) {
        threat += nState.troops + 1;
      }
    }
    if (threat > maxThreat) {
      maxThreat = threat;
      mostThreatenedRegion = r;
    }
  }

  // If our capital is lost, prioritize hiring troops in a staging region next to it
  const isCapitalLost = player.capital !== undefined && state.regionState[player.capital]?.owner !== botId;
  if (isCapitalLost) {
    const staging = ownedRegions.find((r) => state.map.regions[r].neighbors.includes(player.capital));
    if (staging !== undefined) {
      mostThreatenedRegion = staging;
    }
  }

  // Hire if we have gold and income margin is reasonable
  const maxAffordableUnits = Math.floor(virtualTreasury / RULES.unitCost);
  const upkeepMarginThreshold = -RULES.unitUpkeep * 2 * (personality.greed || 1.0);
  if (maxAffordableUnits > 0 && currentMargin >= upkeepMarginThreshold) {
    const unitsToHire = Math.min(maxAffordableUnits, Math.max(1, Math.min(4, Math.floor(maxAffordableUnits / 2) + 1)));
    if (unitsToHire > 0) {
      actions.push({
        type: 'HIRE',
        regionId: mostThreatenedRegion,
        count: unitsToHire,
      });
      virtualTreasury -= unitsToHire * RULES.unitCost;
    }
  }

  // 1.5. Evaluate Fortifications (Forts on high-threat frontiers / Capital; Watchtowers on fogged borders)
  if (virtualTreasury >= RULES.fortCost && maxThreat >= 6) {
    const fortTarget = isCapitalLost ? undefined : (state.regionState[mostThreatenedRegion]?.building !== 'FORT' ? mostThreatenedRegion : undefined);
    if (fortTarget !== undefined) {
      actions.push({
        type: 'BUILD',
        regionId: fortTarget,
        building: 'FORT',
      });
      virtualTreasury -= RULES.fortCost;
    }
  } else if (virtualTreasury >= RULES.watchtowerCost && state.fogOfWar) {
    // Find a border region with fogged neighbors that lacks a watchtower
    const watchtowerCandidate = ownedRegions.find((r) => {
      const reg = state.regionState[r];
      if (reg.building) return false;
      const neighbors = state.map.regions[r].neighbors;
      return neighbors.some((n) => state.regionState[n]?.owner !== botId);
    });
    if (watchtowerCandidate !== undefined) {
      actions.push({
        type: 'BUILD',
        regionId: watchtowerCandidate,
        building: 'WATCHTOWER',
      });
      virtualTreasury -= RULES.watchtowerCost;
    }
  }

  // 1.8. Evaluate Diplomatic Pacts (Secure a quiet flank when under pressure)
  if (virtualTreasury >= RULES.pactCost) {
    const neighborKingdoms = new Set<PlayerId>();
    for (const r of ownedRegions) {
      for (const n of state.map.regions[r].neighbors) {
        const o = state.regionState[n]?.owner;
        if (o >= 0 && o !== botId && state.players[o]?.isAlive) {
          neighborKingdoms.add(o);
        }
      }
    }

    if (neighborKingdoms.size >= 2) {
      // Fighting on 2+ fronts: try to secure peace with one neighbor
      for (const targetKid of neighborKingdoms) {
        if (!hasActivePact(state, botId, targetKid)) {
          const propCheck = canProposePact(state, botId, targetKid);
          if (propCheck.allowed && propCheck.acceptScore >= 50) {
            actions.push({
              type: 'PROPOSE_PACT',
              targetPlayer: targetKid,
            });
            virtualTreasury -= RULES.pactCost;
            break;
          }
        }
      }
    }
  }

  const isBorder = (r: number): boolean =>
    state.map.regions[r].neighbors.some((n) => state.regionState[n].owner !== botId);

  const committableTroops = (r: number): number => {
    const ready = getReadyTroops(state, r);
    if (!isBorder(r)) return ready;
    const isOwnCapital = r === player.capital;
    const effectiveGarrison = Math.max(
      2,
      Math.round((BOT_CONFIG.borderGarrison + (isOwnCapital ? 1 : 0)) / (personality.aggression || 1.0))
    );
    const held = state.regionState[r].troops;
    const reserve = Math.min(effectiveGarrison, held);
    return Math.max(0, ready - reserve);
  };

  // 2. Interior and Border Troop Relocation
  const availableTroops = new Map<number, number>();
  for (const r of ownedRegions) {
    availableTroops.set(r, committableTroops(r));
  }

  for (const r of ownedRegions) {
    let curr = availableTroops.get(r) || 0;
    if (curr <= 0) continue;

    const neighbors = state.map.regions[r].neighbors;
    const hasEnemyNeighbor = isBorder(r);

    if (!hasEnemyNeighbor && curr > 0) {
      const frontlineNeighbor = neighbors.find((n) =>
        isCapitalLost
          ? n === player.capital || state.map.regions[n].neighbors.includes(player.capital)
          : state.map.regions[n].neighbors.some((nn) => state.regionState[nn].owner !== botId)
      ) ?? neighbors[0];

      if (frontlineNeighbor !== undefined) {
        actions.push({
          type: 'MOVE',
          from: r,
          to: frontlineNeighbor,
          count: curr,
        });
        availableTroops.set(r, 0);
      }
    }
  }

  // 3. Proactive Attacks on Neutral & Enemy Territories
  for (const from of ownedRegions) {
    let currAvailable = availableTroops.get(from) || 0;
    if (currAvailable <= 0) continue;

    const neighbors = state.map.regions[from].neighbors;
    const sortedNeighbors = [...neighbors].sort((a, b) => {
      const isOwnCapA = a === player.capital;
      const isOwnCapB = b === player.capital;
      if (isOwnCapA && !isOwnCapB) return -1;
      if (isOwnCapB && !isOwnCapA) return 1;

      const isEnemyCapA = state.players.some((pl) => pl.id !== botId && pl.capital === a);
      const isEnemyCapB = state.players.some((pl) => pl.id !== botId && pl.capital === b);
      if (isEnemyCapA && !isEnemyCapB) return -1;
      if (isEnemyCapB && !isEnemyCapA) return 1;

      const aOwner = state.regionState[a].owner;
      const bOwner = state.regionState[b].owner;
      const aTroops = state.regionState[a].troops;
      const bTroops = state.regionState[b].troops;

      if (aOwner !== botId && bOwner === botId) return -1;
      if (bOwner !== botId && aOwner === botId) return 1;
      return aTroops - bTroops;
    });

    for (const to of sortedNeighbors) {
      const targetState = state.regionState[to];
      if (targetState.owner === botId) continue;

      // Respect active Non-Aggression Pacts
      if (targetState.owner >= 0 && hasActivePact(state, botId, targetState.owner)) {
        continue;
      }

      const preview = previewCombat(currAvailable, targetState.troops);
      if (preview.willWin && preview.attackerSurviving >= 1) {
        actions.push({
          type: 'MOVE',
          from,
          to,
          count: currAvailable,
        });
        availableTroops.set(from, 0);
        break;
      }
    }
  }

  // 4. Always finish turn
  actions.push({ type: 'END_TURN' });
  return actions;
}
