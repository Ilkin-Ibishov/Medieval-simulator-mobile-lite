import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Action, PlayerId, createGame, applyAction, resolveRound, RoundOrders, getDoziaMapData } from '../core';
import { computeBotActions } from '../ai/bot';
import { calculateNetGold } from '../core/rules';
import { Lobby, GameSettings } from './Lobby';
import { MapView } from './MapView';
import { ActionHUD } from './ActionHUD';
import { TurnReport } from './TurnReport';
import { GameOverModal } from './GameOverModal';
import { MultiplayerModal } from './MultiplayerModal';
import { ExitConfirmModal } from './ExitConfirmModal';
import { MockupView } from './MockupView';
import { DiplomacyModal } from './DiplomacyModal';
import { CoinIcon } from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';
import { RealmPickerSheet, RealmStats } from './RealmPickerSheet';
import { DOZIA_PROVINCES } from '../data/maps/dozia_native_provinces';
import { useHardwareBack } from './useHardwareBack';
import './styles.css';

export interface Floater {
  id: number;
  regionId: number;
  text: string;
  kind: 'loss' | 'gain';
}

const SAVE_KEY = 'medsim_lite_savegame';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'LOBBY' | 'REALM_PICKER' | 'PLAYING'>('LOBBY');
  const [selectedScenario, setSelectedScenario] = useState<'HEGEMONY' | 'SHATTERED'>('HEGEMONY');
  const [pickingKingdomId, setPickingKingdomId] = useState<number>(10);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  // Simultaneous Planned Orders for the current round
  const [pendingOrders, setPendingOrders] = useState<Action[]>([]);

  // Selection state
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [targetRegion, setTargetRegion] = useState<number | null>(null);

  // Animation & Feedback
  const [animatingConquest, setAnimatingConquest] = useState<number | null>(null);
  /** Region that just repelled an attack — held, not captured, so it gets its own beat. */
  const [animatingBattle, setAnimatingBattle] = useState<number | null>(null);
  /** Player-wide news (bankruptcy, elimination) that isn't anchored to one region. */
  const [announcement, setAnnouncement] = useState<{ kind: 'bankruptcy' | 'elimination'; text: string } | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  /** March/assault arrow drawn while a battle resolves. */
  const [actionArrow, setActionArrow] = useState<{ from: number; to: number } | null>(null);
  /** Short-lived damage numbers that float off a province. */
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterId = useRef(0);

  // Modals
  const [isTurnReportOpen, setIsTurnReportOpen] = useState<boolean>(false);
  const [isDiplomacyOpen, setIsDiplomacyOpen] = useState<boolean>(false);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState<boolean>(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState<boolean>(false);
  const [isMockupOpen, setIsMockupOpen] = useState<boolean>(() => window.location.hash === '#mockup');

  useEffect(() => {
    const handleHash = () => {
      setIsMockupOpen(window.location.hash === '#mockup');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Ref to hold latest state for async callbacks
  const stateRef = useRef<GameState | null>(null);
  stateRef.current = gameState;

  // Check saved game on mount and when returning to Lobby
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.isOver && parsed.regionState?.length > 0) {
          setHasSavedGame(true);
          return;
        }
      }
    } catch {
      // ignore
    }
    setHasSavedGame(false);
  }, [screen]);

  // Persist game state to localStorage
  useEffect(() => {
    if (!gameState || screen !== 'PLAYING') return;
    if (gameState.isOver) {
      localStorage.removeItem(SAVE_KEY);
      setHasSavedGame(false);
    } else {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      } catch {
        // ignore
      }
    }
  }, [gameState, screen]);

  // Start new game from lobby
  const handleStartGame = (settings: GameSettings) => {
    let newGame: GameState;
    if (settings.mode === 'CAMPAIGN') {
      const doziaMap = getDoziaMapData();
      newGame = createGame({
        seed: settings.seed,
        mapData: doziaMap,
        chosenKingdomId: settings.chosenKingdomId,
        maxTurns: 60,
        humanCount: 1,
        scenario: settings.scenario || selectedScenario,
      });
    } else {
      newGame = createGame({
        seed: settings.seed,
        playerCount: settings.playerCount,
        regionCount: settings.regionCount,
        maxTurns: settings.maxTurns,
        humanCount: 1,
      });
    }
    setGameState(newGame);
    setPendingOrders([]);
    setSelectedRegion(null);
    setTargetRegion(null);
    setScreen('PLAYING');
  };

  // Resume saved game
  const handleResumeGame = () => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        if (parsed && !parsed.isOver) {
          setGameState(parsed);
          setPendingOrders([]);
          setSelectedRegion(null);
          setTargetRegion(null);
          setScreen('PLAYING');
          sounds.playMarch();
          haptics.medium();
        }
      }
    } catch {
      // ignore
    }
  };

  // Hardware Back Button Handler
  useHardwareBack(() => {
    if (isExitConfirmOpen) {
      setIsExitConfirmOpen(false);
      return true;
    }
    if (isMultiplayerModalOpen) {
      setIsMultiplayerModalOpen(false);
      return true;
    }
    if (isTurnReportOpen) {
      setIsTurnReportOpen(false);
      return true;
    }
    if (isDiplomacyOpen) {
      setIsDiplomacyOpen(false);
      return true;
    }
    if (targetRegion !== null) {
      setTargetRegion(null);
      return true;
    }
    if (selectedRegion !== null) {
      setSelectedRegion(null);
      return true;
    }
    if (screen === 'PLAYING') {
      setIsExitConfirmOpen(true);
      return true;
    }
    return false;
  });

  /** Queues a floating damage/gain number over a province for ~1s. */
  const pushFloater = useCallback((regionId: number, text: string, kind: Floater['kind']) => {
    const id = ++floaterId.current;
    setFloaters((f) => [...f, { id, regionId, text, kind }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1000);
  }, []);

  // Queue human planned action for simultaneous execution
  const handleQueueAction = useCallback((action: Action) => {
    if (action.type === 'END_TURN') return;

    if (action.type === 'HIRE') {
      setPendingOrders((prev) => {
        const existing = prev.find((o) => o.type === 'HIRE' && o.regionId === action.regionId);
        if (existing && existing.type === 'HIRE') {
          return prev.map((o) =>
            o === existing ? { ...o, count: existing.count + action.count } : o
          );
        }
        return [...prev, action];
      });
      pushFloater(action.regionId, `+${action.count}`, 'gain');
      setSelectedRegion(null);
      setTargetRegion(null);
    } else if (action.type === 'DISBAND') {
      setPendingOrders((prev) => [...prev, action]);
      pushFloater(action.regionId, `-${action.count}`, 'loss');
      setSelectedRegion(null);
      setTargetRegion(null);
    } else if (action.type === 'MOVE') {
      setPendingOrders((prev) => {
        const existing = prev.find(
          (o) => o.type === 'MOVE' && o.from === action.from && o.to === action.to
        );
        if (existing && existing.type === 'MOVE') {
          return prev.map((o) =>
            o === existing ? { ...o, count: existing.count + action.count } : o
          );
        }
        return [...prev, action];
      });
      setSelectedRegion(null);
      setTargetRegion(null);
    }
  }, [pushFloater]);

  // Cancel a planned queued order
  const handleCancelQueuedOrder = useCallback((actionToCancel: Action) => {
    sounds.playClick();
    haptics.light();
    setPendingOrders((prev) => prev.filter((o) => o !== actionToCancel));
  }, []);

  // Execute simultaneous round when user taps "Növbəni Bitir"
  const handleEndTurn = async () => {
    if (!gameState || gameState.isOver || isResolving) return;

    sounds.playMarch();
    haptics.heavy();
    setIsResolving(true);
    setSelectedRegion(null);
    setTargetRegion(null);

    // Compute AI bot orders for this round based on round-start state
    const roundOrders: RoundOrders = {
      0: pendingOrders,
    };

    for (const p of gameState.players) {
      if (p.isAi && p.isAlive) {
        const view: GameState = { ...gameState, activePlayer: p.id };
        roundOrders[p.id] = computeBotActions(view, p.id);
      }
    }

    // Core resolves the whole round in one deterministic step, but a round that
    // silently flips five provinces at once in a single frame reads as a glitch,
    // not a battle. Narrate it back to the player in three tiers of drama:
    // AI economy orders get a quick floater, conquests and repelled attacks
    // get their own beat, and everything else settles instantly at the end.
    const nextState = resolveRound(gameState, roundOrders);
    const newEvents = nextState.events.slice(gameState.events.length);

    // The human's own hire/disband already got an instant floater the moment
    // they tapped the button — re-showing it here would just be an echo. Only
    // the AI's economy moves are otherwise invisible to the player.
    for (const p of gameState.players) {
      if (!p.isAi || !p.isAlive) continue;
      for (const action of roundOrders[p.id] ?? []) {
        if (action.type === 'HIRE') {
          sounds.playHire();
          pushFloater(action.regionId, `+${action.count}`, 'gain');
          await sleep(180);
        } else if (action.type === 'DISBAND') {
          sounds.playDisband();
          pushFloater(action.regionId, `-${action.count}`, 'loss');
          await sleep(180);
        }
      }
    }

    // Walk the round's events in the order the engine produced them, so an
    // elimination that fires right after the conquest which caused it still
    // reads as "that conquest, then the fall" instead of two unrelated beats.
    let staged = gameState;
    for (const ev of newEvents) {
      if (ev.type === 'CONQUEST' && ev.fromRegion !== undefined && ev.toRegion !== undefined) {
        const toRegion = ev.toRegion;
        setActionArrow({ from: ev.fromRegion, to: toRegion });
        await sleep(420);
        setActionArrow(null);

        // Reveal just this province's new state — the rest of the round
        // (other battles, upkeep, hires) stays hidden until the final settle below.
        staged = {
          ...staged,
          regionState: staged.regionState.map((rs, idx) => (idx === toRegion ? nextState.regionState[toRegion] : rs)),
        };
        setGameState(staged);

        sounds.playConquest();
        haptics.heavy();
        setAnimatingConquest(toRegion);
        if (ev.attackerLosses) pushFloater(toRegion, `-${ev.attackerLosses}`, 'loss');
        await sleep(520);
        setAnimatingConquest(null);
      } else if (ev.type === 'BATTLE' && ev.fromRegion !== undefined && ev.toRegion !== undefined) {
        const toRegion = ev.toRegion;
        setActionArrow({ from: ev.fromRegion, to: toRegion });
        await sleep(420);
        setActionArrow(null);

        staged = {
          ...staged,
          regionState: staged.regionState.map((rs, idx) => (idx === toRegion ? nextState.regionState[toRegion] : rs)),
        };
        setGameState(staged);

        // The province held. Shorter, redder beat — nothing changed hands, so
        // it shouldn't linger as long as an actual conquest does.
        sounds.playRepelled();
        haptics.medium();
        setAnimatingBattle(toRegion);
        if (ev.attackerLosses) pushFloater(toRegion, `-${ev.attackerLosses}`, 'loss');
        await sleep(380);
        setAnimatingBattle(null);
      } else if (ev.type === 'ELIMINATION') {
        // A whole kingdom falling is the biggest non-victory beat in the round.
        sounds.playElimination();
        haptics.heavy();
        setAnnouncement({ kind: 'elimination', text: ev.description });
        await sleep(650);
        setAnnouncement(null);
      } else if (ev.type === 'BANKRUPTCY') {
        sounds.playBankruptcy();
        haptics.medium();
        setAnnouncement({ kind: 'bankruptcy', text: ev.description });
        await sleep(480);
        setAnnouncement(null);
      }
    }

    setGameState(nextState);
    setPendingOrders([]);
    setIsResolving(false);

    if (nextState.isOver) {
      if (nextState.winner === 0) sounds.playVictory();
      else sounds.playDefeat();
      haptics.heavy();
    }
  };

  // Region Click handler
  const handleSelectRegion = (regionId: number) => {
    if (!gameState || isResolving) return;

    sounds.playClick();
    haptics.light();

    const rState = gameState.regionState[regionId];
    const isOwned = rState?.owner === gameState.activePlayer;

    if (selectedRegion === null) {
      // First selection: select if owned or just inspect
      setSelectedRegion(regionId);
      setTargetRegion(null);
    } else if (selectedRegion === regionId) {
      // Tapping same region deselects
      setSelectedRegion(null);
      setTargetRegion(null);
    } else {
      // Check if clicked region is a neighbor of selectedRegion
      const neighbors = gameState.map.regions[selectedRegion]?.neighbors || [];
      if (neighbors.includes(regionId) && gameState.regionState[selectedRegion]?.owner === gameState.activePlayer) {
        // Valid target neighbor selected!
        setTargetRegion(regionId);
      } else {
        // Change selection to new territory if owned, or inspect
        if (isOwned) {
          setSelectedRegion(regionId);
          setTargetRegion(null);
        } else {
          setSelectedRegion(regionId);
          setTargetRegion(null);
        }
      }
    }
  };

  // Diplomacy action handlers
  const handleProposePact = (targetPlayer: PlayerId) => {
    if (!gameState) return;
    const next = applyAction(gameState, { type: 'PROPOSE_PACT', targetPlayer });
    setGameState(next);
  };

  const handleSendTribute = (targetPlayer: PlayerId) => {
    if (!gameState) return;
    const next = applyAction(gameState, { type: 'SEND_TRIBUTE', targetPlayer });
    setGameState(next);
  };

  const handleBreakPact = (targetPlayer: PlayerId) => {
    if (!gameState) return;
    const next = applyAction(gameState, { type: 'BREAK_PACT', targetPlayer });
    setGameState(next);
  };

  // Discover kingdom stats for realm picker
  const kingdomStatsMap = React.useMemo(() => {
    const map = new Map<number, RealmStats>();
    for (const p of DOZIA_PROVINCES) {
      const isCap = p.isCapital;
      const baseTroops = isCap ? 7 : (p.income && p.income >= 10 ? 6 : 4);
      const inc = p.income || 6;

      if (!map.has(p.stateId)) {
        map.set(p.stateId, {
          id: p.stateId,
          name: p.stateName,
          color: p.stateColor,
          provinceCount: 1,
          capitalName: isCap ? p.name : '',
          totalTroops: baseTroops,
          turnIncome: inc,
          mapSharePercent: 0,
        });
      } else {
        const item = map.get(p.stateId)!;
        item.provinceCount++;
        item.totalTroops += baseTroops;
        item.turnIncome += inc;
        if (isCap) item.capitalName = p.name;
      }
    }

    const totalProvinces = DOZIA_PROVINCES.length;
    for (const item of map.values()) {
      item.mapSharePercent = Math.round((item.provinceCount / totalProvinces) * 100);
    }
    return map;
  }, []);

  if (isMockupOpen) {
    return (
      <MockupView
        onBackToGame={() => {
          window.location.hash = '';
          setIsMockupOpen(false);
        }}
      />
    );
  }

  if (screen === 'LOBBY') {
    return (
      <>
        <Lobby
          hasSavedGame={hasSavedGame}
          onResumeGame={handleResumeGame}
          onStartGame={handleStartGame}
          onOpenRealmPicker={() => {
            setPickingKingdomId(10);
            setScreen('REALM_PICKER');
          }}
          onOpenMultiplayerModal={() => setIsMultiplayerModalOpen(true)}
          onOpenMockup={() => {
            window.location.hash = '#mockup';
            setIsMockupOpen(true);
          }}
        />
        {isMultiplayerModalOpen && (
          <MultiplayerModal onClose={() => setIsMultiplayerModalOpen(false)} />
        )}
      </>
    );
  }

  if (screen === 'REALM_PICKER') {
    const doziaMap = getDoziaMapData();
    const currentStats = kingdomStatsMap.get(pickingKingdomId) || Array.from(kingdomStatsMap.values())[0];
    const allKingdomIds = Array.from(kingdomStatsMap.keys());
    const isShattered = selectedScenario === 'SHATTERED';

    // Preview GameState with 10 players and zero fog
    const previewGame: GameState = {
      seed: 12345,
      turn: 1,
      maxTurns: 60,
      activePlayer: 0,
      players: Array.from(kingdomStatsMap.values()).map((k, idx) => ({
        id: idx,
        name: k.name,
        color: k.color,
        isAi: true,
        isAlive: true,
        treasury: 30,
        capital: 0,
        capitalLostTurns: 0,
      })),
      map: doziaMap,
      regionState: doziaMap.regions.map((r) => {
        const isCap = r.isCapital;
        if (isShattered) {
          return {
            owner: isCap && r.stateId !== undefined ? r.stateId - 1 : -1,
            troops: isCap ? 8 : 2,
            exhaustedTroops: 0,
          };
        }
        return {
          owner: r.stateId !== undefined ? r.stateId - 1 : -1,
          troops: isCap ? 7 : (r.income && r.income >= 10 ? 6 : 4),
          exhaustedTroops: 0,
        };
      }),
      isOver: false,
      winner: null,
      events: [],
      fogOfWar: false,
      scenario: selectedScenario,
    };

    return (
      <div className="game-container">
        {/* Top Floating Guide & Scenario Switcher Bar */}
        <div className="realm-picker-topbar">
          <button
            className="btn-picker-back"
            onClick={() => {
              sounds.playClick();
              haptics.light();
              setScreen('LOBBY');
            }}
          >
            ← Lobbi
          </button>

          {/* Scenario Mode Switcher Tabs */}
          <div className="realm-scenario-tabs">
            <button
              className={`scenario-tab-btn ${selectedScenario === 'HEGEMONY' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                haptics.light();
                setSelectedScenario('HEGEMONY');
              }}
            >
              👑 Hegemonluq
            </button>
            <button
              className={`scenario-tab-btn ${selectedScenario === 'SHATTERED' ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                haptics.light();
                setSelectedScenario('SHATTERED');
              }}
            >
              ⚔️ Sındırılmış Dünya
            </button>
          </div>
        </div>

        {/* Map Viewport in Realm Selection Mode */}
        <main className="game-main-area">
          <MapView
            gameState={previewGame}
            selectedRegion={null}
            targetRegion={null}
            onSelectRegion={() => {}}
            isPickingRealm={true}
            chosenKingdomId={pickingKingdomId}
            onSelectKingdom={(kId) => {
              setPickingKingdomId(kId);
            }}
          />
        </main>

        {/* Floating Bottom Realm Detail Sheet */}
        <RealmPickerSheet
          stats={currentStats}
          scenario={selectedScenario}
          onConfirmStart={() => {
            handleStartGame({
              mode: 'CAMPAIGN',
              chosenKingdomId: pickingKingdomId,
              regionCount: 117,
              playerCount: 10,
              seed: Math.floor(Math.random() * 99999) + 1,
              maxTurns: 60,
              scenario: selectedScenario,
            });
          }}
          onRandomKingdom={() => {
            const otherIds = allKingdomIds.filter((id) => id !== pickingKingdomId);
            const randomId = otherIds[Math.floor(Math.random() * otherIds.length)];
            setPickingKingdomId(randomId);
          }}
        />
      </div>
    );
  }

  if (!gameState) return null;

  const humanPlayer = gameState.players[0];
  const netIncome = calculateNetGold(gameState, 0);
  const pendingHireCost = pendingOrders
    .filter((o) => o.type === 'HIRE')
    .reduce((sum, o) => sum + (o.type === 'HIRE' ? o.count * 10 : 0), 0);
  const displayTreasury = Math.max(0, humanPlayer.treasury - pendingHireCost);

  return (
    <div className="game-container">
      {/* Top Status Bar */}
      <header className="game-top-bar">
        <div className="turn-indicator">
          <span className="turn-pill">Raund {gameState.turn}</span>
          <span
            className="active-player-chip"
            style={{ color: '#7a97bf' }}
          >
            {isResolving ? '⏳ Həll olunur' : '👑 Planlaşdırma'}
          </span>
        </div>

        <div className="resource-bar">
          <div className="res-chip">
            <CoinIcon size={16} className="text-gold" />
            <span>{displayTreasury}G</span>
            <span className={netIncome >= 0 ? 'text-green' : 'text-red'} style={{ fontSize: '0.75rem' }}>
              ({netIncome >= 0 ? `+${netIncome}` : netIncome})
            </span>
          </div>

          <button
            className="btn btn-secondary btn-pill btn-diplomacy"
            onClick={() => {
              sounds.playClick();
              haptics.light();
              setIsDiplomacyOpen(true);
            }}
            title="Diplomatiya və Paktlar"
            aria-label="Diplomatiya və Paktlar"
          >
            <span aria-hidden="true">🤝</span>
            <span className="btn-report-label">Paktlar</span>
          </button>

          <button
            className="btn btn-secondary btn-pill btn-report"
            onClick={() => setIsTurnReportOpen(true)}
            title="Hesabat"
            aria-label="Hesabat"
          >
            <span aria-hidden="true">📜</span>
            <span className="btn-report-label">Hesabat</span>
          </button>
        </div>
      </header>

      {/* Main Game Area: Responsive Map Viewport */}
      <main className="game-main-area">
        {announcement && (
          <div className={`round-announcement round-announcement-${announcement.kind}`}>
            {announcement.kind === 'elimination' ? '💀' : '💸'} {announcement.text}
          </div>
        )}
        <MapView
          gameState={gameState}
          selectedRegion={selectedRegion}
          targetRegion={targetRegion}
          onSelectRegion={handleSelectRegion}
          animatingConquest={animatingConquest}
          animatingBattle={animatingBattle}
          actionArrow={actionArrow}
          pendingArrows={pendingOrders
            .filter((o): o is { type: 'MOVE'; from: number; to: number; count: number } => o.type === 'MOVE')
            .map((o) => ({ from: o.from, to: o.to, count: o.count }))}
          floaters={floaters}
        />

        {/* Floating Contextual Action HUD */}
        {selectedRegion !== null && !isResolving && (
          <ActionHUD
            gameState={gameState}
            selectedRegion={selectedRegion}
            targetRegion={targetRegion}
            queuedOrders={pendingOrders}
            onApplyAction={handleQueueAction}
            onCancelQueuedOrder={handleCancelQueuedOrder}
            onSelectTargetRegion={(rId) => setTargetRegion(rId)}
            onDeselect={() => {
              setSelectedRegion(null);
              setTargetRegion(null);
            }}
          />
        )}
      </main>

      {/* Bottom Command Bar */}
      <footer className="game-bottom-bar">
        <button
          className="btn btn-secondary"
          onClick={() => setIsExitConfirmOpen(true)}
        >
          Menyu
        </button>

        <div className="bottom-bar-hint text-muted">
          {isResolving
            ? 'Bütün lordların əmrləri həll olunur...'
            : pendingOrders.length > 0
            ? `${pendingOrders.length} əmr planlaşdırılıb.`
            : 'Ərazilərə toxunaraq yürüş və yığım planla.'}
        </div>

        <button
          className={`btn ${isResolving ? 'btn-secondary' : 'btn-gold'}`}
          disabled={isResolving}
          onClick={handleEndTurn}
        >
          {isResolving
            ? '⏳ Həll Olunur...'
            : pendingOrders.length > 0
            ? `Növbəni Bitir (${pendingOrders.length} Əmr) ➔`
            : 'Növbəni Bitir ➔'}
        </button>
      </footer>

      {/* Exit Confirmation Modal */}
      {isExitConfirmOpen && (
        <ExitConfirmModal
          onConfirmExit={() => {
            setIsExitConfirmOpen(false);
            setScreen('LOBBY');
          }}
          onCancel={() => setIsExitConfirmOpen(false)}
        />
      )}

      {/* Turn Report Modal */}
      {isTurnReportOpen && (
        <TurnReport
          gameState={gameState}
          onClose={() => setIsTurnReportOpen(false)}
        />
      )}

      {/* Diplomacy & Pacts Modal */}
      {isDiplomacyOpen && (
        <DiplomacyModal
          gameState={gameState}
          isOpen={isDiplomacyOpen}
          onClose={() => setIsDiplomacyOpen(false)}
          onProposePact={handleProposePact}
          onSendTribute={handleSendTribute}
          onBreakPact={handleBreakPact}
        />
      )}

      {/* Game Over Modal */}
      {gameState.isOver && (
        <GameOverModal
          gameState={gameState}
          onPlayAgain={() => setScreen('LOBBY')}
        />
      )}
    </div>
  );
};
