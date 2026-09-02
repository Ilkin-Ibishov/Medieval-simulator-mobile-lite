import {
  GameState,
  PlayerState,
  RegionState,
  Action,
  RULES,
  PLAYER_PALETTES,
  MapData,
  Region,
} from './types';
import { generateProceduralMap } from './mapgen';
import {
  canApplyAction,
  previewCombat,
  calculatePlayerIncome,
  calculatePlayerUpkeep,
  getOwnedRegionCount,
} from './rules';

export interface CreateGameOptions {
  seed: number;
  playerCount?: number;
  regionCount?: number;
  humanCount?: number;
  maxTurns?: number;
  mapData?: MapData;
  chosenKingdomId?: number;
  fogOfWar?: boolean;
  scenario?: import('./types').CampaignScenario;
}

export function createGame(options: CreateGameOptions): GameState {
  const seed = options.seed;
  const humanCount = options.humanCount ?? 1;
  const maxTurns = options.maxTurns || RULES.maxTurns;
  const scenario = options.scenario ?? 'HEGEMONY';

  // If a pre-compiled Master Vector Map (e.g. Dozia) is provided:
  if (options.mapData) {
    const map = options.mapData;

    // Discover unique sovereign kingdoms from provinces
    const stateMap = new Map<number, { name: string; color: string; capitalIndex: number }>();
    map.regions.forEach((r: Region, idx: number) => {
      if (r.stateId !== undefined && !stateMap.has(r.stateId)) {
        stateMap.set(r.stateId, {
          name: r.stateName || `Kingdom ${r.stateId}`,
          color: r.stateColor || PLAYER_PALETTES[stateMap.size % PLAYER_PALETTES.length].color,
          capitalIndex: idx,
        });
      }
      if (r.stateId !== undefined && r.isCapital) {
        stateMap.get(r.stateId)!.capitalIndex = idx;
      }
    });

    const rawStateIds = Array.from(stateMap.keys()).sort((a, b) => a - b);
    const chosenSid = options.chosenKingdomId !== undefined && stateMap.has(options.chosenKingdomId)
      ? options.chosenKingdomId
      : rawStateIds[0];

    // Chosen Kingdom is always Seat 0 (Human Player)
    const stateIds = [chosenSid, ...rawStateIds.filter((sid) => sid !== chosenSid)];
    const stateIdToPlayerIdx = new Map<number, number>();
    stateIds.forEach((sid, idx) => stateIdToPlayerIdx.set(sid, idx));

    const players: PlayerState[] = stateIds.map((sid, pIdx) => {
      const st = stateMap.get(sid)!;
      const isHuman = pIdx === 0;
      return {
        id: pIdx,
        name: isHuman ? `${st.name} (Sən)` : st.name,
        color: st.color,
        isAi: !isHuman,
        isAlive: true,
        treasury: RULES.startingTreasury,
        capital: st.capitalIndex,
        capitalLostTurns: 0,
      };
    });

    const isShattered = scenario === 'SHATTERED';

    // Initialize provinces to their starting historical kingdom or shattered capitals
    const regionState: RegionState[] = map.regions.map((r: Region) => {
      const isCap = r.isCapital;
      let ownerIdx = -1;

      if (isShattered) {
        // In Shattered Realm, only Capital provinces are claimed by historical kingdoms
        if (isCap && r.stateId !== undefined && stateIdToPlayerIdx.has(r.stateId)) {
          ownerIdx = stateIdToPlayerIdx.get(r.stateId)!;
        } else {
          ownerIdx = -1; // Neutral Free Barony
        }
      } else {
        // In Full Hegemony, all constitutive provinces belong to their historical kingdom
        ownerIdx = r.stateId !== undefined && stateIdToPlayerIdx.has(r.stateId)
          ? stateIdToPlayerIdx.get(r.stateId)!
          : -1;
      }

      let baseTroops = 2;
      if (ownerIdx >= 0) {
        baseTroops = isCap ? RULES.startingTroops + 3 : (r.income && r.income >= 10 ? 6 : 4);
      } else {
        baseTroops = 2; // Neutral barony garrison
      }

      return {
        owner: ownerIdx,
        troops: baseTroops,
        exhaustedTroops: 0,
      };
    });

    return {
      seed,
      turn: 1,
      maxTurns,
      activePlayer: 0,
      players,
      map,
      regionState,
      isOver: false,
      winner: null,
      events: [],
      fogOfWar: options.fogOfWar ?? true,
      scenario,
    };
  }

  // Procedural Skirmish Fallback:
  const playerCount = Math.min(5, Math.max(2, options.playerCount || 4));
  const regionCount = options.regionCount || 24;
  const map = generateProceduralMap({ seed, regionCount });

  // Create player states
  const players: PlayerState[] = [];
  for (let i = 0; i < playerCount; i++) {
    const palette = PLAYER_PALETTES[i % PLAYER_PALETTES.length];
    players.push({
      id: i,
      name: i < humanCount ? 'Sən (Hökmdar)' : `Lord ${palette.name}`,
      color: palette.color,
      isAi: i >= humanCount,
      isAlive: true,
      treasury: RULES.startingTreasury,
      capital: 0,
      capitalLostTurns: 0,
    });
  }

  // Initialize all regions as neutral.
  const regionState: RegionState[] = [];
  for (let i = 0; i < regionCount; i++) {
    regionState.push({
      owner: -1,
      troops: RULES.neutralGarrison,
      exhaustedTroops: 0,
    });
  }

  const centreOf = (r: number): [number, number] => map.regions[r].center;
  const dist = (a: number, b: number): number => {
    const ca = centreOf(a);
    const cb = centreOf(b);
    return Math.hypot(ca[0] - cb[0], ca[1] - cb[1]);
  };

  const viable: number[] = [];
  for (let i = 0; i < regionCount; i++) {
    if (map.regions[i].neighbors.length > 0) viable.push(i);
  }

  const minPairDistance = (set: number[]): number => {
    let min = Infinity;
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        const d = dist(set[i], set[j]);
        if (d < min) min = d;
      }
    }
    return set.length < 2 ? 0 : min;
  };

  let capitals: number[] = [];
  let bestSpread = -1;
  for (const first of viable) {
    const set = [first];
    while (set.length < playerCount) {
      let pick = -1;
      let pickScore = -1;
      for (const cand of viable) {
        if (set.includes(cand)) continue;
        let nearest = Infinity;
        for (const c of set) nearest = Math.min(nearest, dist(cand, c));
        if (nearest > pickScore) {
          pickScore = nearest;
          pick = cand;
        }
      }
      if (pick < 0) break;
      set.push(pick);
    }
    if (set.length < playerCount) continue;
    const spread = minPairDistance(set);
    if (spread > bestSpread) {
      bestSpread = spread;
      capitals = set;
    }
  }

  // Fallback for degenerate maps (very few viable regions).
  if (capitals.length < playerCount) {
    capitals = [];
    for (let i = 0; i < regionCount && capitals.length < playerCount; i++) capitals.push(i);
  }

  // The SET is now evenly spread, but the ORDER inside it still encodes position quality:
  // farthest-point sampling puts the two extremes first and squeezes the rest between them.
  // Assigning seat p to capitals[p] therefore just moved the bias. Sorting by region index
  // decouples seat from geometry entirely — indices come from the relaxed Voronoi point
  // order and carry no spatial meaning, so each seat draws a random-quality start.
  capitals.sort((a, b) => a - b);

  const assigned = new Set<number>(capitals);
  for (let p = 0; p < playerCount; p++) {
    const cap = capitals[p];
    players[p].capital = cap;
    players[p].capitalLostTurns = 0;
    regionState[cap].owner = p;
    regionState[cap].troops = RULES.startingTroops + 2;
  }

  // Grow each cluster to 3 regions ROUND-ROBIN rather than one player at a time, so an
  // early seat cannot take every shared neighbour before a later seat gets to choose.
  const clusters: number[][] = capitals.map((c) => [c]);
  const CLUSTER_SIZE = 3;
  for (let step = 1; step < CLUSTER_SIZE; step++) {
    for (let k = 0; k < playerCount; k++) {
      // Rotate who picks first each step. Without this, seat 0 always claimed the contested
      // neighbour, which reintroduced positional bias as soon as free neighbours became
      // scarce (measured: seat spread 5.8 -> 8.0 once chokepoint pruning thinned the graph).
      const p = (k + step) % playerCount;
      const owned = clusters[p];
      let chosen: number | null = null;
      // Prefer a free neighbour of the capital, then of anything else already held.
      for (const source of owned) {
        for (const n of map.regions[source].neighbors) {
          if (!assigned.has(n)) {
            chosen = n;
            break;
          }
        }
        if (chosen !== null) break;
      }
      if (chosen === null) continue;
      assigned.add(chosen);
      owned.push(chosen);
      regionState[chosen].owner = p;
      regionState[chosen].troops = RULES.startingTroops;
    }
  }

  return {
    seed,
    turn: 1,
    maxTurns,
    activePlayer: 0,
    players,
    map,
    regionState,
    isOver: false,
    winner: null,
    events: [],
    fogOfWar: options.fogOfWar ?? true,
  };
}

