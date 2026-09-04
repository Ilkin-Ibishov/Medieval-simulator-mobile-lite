import React, { useState, useEffect } from 'react';
import {
  GameState,
  Action,
  RULES,
} from '../core/types';
import {
  previewCombat,
  getReadyTroops,
  getRegionVisibility,
  hasActivePact,
  getDiplomaticRelation,
  canProposePact,
  canSendTribute,
  getOwnedRegionCount,
  calculatePlayerTroopCount,
} from '../core/rules';
import { DOZIA_KINGDOMS_METADATA } from '../data/maps/dozia_native_provinces';
import {
  ShieldIcon,
  FortressIcon,
  WatchtowerIcon,
  CrossedSwordsIcon,
  SingleCoinIcon,
  CrownIcon,
  PactScrollIcon,
  TributeIcon,
  CompassIcon,
  WarningSealIcon,
  FeatherQuillIcon,
  UsersIcon,
} from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';

interface ActionHUDProps {
  gameState: GameState;
  selectedRegion: number;
  targetRegion: number | null;
  queuedOrders?: Action[];
  onApplyAction: (action: Action) => void;
  onCancelQueuedOrder?: (action: Action) => void;
  onSelectTargetRegion: (regionId: number | null) => void;
  onDeselect: () => void;
  onRequestBetrayal?: (action: Action) => void;
  onOpenDiplomacy?: (targetPlayerId?: number) => void;
  onProposePact?: (targetPlayerId: number) => void;
  onSendTribute?: (targetPlayerId: number) => void;
}

