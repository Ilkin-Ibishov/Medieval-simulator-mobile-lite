import React, { useState } from 'react';
import {
  CrownIcon,
  CrossedSwordsIcon,
  UsersIcon,
  RefreshIcon,
  SoundIcon,
  HapticsIcon,
  DiceIcon,
  CompassIcon,
  BannerFlagIcon,
} from './Icons';
import { sounds } from './sound';
import { haptics } from './haptics';
import { loadSettings, saveSettings, applySettings, Settings } from './settings';

export type GameMode = 'CAMPAIGN' | 'SKIRMISH';

export interface GameSettings {
  mode: GameMode;
  chosenKingdomId?: number;
  regionCount: number;
  playerCount: number;
  seed: number;
  maxTurns?: number;
  scenario?: import('../core/types').CampaignScenario;
}

interface LobbyProps {
  hasSavedGame?: boolean;
  onResumeGame?: () => void;
  onStartGame: (settings: GameSettings) => void;
  onOpenRealmPicker: () => void;
  onOpenMultiplayerModal: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  hasSavedGame,
  onResumeGame,
  onStartGame,
  onOpenRealmPicker,
  onOpenMultiplayerModal,
}) => {
  const [regionCount, setRegionCount] = useState<number>(24);
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 99999) + 1);

  const [settings, setSettings] = useState<Settings>(() => {
    const s = loadSettings();
    applySettings(s);
    return s;
  });

  const handleRandomizeSeed = () => {
    sounds.playClick();
    haptics.light();
    setSeed(Math.floor(Math.random() * 99999) + 1);
  };

  const handleStartSkirmish = () => {
    sounds.playClick();
    sounds.playMarch();
    haptics.heavy();
    const maxTurns = regionCount === 16 ? 38 : regionCount === 28 ? 42 : 40;
    onStartGame({
      mode: 'SKIRMISH',
      regionCount,
      playerCount,
      seed,
      maxTurns,
    });
  };

  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applySettings(next);
      saveSettings(next);
      return next;
    });
    if (patch.sound === true) sounds.playClick();
    if (patch.haptics === true) haptics.medium();
  };

  return (
    <div className="lobby-container">
      {/* Background Decor */}
      <div className="lobby-bg-glow" />

      {/* Header */}
      <header className="lobby-header">
        <div className="crown-badge">
          <CrownIcon size={36} className="text-gold" />
        </div>
        <h1 className="lobby-title">MEDIEVAL SIM</h1>
        <div className="lobby-tagline">LITE & GRAND CONQUEST</div>
      </header>

      {/* Main Mode Cards */}
      <div className="lobby-content">
        {hasSavedGame && onResumeGame && (
          <div style={{ marginBottom: 14 }}>
            <button
              className="btn btn-primary btn-block btn-resume"
              onClick={onResumeGame}
            >
              <BannerFlagIcon size={18} /> Cari Partiyanı Davam Et
            </button>
          </div>
        )}

        {/* Mode 1: Grand Campaign (Dozia) - Styled as Sovereign Campaign Tome */}
        <div className="mode-card primary-card campaign-tome-card">
          <div className="card-header-row">
            <div className="card-icon-title">
              <span className="tome-crest-badge">
                <CrownIcon size={22} className="text-gold" />
              </span>
              <div>
                <h2 className="card-title text-gold">
                  Böyük Dozia Kampaniyası
                </h2>
                <span className="tome-subtitle">Nativ Qitə Atlası · 9 Xanədan</span>
              </div>
            </div>
            <span className="badge-ribbon-gold">Atlas</span>
          </div>
          <p className="card-description">
            114 sıfır-drift əyalət və 9 tarixi krallıqla böyük qitə fəthi. Xəritəni canlı kəşf edərək hökmranlıq edəcəyin krallığı seç!
          </p>

          <button
            className="btn btn-gold btn-block btn-tome-cta"
            onClick={() => {
              sounds.playClick();
              haptics.medium();
              onOpenRealmPicker();
            }}
          >
            <CompassIcon size={20} /> Xəritədən Krallıq Seç və Fəthə Başla ➔
          </button>
        </div>

        {/* Mode 2: Fast Skirmish */}
        <div className="mode-card skirmish-card">
          <div className="card-header-row">
            <div className="card-icon-title">
              <span className="skirmish-icon-badge">
                <CrossedSwordsIcon size={20} className="text-gold" />
              </span>
              <h2 className="card-title">Sürətli Təsadüfi Oyun</h2>
            </div>
            <span className="badge-coming-soon">Prosedural</span>
          </div>
          <p className="card-description">
            Təsadüfi prosedural Voronoi xəritəsində hiyləsiz AI lordlarına qarşı 5–10 dəqiqəlik sürətli partiya.
          </p>

          <div className="lobby-controls">
            {/* Map Size */}
            <div className="control-group">
              <label className="control-label">Xəritə Ölçüsü:</label>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${regionCount === 16 ? 'active' : ''}`}
                  onClick={() => { setRegionCount(16); haptics.light(); }}
                >
                  Kiçik (16)
                </button>
                <button
                  className={`segment-btn ${regionCount === 24 ? 'active' : ''}`}
                  onClick={() => { setRegionCount(24); haptics.light(); }}
                >
                  Orta (24)
                </button>
                <button
                  className={`segment-btn ${regionCount === 28 ? 'active' : ''}`}
                  onClick={() => { setRegionCount(28); haptics.light(); }}
                >
                  Böyük (28)
                </button>
              </div>
            </div>

            {/* Player Count */}
            <div className="control-group">
              <label className="control-label">Lord Sayı:</label>
              <div className="segmented-control">
                {[2, 3, 4].map((cnt) => (
                  <button
                    key={cnt}
                    className={`segment-btn ${playerCount === cnt ? 'active' : ''}`}
                    onClick={() => { setPlayerCount(cnt); haptics.light(); }}
                  >
                    {cnt} Lord
                  </button>
                ))}
              </div>
            </div>

            {/* Seed Control */}
            <div className="control-group">
              <label htmlFor="seed-input" className="control-label">
                Xəritə Toxumu (Seed):
              </label>
              <div className="seed-input-row">
                <div className="seed-prefix-icon">
                  <DiceIcon size={16} className="text-gold" />
                </div>
                <input
                  id="seed-input"
                  name="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 1)}
                  className="seed-input"
                  aria-label="Xəritə Toxumu"
                />
                <button className="seed-rand-btn" onClick={handleRandomizeSeed} aria-label="Təsadüfi Kod Seç" title="Yeni Təsadüfi Seed">
                  <RefreshIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleStartSkirmish}>
            <CrossedSwordsIcon size={18} /> Sürətli Partiyaya Başla
          </button>
        </div>

        {/* Card 2: Multiplayer Coming Soon */}
        <div className="mode-card secondary-card" onClick={onOpenMultiplayerModal}>
          <div className="card-header-row">
            <div className="card-icon-title">
              <UsersIcon size={20} className="text-gold" />
              <h3 className="card-title-sm">Qlobal Liqa & Multiplayer</h3>
            </div>
            <span className="badge-coming-soon">Tezliklə</span>
          </div>
          <p className="card-description-sm">
            Həftəlik eyni xəritə üzrə reytinq yarışları və canlı turn-based PvP döyüşləri.
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="lobby-footer">
        <div className="footer-toggles">
          <button
            className="footer-btn"
            onClick={() => update({ sound: !settings.sound })}
            aria-pressed={settings.sound}
          >
            <SoundIcon size={16} muted={!settings.sound} />
            <span>Səs: {settings.sound ? 'Açıq' : 'Bağlı'}</span>
          </button>
          <button
            className="footer-btn"
            onClick={() => update({ haptics: !settings.haptics })}
            aria-pressed={settings.haptics}
          >
            <HapticsIcon size={16} disabled={!settings.haptics} />
            <span>Titrəyiş: {settings.haptics ? 'Açıq' : 'Bağlı'}</span>
          </button>
        </div>
        <span className="footer-version">v0.2.0 · Wax & Vellum Edition</span>
      </footer>
    </div>
  );
};

