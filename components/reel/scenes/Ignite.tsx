import { IRIS_ORIGIN } from "@/lib/reel";
import {
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  easeOutDamped,
  lerp,
  seg,
} from "@/lib/motion";
import { X0, curvePath, curveY } from "../curve";
import { Brackets } from "../bits";

const pct = (v: number) => `${v * 100}%`;

/**
 * SC 01 IGNITE (0-1.8). Gradient descent as a gesture: a loss bowl strokes on,
 * a flame ball drops onto the left rim, rolls, overshoots, and settles in the
 * minimum — which is exactly IRIS_ORIGIN, where NAME will open from.
 */
export default function Ignite({ t }: { t: number }) {
  const grid = easeOutCubic(seg(t, 0, 0.4));
  const path = curvePath(easeInOutCubic(seg(t, 0.15, 0.9)));

  const ballX = t < 0.8 ? X0 : lerp(X0, IRIS_ORIGIN.x, easeOutDamped(seg(t, 0.8, 1.5)));
  const ballY =
    t < 0.78 ? lerp(-0.06, curveY(X0), easeInCubic(seg(t, 0.45, 0.78))) : curveY(ballX);

  const lock = easeOutCubic(seg(t, 1.5, 1.62));
  const pulse = seg(t, 1.5, 1.8);
  const at = { left: pct(IRIS_ORIGIN.x), top: pct(IRIS_ORIGIN.y) };

  return (
    // --ball scales the whole gesture with the viewport: 18px on phones, 34px on a 1920 screen.
    <div className="absolute inset-0 [--ball:clamp(18px,1.75vw,34px)]">
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: grid * 0.09 }}>
        <defs>
          <pattern id="reel-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="1.25" fill="var(--bone)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#reel-dots)" />
      </svg>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {path && (
          <path
            d={path}
            fill="none"
            stroke="var(--bone)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {t >= 1.5 && pulse < 1 && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone"
          style={{
            ...at,
            width: `calc(var(--ball) * ${1 + easeOutCubic(pulse) * 8})`,
            height: `calc(var(--ball) * ${1 + easeOutCubic(pulse) * 8})`,
            opacity: (1 - pulse) * 0.8,
          }}
        />
      )}

      {t >= 1.5 && (
        <Brackets
          className="absolute h-[calc(var(--ball)*2.55)] w-[calc(var(--ball)*2.55)]"
          style={{ ...at, transform: `translate(-50%, -50%) scale(${lerp(1.6, 1, lock)})` }}
        />
      )}

      {t >= 0.45 && (
        <span
          className="absolute h-[var(--ball)] w-[var(--ball)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame"
          style={{ left: pct(ballX), top: pct(ballY) }}
        />
      )}

      <span
        className="mono absolute text-[clamp(11px,0.8vw,15px)] tracking-[0.14em] text-mist"
        style={{
          left: `calc(${pct(IRIS_ORIGIN.x)} + var(--ball) * 1.9)`,
          top: `calc(${pct(IRIS_ORIGIN.y)} + var(--ball) * 0.8)`,
          opacity: easeOutCubic(seg(t, 1.5, 1.7)),
        }}
      >
        ∇f = 0
      </span>
    </div>
  );
}
