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
import {
  PactScrollIcon,
  TributeIcon,
  ShieldIcon,
  CrossedSwordsIcon,
  FortressIcon,
  SingleCoinIcon,
  SkullIcon,
  WarningSealIcon,
  FeatherQuillIcon,
} from './Icons';
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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content diplomacy-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div className="modal-title-row">
            <span className="modal-crest-badge">
              <PactScrollIcon size={24} className="text-gold" />
            </span>
            <div>
              <h2 className="modal-title">Səfirlər Palatası & Paktlar</h2>
              <p className="modal-subtitle">
                Qonşu xanədanlarla sülh bağla, bir cinahı sığortala və fəthə cəmləş
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

        <div className="diplomacy-list-scroll">
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
                style={{ borderLeftColor: k.color }}
              >
                <div className="diplomacy-kingdom-header">
                  <div className="diplomacy-kingdom-left">
                    <span
                      className="diplomacy-heraldic-shield"
                      style={{ backgroundColor: k.color, borderColor: k.color }}
                    >
                      <ShieldIcon size={12} className="text-white" />
                    </span>
                    <strong className="diplomacy-kingdom-name">{k.name}</strong>
                    {meta?.trait && (
                      <span className="badge-trait">
                        {meta.trait}
                      </span>
                    )}
                  </div>

                  <div>
                    {rel.status === 'PACT' ? (
                      <span className="badge-pact-active">
                        <PactScrollIcon size={12} /> Pakt ({rel.pactTurnsRemaining} turn)
                      </span>
                    ) : rel.status === 'COOLDOWN' ? (
                      <span className="badge-pact-cooldown">
                        <WarningSealIcon size={12} /> Soyuma ({rel.cooldownTurnsRemaining} turn)
                      </span>
                    ) : (
                      <span className="badge-pact-war">
                        <CrossedSwordsIcon size={12} /> Neytral / Rəqib
                      </span>
                    )}
                  </div>
                </div>

                <div className="diplomacy-stats-row">
                  <span>
                    <FortressIcon size={13} /> {provinces} torpaq
                  </span>
                  <span>
                    <ShieldIcon size={13} /> {troops} əsgər
                  </span>
                  <span className="text-gold">
                    <SingleCoinIcon size={13} /> {k.treasury}G
                  </span>
                  {pactCheck.allowed && (
                    <span className={`diplomacy-chance-tag ${pactCheck.acceptChancePercent >= 60 ? 'high' : 'low'}`}>
                      Pakt Şansı: {pactCheck.acceptChancePercent}%
                    </span>
                  )}
                </div>

                {isAlive && (
                  <div className="diplomacy-actions-row">
                    {rel.status === 'WAR' && (
                      <button
                        className="btn btn-sm btn-gold btn-diplomacy"
                        disabled={!pactCheck.allowed}
                        onClick={() => {
                          sounds.playMarch();
                          haptics.medium();
                          onProposePact(k.id);
                        }}
                      >
                        <PactScrollIcon size={14} /> Pakt Bağla ({RULES.pactCost}G)
                      </button>
                    )}

                    {rel.status === 'WAR' && (
                      <button
                        className="btn btn-sm btn-secondary btn-diplomacy"
                        disabled={!tributeCheck.allowed}
                        onClick={() => {
                          sounds.playHire();
                          haptics.medium();
                          onSendTribute(k.id);
                        }}
                      >
                        <TributeIcon size={14} /> Xərac Göndər ({RULES.tributeCost}G)
                      </button>
                    )}

                    {rel.status === 'PACT' && (
                      <button
                        className="btn btn-sm btn-danger btn-diplomacy"
                        onClick={() => {
                          sounds.playDisband();
                          haptics.heavy();
                          onBreakPact(k.id);
                        }}
                      >
                        <CrossedSwordsIcon size={14} /> Paktı Poz (-{RULES.betrayalPenalty}G Cərimə)
                      </button>
                    )}

                    {rel.status === 'COOLDOWN' && (
                      <span className="diplomacy-cooldown-text">
                        <FeatherQuillIcon size={13} /> Danışıqlar üçün növbəti {rel.cooldownTurnsRemaining} turn gözləyin.
                      </span>
                    )}
                  </div>
                )}

                {!isAlive && (
                  <div className="diplomacy-fallen-text">
                    <SkullIcon size={14} /> Bu xanədan süqut edib və taxtdan salınıb.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="modal-footer diplomacy-footer-bar">
          <div className="diplomacy-footer-row">
            <span className="diplomacy-treasury-badge">
              <SingleCoinIcon size={14} className="text-gold" /> Xəzinən: <strong>{human.treasury}G</strong>
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                sounds.playClick();
                haptics.light();
                onClose();
              }}
            >
              Hərbi Ştaba Qayıt
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
