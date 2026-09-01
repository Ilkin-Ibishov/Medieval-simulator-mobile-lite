import React, { useState, useEffect } from 'react';
import { GameState, Action, RULES } from '../core/types';
import { getReadyTroops, previewCombat } from '../core/rules';
import { SwordIcon, ShieldIcon, CoinIcon } from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';

interface ActionHUDProps {
  gameState: GameState;
  selectedRegion: number | null;
  targetRegion: number | null;
  queuedOrders?: Action[];
  onApplyAction: (action: Action) => void;
  onCancelQueuedOrder?: (action: Action) => void;
  onSelectTargetRegion: (regionId: number | null) => void;
  onDeselect: () => void;
}

export const ActionHUD: React.FC<ActionHUDProps> = ({
  gameState,
  selectedRegion,
  targetRegion,
  queuedOrders,
  onApplyAction,
  onCancelQueuedOrder,
  onSelectTargetRegion,
  onDeselect,
}) => {
  if (selectedRegion === null) return null;

  const { regionState, map, players, activePlayer } = gameState;
  const currentRegion = map.regions[selectedRegion];
  const currentRState = regionState[selectedRegion];
  const player = players[activePlayer];
  const isOwned = currentRState?.owner === activePlayer;

  // Account for planned moves already departing from this region
  const queuedDepartures =
    queuedOrders
      ?.filter((o) => o.type === 'MOVE' && o.from === selectedRegion)
      .reduce((sum, o) => sum + (o.type === 'MOVE' ? o.count : 0), 0) ?? 0;

  // Account for gold spent on pending recruitment
  const queuedHireCost =
    queuedOrders
      ?.filter((o) => o.type === 'HIRE')
      .reduce((sum, o) => sum + (o.type === 'HIRE' ? o.count * RULES.unitCost : 0), 0) ?? 0;

  const effectiveTreasury = Math.max(0, player.treasury - queuedHireCost);
  const maxAffordable = Math.floor(effectiveTreasury / RULES.unitCost);

  // Available ready troops (excluding newly hired, moved units, and already queued departures)
  const baseReady = isOwned ? getReadyTroops(gameState, selectedRegion) : 0;
  const availableToMove = Math.max(0, baseReady - queuedDepartures);
  const [moveCount, setMoveCount] = useState<number>(availableToMove);

  // Reset moveCount when target or selection changes
  useEffect(() => {
    setMoveCount(availableToMove);
  }, [selectedRegion, targetRegion, availableToMove]);

  // Target info
  const targetR = targetRegion !== null ? map.regions[targetRegion] : null;
  const targetRState = targetRegion !== null ? regionState[targetRegion] : null;
  const isFriendlyTarget = targetRState?.owner === activePlayer;

  // Pending moves from this region
  const pendingMovesFromHere =
    queuedOrders?.filter((o) => o.type === 'MOVE' && o.from === selectedRegion) ?? [];

  // Combat preview
  const combatPreview =
    targetRState && !isFriendlyTarget
      ? previewCombat(moveCount, targetRState.troops)
      : null;

  const handleHire = (count: number) => {
    sounds.playHire();
    haptics.medium();
    onApplyAction({
      type: 'HIRE',
      regionId: selectedRegion,
      count,
    });
  };

  const handleDisband = (count: number) => {
    sounds.playDisband();
    haptics.light();
    onApplyAction({
      type: 'DISBAND',
      regionId: selectedRegion,
      count,
    });
  };

  const handleExecuteMove = () => {
    if (targetRegion === null || moveCount <= 0) return;
    // No combat sound here on purpose: at this point the outcome is unknown to the UI.
    // App plays the sound from the resulting event, so a won and a repelled assault
    // no longer sound identical. Friendly marches have no outcome, so they stay.
    if (isFriendlyTarget) {
      sounds.playMarch();
      haptics.medium();
    } else {
      haptics.heavy();
    }
    onApplyAction({
      type: 'MOVE',
      from: selectedRegion,
      to: targetRegion,
      count: moveCount,
    });
  };

  // Slider percentage calculation for visual track fill
  const sliderPercentage =
    availableToMove > 0
      ? Math.round((moveCount / availableToMove) * 100)
      : 0;

  return (
    <div className="action-hud-floating">
      {/* HUD Header */}
      <div className="hud-header">
        <div className="hud-title-group">
          <span className="hud-region-name">{currentRegion.name}</span>
          <span className="hud-badge">
            {isOwned ? '👑 Sənin' : '🏴 Düşmən'} · {currentRState.troops} Qoşun
            {isOwned && currentRState.exhaustedTroops > 0 && (
              <span className="text-muted" style={{ marginLeft: 4 }}>
                ({availableToMove} hazır)
              </span>
            )}{' '}
            · +{currentRegion.income}G
          </span>
        </div>
        <button className="hud-close-btn" onClick={onDeselect} title="Bağla">
          ✕
        </button>
      </div>

      {/* Mode A: Owned Region Selected & No Target yet */}
      {isOwned && targetRegion === null && (
        <div className="hud-body">
          {/* Quick Recruitment Row */}
          <div className="hud-action-row">
            <button
              className="btn btn-primary btn-sm"
              disabled={maxAffordable < 1}
              onClick={() => handleHire(1)}
            >
              <CoinIcon size={14} /> +1 ({RULES.unitCost}G)
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={maxAffordable < 3}
              onClick={() => handleHire(Math.min(3, maxAffordable))}
            >
              <CoinIcon size={14} /> +3 ({Math.min(3, maxAffordable) * RULES.unitCost}G)
            </button>
            {maxAffordable > 3 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleHire(maxAffordable)}
              >
                Maks ({maxAffordable})
              </button>
            )}
            {currentRState.troops > 0 && (
              <button
                className="btn btn-danger-outline btn-sm"
                onClick={() => handleDisband(1)}
              >
                -1 Tərxis (+5G)
              </button>
            )}
          </div>

          {/* Pending Planned Orders from this province */}
          {pendingMovesFromHere.length > 0 && (
            <div className="hud-pending-orders-list">
              <span className="text-xs text-muted">Planlaşdırılmış Yürüşlər:</span>
              {pendingMovesFromHere.map((pm, idx) => (
                <div key={`pm-${idx}`} className="hud-pending-order-chip">
                  <span>
                    ➔ {map.regions[pm.type === 'MOVE' ? pm.to : 0].name} ({pm.type === 'MOVE' ? pm.count : 0} əsgər)
                  </span>
                  {onCancelQueuedOrder && (
                    <button
                      className="btn-xs btn-pill"
                      onClick={() => onCancelQueuedOrder(pm)}
                      title="Ləğv et"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Unit fatigue notice if all troops in this province are resting or already assigned */}
          {availableToMove === 0 && currentRState.troops > 0 && (
            <div className="hud-fatigue-notice">
              {queuedDepartures > 0
                ? '📍 Bütün hazır qoşunlar üçün yürüş əmri verilib.'
                : '⏳ Bu ərazidəki qoşunlar bu turn hərəkət edib və ya yeni yığılıb (Gözləyir).'}
            </div>
          )}
        </div>
      )}

      {/* Mode B: Target Selected (Move / Attack Confirmation) */}
      {isOwned && targetRegion !== null && targetR && targetRState && (
        <div className="hud-body">
          {/* Target Banner */}
          <div className="hud-target-row">
            <div className="hud-target-badge">
              <strong>{isFriendlyTarget ? '🛡️ Köçür ➔ ' : '⚔️ Hücum ➔ '}</strong>
              <span>
                {targetR.name} ({targetRState.troops} əsgər)
              </span>
            </div>
            <button
              className="btn-pill btn-xs"
              onClick={() => onSelectTargetRegion(null)}
            >
              ← Dəyiş
            </button>
          </div>

          {/* Troop Allocation Stepper & Slider */}
          <div className="hud-slider-box">
            <div className="hud-slider-info">
              <span>Göndərilən Ordu:</span>
              <span className="text-gold font-bold">
                {moveCount} / {availableToMove} ({sliderPercentage}%)
              </span>
            </div>

            <div className="hud-stepper-row">
              <button
                className="btn-pill btn-xs btn-stepper"
                disabled={moveCount <= 1}
                onClick={() => {
                  setMoveCount((prev) => Math.max(1, prev - 1));
                  haptics.light();
                }}
              >
                −
              </button>

              <input
                type="range"
                min={1}
                max={Math.max(1, availableToMove)}
                value={moveCount}
                disabled={availableToMove <= 0}
                onChange={(e) => {
                  setMoveCount(parseInt(e.target.value, 10));
                  haptics.light();
                }}
                className="range-slider"
              />

              <button
                className="btn-pill btn-xs btn-stepper"
                disabled={moveCount >= availableToMove}
                onClick={() => {
                  setMoveCount((prev) => Math.min(availableToMove, prev + 1));
                  haptics.light();
                }}
              >
                +
              </button>

              <div className="hud-quick-pills">
                <button
                  className="btn-pill btn-xs"
                  disabled={availableToMove <= 0}
                  onClick={() => setMoveCount(1)}
                >
                  1
                </button>
                <button
                  className="btn-pill btn-xs"
                  disabled={availableToMove <= 1}
                  onClick={() =>
                    setMoveCount(Math.max(1, Math.round(availableToMove * 0.5)))
                  }
                >
                  50%
                </button>
                <button
                  className="btn-pill btn-xs"
                  disabled={availableToMove <= 0}
                  onClick={() => setMoveCount(availableToMove)}
                >
                  Hamısı
                </button>
              </div>
            </div>
          </div>

          {/* Combat Preview Card */}
          {!isFriendlyTarget && combatPreview && (
            <div
              className={`hud-combat-preview ${
                combatPreview.willWin ? 'win' : 'lose'
              }`}
            >
              <div className="hud-combat-status">
                {combatPreview.willWin ? (
                  <SwordIcon size={14} />
                ) : (
                  <ShieldIcon size={14} />
                )}
                <span>
                  {combatPreview.willWin
                    ? `Qələbə Proqnozu (${
                        combatPreview.confidence === 'CERTAIN_VICTORY'
                          ? 'Mütləq Zəfər'
                          : 'Yüksək Şans'
                      })`
                    : 'Məğlubiyyət Təhlükəsi!'}
                </span>
              </div>
              <div className="hud-combat-numbers">
                <span>
                  İtki: <strong>~{combatPreview.attackerLosses}</strong>
                </span>
                <span>
                  Düşmən itkisi: <strong>~{combatPreview.defenderLosses}</strong>
                </span>
                <span>
                  Qalan ordu: <strong>{combatPreview.attackerSurviving}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Action CTA Button */}
          <button
            className={`btn btn-block ${
              isFriendlyTarget ? 'btn-primary' : 'btn-danger'
            }`}
            disabled={moveCount <= 0 || availableToMove <= 0}
            onClick={handleExecuteMove}
          >
            {isFriendlyTarget ? (
              <>🛡️ Köçürmə Əmri Ver ({moveCount} Əsgər)</>
            ) : (
              <>⚔️ Hücum Əmri Ver ({moveCount} Əsgər)</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
