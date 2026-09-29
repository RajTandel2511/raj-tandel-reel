import { easeOutBack, easeOutCubic, lerp, seg } from "@/lib/motion";
import { C, CENTROID, CONSTRAINTS, K_MAX, K_START, OPT, PERP, POLY, along, isoLine, pts, r, type Pt } from "./geometry";
import { Frame, MONO, palette, type VizProps } from "./kit";

const ARROW = 34;
const TIP: Pt = [CENTROID[0] + C[0] * ARROW, CENTROID[1] + C[1] * ARROW];
/** Offset from the tip: `back` along c, `side` across it. */
const off = (back: number, side: number): Pt => [TIP[0] + C[0] * back + PERP[0] * side, TIP[1] + C[1] * back + PERP[1] * side];
const HEAD: Pt[] = [TIP, off(-7, 4), off(-7, -4)];
const OUT = Math.hypot(OPT[0] - CENTROID[0], OPT[1] - CENTROID[1]);
const LABEL: Pt = [OPT[0] + ((OPT[0] - CENTROID[0]) / OUT) * 26, OPT[1] + ((OPT[1] - CENTROID[1]) / OUT) * 26];
const CORNERS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
] as const;

/** A linear program: constraints fence in a region, the objective line sweeps until it last touches x*. */
export default function OptimizeViz({ p, dark = true, className }: VizProps) {
  const c = palette(dark);
  const region = seg(p, 0.35, 0.5);
  const iso = isoLine(lerp(K_START, K_MAX, easeOutCubic(seg(p, 0.45, 0.85))));
  const isoIn = seg(p, 0.45, 0.5);
  const arrow = seg(p, 0.4, 0.5);
  const snap = seg(p, 0.85, 0.95);
  const s = lerp(26, 9, easeOutBack(snap));

  return (
    <Frame
      className={className}
      label="Optimization: five constraints bound a feasible region; the objective line sweeps across it and stops on the optimal vertex x*"
    >
      {CONSTRAINTS.map(([a, b], i) => {
        const t = easeOutCubic(seg(p, i * 0.075, i * 0.075 + 0.1));
        if (t <= 0) return null;
        const e = along(a, b, t);
        return <line key={i} x1={r(a[0])} y1={r(a[1])} x2={r(e[0])} y2={r(e[1])} style={{ stroke: c.dim }} strokeWidth={1.5} />;
      })}

      {region > 0 && (
        <polygon
          points={pts(POLY)}
          style={{ fill: c.accent, stroke: c.ink }}
          fillOpacity={r(0.12 * region)}
          strokeOpacity={r(region)}
          strokeWidth={2}
          strokeLinejoin="miter"
        />
      )}

      {arrow > 0 && (
        <g opacity={r(arrow)}>
          <line x1={r(CENTROID[0])} y1={r(CENTROID[1])} x2={r(TIP[0])} y2={r(TIP[1])} style={{ stroke: c.ink }} strokeWidth={1.5} />
          <polygon points={pts(HEAD)} style={{ fill: c.ink }} />
          <text x={r(TIP[0] + C[0] * 8)} y={r(TIP[1] + C[1] * 8)} dy="0.35em" textAnchor="middle" style={{ ...MONO, fontSize: 12, fill: c.ink }}>
            c
          </text>
        </g>
      )}

      {isoIn > 0 && (
        <line
          x1={r(iso[0][0])}
          y1={r(iso[0][1])}
          x2={r(iso[1][0])}
          y2={r(iso[1][1])}
          style={{ stroke: c.ink }}
          strokeOpacity={r(isoIn)}
          strokeWidth={1.5}
          strokeDasharray="6 5"
        />
      )}

      {snap > 0 && (
        <g>
          <circle cx={OPT[0]} cy={OPT[1]} r={4} style={{ fill: c.accent }} />
          {CORNERS.map(([sx, sy]) => {
            const x = r(OPT[0] + sx * s);
            const y = r(OPT[1] + sy * s);
            return (
              <path key={`${sx}${sy}`} d={`M${x - sx * 6},${y} L${x},${y} L${x},${y - sy * 6}`} fill="none" style={{ stroke: c.accent }} strokeWidth={2} />
            );
          })}
          <text x={r(LABEL[0])} y={r(LABEL[1])} dy="0.35em" textAnchor="middle" opacity={r(seg(p, 0.9, 1))} style={{ ...MONO, fontSize: 11, fill: c.ink }}>
            x*
          </text>
        </g>
      )}
    </Frame>
  );
}
