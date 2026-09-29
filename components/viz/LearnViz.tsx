import { easeInOutCubic, easeOutCubic, lerp, seg } from "@/lib/motion";
import { BOUNDARY_D, LEARN, along, r } from "./geometry";
import { Frame, palette, type VizProps } from "./kit";

const DOT = 3.6;

/** Scattered, unlabelled points find their clusters, take a class, and a curved boundary splits them. */
export default function LearnViz({ p, dark = true, className }: VizProps) {
  const c = palette(dark);
  const appear = easeOutCubic(seg(p, 0, 0.08));
  const line = easeInOutCubic(seg(p, 0.6, 0.92));
  const ring = seg(p, 0.85, 0.95);

  return (
    <Frame
      className={className}
      label="Machine learning: scattered points cluster into two classes, split by a curved decision boundary; three points near the boundary stay flagged as uncertain"
    >
      {line > 0 && (
        <path
          d={BOUNDARY_D}
          fill="none"
          style={{ stroke: c.ink }}
          strokeWidth={2}
          pathLength={100}
          strokeDasharray={`${r(line * 100)} 100`}
        />
      )}

      {LEARN.map((pt, i) => {
        const [x0, y0] = along(pt.from, pt.to, easeInOutCubic(seg(p, pt.delay, pt.delay + 0.45)));
        const x = r(x0);
        const y = r(y0);
        const k = easeInOutCubic(seg(p, 0.35 + pt.delay, 0.5 + pt.delay));
        return (
          <g key={i}>
            {k < 1 && appear > 0 && <circle cx={x} cy={y} r={r(DOT * appear)} style={{ fill: c.dim }} opacity={r(1 - k)} />}
            {k > 0 &&
              (pt.cls === "a" ? (
                <circle cx={x} cy={y} r={DOT} style={{ fill: c.accent }} opacity={r(k)} />
              ) : (
                <rect x={r(x - 3.2)} y={r(y - 3.2)} width={6.4} height={6.4} style={{ fill: c.alt }} opacity={r(k)} />
              ))}
            {pt.unsure && ring > 0 && (
              <circle cx={x} cy={y} r={r(lerp(16, 8.5, easeOutCubic(ring)))} fill="none" style={{ stroke: c.ink }} strokeWidth={1.5} opacity={r(ring)} />
            )}
          </g>
        );
      })}
    </Frame>
  );
}
