import { Delaunay } from 'd3-delaunay';
import { createRng } from './rng';
import { ChokepointEdge, MapData, Region, RULES } from './types';
import { generateRegionName } from './names';

export interface MapGenOptions {
  seed: number;
  regionCount?: number;
  width?: number;
  height?: number;
  relaxationIterations?: number;
}

/** Cosmetic-only border density for `computeChokepointEdges` — independent of
 *  RULES.maxNeighbors, which governs actual traversable adjacency. */
const VISUAL_CHOKEPOINT_K = 3;

export function generateProceduralMap(options: MapGenOptions): MapData {
  const seed = options.seed;
  const regionCount = options.regionCount || 24;
  // Portrait canvas: phones are portrait, and a 16:9 landscape map either gets cropped
  // (preserveAspectRatio="slice") or shrinks to an unreadable strip when fitted.
  // 1000x1700 closely matches a phone's play area (viewport minus the top/bottom bars),
  // so the whole map fits at zoom 1 with only a thin letterbox band.
  const width = options.width || 1000;
  const height = options.height || 1700;
  const relaxationIterations = options.relaxationIterations || 3;

  const rng = createRng(seed);

  // Generate initial random points across the wide full canvas
  const margin = 20;
  let points: [number, number][] = [];
  for (let i = 0; i < regionCount; i++) {
    points.push([
      rng.next() * (width - 2 * margin) + margin,
      rng.next() * (height - 2 * margin) + margin,
    ]);
  }

  // Lloyd relaxation passes for smooth, clean, touch-friendly cells
  for (let iter = 0; iter < relaxationIterations; iter++) {
    const flatPoints: number[] = [];
    for (const p of points) {
      flatPoints.push(p[0], p[1]);
    }
    const delaunay = new Delaunay(flatPoints);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const newPoints: [number, number][] = [];
    for (let i = 0; i < regionCount; i++) {
      const polygon = voronoi.cellPolygon(i);
      if (!polygon || polygon.length === 0) {
        newPoints.push(points[i]);
        continue;
      }
      // Calculate polygon centroid
      let cx = 0;
      let cy = 0;
      for (const pt of polygon) {
        cx += pt[0];
        cy += pt[1];
      }
      cx /= polygon.length;
      cy /= polygon.length;

      // Keep within bounds
      cx = Math.max(margin, Math.min(width - margin, cx));
      cy = Math.max(margin, Math.min(height - margin, cy));
      newPoints.push([cx, cy]);
    }
    points = newPoints;
  }

  // Final Voronoi generation
  const flatPoints: number[] = [];
  for (const p of points) {
    flatPoints.push(p[0], p[1]);
  }
  const delaunay = new Delaunay(flatPoints);
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  // First pass: Construct all region polygons and centroids
  const rawPolys: [number, number][][] = [];
  const centroids: [number, number][] = [];

  for (let i = 0; i < regionCount; i++) {
    const rawPoly = voronoi.cellPolygon(i) || [];
    const polygon: [number, number][] = rawPoly.map((pt) => [
      Math.round(pt[0] * 10) / 10,
      Math.round(pt[1] * 10) / 10,
    ]);
    rawPolys.push(polygon);

    let cx = points[i][0];
    let cy = points[i][1];
    if (polygon.length > 0) {
      let sumX = 0;
      let sumY = 0;
      for (const pt of polygon) {
        sumX += pt[0];
        sumY += pt[1];
      }
      cx = sumX / polygon.length;
      cy = sumY / polygon.length;
    }
    centroids.push([Math.round(cx * 10) / 10, Math.round(cy * 10) / 10]);
  }

  // Second pass: Calculate true physical neighbors that share a boundary edge
  const regions: Region[] = [];
  for (let i = 0; i < regionCount; i++) {
    const polyA = rawPolys[i];
    const neighborSet = new Set<number>();

    // Delaunay candidate neighbors
    for (const candIdx of delaunay.neighbors(i)) {
      if (candIdx >= 0 && candIdx < regionCount && candIdx !== i) {
        const polyB = rawPolys[candIdx];
        if (doPolygonsShareEdge(polyA, polyB)) {
          neighborSet.add(candIdx);
        }
      }
    }

    regions.push({
      id: i,
      name: generateRegionName(i, seed),
      polygon: polyA,
      center: centroids[i],
      neighbors: Array.from(neighborSet).sort((a, b) => a - b),
      income: RULES.regionBaseIncome,
    });
  }

  pruneToChokepoints(regions, RULES.maxNeighbors);

  const chokepoints = computeChokepointEdges(regions, VISUAL_CHOKEPOINT_K);

  return {
    width,
    height,
    regions,
    chokepoints,
  };
}

