import React, { useState, useRef, useEffect } from 'react';
import { GameState, Region } from '../core/types';
import { getRegionVisibility, hasActivePact } from '../core';
import { haptics } from './haptics';
import { CrownIcon, CompassIcon, FortressIcon, WatchtowerIcon } from './Icons';
import type { Floater } from './App';

interface MapViewProps {
  gameState: GameState;
  selectedRegion: number | null;
  targetRegion: number | null;
  onSelectRegion: (regionId: number) => void;
  isPickingRealm?: boolean;
  chosenKingdomId?: number;
  onSelectKingdom?: (kingdomId: number) => void;
  animatingConquest?: number | null;
  /** Region that just repelled an attack — held, not captured, gets its own beat. */
  animatingBattle?: number | null;
  /** Arrow for an action currently resolving (this is what makes an AI turn watchable). */
  actionArrow?: { from: number; to: number } | null;
  /** All pending planned move orders for simultaneous planning. */
  pendingArrows?: { from: number; to: number; count?: number }[];
  /** Transient damage numbers floating off provinces. */
  floaters?: Floater[];
}

export const MapView: React.FC<MapViewProps> = ({
  gameState,
  selectedRegion,
  targetRegion,
  onSelectRegion,
  isPickingRealm,
  chosenKingdomId,
  onSelectKingdom,
  animatingConquest,
  animatingBattle,
  actionArrow,
  pendingArrows,
  floaters,
}) => {
  const { map, regionState, players, activePlayer } = gameState;

  const MIN_ZOOM = 1.0;
  const MAX_ZOOM = 4.0;
  /** Extra slack (screen px) so edge regions are never flush against the viewport border. */
  const PAN_SLACK = 24;

  // Zoom & Pan state. `pan` is measured in SCREEN pixels so that dragging tracks
  // the finger 1:1; it is converted to SVG user units only when building the transform.
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Invariant screen scaling: counter-scales labels, troop seals, and badges inversely with zoom
  // so their visual size on screen remains constant across all zoom levels (1.0x to 4.0x).
  const invZoom = Number((1 / Math.max(0.1, zoom)).toFixed(4));

  const containerRef = useRef<HTMLDivElement>(null);

  // Gesture tracking refs
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMoved = useRef<boolean>(false);

  // Pinch-to-zoom tracking refs
  const isPinching = useRef<boolean>(false);
  const pinchStartDist = useRef<number>(0);
  const pinchStartZoom = useRef<number>(1.0);
  const pinchCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track the container size so pan limits are derived from real geometry, not guesses.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const read = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const capitalsMap = React.useMemo(() => {
    const map = new Map<number, (typeof players)[0]>();
    for (const pl of players) {
      if (pl.capital !== undefined) {
        map.set(pl.capital, pl);
      }
    }
    return map;
  }, [players]);

  /**
   * Screen pixels per SVG user unit at zoom 1, under preserveAspectRatio="xMidYMid meet".
   * `meet` fits the whole viewBox inside the viewport, so the scale is the smaller ratio.
   */
  const viewScale =
    containerSize.w > 0 && containerSize.h > 0
      ? Math.min(containerSize.w / map.width, containerSize.h / map.height)
      : 0;

  /**
   * Clamps pan (screen px) so the map can never be dragged past its own edges.
   * When the scaled map is smaller than the viewport it stays centred (limit 0).
   */
  const clampPan = React.useCallback(
    (x: number, y: number, currentZoom: number) => {
      if (viewScale <= 0) return { x: 0, y: 0 };
      const contentW = map.width * viewScale * currentZoom;
      const contentH = map.height * viewScale * currentZoom;
      const maxPanX = Math.max(0, (contentW - containerSize.w) / 2 + PAN_SLACK);
      const maxPanY = Math.max(0, (contentH - containerSize.h) / 2 + PAN_SLACK);
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, y)),
      };
    },
    [viewScale, containerSize.w, containerSize.h, map.width, map.height]
  );

  /**
   * Zooms toward a focal point while keeping the map content under that point fixed.
   * `fx`/`fy` are screen offsets measured from the CONTAINER CENTRE, because the
   * transform origin is the map centre (not the top-left corner).
   */
  const applyZoomAt = React.useCallback(
    (nextZoomOf: (prevZoom: number) => number, fx: number, fy: number) => {
      // Functional form: rapid consecutive taps must each build on the previous zoom,
      // not on the value captured when this render closed over it.
      setZoom((prevZoom) => {
        const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoomOf(prevZoom)));
        setPan((p) =>
          clampPan(fx - (fx - p.x) * (nextZoom / prevZoom), fy - (fy - p.y) * (nextZoom / prevZoom), nextZoom)
        );
        return nextZoom;
      });
    },
    [clampPan]
  );

  // Floating Zoom Buttons — anchored at the centre of the viewport
  const handleZoomIn = () => {
    applyZoomAt((z) => Math.round((z + 0.4) * 100) / 100, 0, 0);
    haptics.light();
  };

  const handleZoomOut = () => {
    applyZoomAt((z) => Math.round((z - 0.4) * 100) / 100, 0, 0);
    haptics.light();
  };

  const focusOnRealm = React.useCallback(() => {
    const owned = map.regions.filter((r) => regionState[r.id]?.owner === activePlayer);
    if (owned.length === 0 || viewScale <= 0) return;

    let sumX = 0;
    let sumY = 0;
    for (const r of owned) {
      sumX += r.center[0];
      sumY += r.center[1];
    }
    const realmCenterX = sumX / owned.length;
    const realmCenterY = sumY / owned.length;

    const targetZoom = 1.45;
    const mapCenterX = map.width / 2;
    const mapCenterY = map.height / 2;

    const panX = -(realmCenterX - mapCenterX) * viewScale * targetZoom;
    const panY = -(realmCenterY - mapCenterY) * viewScale * targetZoom;

    const clamped = clampPan(panX, panY, targetZoom);
    setZoom(targetZoom);
    setPan(clamped);
    if (transformGroupRef.current) {
      transformGroupRef.current.style.transform = `translate(${clamped.x / viewScale}px, ${clamped.y / viewScale}px) scale(${targetZoom})`;
    }
    haptics.light();
  }, [map.regions, regionState, activePlayer, viewScale, map.width, map.height, clampPan]);

  const resetToOverview = React.useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    if (transformGroupRef.current && viewScale > 0) {
      transformGroupRef.current.style.transform = `translate(0px, 0px) scale(1.0)`;
    }
    haptics.light();
  }, [viewScale]);

  // Initial Auto-Focus on Player Realm (Mobile Ergonomics)
  const hasInitiallyFocused = useRef<boolean>(false);
  useEffect(() => {
    if (!hasInitiallyFocused.current && viewScale > 0 && containerSize.w > 0) {
      hasInitiallyFocused.current = true;
      if (containerSize.w < 600) {
        focusOnRealm();
      }
    }
  }, [viewScale, containerSize.w, focusOnRealm]);

  // Mouse Wheel Zoom centered at cursor
  const onWheel = (e: React.WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const fx = e.clientX - rect.left - rect.width / 2;
    const fy = e.clientY - rect.top - rect.height / 2;
    applyZoomAt((z) => z * (e.deltaY < 0 ? 1.15 : 0.87), fx, fy);
  };

  // Memoized region SVG paths (zero per-frame string recalculations)
  const regionPathsMap = React.useMemo(() => {
    const m = new Map<number, string>();
    for (const r of map.regions) {
      if (r.svgPath) {
        m.set(r.id, r.svgPath);
      } else if (r.polygon && r.polygon.length > 0) {
        m.set(r.id, `M ${r.polygon.map((p) => `${p[0]},${p[1]}`).join(' L ')} Z`);
      } else {
        m.set(r.id, '');
      }
    }
    return m;
  }, [map.regions]);

  const transformGroupRef = useRef<SVGGElement | null>(null);

  // Latest-value mirrors so the native touch listeners never need re-binding.
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const clampRef = useRef(clampPan);
  const viewScaleRef = useRef(viewScale);
  panRef.current = pan;
  zoomRef.current = zoom;
  clampRef.current = clampPan;
  viewScaleRef.current = viewScale;

  // Direct Hardware Transform (Zero React Re-renders during active drag/pinch gestures)
  const updateTransformDirect = React.useCallback(
    (nextPan: { x: number; y: number }, nextZoom?: number) => {
      panRef.current = nextPan;
      if (nextZoom !== undefined) zoomRef.current = nextZoom;

      const g = transformGroupRef.current;
      if (g) {
        const scale = viewScaleRef.current;
        const tx = scale > 0 ? nextPan.x / scale : 0;
        const ty = scale > 0 ? nextPan.y / scale : 0;
        const z = zoomRef.current;
        g.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
      }
    },
    []
  );

  // Native Touch Event Listeners for 2-finger Pinch & 1-finger Drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      const pan = panRef.current;
      const zoom = zoomRef.current;
      if (e.touches.length === 1) {
        // Single finger drag start
        isDragging.current = true;
        isPinching.current = false;
        hasMoved.current = false;
        dragStart.current = {
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        };
      } else if (e.touches.length === 2) {
        // Two finger pinch start
        isPinching.current = true;
        isDragging.current = false;
        hasMoved.current = true; // Pinch is always a drag action, not a click

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        pinchStartDist.current = dist;
        pinchStartZoom.current = zoom;
        pinchStartPan.current = { ...pan };

        // Focal point measured from the container CENTRE (transform origin is the map centre)
        const rect = el.getBoundingClientRect();
        pinchCenter.current = {
          x: (t1.clientX + t2.clientX) / 2 - rect.left - rect.width / 2,
          y: (t1.clientY + t2.clientY) / 2 - rect.top - rect.height / 2,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const pan = panRef.current;
      const zoom = zoomRef.current;
      const clamp = clampRef.current;
      if (e.touches.length === 1 && isDragging.current) {
        // 1-finger pan with boundary clamping
        const rawX = e.touches[0].clientX - dragStart.current.x;
        const rawY = e.touches[0].clientY - dragStart.current.y;
        if (Math.hypot(rawX - pan.x, rawY - pan.y) > 6) {
          hasMoved.current = true;
        }
        updateTransformDirect(clamp(rawX, rawY, zoom));
      } else if (e.touches.length === 2 && isPinching.current) {
        // 2-finger pinch to zoom with boundary clamping
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (pinchStartDist.current <= 0) return;

        const scaleMultiplier = currentDist / pinchStartDist.current;
        const newZoom = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, pinchStartZoom.current * scaleMultiplier)
        );

        // Focal point zoom calculation
        const cx = pinchCenter.current.x;
        const cy = pinchCenter.current.y;
        const s0 = pinchStartZoom.current;
        const p0 = pinchStartPan.current;

        const rawPanX = cx - (cx - p0.x) * (newZoom / s0);
        const rawPanY = cy - (cy - p0.y) * (newZoom / s0);

        updateTransformDirect(clamp(rawPanX, rawPanY, newZoom), newZoom);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDragging.current = false;
        isPinching.current = false;
        // Sync final position to React state once gesture completes
        if (hasMoved.current) {
          setPan(panRef.current);
          setZoom(zoomRef.current);
        }
      } else if (e.touches.length === 1) {
        // Re-anchor single finger drag after releasing one finger
        isPinching.current = false;
        isDragging.current = true;
        dragStart.current = {
          x: e.touches[0].clientX - panRef.current.x,
          y: e.touches[0].clientY - panRef.current.y,
        };
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [updateTransformDirect]);

  // Pointer event handlers for desktop mouse dragging
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !isDragging.current) return;
    const rawX = e.clientX - dragStart.current.x;
    const rawY = e.clientY - dragStart.current.y;
    if (Math.hypot(rawX - panRef.current.x, rawY - panRef.current.y) > 6) {
      hasMoved.current = true;
    }
    updateTransformDirect(clampPan(rawX, rawY, zoomRef.current));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      isDragging.current = false;
      if (hasMoved.current) {
        setPan(panRef.current);
        setZoom(zoomRef.current);
      }
    }
  };

  // Troop counts tween toward their new value instead of snapping. A province going
  // 7 -> 2 after a battle should read as an event, not as a silent relabel.
  const rawTroopCounts = React.useMemo(() => regionState.map((r) => r.troops), [regionState]);
  const displayedTroops = useAnimatedCounts(rawTroopCounts);

  // Selected region neighbors for highlight
  const selectedNeighbors = React.useMemo(() => {
    if (selectedRegion === null) return new Set<number>();
    const n = map.regions[selectedRegion]?.neighbors || [];
    return new Set<number>(n);
  }, [selectedRegion, map.regions]);

  // Memoized combined coastal waterline path (1 combined path instead of 194 separate DOM nodes)
  const combinedCoastalPathD = React.useMemo(() => {
    let combined = '';
    for (const r of map.regions) {
      const p = regionPathsMap.get(r.id);
      if (p) combined += (combined ? ' ' : '') + p;
    }
    return combined;
  }, [map.regions, regionPathsMap]);

  // Memoized region visibility array to eliminate duplicate calls across render passes
  const visibilityMap = React.useMemo(() => {
    if (isPickingRealm) return map.regions.map(() => 'VISIBLE' as const);
    return map.regions.map((r) => getRegionVisibility(gameState, activePlayer, r.id));
  }, [isPickingRealm, gameState, activePlayer, map.regions]);

  // Memoized Floating Kingdom Titles (BFS cluster centroid computed only on state ownership change)
  const floatingKingdomTitles = React.useMemo(() => {
    return players
      .map((pl) => {
        if (!pl.isAlive) return null;
        const owned = map.regions.filter((r) => regionState[r.id]?.owner === pl.id);
        if (owned.length <= 1) return null;

        const ownedSet = new Set(owned.map((r) => r.id));
        const visited = new Set<number>();
        let largestCluster: Region[] = [];

        for (const r of owned) {
          if (visited.has(r.id)) continue;
          const cluster: Region[] = [];
          const queue: number[] = [r.id];
          visited.add(r.id);

          while (queue.length > 0) {
            const currId = queue.shift()!;
            const currRegion = map.regions[currId];
            if (currRegion) cluster.push(currRegion);

            for (const nId of currRegion.neighbors) {
              if (ownedSet.has(nId) && !visited.has(nId)) {
                visited.add(nId);
                queue.push(nId);
              }
            }
          }

          if (cluster.length > largestCluster.length) {
            largestCluster = cluster;
          }
        }

        if (largestCluster.length === 0) return null;

        let sumX = 0;
        let sumY = 0;
        for (const r of largestCluster) {
          sumX += r.center[0];
          sumY += r.center[1];
        }
        const cx = sumX / largestCluster.length;
        const cy = sumY / largestCluster.length;

        const totalRegions = Math.max(1, map.regions.length);
        const ratio = owned.length / totalRegions;
        const fontSize = Math.min(42, Math.max(13, Math.round(12 + Math.sqrt(ratio) * 38)));
        const letterSpacing = `${Math.min(14, Math.max(2.5, Math.round(2.5 + ratio * 16)))}px`;
        const opacity = Math.min(0.85, Math.max(0.4, 0.4 + ratio * 0.45));

        return {
          id: pl.id,
          name: pl.name.replace(' (Sən)', ''),
          cx,
          cy,
          fontSize,
          letterSpacing,
          opacity,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  }, [map.regions, regionState, players]);

  function polygonToPath(region: Region): string {
    if (region.svgPath) return region.svgPath;
    if (!region.polygon || region.polygon.length === 0) return '';
    return `M ${region.polygon.map((p) => `${p[0]},${p[1]}`).join(' L ')} Z`;
  }

  function getRegionColor(regionId: number): string {
    const owner = regionState[regionId]?.owner;
    if (owner >= 0 && players[owner]) {
      return players[owner].color;
    }
    return '#584c38'; // Neutral weathered-earth for unclaimed regions
  }

  const getCurvePath = React.useCallback(
    (from: number, to: number) => {
      const fromCenter = map.regions[from]?.center;
      const toCenter = map.regions[to]?.center;
      if (!fromCenter || !toCenter) return null;
      const dx = toCenter[0] - fromCenter[0];
      const dy = toCenter[1] - fromCenter[1];
      const cx = (fromCenter[0] + toCenter[0]) / 2 - dy * 0.15;
      const cy = (fromCenter[1] + toCenter[1]) / 2 + dx * 0.15;
      return `M ${fromCenter[0]} ${fromCenter[1]} Q ${cx} ${cy} ${toCenter[0]} ${toCenter[1]}`;
    },
    [map.regions]
  );

  // Chokepoint (mountain/river) border decorations — geometry is precomputed at
  // mapgen time (map.chokepoints), this just derives a jagged stroke + glyph
  // position per edge. Jitter is seeded from the region-id pair, not Math.random,
  // so the same map always renders the same jagged shape.
  const chokepointPaths = React.useMemo(() => {
    const edges = map.chokepoints ?? [];
    return edges.map((edge) => {
      const [[x0, y0], [x1, y1]] = edge.points;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const seed = Math.sin(edge.regionA * 12.9898 + edge.regionB * 78.233) * 43758.5453;
      const jitter = (seed - Math.floor(seed) - 0.5) * Math.min(len * 0.25, 14);
      const midX = (x0 + x1) / 2 + nx * jitter;
      const midY = (y0 + y1) / 2 + ny * jitter;
      return {
        key: `chokepoint-${edge.regionA}-${edge.regionB}`,
        d: `M ${x0} ${y0} L ${midX} ${midY} L ${x1} ${y1}`,
        glyphX: midX,
        glyphY: midY,
      };
    });
  }, [map.chokepoints]);

  // Draw attack arrow if from and to are selected
  const arrowPath = React.useMemo(() => {
    // An action being resolved (human or AI) takes precedence over the pending selection.
    const from = actionArrow ? actionArrow.from : selectedRegion;
    const to = actionArrow ? actionArrow.to : targetRegion;
    if (from === null || to === null || from === undefined || to === undefined) return null;
    return getCurvePath(from, to);
  }, [selectedRegion, targetRegion, actionArrow, getCurvePath]);

  return (
    <div
      ref={containerRef}
      className="map-viewport"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Floating Map Navigation & Zoom Controls */}
        <div className={`map-zoom-controls ${isPickingRealm ? 'picker-mode' : ''}`}>
          <button
            className="zoom-btn"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Böyüt (+)"
          >
            +
          </button>
          <button
            className="zoom-btn"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Kiçilt (−)"
          >
            −
          </button>
          <button
            className="zoom-btn"
            onClick={focusOnRealm}
            title="Öz Krallığına Fokuslan"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CrownIcon size={14} color="#f59e0b" />
          </button>
          {(zoom !== 1.0 || pan.x !== 0 || pan.y !== 0) && (
            <button
              className="zoom-btn zoom-btn-reset"
              onClick={resetToOverview}
              title="Bütün Xəritə (Sıfırla)"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CompassIcon size={14} color="#94a3b8" />
            </button>
          )}
        </div>

      <svg
        viewBox={`0 0 ${map.width} ${map.height}`}
        className="map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle glow filter for selection */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Arrow marker */}
          <marker
            id="attack-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#c9a24a" />
          </marker>

          {/* Pending Planned Arrow marker */}
          <marker
            id="pending-attack-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#5f7a68" />
          </marker>

          {/* Deep Prussian Navy & Oceanic Radial Gradient */}
          <radialGradient
            id="ocean-canvas-gradient"
            cx="50%"
            cy="50%"
            r="65%"
          >
            <stop offset="0%" stopColor="#141f2b" />
            <stop offset="55%" stopColor="#0f1721" />
            <stop offset="100%" stopColor="#080c10" />
          </radialGradient>

          {/* Portolan Nautical Navigation Grid */}
          <pattern
            id="ocean-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(85, 135, 180, 0.06)"
              strokeWidth="1"
            />
            <circle cx="80" cy="80" r="1.5" fill="rgba(100, 160, 210, 0.09)" />
          </pattern>
        </defs>

        {/* Expansive Canvas Background (Ensures Full Cover even when panning) */}
        <rect
          x="-3000"
          y="-3000"
          width="6000"
          height="6000"
          fill="url(#ocean-canvas-gradient)"
        />
        <rect
          x="-3000"
          y="-3000"
          width="6000"
          height="6000"
          fill="url(#ocean-grid)"
        />

        {/* Scaled & Panned Map Layer.
            Two things here are load-bearing, both verified in a real browser:

            1. NO `transition` on `transform`. A CSS transition on the transform of an SVG
               element pins the computed value at the identity matrix forever — the map
               simply never moves. This is why zoom/pan appeared to do nothing at all:
               `scale(1.8)` was in the style attribute while the computed value stayed
               `matrix(1,0,0,1,0,0)`. Removing the transition makes it apply instantly.
               (Smooth zoom easing can come back later as a JS tween of `zoom` itself.)

            2. The transform is a CSS PROPERTY, not an SVG presentation attribute, so the
               px units below are meaningful and the value is not silently overridden.

            `pan` is stored in screen px, so it is divided by viewScale to reach user units. */}
        <g
          ref={transformGroupRef}
          className="map-transform-layer"
          style={{
            transform: `translate(${viewScale > 0 ? pan.x / viewScale : 0}px, ${
              viewScale > 0 ? pan.y / viewScale : 0
            }px) scale(${zoom})`,
            transformOrigin: `${map.width / 2}px ${map.height / 2}px`,
          }}
        >
          {/* Coastal Waterline Glow Halo (Grand Strategy Sea Ripples - Single Path Optimization) */}
          <g className="coastal-waterlines-layer" pointerEvents="none">
            {/* Outer soft oceanic ripple */}
            <path
              d={combinedCoastalPathD}
              fill="none"
              stroke="#1e3448"
              strokeWidth="8"
              strokeOpacity="0.45"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Inner crisp coastal waterline */}
            <path
              d={combinedCoastalPathD}
              fill="none"
              stroke="#325370"
              strokeWidth="2.5"
              strokeOpacity="0.40"
              strokeLinejoin="round"
            />
          </g>

          {/* Region Polygons */}
          <g className="regions-layer">
            {map.regions.map((region: Region) => {
              const visibility = visibilityMap[region.id];
              const isFogged = visibility === 'FOGGED';
              const isChosenKingdom = isPickingRealm && chosenKingdomId !== undefined && (region as any).stateId === chosenKingdomId;
              const isSelected = selectedRegion === region.id || isChosenKingdom;
              const isTarget = targetRegion === region.id;
              const isNeighbor = !isPickingRealm && selectedNeighbors.has(region.id);
              const isConquered = animatingConquest === region.id;
              const isRepelled = animatingBattle === region.id;
              const fillColor = getRegionColor(region.id);
              const pathD = regionPathsMap.get(region.id) || polygonToPath(region);
              const rState = gameState.regionState[region.id];
              const isAlly = !isPickingRealm && rState?.owner !== undefined && rState.owner >= 0 && rState.owner !== gameState.activePlayer && hasActivePact(gameState, gameState.activePlayer, rState.owner);

              return (
                <React.Fragment key={region.id}>
                  {/* Sovereign Kingdom Color Layer */}
                  <path
                    d={pathD}
                    fill={fillColor}
                    fillOpacity={
                      isSelected
                        ? 0.92
                        : isNeighbor
                        ? 0.85
                        : 0.78
                    }
                    style={{ transition: 'fill 0.35s ease' }}
                    stroke={
                      isChosenKingdom
                        ? '#fae19c'
                        : isSelected
                        ? '#d9a43a'
                        : isTarget
                        ? '#b3554f'
                        : isAlly
                        ? '#4ade80'
                        : isNeighbor
                        ? '#5f7a68'
                        : isFogged
                        ? '#221910'
                        : '#1a140d'
                    }
                    strokeWidth={isChosenKingdom ? 3.2 : (isSelected || isTarget ? 3.5 : isAlly ? 2.8 : isNeighbor ? 2.5 : 1.4)}
                    strokeDasharray={isAlly ? '6 4' : (isNeighbor && !isSelected && !isTarget ? '4 3' : undefined)}
                    className={`region-path ${isSelected ? 'selected' : ''} ${
                      isNeighbor ? 'neighbor-selectable' : ''
                    } ${isAlly ? 'pact-ally-border' : ''} ${isConquered ? 'conquest-pulse' : ''} ${isRepelled ? 'battle-repel-pulse' : ''}`}
                    onClick={(e) => {
                      if (!hasMoved.current) {
                        e.stopPropagation();
                        if (isPickingRealm && onSelectKingdom) {
                          const sId = (region as any).stateId;
                          if (sId !== undefined) {
                            haptics.light();
                            onSelectKingdom(sId);
                          }
                        } else {
                          onSelectRegion(region.id);
                        }
                      }
                    }}
                    data-region={region.id}
                    data-owner={regionState[region.id]?.owner}
                    data-troops={regionState[region.id]?.troops}
                    data-visibility={visibility}
                  />

                  {/* Atmospheric Fog of War Shroud Layer */}
                  {isFogged && (
                    <path
                      d={pathD}
                      fill="#0d0905"
                      fillOpacity={0.65}
                      pointerEvents="none"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </g>

          {/* Dynamic Floating Kingdom Titles Layer (Pre-computed BFS Centroids) */}
          <g className="floating-kingdom-titles-layer" pointerEvents="none">
            {floatingKingdomTitles.map((t) => (
              <g key={`kingdom-title-${t.id}`} transform={`translate(${t.cx}, ${t.cy}) scale(${invZoom})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#f6ebd2"
                  stroke="#1a140d"
                  strokeWidth={t.fontSize > 24 ? 3.5 : 2.5}
                  paintOrder="stroke"
                  opacity={t.opacity}
                  fontSize={t.fontSize}
                  fontFamily="'Noto Serif', Georgia, serif"
                  fontWeight="bold"
                  letterSpacing={t.letterSpacing}
                  style={{
                    textTransform: 'uppercase',
                    pointerEvents: 'none',
                  }}
                >
                  {t.name}
                </text>
              </g>
            ))}
          </g>

          {/* Chokepoint borders — cosmetic mountain/river markers on the map's
              narrowest passes. Purely decorative: does not block movement. */}
          <g className="chokepoints-layer" pointerEvents="none">
            {chokepointPaths.map((c) => (
              <g key={c.key}>
                <path d={c.d} fill="none" stroke="#4c3f26" strokeWidth="3" strokeLinecap="round" />
                <g transform={`translate(${c.glyphX}, ${c.glyphY}) scale(${invZoom})`}>
                  <path
                    d="M -5 4 L 0 -5 L 5 4 Z"
                    fill="#6b5f45"
                    stroke="#1d1710"
                    strokeWidth="0.75"
                  />
                </g>
              </g>
            ))}
          </g>

          {/* Pending Planned Move Arrows (Simultaneous Planning Phase) */}
          {pendingArrows?.map((pa, idx) => {
            const p = getCurvePath(pa.from, pa.to);
            if (!p) return null;
            return (
              <path
                key={`pending-arrow-${idx}-${pa.from}-${pa.to}`}
                d={p}
                fill="none"
                stroke="#5f7a68"
                strokeWidth="3"
                strokeDasharray="5 3"
                markerEnd="url(#pending-attack-arrow)"
                className="pending-order-arrow"
              />
            );
          })}

          {/* Attack / Move Curved Arrow */}
          {arrowPath && (
            <path
              d={arrowPath}
              fill="none"
              stroke="#c9a24a"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              markerEnd="url(#attack-arrow)"
              className="attack-arrow-animated"
            />
          )}

          {/* Conquest Impact Burst — a one-shot ring in the new owner's color,
              timed to the exact moment `animatingConquest` fires so the flip
              of ownership reads as an impact, not a silent recolor. */}
          {typeof animatingConquest === 'number' && map.regions[animatingConquest] && (
            <circle
              key={`burst-${animatingConquest}`}
              cx={map.regions[animatingConquest].center[0]}
              cy={map.regions[animatingConquest].center[1]}
              r={4}
              fill="none"
              stroke={getRegionColor(animatingConquest)}
              className="conquest-burst-ring"
              pointerEvents="none"
            />
          )}

          {/* Battle Repel Burst — a smaller, redder, quicker ring than the conquest
              one: the province held, so it shouldn't read as a triumphant claim. */}
          {typeof animatingBattle === 'number' && map.regions[animatingBattle] && (
            <circle
              key={`repel-${animatingBattle}`}
              cx={map.regions[animatingBattle].center[0]}
              cy={map.regions[animatingBattle].center[1]}
              r={4}
              fill="none"
              stroke="#b3554f"
              className="battle-repel-ring"
              pointerEvents="none"
            />
          )}

          {/* Troop Badges & Labels Layer */}
          <g className="troops-layer">
            {map.regions.map((region: Region) => {
              const visibility = visibilityMap[region.id];
              const isFogged = visibility === 'FOGGED';
              if (isFogged) return null;

              const rState = regionState[region.id];
              const [cx, cy] = region.center;
              const isSelected = selectedRegion === region.id;
              const isOwned = rState?.owner === activePlayer;
              const hasExhausted = (rState?.exhaustedTroops || 0) > 0 && rState.troops > 0;
              const ready = Math.max(0, (rState?.troops || 0) - (rState?.exhaustedTroops || 0));

              const capPlayer = capitalsMap.get(region.id);

              return (
                <g
                  key={`badge-${region.id}`}
                  transform={`translate(${cx}, ${cy}) scale(${invZoom})`}
                  className="troop-badge-group"
                  onClick={(e) => {
                    if (!hasMoved.current) {
                      e.stopPropagation();
                      onSelectRegion(region.id);
                    }
                  }}
                >
                  {/* Capital Heraldic Knight Shield & Crown (Only if not fogged) */}
                  {capPlayer && !isFogged && (() => {
                    const isOccupied = capPlayer.isAlive && rState?.owner !== capPlayer.id;
                    const left = Math.max(0, 5 - (capPlayer.capitalLostTurns || 0));
                    return (
                      <g transform="translate(0, -22)" pointerEvents="none" className="capital-shield-badge">
                        {/* Shield */}
                        <path
                          d="M 0,-13 L 11,-13 C 11,-2 8,6 0,13 C -8,6 -11,-2 -11,-13 Z"
                          fill={capPlayer.color}
                          stroke="#fae19c"
                          strokeWidth="1.8"
                        />
                        {/* Golden Crown */}
                        <path
                          d="M -5,-5 L -5,-2 L -2.5,-3 L 0,-0.5 L 2.5,-3 L 5,-2 L 5,-5 L 2.5,-6.5 L 0,-4 L -2.5,-6.5 Z"
                          fill="#ffd700"
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                        {/* Occupied Countdown Alert Badge */}
                        {isOccupied && (
                          <g transform="translate(10, -10)">
                            <circle cx="0" cy="0" r="7.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.2" />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="bold"
                              fill="#ffffff"
                              fontFamily="system-ui, sans-serif"
                            >
                              {left}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* Tactical Fortification Badge (Fort or Watchtower) */}
                  {rState?.building && rState.building !== 'NONE' && (
                    <g transform="translate(13, -12)" pointerEvents="none" className="fortification-badge">
                      <circle
                        cx="0"
                        cy="0"
                        r="8"
                        fill={rState.building === 'FORT' ? '#78350f' : '#0369a1'}
                        stroke={rState.building === 'FORT' ? '#f59e0b' : '#38bdf8'}
                        strokeWidth="1.2"
                      />
                      <g transform="translate(-4.5, -4.5)">
                        {rState.building === 'FORT' ? (
                          <FortressIcon size={9} color="#fef08a" />
                        ) : (
                          <WatchtowerIcon size={9} color="#bae6fd" />
                        )}
                      </g>
                    </g>
                  )}

                  {/* Troop Seal Circle */}
                  <circle
                    r={isSelected ? 16 : 14}
                    fill={
                      hasExhausted && isOwned && ready === 0
                        ? '#241a10'
                        : '#1d1710'
                    }
                    stroke={
                      isSelected
                        ? '#d9a43a'
                        : hasExhausted && isOwned
                        ? '#a99878'
                        : '#6b5f45'
                    }
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray={hasExhausted && isOwned && ready === 0 ? '3 2' : undefined}
                    className="troop-circle"
                  />

                  {/* Troop Count */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={
                      hasExhausted && isOwned && ready === 0
                        ? '#a99878'
                        : '#f5ecd8'
                    }
                    fontSize={isSelected ? '12' : '11'}
                    fontWeight="bold"
                    fontFamily="'Noto Serif', Georgia, serif"
                    pointerEvents="none"
                  >
                    {displayedTroops[region.id] ?? rState?.troops ?? 0}
                  </text>

                  {/* Region Name text under seal */}
                  <text
                    textAnchor="middle"
                    dy="26"
                    fill="#e8dcc0"
                    stroke="#1d1710"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="'Noto Serif', Georgia, serif"
                    pointerEvents="none"
                    className="region-name-label"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Transient damage numbers */}
          <g className="floaters-layer" pointerEvents="none">
            {(floaters ?? []).map((f) => {
              const c = map.regions[f.regionId]?.center;
              if (!c) return null;
              return (
                <g
                  key={f.id}
                  transform={`translate(${c[0]}, ${c[1] - 18}) scale(${invZoom})`}
                >
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    className={`floater floater-${f.kind}`}
                    fontSize="16"
                    fontWeight="800"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {f.text}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Tweens an array of numbers toward their targets over ~260ms on rAF.
 * Returns rounded values ready to render.
 */
function useAnimatedCounts(targets: number[]): number[] {
  const [shown, setShown] = useState<number[]>(targets);
  const fromRef = useRef<number[]>(targets);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const targetsKey = targets.join(',');

  useEffect(() => {
    const to = targetsKey.split(',').map(Number);
    const from = fromRef.current;
    // Length changed (new game / different map size) — snap, don't tween.
    if (from.length !== to.length) {
      fromRef.current = to;
      setShown(to);
      return;
    }
    if (from.every((v, i) => v === to[i])) return;

    const DURATION = 260;
    startRef.current = performance.now();
    const base = [...from];

    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = base.map((v, i) => Math.round(v + (to[i] - v) * eased));
      setShown(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      fromRef.current = to;
    };
  }, [targetsKey]);

  return shown;
}
