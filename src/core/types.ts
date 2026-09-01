// Pure, deterministic game types for Medieval Sim Mobile Lite

export type PlayerId = number;

export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  isAi: boolean;
  isAlive: boolean;
  treasury: number;
  /** Oyunçunun əsas mərkəz paytaxtı */
  capital: number;
  /** Paytaxtın ardıcıl neçə turn işğalda qaldığı (0..5) */
  capitalLostTurns: number;
}

export interface Region {
  id: number;
  name: string;
  polygon: [number, number][];
  center: [number, number];
  neighbors: number[];
  income: number;
  svgPath?: string;
  fullName?: string;
  stateId?: number;
  stateName?: string;
  stateColor?: string;
  burgName?: string;
  isCapital?: boolean;
  terrain?: 'mountain' | 'forest' | 'plains' | 'hills';
}

export interface RegionState {
  owner: PlayerId; // -1 for neutral (if any), 0..N for players
  troops: number;
  exhaustedTroops: number; // troops that moved or were hired in current turn (cannot march again this turn)
}

/** A border classified as a narrow/mountain chokepoint for rendering only — purely
 *  cosmetic, does not affect which regions can actually attack/move into each other
 *  (see Region.neighbors for that). */
export interface ChokepointEdge {
  regionA: number;
  regionB: number;
  points: [[number, number], [number, number]];
}

export interface MapData {
  name?: string;
  width: number;
  height: number;
  regions: Region[];
  chokepoints?: ChokepointEdge[];
  svgAsset?: string;
}

export interface TurnEvent {
  turn: number;
  playerId: PlayerId;
  type: 'BATTLE' | 'CONQUEST' | 'BANKRUPTCY' | 'ELIMINATION';
  description: string;
  fromRegion?: number;
  toRegion?: number;
  attackerLosses?: number;
  defenderLosses?: number;
  winner?: PlayerId;
}

export type VisibilityLevel = 'VISIBLE' | 'BORDER' | 'FOGGED';

export interface GameState {
  seed: number;
  turn: number;
  maxTurns: number;
  activePlayer: PlayerId;
  players: PlayerState[];
  map: MapData;
  regionState: RegionState[];
  isOver: boolean;
  winner: PlayerId | null;
  events: TurnEvent[];
  fogOfWar?: boolean;
}

export type Action =
  | { type: 'HIRE'; regionId: number; count: number }
  | { type: 'MOVE'; from: number; to: number; count: number }
  | { type: 'DISBAND'; regionId: number; count: number }
  | { type: 'END_TURN' };

export interface BalanceRules {
  unitCost: number;
  unitUpkeep: number;
  regionBaseIncome: number;
  startingTreasury: number;
  startingTroops: number;
  defenderAdvantageRatio: number; // e.g. 1.1x defender power
  /** Share of the defender's army the winning attacker loses. Drives how strong a
   *  conquering garrison is left behind — the main lever on map churn. */
  attackerLossRatio: number;
  /** Share of the attacking army a successful defender loses. */
  defenderLossRatio: number;
  /** Each region keeps at most this many of its closest borders; longer ones become
   *  impassable mountains/rivers. Lower = more chokepoints, more decisive games. */
  maxNeighbors: number;
  /** Troops defending each unowned region at game start. Zero means the opening is a
   *  free land grab decided purely by turn order. */
  neutralGarrison: number;
  maxTurns: number;
  /** Paytaxtı işğaldan azad etmək üçün verilən maksimal möhlət (turn) */
  capitalReconquestTurns: number;
  /** Paytaxtda dayanan müdafiəçiyə verilən əlavə güc */
  capitalDefenseBonus: number;
}

export interface BotPersonality {
  /** Aggression multiplier for attack thresholds (e.g. 1.3 = attacks with less superiority). */
  aggression: number;
  /** Economic greed multiplier (e.g. 1.2 = leaves more margin before spending all gold). */
  greed: number;
}

/**
 * Balance constants. Every number here was chosen by measurement, not taste.
 * See BALANCE.md for the results.
 */
export const RULES: BalanceRules = {
  unitCost: 10,
  unitUpkeep: 2,
  regionBaseIncome: 12,
  startingTreasury: 30,
  startingTroops: 5,
  // 1.5 means an attacker needs real local superiority, not a single spare soldier.
  defenderAdvantageRatio: 1.5,
  // Low attacker losses: once you commit enough force, the conquering army is still
  // strong enough to HOLD the province.
  attackerLossRatio: 0.2,
  defenderLossRatio: 0.7,
  // Natural Voronoi adjacency: every touching polygon is a real traversable neighbor (100% visual-logical parity).
  maxNeighbors: 99,
  neutralGarrison: 0,
  // 40: retuned for simultaneous resolution and natural Voronoi geometry (decisive games ~36-37 turns).
  maxTurns: 40,
  capitalReconquestTurns: 5,
  capitalDefenseBonus: 1,
};

export const PLAYER_PALETTES: {
  name: string;
  color: string;
  border: string;
  personality: BotPersonality;
}[] = [
  { name: 'Kral Qalxanı (Sən)', color: '#3b82f6', border: '#1d4ed8', personality: { aggression: 1.0, greed: 1.0 } }, // Blue
  { name: 'Qırmızı Baron', color: '#ef4444', border: '#b91c1c', personality: { aggression: 1.0, greed: 1.0 } },     // Red (Aggressive warlord)
  { name: 'Zümrüd Qvardiyası', color: '#10b981', border: '#047857', personality: { aggression: 1.0, greed: 1.0 } }, // Green (Economic defender)
  { name: 'Qızıl Hersoq', color: '#f59e0b', border: '#b45309', personality: { aggression: 1.0, greed: 1.0 } },      // Gold (Balanced opportunist)
  { name: 'Bənövşəyi Tac', color: '#8b5cf6', border: '#6d28d9', personality: { aggression: 1.0, greed: 1.0 } },     // Purple
];
