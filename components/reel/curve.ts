import { IRIS_ORIGIN } from "@/lib/reel";

/**
 * The IGNITE loss bowl, in viewport fractions (0..1 on both axes).
 * Spans X0..X1 (~70% of the width) with its minimum exactly at IRIS_ORIGIN,
 * so the ball settles where the iris into NAME opens.
 *
 * Asymmetric: the left rim sits higher than the right. y is the cubic
 * g(s) = A s^2 + B s^3 on each normalised side s in [-1, 1], which is
 * monotone on both sides (g' = s(2A + 3Bs) keeps the sign of s) — one minimum.
 */
export const X0 = 0.15;
export const X1 = 0.85;

const LEFT_RIM = 0.36; // rim height above the minimum
const RIGHT_RIM = 0.22;
const A = (LEFT_RIM + RIGHT_RIM) / 2;
const B = (RIGHT_RIM - LEFT_RIM) / 2;

export function curveY(x: number): number {
  const u = x - IRIS_ORIGIN.x;
  const s = u / (u < 0 ? IRIS_ORIGIN.x - X0 : X1 - IRIS_ORIGIN.x);
  return IRIS_ORIGIN.y - (A * s * s + B * s * s * s);
}

const STEPS = 96;

/**
 * The curve drawn from the left rim up to fraction `p` of its x-span, as an
 * SVG path in a 0..100 viewBox. ponytail: partial path instead of dashoffset —
 * dash lengths don't survive vector-effect="non-scaling-stroke" reliably.
 */
export function curvePath(p: number): string {
  if (p <= 0) return "";
  const end = X0 + (X1 - X0) * Math.min(1, p);
  const n = Math.max(1, Math.ceil(STEPS * p));
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = X0 + ((end - X0) * i) / n;
    d += `${i ? "L" : "M"}${(x * 100).toFixed(3)} ${(curveY(x) * 100).toFixed(3)}`;
  }
  return d;
}