export const ActionHUD: React.FC<ActionHUDProps> = ({
  gameState,
  selectedRegion,
  targetRegion,
  queuedOrders = [],
  onApplyAction,
  onCancelQueuedOrder,
  onSelectTargetRegion,
  onDeselect,
  onRequestBetrayal,
  onOpenDiplomacy,
  onProposePact,
  onSendTribute,
}) => {
  const { map, regionState, players, activePlayer } = gameState;
  const currentRegion = map.regions[selectedRegion];
  const currentRState = regionState[selectedRegion];
  if (!currentRegion || !currentRState) return null;

  const player = players[activePlayer];
  const isOwned = currentRState?.owner === activePlayer;
  const visibility = getRegionVisibility(gameState, activePlayer, selectedRegion);
  const isFogged = visibility === 'FOGGED';

  // Account for planned moves already departing from this region
  const queuedDepartures =
    queuedOrders
      ?.filter((o) => o.type === 'MOVE' && o.from === selectedRegion)
      .reduce((sum, o) => sum + (o.type === 'MOVE' ? o.count : 0), 0) ?? 0;

  // Account for all gold committed in queued orders
  const queuedGoldSpent =
    queuedOrders?.reduce((sum, o) => {
      if (o.type === 'HIRE') return sum + o.count * RULES.unitCost;
      if (o.type === 'BUILD') {
        return sum + (o.building === 'FORT' ? RULES.fortCost : o.building === 'WATCHTOWER' ? RULES.watchtowerCost : 0);
      }
      if (o.type === 'PROPOSE_PACT') return sum + RULES.pactCost;
      if (o.type === 'SEND_TRIBUTE') return sum + RULES.tributeCost;
      return sum;
    }, 0) ?? 0;

  const effectiveTreasury = Math.max(0, player.treasury - queuedGoldSpent);
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
  const isAllyTarget =
    targetRState &&
    targetRState.owner >= 0 &&
    targetRState.owner !== activePlayer &&
    hasActivePact(gameState, activePlayer, targetRState.owner);

  // Pending orders related to this region
  const pendingOrdersForHere = queuedOrders.filter(
    (o) =>
      (o.type === 'MOVE' && o.from === selectedRegion) ||
      (o.type === 'HIRE' && o.regionId === selectedRegion) ||
      (o.type === 'BUILD' && o.regionId === selectedRegion) ||
      (o.type === 'DISBAND' && o.regionId === selectedRegion)
  );

  const queuedBuild = queuedOrders.find(
    (o) => o.type === 'BUILD' && o.regionId === selectedRegion
  );

  // Combat preview
  const combatPreview =
    targetRState && !isFriendlyTarget
      ? previewCombat(moveCount, targetRState.troops, {
          isCapital: targetR?.isCapital,
          hasFort: targetRState.building === 'FORT',
        })
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

  const handleBuild = (building: 'FORT' | 'WATCHTOWER') => {
    sounds.playHire();
    haptics.medium();
    onApplyAction({
      type: 'BUILD',
      regionId: selectedRegion,
      building,
    });
  };

  const handleExecuteMove = () => {
    if (targetRegion === null || moveCount <= 0) return;
    const moveAction: Action = {
      type: 'MOVE',
      from: selectedRegion,
      to: targetRegion,
      count: moveCount,
    };

    if (isAllyTarget && onRequestBetrayal) {
      onRequestBetrayal(moveAction);
      return;
    }

    if (isFriendlyTarget) {
      sounds.playMarch();
      haptics.medium();
    } else {
      haptics.heavy();
    }
    onApplyAction(moveAction);
  };

  // Slider percentage calculation for visual track fill
  const sliderPercentage =
    availableToMove > 0
      ? Math.round((moveCount / availableToMove) * 100)
      : 0;

  // Foreign owner info (for unowned inspection)
  const foreignOwnerId = currentRState.owner;
  const foreignOwner = foreignOwnerId >= 0 ? players[foreignOwnerId] : null;
  const foreignMeta = foreignOwner ? DOZIA_KINGDOMS_METADATA[foreignOwner.id + 1] : null;
  const foreignRel = foreignOwner ? getDiplomaticRelation(gameState, activePlayer, foreignOwner.id) : null;
  const foreignPactCheck = foreignOwner ? canProposePact(gameState, activePlayer, foreignOwner.id) : null;
  const foreignTributeCheck = foreignOwner ? canSendTribute(gameState, activePlayer, foreignOwner.id) : null;
  const foreignOwnedProvinces = foreignOwner ? getOwnedRegionCount(gameState, foreignOwner.id) : 0;
  const foreignTotalTroops = foreignOwner ? calculatePlayerTroopCount(gameState, foreignOwner.id) : 0;

  return (
    <div className="action-hud-floating war-command-slab">
      {/* HUD Header */}
      <div className="hud-header">
        <div className="hud-title-group">
          <div className="hud-crest-icon">
            {isOwned ? (
              <CrownIcon size={18} color="#d9a43a" />
            ) : currentRegion.isCapital ? (
              <CrownIcon size={18} color={foreignOwner?.color || '#ef4444'} />
            ) : (
              <ShieldIcon size={18} color={foreignOwner?.color || '#a99878'} />
            )}
          </div>
          <div>
            <div className="hud-province-title">
              <strong>{currentRegion.name}</strong>
              {currentRegion.isCapital && (
                <span className="badge-capital-gold">
                  <CrownIcon size={10} color="#f59e0b" /> PAYTAXT
                </span>
              )}
            </div>
            <div className="hud-province-meta">
              <span className="hud-stat-item">
                <ShieldIcon size={12} />
                {isFogged ? '?' : currentRState.troops + ' əsgər'}
                {isOwned && baseReady < currentRState.troops && (
                  <span className="text-xs text-muted" title="Hazır hərbi qüvvə">
                    {' '}({baseReady} hazır)
                  </span>
                )}
              </span>
              <span className="hud-stat-item text-gold">
                <SingleCoinIcon size={12} /> +{isFogged ? '?' : currentRegion.income}G
              </span>
              {currentRState.building && currentRState.building !== 'NONE' && (
                <span className="hud-stat-item hud-building-tag">
                  {currentRState.building === 'FORT' ? (
                    <><FortressIcon size={12} /> Qala</>
                  ) : (
                    <><WatchtowerIcon size={12} /> Qüllə</>
                  )}
                </span>
              )}
              {queuedBuild && queuedBuild.type === 'BUILD' && (
                <span className="hud-stat-item text-gold">
                  {queuedBuild.building === 'FORT' ? (
                    <><FortressIcon size={12} /> +Qala (Plan)</>
                  ) : (
                    <><WatchtowerIcon size={12} /> +Qüllə (Plan)</>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="hud-close-btn" onClick={onDeselect} title="Bağla" aria-label="Bağla">
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
              <SingleCoinIcon size={13} /> +1 ({RULES.unitCost}G)
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={maxAffordable < 3}
              onClick={() => handleHire(Math.min(3, maxAffordable))}
            >
              <SingleCoinIcon size={13} /> +3 ({Math.min(3, maxAffordable) * RULES.unitCost}G)
            </button>
            {maxAffordable > 3 && (
              <button
                className="btn btn-primary btn-sm"
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

          {/* Tactical Fortifications Row */}
          <div className="hud-action-row" style={{ marginTop: 6 }}>
            {currentRState.building === 'FORT' || (queuedBuild?.type === 'BUILD' && queuedBuild.building === 'FORT') ? (
              <span className="badge-ribbon-gold">
                <FortressIcon size={13} /> Qala {queuedBuild ? '(Planlaşdırılıb)' : 'Aktiv (+2 Müdafiə)'}
              </span>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                disabled={effectiveTreasury < RULES.fortCost}
                onClick={() => handleBuild('FORT')}
                title="Qala: Müdafiə olunan qoşunlara +2 döyüş gücü verir"
              >
                <FortressIcon size={13} /> Qala ({RULES.fortCost}G)
              </button>
            )}

            {currentRState.building === 'WATCHTOWER' || (queuedBuild?.type === 'BUILD' && queuedBuild.building === 'WATCHTOWER') ? (
              <span className="badge-ribbon-primary">
                <WatchtowerIcon size={13} /> Qüllə {queuedBuild ? '(Planlaşdırılıb)' : 'Aktiv (2-hop)'}
              </span>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                disabled={effectiveTreasury < RULES.watchtowerCost}
                onClick={() => handleBuild('WATCHTOWER')}
                title="Müşahidə Qülləsi: Dumanı 2 qat dərinliyinə açır"
              >
                <WatchtowerIcon size={13} /> Qüllə ({RULES.watchtowerCost}G)
              </button>
            )}
          </div>

          {/* Pending Planned Orders from this province */}
          {pendingOrdersForHere.length > 0 && (
            <div className="hud-pending-orders-list">
              <span className="text-xs text-muted">
                <FeatherQuillIcon size={12} /> Planlaşdırılmış Əmrlər:
              </span>
              {pendingOrdersForHere.map((po, idx) => (
                <div key={'po-' + idx} className="hud-pending-order-chip">
                  <span>
                    {po.type === 'MOVE' && (
                      <>➔ {map.regions[po.to].name} ({po.count} əsgər)</>
                    )}
                    {po.type === 'HIRE' && (
                      <>+ {po.count} Əsgər Yığımı ({po.count * RULES.unitCost}G)</>
                    )}
                    {po.type === 'BUILD' && (
                      <>{po.building === 'FORT' ? '🏰 Qala Tikintisi' : '🗼 Qüllə Tikintisi'} ({po.building === 'FORT' ? RULES.fortCost : RULES.watchtowerCost}G)</>
                    )}
                    {po.type === 'DISBAND' && (
                      <>- {po.count} Əsgər Tərxis</>
                    )}
                  </span>
                  {onCancelQueuedOrder && (
                    <button
                      className="btn-xs btn-pill"
                      onClick={() => onCancelQueuedOrder(po)}
                      title="Ləğv et"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Unit fatigue notice */}
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
              {isFriendlyTarget ? (
                <ShieldIcon size={16} color="#60a5fa" />
              ) : isAllyTarget ? (
                <WarningSealIcon size={16} color="#ef4444" />
              ) : (
                <CrossedSwordsIcon size={16} color="#f87171" />
              )}
              <strong>{isFriendlyTarget ? 'Köçür ➔ ' : isAllyTarget ? 'Xain Hücum ➔ ' : 'Hücum ➔ '}</strong>
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

          {/* Treason warning alert for ally attacks */}
          {isAllyTarget && (
            <div className="hud-betrayal-alert">
              <WarningSealIcon size={14} color="#ef4444" />
              <span>
                <strong>Diqqət:</strong> Müttəfiq Paktı Pozulacaq! (-{RULES.betrayalPenalty}G Cərimə)
              </span>
            </div>
          )}

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
                className="hud-slider-input"
                style={{
                  background: 'linear-gradient(to right, #d9a43a 0%, #d9a43a ' + sliderPercentage + '%, #2e261b ' + sliderPercentage + '%, #2e261b 100%)',
                }}
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
            </div>

            <div className="hud-quick-ratios">
              <button
                className="btn-pill btn-xs"
                disabled={availableToMove < 2}
                onClick={() => {
                  setMoveCount(Math.max(1, Math.floor(availableToMove / 2)));
                  haptics.light();
                }}
              >
                50% ({Math.max(1, Math.floor(availableToMove / 2))})
              </button>
              <button
                className="btn-pill btn-xs"
                disabled={availableToMove <= 0}
                onClick={() => {
                  setMoveCount(availableToMove);
                  haptics.light();
                }}
              >
                100% ({availableToMove})
              </button>
            </div>
          </div>

          {/* Combat Preview Card */}
          {!isFriendlyTarget && combatPreview && (
            <div
              className={'hud-combat-preview ' + (combatPreview.willWin ? 'win' : 'lose')}
            >
              <div className="hud-combat-status">
                {combatPreview.willWin ? (
                  <CrossedSwordsIcon size={15} color="#4ade80" />
                ) : (
                  <WarningSealIcon size={15} color="#ef4444" />
                )}
                <span>
                  {combatPreview.willWin
                    ? ('Zəfər Proqnozu (' + (combatPreview.confidence === 'CERTAIN_VICTORY' ? 'Mütləq Zəfər' : 'Yüksək Şans') + ')')
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
                  Qalan: <strong>{combatPreview.attackerSurviving}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Action CTA Button */}
          <button
            className={'btn btn-block ' + (isFriendlyTarget ? 'btn-primary' : isAllyTarget ? 'btn-danger-treason' : 'btn-danger')}
            disabled={moveCount <= 0 || availableToMove <= 0}
            onClick={handleExecuteMove}
          >
            {isFriendlyTarget ? (
              <><ShieldIcon size={16} /> Köçürmə Əmri Ver ({moveCount} Əsgər)</>
            ) : isAllyTarget ? (
              <><WarningSealIcon size={16} /> Paktı Poz & Hücum Et ({moveCount} Əsgər)</>
            ) : (
              <><CrossedSwordsIcon size={16} /> Hücum Əmri Ver ({moveCount} Əsgər)</>
            )}
          </button>
        </div>
      )}

      {/* Mode C: Unowned Territory / Rival Kingdom Capital Inspection */}
      {!isOwned && !isFogged && (
        <div className="hud-body foreign-inspection-slab">
          {foreignOwner ? (
            <>
              <div className="foreign-kingdom-banner" style={{ borderLeftColor: foreignOwner.color }}>
                <div className="foreign-kingdom-top">
                  <span
                    className="diplomacy-heraldic-shield"
                    style={{ backgroundColor: foreignOwner.color, borderColor: foreignOwner.color }}
                  >
                    <ShieldIcon size={14} color="#ffffff" />
                  </span>
                  <div>
                    <strong className="foreign-kingdom-name">{foreignOwner.name}</strong>
                    <div className="text-xs text-muted">
                      {foreignMeta?.trait || 'Sovereign Realm'} · Paytaxt: {foreignMeta?.capitalName || 'Bilinmir'}
                    </div>
                  </div>
                  {foreignRel?.status === 'PACT' && (
                    <span className="badge-pact-active ml-auto">
                      <PactScrollIcon size={11} color="#a7f3d0" /> Pakt ({foreignRel.pactTurnsRemaining}t)
                    </span>
                  )}
                  {foreignRel?.status === 'COOLDOWN' && (
                    <span className="badge-pact-cooldown ml-auto">
                      <WarningSealIcon size={11} color="#fde68a" /> Soyuma ({foreignRel.cooldownTurnsRemaining}t)
                    </span>
                  )}
                </div>

                <div className="foreign-stats-row">
                  <span><FortressIcon size={12} /> {foreignOwnedProvinces} Torpaq</span>
                  <span><ShieldIcon size={12} /> {foreignTotalTroops} Qoşun</span>
                  <span><SingleCoinIcon size={12} /> {foreignOwner.treasury}G</span>
                </div>
              </div>

              {/* Direct Embassy Actions */}
              <div className="foreign-embassy-actions">
                {foreignRel?.status !== 'PACT' ? (
                  <button
                    className="btn btn-gold btn-sm flex-1"
                    disabled={!foreignPactCheck?.allowed || effectiveTreasury < RULES.pactCost}
                    onClick={() => {
                      if (onProposePact && foreignOwner) onProposePact(foreignOwner.id);
                    }}
                    title={foreignPactCheck?.reason || 'Qeyri-Hücum Paktı bağla'}
                  >
                    <PactScrollIcon size={13} /> Pakt ({RULES.pactCost}G)
                  </button>
                ) : (
                  <span className="badge-ribbon-gold flex-1 text-center">
                    <PactScrollIcon size={13} /> Müttəfiq Xanədan
                  </span>
                )}

                <button
                  className="btn btn-secondary btn-sm flex-1"
                  disabled={!foreignTributeCheck?.allowed || effectiveTreasury < RULES.tributeCost}
                  onClick={() => {
                    if (onSendTribute && foreignOwner) onSendTribute(foreignOwner.id);
                  }}
                  title={foreignTributeCheck?.reason || 'Xəzinəsinə qızıl göndər'}
                >
                  <TributeIcon size={13} /> Xərac ({RULES.tributeCost}G)
                </button>

                {onOpenDiplomacy && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenDiplomacy(foreignOwner.id)}
                    title="Səfirlər Palatasını Aç"
                  >
                    <UsersIcon size={13} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="neutral-barony-card">
              <div className="neutral-barony-header">
                <ShieldIcon size={16} color="#94a3b8" />
                <strong>Azad Neytral Baroniya</strong>
              </div>
              <p className="text-xs text-muted" style={{ margin: '4px 0 8px 0', lineHeight: 1.35 }}>
                Tərəfsiz yerli qarnizon (+{currentRegion.income}G gəlir). Qonşu ərazinizdən hücum edərək imperiyanıza qata bilərsiniz.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode D: Unowned Fogged Region Inspected */}
      {!isOwned && isFogged && (
        <div className="hud-body">
          <div className="hud-fatigue-notice">
            <CompassIcon size={16} color="#94a3b8" /> Bu ərazi kəşf edilməmiş duman altındadır. Kəşfiyyat aparmaq üçün yaxın sərhədə qoşun cəmləyin və ya Müşahidə Qülləsi ucaldın.
          </div>
        </div>
      )}
    </div>
  );
};
