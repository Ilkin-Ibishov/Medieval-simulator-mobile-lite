import React from 'react';
import { GameState } from '../core/types';
import { getOwnedRegionCount } from '../core/rules';
import {
  TrophyIcon,
  SkullIcon,
  CrossedSwordsIcon,
  SparklesIcon,
  BannerFlagIcon,
} from './Icons';

interface GameOverModalProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ gameState, onPlayAgain }) => {
  const { winner, players, map, turn } = gameState;
  const isDraw = winner === null;
  const isHumanWinner = winner === 0;
  const winnerPlayer = winner !== null ? players[winner] : null;

  const aliveCount = players.filter((p) => p.isAlive).length;
  const wasElimination = !isDraw && aliveCount <= 1;
  const humanSurvived = players[0].isAlive;

  let title: string;
  let description: string;
  let iconComponent: React.ReactNode;

  if (isDraw) {
    title = 'MÜHARİBƏ BİTDİ: HEÇ-HEÇƏ';
    description = `Qitə uğrunda döyüşlər ${turn} raund sonra heç-heçə ilə başa çatdı.`;
    iconComponent = <CrossedSwordsIcon size={52} className="text-blue" />;
  } else if (isHumanWinner) {
    title = 'ZƏFƏR TACQOYMASI!';
    description = wasElimination
      ? `Bütün rəqib xanədanları darmadağın edərək ${turn} raund ərzində Dozia taxtına sahibləndin!`
      : `${turn} raund sonunda qitənin ən qüdrətli hökmdarı kimi taxtı ələ keçirdin!`;
    iconComponent = <TrophyIcon size={52} className="text-gold" />;
  } else {
    title = humanSurvived ? 'MƏĞLUBİYYƏT!' : 'XANƏDANIN SÜQUTU!';
    description = wasElimination
      ? `${winnerPlayer!.name} bütün rəqiblərini darmadağın edərək ${turn} raund ərzində taxta sahibləndi.`
      : `${winnerPlayer!.name} ${turn} raund sonunda ən çox torpağa sahib olaraq qələbə qazandı.`;
    iconComponent = <SkullIcon size={52} className="text-red" />;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content coronation-modal text-center">
        <div className="winner-icon-wrapper">
          {iconComponent}
        </div>

        <h1 className="game-over-title">{title}</h1>
        <p className="game-over-desc">{description}</p>

        {/* Territory breakdown */}
        <div className="game-over-breakdown">
          <h4 className="breakdown-header">
            <BannerFlagIcon size={14} className="text-gold" /> Yekun Qitə Torpaq Bölgüsü:
          </h4>
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
          <SparklesIcon size={18} /> Yeni Səltənətə Başla
        </button>
      </div>
    </div>
  );
};

