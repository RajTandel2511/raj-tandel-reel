import { clamp, easeInOutCubic, easeOutBack, easeOutCubic, lerp, seg } from "@/lib/motion";
import { EDGES, LEGS, LEG_START, NODES, PATH, PATH_LEN, PATH_PTS, S, T, along, r, type Pt } from "./geometry";
import { Frame, MONO, palette, type VizProps } from "./kit";

/** Where the lit front is after travelling `s` along the shortest path. */
function front(s: number): Pt {
  const j = Math.max(0, LEG_START.findLastIndex((start) => start <= s));
  return along(PATH_PTS[j], PATH_PTS[j + 1], clamp((s - LEG_START[j]) / LEGS[j]));
}

/** A network builds, then the true shortest S-to-T route (Dijkstra) lights edge by edge. */
export default function DecideViz({ p, dark = true, className }: VizProps) {
  const c = palette(dark);
  const lit = easeInOutCubic(seg(p, 0.35, 0.85));
  const s = lit * PATH_LEN;
  const arrive = seg(p, 0.85, 1);
  const reached = (node: number) => {
    const j = PATH.indexOf(node);
    return j >= 0 && lit > 0 && (j < LEGS.length ? s >= LEG_START[j] : lit >= 1);
  };

  return (
    <Frame
      className={className}
      label="Decision systems: a network of nodes and edges; the shortest route from S to T lights up edge by edge"
    >
      {EDGES.map(([a, b], i) => {
        const o = seg(p, 0.1 + (i / EDGES.length) * 0.15, 0.2 + (i / EDGES.length) * 0.15);
        if (o <= 0) return null;
        return (
          <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} style={{ stroke: c.dim }} strokeWidth={1.5} opacity={r(o)} />
        );
      })}

      {LEGS.map((len, j) => {
        const f = clamp((s - LEG_START[j]) / len);
        if (f <= 0) return null;
        const [x, y] = along(PATH_PTS[j], PATH_PTS[j + 1], f);
        return (
          <line key={j} x1={PATH_PTS[j][0]} y1={PATH_PTS[j][1]} x2={r(x)} y2={r(y)} style={{ stroke: c.accent }} strokeWidth={2.5} strokeLinecap="round" />
        );
      })}

      {NODES.map(([x, y], i) => {
        const d = (i / NODES.length) * 0.12;
        const q = seg(p, d, d + 0.08);
        if (q <= 0) return null;
        const k = easeOutBack(q);
        const end = i === S || i === T;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r(Math.max(0, (end ? 6 : 4.5) * k))} style={{ fill: reached(i) ? c.accent : c.ink }} />
            {end && (
              <text x={x} y={y - 16} textAnchor="middle" opacity={r(clamp(k))} style={{ ...MONO, fontSize: 11, fill: c.ink }}>
                {i === S ? "S" : "T"}
              </text>
            )}
          </g>
        );
      })}

      {lit > 0 && lit < 1 && (() => {
        const [x, y] = front(s);
        return <circle cx={r(x)} cy={r(y)} r={4} style={{ fill: c.ink, stroke: c.accent }} strokeWidth={2} />;
      })()}

      {arrive > 0 && (
        <g style={{ stroke: c.accent }} fill="none">
          <circle cx={NODES[T][0]} cy={NODES[T][1]} r={r(lerp(6, 11, easeOutBack(arrive)))} strokeWidth={2} />
          <circle cx={NODES[T][0]} cy={NODES[T][1]} r={r(lerp(11, 30, easeOutCubic(arrive)))} strokeWidth={1.5} opacity={r(1 - arrive)} />
        </g>
      )}
    </Frame>
  );
}
