import { easeInOutCubic, seg } from "@/lib/motion";
import { CONE_HI, CONE_LO, END_X, FC, FORECAST, HISTORY, NOW_X, fcY, partial, pts, r } from "./geometry";
import { Frame, MONO, palette, type VizProps } from "./kit";

const TICKS = [0, 0.25, 0.5, 0.75, 1];
const JOIN = HISTORY[HISTORY.length - 1];

/** History draws on, "now" drops in, then a dashed forecast runs inside a cone that widens with horizon. */
export default function ForecastViz({ p, dark = true, className }: VizProps) {
  const c = palette(dark);
  const hist = easeInOutCubic(seg(p, 0, 0.5));
  const now = seg(p, 0.45, 0.55);
  const fut = easeInOutCubic(seg(p, 0.5, 0.85));
  const hi = partial(CONE_HI, fut);
  const lo = partial(CONE_LO, fut);
  const end = seg(p, 0.8, 0.9);

  return (
    <Frame
      className={className}
      label="Forecast: a seasonal history line runs up to now, then continues as a dashed forecast inside a confidence cone that widens with the horizon"
    >
      <line x1={FC.left} x2={FC.right} y1={FC.bottom} y2={FC.bottom} style={{ stroke: c.dim }} strokeWidth={1.5} />
      {TICKS.map((v) => (
        <line key={v} x1={FC.left - 9} x2={FC.left - 3} y1={r(fcY(v))} y2={r(fcY(v))} style={{ stroke: c.dim }} strokeWidth={1.5} />
      ))}

      {fut > 0 && <polygon points={pts([...hi, ...[...lo].reverse()])} style={{ fill: c.accent }} fillOpacity={0.16} />}

      {now > 0 && (
        <g opacity={r(now)}>
          <line x1={r(NOW_X)} x2={r(NOW_X)} y1={FC.top - 8} y2={FC.bottom} style={{ stroke: c.ink }} strokeWidth={1.5} strokeDasharray="2 4" />
          <circle cx={r(JOIN[0])} cy={r(JOIN[1])} r={3.5} style={{ fill: c.ink }} />
          <text x={r(NOW_X)} y={FC.bottom + 20} textAnchor="middle" style={{ ...MONO, fill: c.ink }}>
            NOW
          </text>
        </g>
      )}

      <polyline points={pts(partial(HISTORY, hist))} fill="none" style={{ stroke: c.ink }} strokeWidth={2} strokeLinejoin="round" />
      <polyline
        points={pts(partial(FORECAST, fut))}
        fill="none"
        style={{ stroke: c.accent }}
        strokeWidth={2}
        strokeDasharray="5 4"
        strokeLinejoin="round"
      />

      {end > 0 && (
        <g opacity={r(end)}>
          <line x1={END_X} x2={END_X} y1={FC.bottom} y2={FC.bottom + 6} style={{ stroke: c.ink }} strokeWidth={1.5} />
          <text x={END_X} y={FC.bottom + 20} textAnchor="end" style={{ ...MONO, fill: c.ink }}>
            T+14
          </text>
        </g>
      )}
    </Frame>
  );
}
