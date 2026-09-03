import React from 'react';
import { GameState, PlayerId, RULES } from '../core/types';
import {
  getDiplomaticRelation,
  canProposePact,
  canSendTribute,
  calculatePlayerTroopCount,
  getOwnedRegionCount,
} from '../core/rules';
import { DOZIA_KINGDOMS_METADATA } from '../data/maps/dozia_native_provinces';
import { sounds } from './sound';
import { haptics } from './haptics';

interface DiplomacyModalProps {
  gameState: GameState;
  isOpen: boolean;
  onClose: () => void;
  onProposePact: (targetPlayer: PlayerId) => void;
  onSendTribute: (targetPlayer: PlayerId) => void;
  onBreakPact: (targetPlayer: PlayerId) => void;
}

export const DiplomacyModal: React.FC<DiplomacyModalProps> = ({
  gameState,
  isOpen,
  onClose,
  onProposePact,
  onSendTribute,
  onBreakPact,
}) => {
  if (!isOpen) return null;

  const human = gameState.players[gameState.activePlayer];
  const otherKingdoms = gameState.players.filter((p) => p.id !== gameState.activePlayer);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card diplomacy-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        <header className="modal-header">
          <div className="modal-title-row">
            <span style={{ fontSize: 24 }}>🤝</span>
            <div>
              <h2 className="modal-title">Taktiki Diplomatiya & Paktlar</h2>
              <p className="modal-subtitle">
                Qonşularla sülh bağla, bir cinahı sığortala və ordunu cəmlə
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => {
              sounds.playClick();
              haptics.light();
              onClose();
            }}
            aria-label="Bağla"
          >
            ✕
          </button>
        </header>

        <div className="modal-body diplomacy-list-scroll" style={{ overflowY: 'auto', flex: 1, padding: '12px 0' }}>
          {otherKingdoms.map((k) => {
            const isAlive = k.isAlive && getOwnedRegionCount(gameState, k.id) > 0;
            const rel = getDiplomaticRelation(gameState, gameState.activePlayer, k.id);
            const meta = DOZIA_KINGDOMS_METADATA[k.id + 1];
            const troops = calculatePlayerTroopCount(gameState, k.id);
            const provinces = getOwnedRegionCount(gameState, k.id);
            const pactCheck = canProposePact(gameState, gameState.activePlayer, k.id);
            const tributeCheck = canSendTribute(gameState, gameState.activePlayer, k.id);

            return (
              <div
                key={k.id}
                className={`diplomacy-kingdom-card ${!isAlive ? 'kingdom-dead' : ''} ${rel.status === 'PACT' ? 'kingdom-pact-active' : ''}`}
                style={{
                  borderLeft: `4px solid ${k.color}`,
                  background: rel.status === 'PACT' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 10,
                  border: rel.status === 'PACT' ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: k.color,
                        display: 'inline-block',
                      }}
                    />
                    <strong style={{ fontSize: '1rem', color: '#f3f4f6' }}>{k.name}</strong>
                    {meta?.trait && (
                      <span className="badge-trait" style={{ fontSize: '0.7rem', opacity: 0.8, color: '#fbbf24' }}>
                        {meta.trait}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {rel.status === 'PACT' ? (
                      <span className="badge-pact-active" style={{ background: '#166534', color: '#86efac', padding: '3px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>
                        🤝 Pakt ({rel.pactTurnsRemaining} turn)
                      </span>
                    ) : rel.status === 'COOLDOWN' ? (
                      <span className="badge-pact-cooldown" style={{ background: '#78350f', color: '#fde68a', padding: '3px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>
                        ⏳ Soyuma ({rel.cooldownTurnsRemaining} turn)
                      </span>
                    ) : (
                      <span className="badge-pact-war" style={{ background: '#374151', color: '#d1d5db', padding: '3px 8px', borderRadius: 12, fontSize: '0.75rem' }}>
                        ⚔️ Neytral / Rəqib
                      </span>
                    )}
                  </div>
                </div>

                {/* Realm Info Bar */}
                <div style={{ display: 'flex', gap: 14, fontSize: '0.8rem', color: '#9ca3af', marginBottom: 10 }}>
                  <span>🏰 {provinces} torpaq</span>
                  <span>⚔️ {troops} əsgər</span>
                  <span>💰 {k.treasury}G</span>
                  {pactCheck.allowed && (
                    <span style={{ color: pactCheck.acceptChancePercent >= 60 ? '#4ade80' : '#f87171', marginLeft: 'auto' }}>
                      Pakt Şansı: {pactCheck.acceptChancePercent}%
                    </span>
                  )}
                </div>

                {/* Diplomatic Actions Row */}
                {isAlive && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {rel.status === 'WAR' && (
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={!pactCheck.allowed}
                        onClick={() => {
                          sounds.playMarch();
                          haptics.medium();
                          onProposePact(k.id);
                        }}
                        style={{ flex: 1, minWidth: 140, fontSize: '0.8rem' }}
                      >
                        🤝 Pakt Bağla ({RULES.pactCost}G)
                      </button>
                    )}

                    {rel.status === 'WAR' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        disabled={!tributeCheck.allowed}
                        onClick={() => {
                          sounds.playClick();
                          haptics.light();
                          onSendTribute(k.id);
                        }}
                        style={{ fontSize: '0.8rem' }}
                        title="Dövlətin xəzinəsinə qızıl göndərərək münasibətləri yaxşılaşdır"
                      >
                        💰 Töhfə ({RULES.tributeCost}G)
                      </button>
                    )}

                    {rel.status === 'PACT' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          sounds.playRepelled();
                          haptics.heavy();
                          onBreakPact(k.id);
                        }}
                        style={{ flex: 1, fontSize: '0.8rem', background: '#991b1b', color: '#fff', border: 'none' }}
                      >
                        ⚡ Paktı Poz (-{RULES.betrayalPenalty}G)
                      </button>
                    )}

                    {rel.status === 'COOLDOWN' && (
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic', alignSelf: 'center' }}>
                        Danışıqlar üçün növbəti {rel.cooldownTurnsRemaining} turn gözləyin.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Xəzinən: <strong style={{ color: '#fbbf24' }}>{human.treasury}G</strong>
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => {
                sounds.playClick();
                haptics.light();
                onClose();
              }}
            >
              Bağla
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
