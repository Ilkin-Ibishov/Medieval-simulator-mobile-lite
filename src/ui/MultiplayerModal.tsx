import React from 'react';
import { UsersIcon } from './Icons';

interface MultiplayerModalProps {
  onClose: () => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-3">
          <div className="multiplayer-icon-glow">
            <UsersIcon size={44} className="text-gold" />
          </div>
          <h2 className="modal-title">Qlobal Multiplayer Liqası</h2>
          <span className="badge-coming-soon">Tezliklə</span>
        </div>

        <p className="modal-text">
          Həftəlik eyni xəritə toxumu üzrə beynəlxalq fəth turnirləri və real-vaxt turn-based PvP arenaları hazırlanır.
        </p>

        <button className="btn btn-gold btn-block mt-4" onClick={onClose}>
          Anladım
        </button>
      </div>
    </div>
  );
};

