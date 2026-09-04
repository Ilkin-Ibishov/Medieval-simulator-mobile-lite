import React from 'react';
import { GameState } from '../core/types';
import {
  calculatePlayerIncome,
  calculatePlayerUpkeep,
  calculateNetGold,
  getOwnedRegionCount,
  calculatePlayerTroopCount,
} from '../core/rules';
import {
  CrownIcon,
  ShieldIcon,
  FortressIcon,
  CoinBagIcon,
  SkullIcon,
  WarningSealIcon,
  FeatherQuillIcon,
  TreasuryScaleIcon,
} from './Icons';

interface TurnReportProps {
  gameState: GameState;
  onClose: () => void;
}

export const TurnReport: React.FC<TurnReportProps> = ({ gameState, onClose }) => {
  const { turn, players, map, events } = gameState;
  const human = players[0];

  const income = calculatePlayerIncome(gameState, 0);
  const upkeep = calculatePlayerUpkeep(gameState, 0);
  const net = calculateNetGold(gameState, 0);

  // Turn events of the current turn
  const recentEvents = events.filter((e) => e.turn === turn - 1 || e.turn === turn).slice(-4);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content royal-chronicle-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chronicle-header-row">
          <div className="chronicle-icon-badge">
            <FeatherQuillIcon size={24} className="text-gold" />
          </div>
          <div>
            <h2 className="modal-title">Raund {turn} Salnaməsi</h2>
            <span className="chronicle-subtitle">Hərbi Xəzinə və Qitə Qüvvələr Balansı</span>
          </div>
        </div>

        {/* Treasury breakdown */}
        <div className="report-stats-grid">
          <div className="stat-card">
            <span className="stat-label">
              <FortressIcon size={13} /> Ərazi Gəliri
            </span>
            <span className="stat-value text-green">+{income}G</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">
              <ShieldIcon size={13} /> Ordu Maaşı (Upkeep)
            </span>
            <span className="stat-value text-red">-{upkeep}G</span>
          </div>
          <div className="stat-card stat-card-wide">
            <span className="stat-label">
              <TreasuryScaleIcon size={13} /> Xalis Gəlir / Mövcud Xəzinə
            </span>
            <span className={`stat-value ${net >= 0 ? 'text-green' : 'text-red'}`}>
              <CoinBagIcon size={16} /> {net >= 0 ? `+${net}` : net}G · Xəzinə: {human.treasury}G
            </span>
          </div>
        </div>

        {/* Critical Capital Occupation Danger Alert */}
        {human.isAlive && gameState.regionState[human.capital]?.owner !== human.id && (
          <div className="capital-danger-banner">
            <div className="capital-danger-icon">
              <WarningSealIcon size={24} className="text-red" />
            </div>
            <div className="capital-danger-text">
              <strong>PAYTAXTIN İŞĞAL ALTINDADIR!</strong>
              <span>{gameState.map.regions[human.capital]?.name} əyalətini <strong>{Math.max(0, 5 - (human.capitalLostTurns || 0))} raund</strong> ərzində azad etməsən krallığın çökəcək!</span>
            </div>
          </div>
        )}

        {/* Live Faction Leaderboard */}
        <div className="faction-leaderboard-container">
          <h4 className="breakdown-header">
            <CrownIcon size={14} className="text-gold" /> Qlobal Qüvvələr Balansı:
          </h4>
          <div className="faction-leaderboard-list">
            {players.map((p) => {
              const count = getOwnedRegionCount(gameState, p.id);
              const troops = calculatePlayerTroopCount(gameState, p.id);
              const pct = Math.round((count / map.regions.length) * 100);
              const isFallen = !p.isAlive || count === 0;
              const holdsCapital = gameState.regionState[p.capital]?.owner === p.id;
              const capLeft = Math.max(0, 5 - (p.capitalLostTurns || 0));

              return (
                <div
                  key={p.id}
                  className={`faction-card-row ${isFallen ? 'faction-fallen' : ''}`}
                >
                  <div className="faction-card-header">
                    <div className="faction-card-left">
                      <span
                        className="player-color-dot"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="faction-name-text">{p.name}</span>
                      {isFallen && (
                        <span className="status-pill status-fallen">
                          <SkullIcon size={11} /> Süqut
                        </span>
                      )}
                      {!isFallen && holdsCapital && (
                        <span className="capital-crown-tag" title="Paytaxt nəzarətdədir">
                          <CrownIcon size={12} className="text-gold" />
                        </span>
                      )}
                      {!isFallen && !holdsCapital && (
                        <span className="status-pill status-danger" title="Paytaxt işğaldadır">
                          <WarningSealIcon size={11} /> {capLeft}r
                        </span>
                      )}
                    </div>
                    <div className="faction-card-stats">
                      <span className="stat-num">{count}</span>
                      <span className="stat-unit">torpaq</span>
                      <span className="stat-separator">·</span>
                      <span className="stat-num">{troops}</span>
                      <span className="stat-unit">əsgər</span>
                    </div>
                  </div>
                  <div className="faction-pct-bar-track">
                    <div
                      className="faction-pct-bar-fill"
                      style={{
                        width: isFallen ? '0%' : `${Math.max(count > 0 ? 4 : 0, pct)}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events log */}
        {recentEvents.length > 0 && (
          <div className="events-log-container">
            <h4 className="events-header">
              <FeatherQuillIcon size={13} className="text-gold" /> Son Hadisələr Salnaməsi:
            </h4>
            <div className="events-list">
              {recentEvents.map((ev, i) => (
                <div key={i} className="event-item">
                  <span className="event-bullet-point">§</span>
                  <span className="event-desc">{ev.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-gold btn-block mt-4" onClick={onClose}>
          Döyüş Meydanına Qayıt
        </button>
      </div>
    </div>
  );
};

