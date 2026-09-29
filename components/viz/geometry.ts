import { prng } from "@/lib/motion";

/**
 * All viz geometry, computed once at module load. Everything is seeded or
 * hand-placed, so server and client build identical pictures; the components
 * only decide how much of it to show for a given progress p.
 */

export type Pt = readonly [number, number];

/** Round for SVG output: keeps server/client markup identical across JS engines. */
export const r = (v: number) => Math.round(v * 100) / 100;
export const pts = (list: readonly Pt[]) => list.map(([x, y]) => `${r(x)},${r(y)}`).join(" ");
const dot = (a: Pt, b: Pt) => a[0] * b[0] + a[1] * b[1];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
export const along = (a: Pt, b: Pt, f: number): Pt => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];

/** First t (0..1) of a polyline, by index (x-uniform for a time series). */
export function partial(list: readonly Pt[], t: number): Pt[] {
  if (t <= 0 || list.length < 2) return [];
  const x = Math.min(t, 1) * (list.length - 1);
  const i = Math.floor(x);
  const out = list.slice(0, i + 1);
  if (i < list.length - 1) out.push(along(list[i], list[i + 1], x - i));
  return out;
}

/* ------------------------------ Forecast ------------------------------ */

export const FC = { left: 36, right: 384, top: 22, bottom: 206, hist: 36, horizon: 14 } as const;
const fcX = (i: number) => FC.left + (i * (FC.right - FC.left)) / (FC.hist + FC.horizon - 1);
export const fcY = (v: number) => FC.bottom - v * (FC.bottom - FC.top);
const signal = (i: number) => 0.2 + 0.009 * i + 0.1 * Math.sin((2 * Math.PI * i) / 12);
const CONE = 0.014; // half-width per step of horizon: uncertainty grows with distance

const rf = prng(12);
const histV = Array.from({ length: FC.hist }, (_, i) => signal(i) + (rf() - 0.5) * 0.08);
const LAST = FC.hist - 1;
const drift = histV[LAST] - signal(LAST);
const fcV = Array.from({ length: FC.horizon + 1 }, (_, k) => signal(LAST + k) + drift * Math.exp(-k / 3));

export const HISTORY: Pt[] = histV.map((v, i) => [fcX(i), fcY(v)]);
export const FORECAST: Pt[] = fcV.map((v, k) => [fcX(LAST + k), fcY(v)]);
export const CONE_HI: Pt[] = fcV.map((v, k) => [fcX(LAST + k), fcY(v + CONE * k)]);
export const CONE_LO: Pt[] = fcV.map((v, k) => [fcX(LAST + k), fcY(v - CONE * k)]);
export const NOW_X = fcX(LAST);
export const END_X = fcX(LAST + FC.horizon);

/* ------------------------------ Optimize ------------------------------ */

/** Feasible region of a 2-variable LP: five vertices, convex, in SVG space. */
export const POLY: Pt[] = [
  [70, 188],
  [246, 204],
  [326, 128],
  [262, 46],
  [112, 62],
];
const cRaw: Pt = [0.86, -0.51];
/** Objective gradient c (unit), pointing up-right on screen. */
export const C: Pt = [cRaw[0] / Math.hypot(...cRaw), cRaw[1] / Math.hypot(...cRaw)];
export const PERP: Pt = [-C[1], C[0]];
const levels = POLY.map((v) => dot(C, v));
/** The optimum is computed, never hand-picked: argmax of c.v over the vertices. */
export const OPT_I = levels.indexOf(Math.max(...levels));
export const OPT = POLY[OPT_I];
export const K_MAX = levels[OPT_I];
export const K_START = Math.min(...levels) - 40;
export const CENTROID: Pt = [
  POLY.reduce((s, v) => s + v[0], 0) / POLY.length,
  POLY.reduce((s, v) => s + v[1], 0) / POLY.length,
];
/** Each constraint is its edge extended well past the region (a full half-plane boundary). */
export const CONSTRAINTS: [Pt, Pt][] = POLY.map((a, i) => {
  const b = POLY[(i + 1) % POLY.length];
  const len = dist(a, b);
  const d: Pt = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const ext = 46;
  return [
    [a[0] - d[0] * ext, a[1] - d[1] * ext],
    [b[0] + d[0] * ext, b[1] + d[1] * ext],
  ];
});
/** The objective iso-line c.x = k: slides along c and passes through OPT exactly at K_MAX. */
export function isoLine(k: number, half = 260): [Pt, Pt] {
  const m: Pt = [OPT[0] + C[0] * (k - K_MAX), OPT[1] + C[1] * (k - K_MAX)];
  return [
    [m[0] - PERP[0] * half, m[1] - PERP[1] * half],
    [m[0] + PERP[0] * half, m[1] + PERP[1] * half],
  ];
}