/**
 * Thins the adjacency graph into something with chokepoints.
 *
 * Raw Voronoi is very densely connected — measured across 100 maps: 4.57 neighbours on
 * average (up to 8), and it gets WORSE as the map grows (4.24 at 16 regions, 5.00 at 48).
 * Wide fronts mean nobody can ever break through, which is why bigger maps were measurably
 * less decisive (49% conquest at 24 regions, 21% at 32, 1% at 48).
 *
 * Each region keeps its `maxNeighbors` closest borders; the longer ones become impassable
 * mountains and rivers. Measured effect at K=3: conquest 49% -> 54%, games 0.6 turns shorter.
 *
 * Pruning is symmetric (an edge survives if EITHER side wants to keep it) and the graph is
 * always verified to stay fully connected — dropped edges are restored if the map splits,
 * because an unreachable province would be an unwinnable game.
 */
export function pruneToChokepoints(regions: Region[], maxNeighbors: number): void {
  if (maxNeighbors <= 0 || regions.length < 2) return;

  const key = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const dist = (a: number, b: number): number =>
    Math.hypot(
      regions[a].center[0] - regions[b].center[0],
      regions[a].center[1] - regions[b].center[1]
    );

  const original = regions.map((r) => [...r.neighbors]);

  // Union of each region's K nearest borders. A region may end up with more than K if its
  // neighbours all chose it, which is exactly the shape a chokepoint has.
  const keep = new Set<string>();
  for (const region of regions) {
    const sorted = [...region.neighbors].sort((a, b) => dist(region.id, a) - dist(region.id, b));
    for (const n of sorted.slice(0, maxNeighbors)) keep.add(key(region.id, n));
  }

  const apply = () => {
    for (let i = 0; i < regions.length; i++) {
      regions[i].neighbors = original[i].filter((n) => keep.has(key(i, n)));
    }
  };
  apply();

  // Restore edges until the whole map is reachable again.
  for (let guard = 0; guard < regions.length; guard++) {
    const seen = new Set<number>([0]);
    const stack = [0];
    while (stack.length > 0) {
      const cur = stack.pop() as number;
      for (const n of regions[cur].neighbors) {
        if (!seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      }
    }
    if (seen.size === regions.length) return;

    // Reconnect the nearest severed link between the reached set and the rest.
    let bestA = -1;
    let bestB = -1;
    let bestD = Infinity;
    for (let i = 0; i < regions.length; i++) {
      if (!seen.has(i)) continue;
      for (const n of original[i]) {
        if (seen.has(n)) continue;
        const d = dist(i, n);
        if (d < bestD) {
          bestD = d;
          bestA = i;
          bestB = n;
        }
      }
    }
    if (bestA < 0) return; // nothing left to reconnect
    keep.add(key(bestA, bestB));
    apply();
  }
}

/**
 * Finds the vertices two Voronoi cell polygons share (within 1.5px), deduped to
 * within 1px of each other. Returns null if fewer than 2 distinct shared vertices
 * exist, or none of them are >= 2px apart (i.e. no real border edge).
 */
export function getSharedEdgeVertices(
  polyA: [number, number][],
  polyB: [number, number][]
): [[number, number], [number, number]] | null {
  if (!polyA || !polyB || polyA.length < 3 || polyB.length < 3) return null;

  const sharedVertices: [number, number][] = [];
  for (const ptA of polyA) {
    for (const ptB of polyB) {
      if (Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1]) < 1.5) {
        if (!sharedVertices.some((sv) => Math.hypot(sv[0] - ptA[0], sv[1] - ptA[1]) < 1.0)) {
          sharedVertices.push(ptA);
        }
      }
    }
  }

  if (sharedVertices.length >= 2) {
    for (let i = 0; i < sharedVertices.length; i++) {
      for (let j = i + 1; j < sharedVertices.length; j++) {
        const dist = Math.hypot(
          sharedVertices[i][0] - sharedVertices[j][0],
          sharedVertices[i][1] - sharedVertices[j][1]
        );
        if (dist >= 2.0) {
          return [sharedVertices[i], sharedVertices[j]];
        }
      }
    }
  }

  return null;
}

