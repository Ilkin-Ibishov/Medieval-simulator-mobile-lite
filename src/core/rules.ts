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

export function previewCombat(
  attackerCount: number,
  defenderCount: number,
  options?: { isCapital?: boolean; hasFort?: boolean }
): CombatPreview {
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

  const effectiveDefender =
    defenderCount +
    (options?.isCapital ? RULES.capitalDefenseBonus : 0) +
    (options?.hasFort ? RULES.fortDefenseBonus : 0);
  const defPower = effectiveDefender * RULES.defenderAdvantageRatio;

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
    case 'BUILD': {
      const reg = state.regionState[action.regionId];
      if (!reg || reg.owner !== playerId) return false;
      if (reg.building === action.building) return false;
      if (action.building === 'WATCHTOWER') {
        return player.treasury >= RULES.watchtowerCost;
      }
      if (action.building === 'FORT') {
        return player.treasury >= RULES.fortCost;
      }
      return action.building === 'NONE';
    }
    case 'DISBAND': {
      if (action.count <= 0) return false;
      const reg = state.regionState[action.regionId];
      if (!reg || reg.owner !== playerId) return false;
      return reg.troops >= action.count;
    }
    case 'PROPOSE_PACT': {
      const res = canProposePact(state, playerId, action.targetPlayer);
      return res.allowed;
    }
    case 'SEND_TRIBUTE': {
      const res = canSendTribute(state, playerId, action.targetPlayer);
      return res.allowed;
    }
    case 'BREAK_PACT': {
      if (action.targetPlayer === playerId) return false;
      const rel = getDiplomaticRelation(state, playerId, action.targetPlayer);
      return rel.status === 'PACT';
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

  // 2. Fortification Building actions
  for (let r = 0; r < state.regionState.length; r++) {
    const reg = state.regionState[r];
    if (reg.owner === playerId) {
      if (reg.building !== 'FORT' && player.treasury >= RULES.fortCost) {
        actions.push({ type: 'BUILD', regionId: r, building: 'FORT' });
      }
      if (reg.building !== 'WATCHTOWER' && player.treasury >= RULES.watchtowerCost) {
        actions.push({ type: 'BUILD', regionId: r, building: 'WATCHTOWER' });
      }
    }
  }

  // 3. Move & Attack actions (Only using ready troops)
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

  // 4. Diplomatic Actions
  if (player.treasury >= RULES.pactCost) {
    for (const other of state.players) {
      if (other.id !== playerId && other.isAlive) {
        const check = canProposePact(state, playerId, other.id);
        if (check.allowed) {
          actions.push({ type: 'PROPOSE_PACT', targetPlayer: other.id });
        }
      }
    }
  }

  return actions;
}

/**
 * Calculates visibility level for a given player viewing a specific province.
 * - 'VISIBLE': The player directly owns this province. Full details visible.
 * - 'BORDER': The province directly neighbors at least one province owned by the player, OR is within 2-hop watchtower reconnaissance.
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

  // 2. 1-hop: Neighbor of any owned province
  const neighbors = state.map.regions[regionId]?.neighbors || [];
  for (const nId of neighbors) {
    if (state.regionState[nId]?.owner === viewerPlayerId) {
      return 'BORDER';
    }
  }

  // 3. 2-hop: Watchtower reconnaissance from any owned province
  for (let r = 0; r < state.regionState.length; r++) {
    const rSt = state.regionState[r];
    if (rSt.owner === viewerPlayerId && rSt.building === 'WATCHTOWER') {
      const towerNeighbors = state.map.regions[r]?.neighbors || [];
      for (const tnId of towerNeighbors) {
        const secondaryNeighbors = state.map.regions[tnId]?.neighbors || [];
        if (secondaryNeighbors.includes(regionId)) {
          return 'BORDER';
        }
      }
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

/**
 * Standard symmetric key for indexing diplomacy between any pair of players.
 */
export function getDiplomacyKey(pA: PlayerId, pB: PlayerId): string {
  return pA < pB ? `${pA}-${pB}` : `${pB}-${pA}`;
}

/**
 * Retrieves the diplomatic relation between two players. Defaults to WAR (neutral/hostile).
 */
export function getDiplomaticRelation(
  state: GameState,
  pA: PlayerId,
  pB: PlayerId
): import('./types').DiplomaticRelation {
  if (pA === pB) {
    return { status: 'PACT', pactTurnsRemaining: 999, cooldownTurnsRemaining: 0 };
  }
  const key = getDiplomacyKey(pA, pB);
  if (state.diplomacy && state.diplomacy[key]) {
    return state.diplomacy[key];
  }
  return { status: 'WAR', pactTurnsRemaining: 0, cooldownTurnsRemaining: 0 };
}

/**
 * Returns true if two players have an active, unbroken Non-Aggression Pact.
 */
export function hasActivePact(state: GameState, pA: PlayerId, pB: PlayerId): boolean {
  if (pA === pB) return true;
  const rel = getDiplomaticRelation(state, pA, pB);
  return rel.status === 'PACT' && rel.pactTurnsRemaining > 0;
}

/**
 * Calculates whether a player can propose a Non-Aggression Pact to another player.
 */
export function canProposePact(
  state: GameState,
  fromPlayer: PlayerId,
  toPlayer: PlayerId
): { allowed: boolean; reason?: string; acceptScore: number; acceptChancePercent: number } {
  if (fromPlayer === toPlayer) {
    return { allowed: false, reason: 'Özünlə pakt bağlaya bilməzsən', acceptScore: 0, acceptChancePercent: 0 };
  }
  const sender = state.players[fromPlayer];
  const target = state.players[toPlayer];
  if (!sender || !target || !sender.isAlive || !target.isAlive) {
    return { allowed: false, reason: 'Dövlət mövcud deyil və ya süqut edib', acceptScore: 0, acceptChancePercent: 0 };
  }

  if (sender.treasury < RULES.pactCost) {
    return { allowed: false, reason: `Yetərli qızıl yoxdur (${RULES.pactCost}G tələb olunur)`, acceptScore: 0, acceptChancePercent: 0 };
  }

  const rel = getDiplomaticRelation(state, fromPlayer, toPlayer);
  if (rel.status === 'PACT') {
    return { allowed: false, reason: `Artıq aktiv pakt mövcuddur (${rel.pactTurnsRemaining} turn qalıb)`, acceptScore: 100, acceptChancePercent: 100 };
  }
  if (rel.cooldownTurnsRemaining > 0) {
    return { allowed: false, reason: `Soyuma müddəti aktivdir (${rel.cooldownTurnsRemaining} turn qalıb)`, acceptScore: 0, acceptChancePercent: 0 };
  }

  // Calculate deterministic AI acceptance score (0..100)
  const fromTroops = calculatePlayerTroopCount(state, fromPlayer);
  const targetTroops = calculatePlayerTroopCount(state, toPlayer);

  let score = 50; // Base willingness

  // Relative power: if sender is militarily formidable, target is more eager for peace
  if (fromTroops >= targetTroops * 1.3) {
    score += 25;
  } else if (fromTroops >= targetTroops) {
    score += 15;
  } else if (targetTroops >= fromTroops * 1.5) {
    score -= 20; // Target feels strong and ambitious
  }

  // Border contact check
  let sharesBorder = false;
  for (let r = 0; r < state.regionState.length; r++) {
    if (state.regionState[r].owner === fromPlayer) {
      const neighbors = state.map.regions[r]?.neighbors || [];
      for (const n of neighbors) {
        if (state.regionState[n]?.owner === toPlayer) {
          sharesBorder = true;
          break;
        }
      }
      if (sharesBorder) break;
    }
  }

  if (sharesBorder) {
    score += 15; // Frontier security is valuable
  } else {
    score -= 15; // No shared border, low diplomatic urgency
  }

  const finalScore = Math.max(10, Math.min(95, score));

  return {
    allowed: true,
    acceptScore: finalScore,
    acceptChancePercent: finalScore,
  };
}

/**
 * Calculates whether a player can send a gold tribute to another player.
 */
export function canSendTribute(
  state: GameState,
  fromPlayer: PlayerId,
  toPlayer: PlayerId
): { allowed: boolean; reason?: string } {
  if (fromPlayer === toPlayer) {
    return { allowed: false, reason: 'Özünə töhfə göndərə bilməzsən' };
  }
  const sender = state.players[fromPlayer];
  const target = state.players[toPlayer];
  if (!sender || !target || !sender.isAlive || !target.isAlive) {
    return { allowed: false, reason: 'Dövlət mövcud deyil və ya süqut edib' };
  }
  if (sender.treasury < RULES.tributeCost) {
    return { allowed: false, reason: `Yetərli qızıl yoxdur (${RULES.tributeCost}G tələb olunur)` };
  }
  return { allowed: true };
}
