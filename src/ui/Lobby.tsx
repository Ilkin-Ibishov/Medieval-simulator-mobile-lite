import React, { useState } from 'react';
import { CrownIcon, UsersIcon, SettingsIcon, RefreshIcon } from './Icons';
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
  onOpenMockup?: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  hasSavedGame,
  onResumeGame,
  onStartGame,
  onOpenRealmPicker,
  onOpenMultiplayerModal,
  onOpenMockup,
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
              className="btn btn-primary btn-block"
              onClick={onResumeGame}
              style={{ background: '#3d5a80', border: '1px solid #5f7a9c', padding: '14px 16px' }}
            >
              🛡️ Cari Partiyanı Davam Et
            </button>
          </div>
        )}

        {/* Mode 1: Grand Campaign (Dozia) */}
        <div className="mode-card primary-card" style={{ borderColor: 'rgba(217, 164, 58, 0.7)' }}>
          <div className="card-header-row">
            <div className="card-icon-title">
              <span style={{ fontSize: 22 }}>👑</span>
              <h2 className="card-title" style={{ color: '#fae19c' }}>
                Böyük Dozia Kampaniyası
              </h2>
            </div>
            <span className="badge-coming-soon" style={{ background: '#d9a43a', color: '#1a1208', fontWeight: 'bold' }}>
              Atlas
            </span>
          </div>
          <p className="card-description">
            117 nativ əyalət və 10 tarixi krallıqla böyük qitə fəthi. Xəritəni canlı kəşf edərək hökmranlıq edəcəyin krallığı seç!
          </p>

          <button
            className="btn btn-gold btn-block"
            onClick={() => {
              sounds.playClick();
              haptics.medium();
              onOpenRealmPicker();
            }}
            style={{ marginTop: 14, padding: '14px 16px', fontSize: 16 }}
          >
            🗺️ Xəritədən Krallıq Seç və Fəthə Başla ➔
          </button>
        </div>

        {/* Mode 2: Fast Skirmish */}
        <div className="mode-card" style={{ background: 'rgba(22, 17, 11, 0.7)', border: '1px solid #4a3c28' }}>
          <h2 className="card-title">⚡ Sürətli Təsadüfi Oyun</h2>
          <p className="card-description">
            Təsadüfi prosedural xəritədə hiyləsiz AI lordlarına qarşı 5–10 dəqiqəlik sürətli partiya.
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
              <label htmlFor="seed-input" className="control-label">Xəritə Kodu (Seed):</label>
              <div className="seed-input-row">
                <input
                  id="seed-input"
                  name="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 1)}
                  className="seed-input"
                  aria-label="Xəritə Kodu"
                />
                <button className="seed-rand-btn" onClick={handleRandomizeSeed} aria-label="Təsadüfi Kod Seç">
                  <RefreshIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleStartSkirmish}>
            ⚔️ Sürətli Partiyaya Başla
          </button>
        </div>

        {/* Card 2: Interactive Map Mockup Demo */}
        {onOpenMockup && (
          <div
            className="mode-card secondary-card"
            onClick={onOpenMockup}
            style={{
              borderColor: 'rgba(217, 119, 6, 0.6)',
              background: 'rgba(217, 119, 6, 0.08)',
              cursor: 'pointer',
            }}
          >
            <div className="card-header-row">
              <div className="card-icon-title">
                <span style={{ fontSize: 20 }}>🎨</span>
                <h3 className="card-title-sm" style={{ color: '#fbbf24' }}>
                  Xəritə Vizual Mockup (Demo)
                </h3>
              </div>
              <span className="badge-coming-soon" style={{ background: '#d97706', color: '#fff' }}>
                Aktiv
              </span>
            </div>
            <p className="card-description-sm">
              Müstəqil interaktiv xəritə prototipini nəzərdən keçir: ada relyefi, dağlar, meşələr və mum möhürlər.
            </p>
          </div>
        )}

        {/* Card 3: Multiplayer Coming Soon */}
        <div className="mode-card secondary-card" onClick={onOpenMultiplayerModal}>
          <div className="card-header-row">
            <div className="card-icon-title">
              <UsersIcon size={24} className="text-gold" />
              <h3 className="card-title-sm">👥 Qlobal Multiplayer & Liqa</h3>
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
            <SettingsIcon size={18} /> Səs: {settings.sound ? 'Açıq 🔊' : 'Bağlı 🔇'}
          </button>
          <button
            className="footer-btn"
            onClick={() => update({ haptics: !settings.haptics })}
            aria-pressed={settings.haptics}
          >
            Titrəyiş: {settings.haptics ? 'Açıq 📳' : 'Bağlı 🚫'}
          </button>
        </div>
        <span className="footer-version">v0.1.0 Lite · Tam Offline</span>
      </footer>
    </div>
  );
};
