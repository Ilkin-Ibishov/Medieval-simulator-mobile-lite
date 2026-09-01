import React from 'react';
import { GameState } from '../core/types';
import { getOwnedRegionCount } from '../core/rules';
import { CrownIcon, SparklesIcon } from './Icons';

interface GameOverModalProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ gameState, onPlayAgain }) => {
  const { winner, players, map, turn } = gameState;
  const isDraw = winner === null;
  const isHumanWinner = winner === 0;
  const winnerPlayer = winner !== null ? players[winner] : null;

  // The winner is decided one of two ways: everyone else was actually wiped
  // out, or the turn limit hit and they simply held the most territory. Only
  // the first one is truthfully "destroyed all rivals" — conflating them
  // told survivors they'd been annihilated when they hadn't been.
  const aliveCount = players.filter((p) => p.isAlive).length;
  const wasElimination = !isDraw && aliveCount <= 1;
  const humanSurvived = players[0].isAlive;

  let title: string;
  let crownColorClass: string;
  let description: string;

  if (isDraw) {
    title = '⚔️ HEÇ-HEÇƏ!';
    crownColorClass = 'text-blue';
    description = `Müharibə ${turn} turn sonra heç-heçə ilə başa çatdı.`;
  } else if (isHumanWinner) {
    title = '🏆 ZƏFƏR SƏNİNDİR!';
    crownColorClass = 'text-gold';
    description = wasElimination
      ? `Bütün rəqiblərini darmadağın edərək ${turn} turn ərzində taxta sahibləndin.`
      : `${turn} turn sonunda ən çox torpağa sahib olaraq taxtı ələ keçirdin.`;
  } else {
    title = humanSurvived ? '🏳️ MƏĞLUB OLDUN!' : '💀 SÜQUT ETDİN!';
    crownColorClass = 'text-red';
    description = wasElimination
      ? `${winnerPlayer!.name} bütün rəqiblərini darmadağın edərək ${turn} turn ərzində taxta sahibləndi.`
      : `${winnerPlayer!.name} ${turn} turn sonunda ən çox torpağa sahib olaraq qələbəni qazandı.`;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content text-center">
        <div className="winner-icon-wrapper">
          <CrownIcon size={56} className={crownColorClass} />
        </div>

        <h1 className="game-over-title">{title}</h1>

        <p className="game-over-desc">{description}</p>

        {/* Territory breakdown */}
        <div className="game-over-breakdown">
          <h4 className="breakdown-header">Yekun Torpaq Bölgüsü:</h4>
          {players.map((p) => {
            const count = getOwnedRegionCount(gameState, p.id);
            const pct = Math.round((count / map.regions.length) * 100);
            return (
              <div key={p.id} className="player-stat-row">
                <div className="player-info">
                  <span
                    className="player-color-dot"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.name}</span>
                </div>
                <div className="player-pct-bar-wrapper">
                  <div
                    className="player-pct-bar"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <span className="player-count">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>

        <button className="btn btn-gold btn-large btn-block mt-4" onClick={onPlayAgain}>
          <SparklesIcon size={18} /> Yenidən Oyna
        </button>
      </div>
    </div>
  );
};