export function cloneGameState(state: GameState): GameState {
  return {
    seed: state.seed,
    turn: state.turn,
    maxTurns: state.maxTurns,
    activePlayer: state.activePlayer,
    players: state.players.map((p) => ({ ...p })),
    map: state.map, // Static geometry
    regionState: state.regionState.map((r) => ({ ...r })),
    isOver: state.isOver,
    winner: state.winner,
    events: [...state.events],
    fogOfWar: state.fogOfWar,
  };
}

export function applyAction(prevState: GameState, action: Action): GameState {
  if (prevState.isOver) return prevState;

  const currentActive = prevState.activePlayer;
  if (!canApplyAction(prevState, action, currentActive)) {
    return prevState;
  }

  const next = cloneGameState(prevState);
  const player = next.players[currentActive];

  switch (action.type) {
    case 'HIRE': {
      const reg = next.regionState[action.regionId];
      const cost = action.count * RULES.unitCost;
      player.treasury -= cost;
      reg.troops += action.count;
      // Newly recruited troops have summoning sickness (cannot march on hire turn)
      reg.exhaustedTroops = (reg.exhaustedTroops || 0) + action.count;
      break;
    }

    case 'BUILD': {
      const reg = next.regionState[action.regionId];
      if (action.building === 'WATCHTOWER') {
        player.treasury -= RULES.watchtowerCost;
        reg.building = 'WATCHTOWER';
        next.events.push({
          turn: next.turn,
          playerId: currentActive,
          type: 'BATTLE',
          description: `${player.name} ${next.map.regions[action.regionId].name} əyalətində Müşahidə Qülləsi ucaltdı!`,
        });
      } else if (action.building === 'FORT') {
        player.treasury -= RULES.fortCost;
        reg.building = 'FORT';
        next.events.push({
          turn: next.turn,
          playerId: currentActive,
          type: 'BATTLE',
          description: `${player.name} ${next.map.regions[action.regionId].name} əyalətində Qala inşa etdi!`,
        });
      } else {
        reg.building = 'NONE';
      }
      break;
    }

    case 'DISBAND': {
      const reg = next.regionState[action.regionId];
      reg.troops -= action.count;
      reg.exhaustedTroops = Math.max(0, (reg.exhaustedTroops || 0) - action.count);
      // Refund partial gold (50% of hire cost)
      player.treasury += Math.floor(action.count * (RULES.unitCost / 2));
      break;
    }

    case 'MOVE': {
      const fromReg = next.regionState[action.from];
      const toReg = next.regionState[action.to];

      fromReg.troops -= action.count;

      if (toReg.owner === currentActive) {
        // Friendly reinforcement (arriving troops cannot move again this turn)
        toReg.troops += action.count;
        toReg.exhaustedTroops = (toReg.exhaustedTroops || 0) + action.count;
      } else {
        // Battle / Attack!
        const defenderOwner = toReg.owner;
        const targetRegion = next.map.regions[action.to];
        const preview = previewCombat(action.count, toReg.troops, {
          isCapital: targetRegion?.isCapital,
          hasFort: toReg.building === 'FORT',
        });

        if (preview.willWin) {
          // Attacker wins and conquers the territory
          toReg.owner = currentActive;
          toReg.troops = preview.attackerSurviving;
          toReg.building = undefined; // Fortifications razed upon conquest
          // Conquering army rests in the conquered territory for the remainder of this turn
          toReg.exhaustedTroops = preview.attackerSurviving;

          next.events.push({
            turn: next.turn,
            playerId: currentActive,
            type: 'CONQUEST',
            description: `${player.name} ${next.map.regions[action.to].name} əyalətini fəth etdi!`,
            fromRegion: action.from,
            toRegion: action.to,
            attackerLosses: preview.attackerLosses,
            defenderLosses: preview.defenderLosses,
            winner: currentActive,
          });

          // Check if defender was eliminated
          if (defenderOwner >= 0 && getOwnedRegionCount(next, defenderOwner) === 0) {
            next.players[defenderOwner].isAlive = false;
            next.events.push({
              turn: next.turn,
              playerId: defenderOwner,
              type: 'ELIMINATION',
              description: `${next.players[defenderOwner].name} süqut etdi!`,
            });
          }
        } else {
          // Defender holds
          toReg.troops = preview.defenderSurviving;
          next.events.push({
            turn: next.turn,
            playerId: currentActive,
            type: 'BATTLE',
            description: `${next.map.regions[action.to].name} yaxınlığında hücum dəf edildi.`,
            fromRegion: action.from,
            toRegion: action.to,
            attackerLosses: preview.attackerLosses,
            defenderLosses: preview.defenderLosses,
          });
        }
      }
      break;
    }

    case 'END_TURN': {
      // 1. Collect income & pay upkeep for current player
      const income = calculatePlayerIncome(next, currentActive);
      const upkeep = calculatePlayerUpkeep(next, currentActive);
      player.treasury += income - upkeep;

      // 2. Bankruptcy & Desertion check
      if (player.treasury < 0) {
        let deficit = -player.treasury;
        player.treasury = 0;

        // Troops desert starting from the highest troop concentration
        const ownedRegionIndices: number[] = [];
        for (let i = 0; i < next.regionState.length; i++) {
          if (next.regionState[i].owner === currentActive) {
            ownedRegionIndices.push(i);
          }
        }
        ownedRegionIndices.sort(
          (a, b) => next.regionState[b].troops - next.regionState[a].troops
        );

        let totalDeserted = 0;
        for (const rIdx of ownedRegionIndices) {
          if (deficit <= 0) break;
          const reg = next.regionState[rIdx];
          const availableToDesert = Math.max(0, reg.troops - 1);
          const toDesert = Math.min(availableToDesert, Math.ceil(deficit / RULES.unitUpkeep));
          reg.troops -= toDesert;
          deficit -= toDesert * RULES.unitUpkeep;
          totalDeserted += toDesert;
        }

        if (totalDeserted > 0) {
          next.events.push({
            turn: next.turn,
            playerId: currentActive,
            type: 'BANKRUPTCY',
            description: `Xəzinə boşaldı: ${player.name} ordusundan ${totalDeserted} əsgər dağıldı!`,
          });
        }
      }

      // 3. Reset all unit move exhaustion for all regions across the map
      for (let i = 0; i < next.regionState.length; i++) {
        next.regionState[i].exhaustedTroops = 0;
      }

      // 4. Find next living player
      let nextPlayer = (currentActive + 1) % next.players.length;
      let loopCount = 0;
      while (!next.players[nextPlayer].isAlive && loopCount < next.players.length) {
        nextPlayer = (nextPlayer + 1) % next.players.length;
        loopCount++;
      }

      // Check if new round started
      if (nextPlayer <= currentActive) {
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
                description: `👑 ${pl.name}: Paytaxt işğaldadır! (${left} turn qaldı)`,
              });
            } else {
              pl.isAlive = false;
              next.events.push({
                turn: next.turn,
                playerId: pl.id,
                type: 'ELIMINATION',
                description: `☠️ ${pl.name} taxtı çökdü! Paytaxt ${RULES.capitalReconquestTurns} turn ərzində azad edilmədi.`,
              });
              // Neutralize remaining territories
              for (let r = 0; r < next.regionState.length; r++) {
                if (next.regionState[r].owner === pl.id) {
                  next.regionState[r].owner = -1;
                  next.regionState[r].troops = 1;
                }
              }
            }
          }
        }
        next.turn++;
      }

      next.activePlayer = nextPlayer;
      break;
    }
  }

  // Check Game Over Condition
  const alivePlayers = next.players.filter((p) => p.isAlive && getOwnedRegionCount(next, p.id) > 0);

  if (alivePlayers.length === 1) {
    next.isOver = true;
    next.winner = alivePlayers[0].id;
  } else if (alivePlayers.length === 0) {
    next.isOver = true;
    next.winner = null;
  } else if (next.turn > next.maxTurns) {
    // Determine winner by region count and army strength
    let topPlayer = alivePlayers[0].id;
    let topScore = -1;
    for (const p of alivePlayers) {
      const rCount = getOwnedRegionCount(next, p.id);
      const score = rCount * 100 + p.treasury;
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