/**
 * Checks if two Voronoi cell polygons share an actual physical border edge
 * (i.e. share at least 2 distinct vertices separated by >= 2px).
 */
export function doPolygonsShareEdge(
  polyA: [number, number][],
  polyB: [number, number][]
): boolean {
  return getSharedEdgeVertices(polyA, polyB) !== null;
}

/**
 * Classifies a purely COSMETIC subset of borders as "chokepoints" (mountains/rivers)
 * for rendering only. This is independent of `pruneToChokepoints` / RULES.maxNeighbors,
 * which drive actual movement/combat — at the live game's maxNeighbors (99), that
 * function keeps virtually every edge, so nothing would ever render as a chokepoint
 * if this reused its output. Instead we run the same "keep K nearest borders" logic
 * against a separate, smaller, visual-only K, without touching `regions[i].neighbors`.
 */
export function computeChokepointEdges(
  regions: Region[],
  visualMaxNeighbors: number
): ChokepointEdge[] {
  if (visualMaxNeighbors <= 0 || regions.length < 2) return [];

  const key = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const dist = (a: number, b: number): number =>
    Math.hypot(
      regions[a].center[0] - regions[b].center[0],
      regions[a].center[1] - regions[b].center[1]
    );

  const keep = new Set<string>();
  for (const region of regions) {
    const sorted = [...region.neighbors].sort((a, b) => dist(region.id, a) - dist(region.id, b));
    for (const n of sorted.slice(0, visualMaxNeighbors)) keep.add(key(region.id, n));
  }

  const edges: ChokepointEdge[] = [];
  const seen = new Set<string>();
  for (const region of regions) {
    for (const n of region.neighbors) {
      const k = key(region.id, n);
      if (keep.has(k) || seen.has(k)) continue;
      seen.add(k);
      const verts = getSharedEdgeVertices(region.polygon, regions[n].polygon);
      if (!verts) continue;
      edges.push({ regionA: region.id, regionB: n, points: verts });
    }
  }

  return edges;
}

import { DOZIA_PROVINCES, DOZIA_MAP_METADATA } from '../data/maps/dozia_native_provinces';

export function getDoziaMapData(): MapData {
  return {
    name: DOZIA_MAP_METADATA.name,
    width: DOZIA_MAP_METADATA.width,
    height: DOZIA_MAP_METADATA.height,
    svgAsset: DOZIA_MAP_METADATA.svgAsset,
    regions: DOZIA_PROVINCES.map((p) => ({
      id: p.id,
      name: p.name,
      fullName: p.fullName,
      polygon: [],
      center: [p.cx, p.cy],
      neighbors: p.neighbors,
      income: p.income,
      svgPath: p.svgPath,
      stateId: p.stateId,
      stateName: p.stateName,
      stateColor: p.stateColor,
      burgName: p.burgName,
      isCapital: p.isCapital,
      terrain: p.terrain,
    })),
  };
}