/* ------------------------------- Learn -------------------------------- */

/** Decision boundary: cubic Bezier, monotone in y, so "which side" is a lookup of x at y. */
export const BOUNDARY: [Pt, Pt, Pt, Pt] = [
  [150, 8],
  [290, 70],
  [120, 170],
  [262, 232],
];
const bez = (t: number): Pt => {
  const m = 1 - t;
  const w = [m * m * m, 3 * m * m * t, 3 * m * t * t, t * t * t];
  return [0, 1].map((k) => BOUNDARY.reduce((s, p, j) => s + p[k] * w[j], 0)) as unknown as Pt;
};
const curve = Array.from({ length: 241 }, (_, i) => bez(i / 240));
function boundaryX(y: number) {
  const j = curve.findIndex((p) => p[1] >= y);
  if (j <= 0) return curve[j === 0 ? 0 : curve.length - 1][0];
  const a = curve[j - 1];
  const b = curve[j];
  return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
}
export const BOUNDARY_D = `M${BOUNDARY[0].map(r)} C${BOUNDARY.slice(1)
  .map((p) => p.map(r).join(","))
  .join(" ")}`;

export type LearnPoint = { from: Pt; to: Pt; cls: "a" | "b"; delay: number; unsure: boolean };

const rl = prng(7);
const gauss = () => Math.sqrt(-2 * Math.log(1 - rl())) * Math.cos(2 * Math.PI * rl());
const CENTRES = { a: [118, 152] as Pt, b: [292, 88] as Pt };
const MARGIN = 14; // confident points keep at least this far (horizontally) from the boundary

function target(cls: "a" | "b"): Pt {
  const sign = cls === "a" ? -1 : 1;
  for (;;) {
    const p: Pt = [CENTRES[cls][0] + gauss() * 34, CENTRES[cls][1] + gauss() * 30];
    const inside = p[0] > 16 && p[0] < 384 && p[1] > 16 && p[1] < 224;
    if (inside && sign * (p[0] - boundaryX(p[1])) > MARGIN) return p;
  }
}
/** Three points hugging the boundary (still on their correct side): the ones a model is unsure of. */
const UNSURE: { y: number; cls: "a" | "b" }[] = [
  { y: 98, cls: "b" },
  { y: 134, cls: "a" },
  { y: 168, cls: "b" },
];
export const LEARN: LearnPoint[] = Array.from({ length: 44 }, (_, i): LearnPoint => {
  const u = i % 15 === 0 ? UNSURE[i / 15] : undefined;
  const cls = u ? u.cls : i % 2 ? "b" : "a";
  const to: Pt = u ? [boundaryX(u.y) + (cls === "a" ? -7 : 7), u.y] : target(cls);
  return { from: [20 + rl() * 360, 20 + rl() * 200], to, cls, delay: rl() * 0.15, unsure: Boolean(u) };
});

/* ------------------------------- Decide ------------------------------- */

export const NODES: Pt[] = [
  [30, 122], // 0 S
  [92, 46], // 1
  [104, 136], // 2
  [86, 204], // 3
  [176, 84], // 4
  [186, 186], // 5
  [238, 30], // 6
  [262, 128], // 7
  [314, 64], // 8
  [310, 200], // 9
  [370, 128], // 10 T
];
export const S = 0;
export const T = 10;
export const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 6], [2, 4], [2, 5], [3, 5], [4, 6],
  [4, 7], [5, 7], [5, 9], [6, 8], [7, 8], [7, 9], [8, 10], [9, 10],
];

/** Dijkstra over Euclidean edge lengths, S to T. O(n^2), fine for 11 nodes. */
function shortest(): number[] {
  const n = NODES.length;
  const d = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const done = Array(n).fill(false);
  d[S] = 0;
  for (;;) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && d[i] < Infinity && (u < 0 || d[i] < d[u])) u = i;
    if (u < 0 || u === T) break;
    done[u] = true;
    for (const [a, b] of EDGES) {
      const v = a === u ? b : b === u ? a : -1;
      if (v < 0 || done[v]) continue;
      const alt = d[u] + dist(NODES[u], NODES[v]);
      if (alt < d[v]) {
        d[v] = alt;
        prev[v] = u;
      }
    }
  }
  const path = [T];
  while (path[0] !== S) path.unshift(prev[path[0]]);
  return path;
}
export const PATH = shortest();
export const PATH_PTS: Pt[] = PATH.map((i) => NODES[i]);
const legs = PATH_PTS.slice(1).map((p, i) => dist(PATH_PTS[i], p));
export const PATH_LEN = legs.reduce((s, l) => s + l, 0);
/** Cumulative distance at the start of each leg. */
export const LEG_START = legs.map((_, i) => legs.slice(0, i).reduce((s, l) => s + l, 0));
export const LEGS = legs;
