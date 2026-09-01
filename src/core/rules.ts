import { GameState, PlayerId, Action, RULES, VisibilityLevel } from './types';

export interface CombatPreview {
  willWin: boolean;
  attackerLosses: number;
  defenderLosses: number;
  attackerSurviving: number;
  defenderSurviving: number;
  confidence: 'CERTAIN_VICTORY' | 'LIKELY_VICTORY' | 'PYRRHIC_VICTORY' | 'DEFEAT';
}

export function calculatePlayerIncome(state: GameState, playerId: PlayerId): number {
  let total = 0;
  for (let i = 0; i < state.map.regions.length; i++) {
    if (state.regionState[i].owner === playerId) {
      total += state.map.regions[i].income;
    }
  }
  return total;
}

export function calculatePlayerTroopCount(state: GameState, playerId: PlayerId): number {
  let total = 0;
  for (let i = 0; i < state.regionState.length; i++) {
    if (state.regionState[i].owner === playerId) {
      total += state.regionState[i].troops;
    }
  }
  return total;
}

export function calculatePlayerUpkeep(state: GameState, playerId: PlayerId): number {
  const troops = calculatePlayerTroopCount(state, playerId);
  return troops * RULES.unitUpkeep;
}

export function calculateNetGold(state: GameState, playerId: PlayerId): number {
  return calculatePlayerIncome(state, playerId) - calculatePlayerUpkeep(state, playerId);
}

export function getOwnedRegionCount(state: GameState, playerId: PlayerId): number {
  let count = 0;
  for (let i = 0; i < state.regionState.length; i++) {
    if (state.regionState[i].owner === playerId) count++;
  }
  return count;
}

export function previewCombat(attackerCount: number, defenderCount: number): CombatPreview {
  if (attackerCount <= 0) {
    return {
      willWin: false,
      attackerLosses: 0,
      defenderLosses: 0,
      attackerSurviving: 0,
      defenderSurviving: defenderCount,
      confidence: 'DEFEAT',
    };
  }

  const defPower = defenderCount * RULES.defenderAdvantageRatio;

  if (attackerCount > defPower) {
    // Attacker wins
    const attLosses = Math.min(attackerCount - 1, Math.round(defenderCount * RULES.attackerLossRatio));
    const attSurviving = Math.max(1, attackerCount - attLosses);
    const defLosses = defenderCount;

    let confidence: CombatPreview['confidence'] = 'CERTAIN_VICTORY';
    if (attLosses > attackerCount * 0.5) {
      confidence = 'PYRRHIC_VICTORY';
    } else if (attackerCount < defenderCount * 1.5) {
      confidence = 'LIKELY_VICTORY';
    }

    return {
      willWin: true,
      attackerLosses: attLosses,
      defenderLosses: defLosses,
      attackerSurviving: attSurviving,
      defenderSurviving: 0,
      confidence,
    };
  } else {
    // Defender wins
    const defLosses = Math.min(defenderCount, Math.round(attackerCount * RULES.defenderLossRatio));
    const defSurviving = Math.max(1, defenderCount - defLosses);
    const attLosses = attackerCount;

    return {
      willWin: false,
      attackerLosses: attLosses,
      defenderLosses: defLosses,
      attackerSurviving: 0,
      defenderSurviving: defSurviving,
      confidence: 'DEFEAT',
    };
  }
}

export function getReadyTroops(state: GameState, regionId: number): number {
  const reg = state.regionState[regionId];
  if (!reg) return 0;
  return Math.max(0, reg.troops - (reg.exhaustedTroops || 0));
}

export function canApplyAction(state: GameState, action: Action, playerId: PlayerId): boolean {
  if (state.isOver) return false;
  if (state.activePlayer !== playerId) return false;

  const player = state.players[playerId];
  if (!player || !player.isAlive) return false;

  switch (action.type) {
    case 'HIRE': {
      if (action.count <= 0) return false;
      const reg = state.regionState[action.regionId];
      if (!reg || reg.owner !== playerId) return false;
      const cost = action.count * RULES.unitCost;
      return player.treasury >= cost;
    }
    case 'MOVE': {
      if (action.count <= 0) return false;
      const fromReg = state.regionState[action.from];
      const toReg = state.regionState[action.to];
      if (!fromReg || !toReg) return false;
      if (fromReg.owner !== playerId) return false;

      // Only ready troops (not moved or hired this turn) can march/attack
      const ready = getReadyTroops(state, action.from);
      if (ready < action.count) return false;

      // Must be physical neighbors
      const neighbors = state.map.regions[action.from]?.neighbors || [];
      return neighbors.includes(action.to);
    }
    case 'DISBAND': {
      if (action.count <= 0) return false;
      const reg = state.regionState[action.regionId];
      if (!reg || reg.owner !== playerId) return false;
      return reg.troops >= action.count;
    }
    case 'END_TURN':
      return true;
  }
}

export function getLegalActions(state: GameState, playerId: PlayerId): Action[] {
  if (state.isOver || state.activePlayer !== playerId) return [];
  const player = state.players[playerId];
  if (!player || !player.isAlive) return [];

  const actions: Action[] = [{ type: 'END_TURN' }];

  // 1. Hiring actions
  const maxHire = Math.floor(player.treasury / RULES.unitCost);
  if (maxHire > 0) {
    for (let r = 0; r < state.regionState.length; r++) {
      if (state.regionState[r].owner === playerId) {
        actions.push({ type: 'HIRE', regionId: r, count: 1 });
        if (maxHire >= 3) {
          actions.push({ type: 'HIRE', regionId: r, count: Math.min(maxHire, 3) });
        }
      }
    }
  }

  // 2. Move & Attack actions (Only using ready troops)
  for (let from = 0; from < state.regionState.length; from++) {
    const fromState = state.regionState[from];
    if (fromState.owner === playerId) {
      const ready = getReadyTroops(state, from);
      if (ready >= 1) {
        const neighbors = state.map.regions[from]?.neighbors || [];
        for (const to of neighbors) {
          actions.push({ type: 'MOVE', from, to, count: ready });
          if (ready > 2) {
            actions.push({ type: 'MOVE', from, to, count: Math.floor(ready / 2) });
          }
        }
      }
    }
  }

  return actions;
}

/**
 * Calculates visibility level for a given player viewing a specific province.
 * - 'VISIBLE': The player directly owns this province. Full details visible.
 * - 'BORDER': The province directly neighbors at least one province owned by the player. Live reconnaissance.
 * - 'FOGGED': Deep unexplored territory. Troop numbers and movements hidden.
 */
export function getRegionVisibility(
  state: GameState,
  viewerPlayerId: PlayerId,
  regionId: number
): VisibilityLevel {
  if (state.fogOfWar === false) {
    return 'VISIBLE';
  }

  const regState = state.regionState[regionId];
  if (!regState) return 'FOGGED';

  // 1. Directly owned province
  if (regState.owner === viewerPlayerId) {
    return 'VISIBLE';
  }

  // 2. Neighbor of any owned province
  const neighbors = state.map.regions[regionId]?.neighbors || [];
  for (const nId of neighbors) {
    if (state.regionState[nId]?.owner === viewerPlayerId) {
      return 'BORDER';
    }
  }

  return 'FOGGED';
}

/**
 * Returns true if the region is either directly owned or on the immediate border.
 */
export function isRegionDiscovered(
  state: GameState,
  viewerPlayerId: PlayerId,
  regionId: number
): boolean {
  const vis = getRegionVisibility(state, viewerPlayerId, regionId);
  return vis === 'VISIBLE' || vis === 'BORDER';
}
