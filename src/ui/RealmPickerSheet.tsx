import React from 'react';
import { DOZIA_KINGDOMS_METADATA } from '../data/maps/dozia_native_provinces';
import { sounds } from './sound';
import { haptics } from './haptics';

export interface RealmStats {
  id: number;
  name: string;
  color: string;
  provinceCount: number;
  capitalName: string;
  totalTroops: number;
  turnIncome: number;
  mapSharePercent: number;
}

interface RealmPickerSheetProps {
  stats: RealmStats;
  scenario?: 'HEGEMONY' | 'SHATTERED';
  onConfirmStart: () => void;
  onRandomKingdom: () => void;
}

export const RealmPickerSheet: React.FC<RealmPickerSheetProps> = ({
  stats,
  scenario = 'HEGEMONY',
  onConfirmStart,
  onRandomKingdom,
}) => {
  const isShattered = scenario === 'SHATTERED';

  const meta = DOZIA_KINGDOMS_METADATA[stats.id] || {
    name: stats.name,
    color: stats.color,
    capitalName: stats.capitalName,
    tagline: 'Tarixi Dozia Krallığı',
    description: 'Dozia qitəsində suveren hakimiyyət.',
    difficulty: 'ORTA' as const,
    trait: '⚔️ Böyük Səltənət',
  };

  const getDifficultyBadge = (diff: 'ASAN' | 'ORTA' | 'ÇƏTİN') => {
    if (isShattered) {
      return { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#93c5fd', label: 'Bərabər Başlanğıc' };
    }
    switch (diff) {
      case 'ASAN':
        return { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#86efac', label: 'Asan Başlanğıc' };
      case 'ORTA':
        return { bg: 'rgba(234, 179, 8, 0.2)', border: '#eab308', text: '#fde047', label: 'Orta Çətinlik' };
      case 'ÇƏTİN':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#fca5a5', label: 'Çətin Başlanğıc' };
    }
  };

  const diffBadge = getDifficultyBadge(meta.difficulty);

  const displayProvinces = isShattered ? 1 : stats.provinceCount;
  const displayMapShare = isShattered ? 1 : stats.mapSharePercent;
  const displayTroops = isShattered ? 8 : stats.totalTroops;
  const displayIncome = isShattered ? 12 : stats.turnIncome;
  const displayDescription = isShattered
    ? 'İmperiyalar süqut edib! Yalnız paytaxt qalası və 8 seçmə qoşunla başlayırsan. 107 azad baronluğu hamıdan tez fəth etmək üçün yarış!'
    : meta.description;
  const displayTrait = isShattered ? '⚡ Bərabər Paytaxt Fəthi' : meta.trait;

  return (
    <div className="realm-picker-sheet">
      {/* Header with Kingdom Name, Flag, & Badges */}
      <div className="realm-header-row">
        <div className="realm-title-group">
          <span
            className="realm-color-dot"
            style={{
              background: stats.color,
              boxShadow: `0 0 10px ${stats.color}`,
            }}
          />
          <div>
            <h2 className="realm-name">{stats.name}</h2>
            <div className="realm-tagline">{meta.tagline}</div>
          </div>
        </div>

        <div className="realm-badges-group">
          <span
            className="realm-badge"
            style={{
              background: diffBadge.bg,
              border: `1.5px solid ${diffBadge.border}`,
              color: diffBadge.text,
            }}
          >
            {diffBadge.label}
          </span>
          <span className="realm-badge realm-trait-badge">
            {displayTrait}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="realm-description">{displayDescription}</p>

      {/* Key Stats Grid */}
      <div className="realm-stats-grid">
        <div className="realm-stat-box">
          <span className="stat-label">🗺️ Ərazi Payı</span>
          <span className="stat-value text-gold">
            {displayProvinces} Əyalət ({displayMapShare}%)
          </span>
        </div>
        <div className="realm-stat-box">
          <span className="stat-label">🏰 Paytaxt Şəhər</span>
          <span className="stat-value">{stats.capitalName || meta.capitalName}</span>
        </div>
        <div className="realm-stat-box">
          <span className="stat-label">⚔️ İlkin Ordu</span>
          <span className="stat-value">{displayTroops} Qoşun</span>
        </div>
        <div className="realm-stat-box">
          <span className="stat-label">💰 Turn Başına Gəlir</span>
          <span className="stat-value text-gold">+{displayIncome}G</span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="realm-action-row">
        <button
          className="btn-random-realm"
          onClick={() => {
            sounds.playClick();
            haptics.light();
            onRandomKingdom();
          }}
          title="Təsadüfi Krallıq"
        >
          🎲 Təsadüfi
        </button>

        <button
          className="btn btn-gold btn-start-realm"
          onClick={() => {
            sounds.playClick();
            sounds.playMarch();
            haptics.heavy();
            onConfirmStart();
          }}
        >
          👑 {stats.name} ilə Fəthə Başla
        </button>
      </div>
    </div>
  );
};
