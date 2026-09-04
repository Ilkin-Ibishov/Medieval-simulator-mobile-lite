import React from 'react';
import { ShieldIcon, BannerFlagIcon } from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';

interface ExitConfirmModalProps {
  onConfirmExit: () => void;
  onCancel: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  onConfirmExit,
  onCancel,
}) => {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
        <div className="winner-icon-wrapper" style={{ marginBottom: 12 }}>
          <ShieldIcon size={44} className="text-gold" />
        </div>
        <h2 className="card-title" style={{ fontSize: '1.25rem', marginBottom: 8 }}>
          Döyüşdən Çıxış və Saxlama
        </h2>
        <p className="card-description" style={{ fontSize: '0.85rem', marginBottom: 20 }}>
          Cari yürüşün vəziyyəti avtomatik yadda saxlanılacaq və istənilən vaxt Lobbi-dən davam etdirilə bilər.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              sounds.playClick();
              haptics.medium();
              onConfirmExit();
            }}
          >
            <BannerFlagIcon size={16} /> Lobbi-yə Qayıt (Yadda Saxla)
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => {
              sounds.playClick();
              haptics.light();
              onCancel();
            }}
          >
            Döyüşə Davam Et
          </button>
        </div>
      </div>
    </div>
  );
};

