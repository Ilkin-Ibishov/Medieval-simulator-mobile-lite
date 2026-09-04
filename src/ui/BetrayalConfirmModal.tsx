import React from 'react';
import { GameState, Action, RULES } from '../core/types';
import { DOZIA_KINGDOMS_METADATA } from '../data/maps/dozia_native_provinces';
import {
  WarningSealIcon,
  CrossedSwordsIcon,
  ShieldIcon,
  SingleCoinIcon,
} from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';

interface BetrayalConfirmModalProps {
  gameState: GameState;
  pendingAttack: Action | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BetrayalConfirmModal: React.FC<BetrayalConfirmModalProps> = ({
  gameState,
  pendingAttack,
  onConfirm,
  onCancel,
}) => {
  if (!pendingAttack || pendingAttack.type !== 'MOVE') return null;

  const targetR = gameState.map.regions[pendingAttack.to];
  const targetRState = gameState.regionState[pendingAttack.to];
  const targetOwnerId = targetRState?.owner;

  if (targetOwnerId === undefined || targetOwnerId < 0) return null;

  const ally = gameState.players[targetOwnerId];
  const meta = DOZIA_KINGDOMS_METADATA[ally.id + 1];

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-content betrayal-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="betrayal-header">
          <div className="betrayal-icon-badge">
            <WarningSealIcon size={28} color="#ef4444" />
          </div>
          <div>
            <h2 className="modal-title text-red">Paktın Xaincəsinə Pozulması!</h2>
            <span className="betrayal-subtitle">
              Müttəfiq Xanədana Qarşı Qəfil Hücum
            </span>
          </div>
        </div>

        <div className="betrayal-body">
          <div className="betrayal-ally-chip" style={{ borderLeftColor: ally.color }}>
            <span
              className="diplomacy-heraldic-shield"
              style={{ backgroundColor: ally.color, borderColor: ally.color }}
            >
              <ShieldIcon size={14} color="#ffffff" />
            </span>
            <div className="betrayal-ally-info">
              <strong>{ally.name}</strong>
              <span className="text-xs text-muted">
                {meta?.trait || 'Qeyri-Hücum Müttəfiqi'} · Hədəf: {targetR?.name}
              </span>
            </div>
          </div>

          <p className="betrayal-warning-text">
            Siz <strong>{ally.name}</strong> ilə rəsmi <strong>Qeyri-Hücum Paktı (NAP)</strong> bağlamısınız. 
            Bu əraziyə qoşun yeritmək müqaviləni birbaşa pozacaq:
          </p>

          <div className="betrayal-consequences-grid">
            <div className="betrayal-consequence-card">
              <span className="text-red font-bold flex items-center gap-1">
                <SingleCoinIcon size={14} color="#ef4444" /> -{RULES.betrayalPenalty}G Cərimə
              </span>
              <span className="text-xs text-muted">
                Xəzinədən xəyanət cəriməsi çıxılacaq
              </span>
            </div>
            <div className="betrayal-consequence-card">
              <span className="text-gold font-bold">
                ⚠️ 6 Turn Soyuma
              </span>
              <span className="text-xs text-muted">
                Müttəfiqlik əlaqələri dərhal kəsiləcək
              </span>
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button
            className="btn btn-secondary flex-1"
            onClick={() => {
              sounds.playClick();
              haptics.light();
              onCancel();
            }}
          >
            ← Geri Qayıt
          </button>
          <button
            className="btn btn-danger flex-1"
            onClick={() => {
              sounds.playMarch();
              haptics.heavy();
              onConfirm();
            }}
          >
            <CrossedSwordsIcon size={16} /> Xəyanət Et və Hücum Çək
          </button>
        </div>
      </div>
    </div>
  );
};
