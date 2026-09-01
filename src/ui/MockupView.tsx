import React, { useState, useRef, useMemo } from 'react';
import { DOZIA_PROVINCES, DOZIA_MAP_METADATA, NativeProvince } from '../data/maps/dozia_native_provinces';

export const MockupView: React.FC<{ onBackToGame?: () => void }> = ({ onBackToGame }) => {
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [politicalOpacity, setPoliticalOpacity] = useState<number>(0.38);
  const [showTroops, setShowTroops] = useState(true);
  const [filterState, setFilterState] = useState<number | null>(null);

  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const didDrag = useRef(false);

  const MAP_W = DOZIA_MAP_METADATA.width;
  const MAP_H = DOZIA_MAP_METADATA.height;

  const statesList = useMemo(() => {
    const map = new Map<number, { id: number; name: string; color: string; count: number }>();
    DOZIA_PROVINCES.forEach((p) => {
      if (!map.has(p.stateId)) {
        map.set(p.stateId, { id: p.stateId, name: p.stateName, color: p.stateColor, count: 0 });
      }
      map.get(p.stateId)!.count++;
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, []);

  const visibleProvinces = useMemo(() => {
    if (filterState === null) return DOZIA_PROVINCES;
    return DOZIA_PROVINCES.filter((p) => p.stateId === filterState);
  }, [filterState]);

  const selectedProv: NativeProvince | null = selectedId !== null ? DOZIA_PROVINCES[selectedId] : null;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    didDrag.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true;
    setPan({
      x: dragStart.current.panX + dx / zoom,
      y: dragStart.current.panY + dy / zoom,
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="mockup-page-container">
      {/* Top Header */}
      <header className="mockup-header">
        <div className="mockup-header-left">
          <span className="mockup-badge">👑 100% NATIVE GEOJSON ATLAS</span>
          <h1 className="mockup-title">{DOZIA_MAP_METADATA.name}</h1>
        </div>
        <div className="mockup-header-right">
          {onBackToGame && (
            <button className="btn-mockup-back" onClick={onBackToGame}>
              ← Oyuna Qayıt
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Map Viewport */}
      <div
        className="mockup-map-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="mockup-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Wax Seal Metallic Brass Gradients */}
            <radialGradient id="prov-wax-seal" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffea75" />
              <stop offset="25%" stopColor="#d4af37" />
              <stop offset="65%" stopColor="#8a691e" />
              <stop offset="95%" stopColor="#4d3509" />
              <stop offset="100%" stopColor="#291a03" />
            </radialGradient>

            <radialGradient id="prov-inner-bed" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#3a2410" />
              <stop offset="100%" stopColor="#180e05" />
            </radialGradient>

            <filter id="token-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Interactive Zoom/Pan Canvas Group */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transformOrigin: `${MAP_W / 2}px ${MAP_H / 2}px` }}
          >
            {/* ═══════════════════════════════════════════════════════════
               1. AZGAAR NATIVE VECTOR MASTER ATLAS (DOZIA EMBEDDED SVG)
               ═══════════════════════════════════════════════════════════ */}
            <image
              href={DOZIA_MAP_METADATA.svgAsset}
              x="0"
              y="0"
              width={MAP_W}
              height={MAP_H}
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: 'none' }}
            />

            {/* ═══════════════════════════════════════════════════════════
               2. DYNAMIC WATERCOLOR POLITICAL PROVINCE OVERLAYS (100% NATIVE)
               ═══════════════════════════════════════════════════════════ */}
            <g className="political-province-layers">
              {visibleProvinces.map((prov) => {
                const isSelected = selectedId === prov.id;
                const fillColor = prov.stateColor;

                return (
                  <path
                    key={`prov-${prov.id}`}
                    d={prov.svgPath}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.65 : politicalOpacity}
                    stroke={isSelected ? '#ffd700' : 'rgba(20,12,6,0.35)'}
                    strokeWidth={isSelected ? 3.0 : 0.6}
                    strokeLinejoin="round"
                    style={{
                      mixBlendMode: 'multiply',
                      cursor: 'pointer',
                      transition: 'fill-opacity 0.15s ease',
                    }}
                    onClick={() => {
                      if (!didDrag.current) setSelectedId(prov.id);
                    }}
                  />
                );
              })}
            </g>

            {/* ═══════════════════════════════════════════════════════════
               3. TACTICAL TROOP SEALS & LABELS
               ═══════════════════════════════════════════════════════════ */}
            {showTroops && (
              <g className="tactical-tokens-layer">
                {visibleProvinces.map((prov) => {
                  const isSelected = selectedId === prov.id;
                  const troops = 4 + ((prov.id * 7) % 11);

                  // Density filter for low zoom
                  if (!isSelected && zoom < 1.3 && !prov.isCapital && prov.cellCount < 20) {
                    return null;
                  }

                  return (
                    <g
                      key={`token-${prov.id}`}
                      transform={`translate(${prov.cx}, ${prov.cy})`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!didDrag.current) setSelectedId(prov.id);
                      }}
                    >
                      {/* Capital Crown if State Capital */}
                      {prov.isCapital && (
                        <g transform="translate(0, -18)">
                          <text x="0" y="0" textAnchor="middle" fontSize="13">👑</text>
                        </g>
                      )}

                      {/* Stamped Brass Wax Seal Coin */}
                      <g filter="url(#token-shadow)">
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? 14 : 10}
                          fill="url(#prov-wax-seal)"
                          stroke="#211406"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? 11 : 8}
                          fill="url(#prov-inner-bed)"
                          stroke="#d4af37"
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y={isSelected ? 4 : 3}
                          textAnchor="middle"
                          fill="#ffd700"
                          fontSize={isSelected ? '11' : '8.5'}
                          fontWeight="900"
                          fontFamily="Cinzel, IM Fell English SC, Georgia, serif"
                          pointerEvents="none"
                        >
                          {troops}
                        </text>
                      </g>

                      {/* Province Name Label */}
                      {(isSelected || zoom >= 1.4 || prov.isCapital) && (
                        <g transform="translate(0, 16)">
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            fill="#100802"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            paintOrder="stroke fill"
                            fontSize={isSelected ? '12' : '9.5'}
                            fontWeight="900"
                            fontFamily="Cinzel, IM Fell English SC, Georgia, serif"
                            pointerEvents="none"
                          >
                            {prov.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        </svg>

        {/* Floating Controls Overlay */}
        <div className="mockup-controls-overlay">
          <div className="mockup-btn-group">
            <button
              className="btn-mockup-pill active"
              onClick={() => setPoliticalOpacity((o) => (o === 0.38 ? 0.18 : o === 0.18 ? 0.65 : 0.38))}
            >
              🎨 Siyasi Boya: {Math.round(politicalOpacity * 100)}%
            </button>
            <button
              className={`btn-mockup-pill ${showTroops ? 'active' : ''}`}
              onClick={() => setShowTroops(!showTroops)}
            >
              🛡️ Möhürlər ({showTroops ? 'Açıq' : 'Bağlı'})
            </button>
            <select
              className="btn-mockup-pill"
              value={filterState ?? ''}
              onChange={(e) => setFilterState(e.target.value === '' ? null : Number(e.target.value))}
              style={{ background: '#1c2834', color: '#ffd700', border: '1px solid #d4af37' }}
            >
              <option value="">Bütün Krallıqlar (121 Əyalət)</option>
              {statesList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.count} əyalət)
                </option>
              ))}
            </select>
          </div>

          <div className="mockup-zoom-group">
            <button className="btn-mockup-zoom" onClick={() => setZoom((z) => Math.min(4.0, z * 1.3))}>+</button>
            <button className="btn-mockup-zoom" onClick={() => setZoom((z) => Math.max(0.7, z * 0.75))}>−</button>
            <button className="btn-mockup-zoom" onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }}>⟲</button>
          </div>
        </div>
      </div>

      {/* Bottom Inspection Card */}
      {selectedProv && (
        <footer className="mockup-footer-card">
          <div className="mockup-prov-badge" style={{ borderColor: selectedProv.stateColor }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="prov-title">{selectedProv.name}</span>
              {selectedProv.isCapital && <span className="prov-capital-tag">👑 DÖVLƏT PAYTAXTI</span>}
            </div>
            <span style={{ fontSize: '0.85rem', color: selectedProv.stateColor, fontWeight: 700 }}>
              Dövlət: {selectedProv.stateName} ({selectedProv.fullName})
            </span>
          </div>
          <div className="mockup-prov-details">
            <div className="detail-item">
              <span className="detail-label">Mərkəz / Qala:</span>
              <span className="detail-val" style={{ color: selectedProv.stateColor, fontWeight: 700 }}>
                🏰 {selectedProv.burgName} ({selectedProv.cellCount} nativ sektor)
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Relyef / Gəlir:</span>
              <span className="detail-val">
                {selectedProv.terrain === 'mountain' && '▲ Dağlıq (+2 🛡️)'}
                {selectedProv.terrain === 'forest' && '🌲 Meşəlik (+1 🛡️)'}
                {selectedProv.terrain === 'hills' && '⌒ Təpəlik (+1 🛡️)'}
                {selectedProv.terrain === 'plains' && '🌾 Düzənlik'} · 💰 +{selectedProv.income}G/turn
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Qonşu Əyalətlər ({selectedProv.neighbors.length}):</span>
              <span className="detail-val text-gold">
                ⚔️ {selectedProv.neighbors.slice(0, 5).map((nid) => DOZIA_PROVINCES[nid]?.name).join(', ')}
                {selectedProv.neighbors.length > 5 ? ` + ${selectedProv.neighbors.length - 5} daha` : ''}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
