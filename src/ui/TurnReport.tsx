import React from 'react';
import { GameState } from '../core/types';
import {
  calculatePlayerIncome,
  calculatePlayerUpkeep,
  calculateNetGold,
  getOwnedRegionCount,
  calculatePlayerTroopCount,
} from '../core/rules';

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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">📜 Raund {turn} Hesabatı</h2>

        {/* Treasury breakdown */}
        <div className="report-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Ərazi Gəliri</span>
            <span className="stat-value text-green">+{income}G</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Ordu Maaşı (Upkeep)</span>
            <span className="stat-value text-red">-{upkeep}G</span>
          </div>
          <div className="stat-card stat-card-wide">
            <span className="stat-label">Xalis Gəlir / Xəzinə</span>
            <span className={`stat-value ${net >= 0 ? 'text-green' : 'text-red'}`}>
              {net >= 0 ? `+${net}` : net}G · Xəzinə: {human.treasury}G
            </span>
          </div>
        </div>

        {/* Critical Capital Occupation Danger Alert */}
        {human.isAlive && gameState.regionState[human.capital]?.owner !== human.id && (
          <div className="capital-danger-banner">
            <div className="capital-danger-icon">👑⚠️</div>
            <div className="capital-danger-text">
              <strong>PAYTAXTIN İŞĞAL ALTINDADIR!</strong>
              <span>{gameState.map.regions[human.capital]?.name} əyalətini <strong>{Math.max(0, 5 - (human.capitalLostTurns || 0))} raund</strong> ərzində azad etməsən krallığın çökəcək!</span>
            </div>
          </div>
        )}

        {/* Live Faction Leaderboard */}
        <div className="faction-leaderboard-container">
          <h4 className="breakdown-header">Qlobal Fraksiya Reytinqi:</h4>
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
                      {isFallen && <span className="status-pill status-fallen">Süqut</span>}
                      {!isFallen && holdsCapital && (
                        <span className="capital-crown-tag" title="Paytaxt nəzarətdədir">👑</span>
                      )}
                      {!isFallen && !holdsCapital && (
                        <span className="status-pill status-danger" title="Paytaxt işğaldadır">
                          ⚠️ {capLeft}r
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
          <div className="events-log-container" style={{ marginTop: 12 }}>
            <h4 className="events-header">Son Hadisələr:</h4>
            <div className="events-list">
              {recentEvents.map((ev, i) => (
                <div key={i} className="event-item">
                  <span className="event-desc">{ev.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-gold btn-block mt-4" onClick={onClose}>
          Döyüşə Qayıt
        </button>
      </div>
    </div>
  );
};
