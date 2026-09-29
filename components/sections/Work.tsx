import { projects, type Project } from "@/lib/content";

/**
 * SC 11 — Work. Every project is one full-bleed "clip" row. Hover or keyboard
 * focus hard-cuts the row to flame with void text — the reel's own cut, no fade.
 */

// Every coloured element inside a row flips to void when the row is cut to flame.
const FLIP = "group-hover:text-void group-focus-visible:text-void";

export default function Work() {
  return (
    <section
      id="work"
      data-scene="SC 11 · Work"
      data-tone="dark"
      aria-labelledby="work-title"
      className="scene bg-void text-bone"
    >
      <div className="flex items-baseline justify-between gap-6">
        <p className="label text-flame">SC 11 — Work</p>
        <p className="label text-mist">{String(projects.length).padStart(2, "0")} clips</p>
      </div>

      <h2
        id="work-title"
        className="display reveal mt-8 text-balance [container-type:inline-size] [font-stretch:110%] md:[font-stretch:150%]"
        style={{ fontSize: "clamp(2.5rem, 8.5vw, 7.5rem)" }}
      >
        Shipped, not{" "}
        {/* Its own line, never broken at the hyphen (U+2011), and shrunk only if it
            would overflow. Measured in Anybody 900: 8.17em wide at 110% stretch,
            11.16em at 150% — the divisors below add ~1.5% headroom. */}
        <span className="block whitespace-nowrap line-through decoration-flame decoration-[0.14em] [font-size:min(1em,calc(100cqw/8.3))] md:[font-size:min(1em,calc(100cqw/11.33))]">
          slide‑decked.
        </span>
      </h2>

      {/* Negative margin = the rules and the flame cut run edge to edge. */}
      <ol className="mx-[calc(var(--gutter)*-1)] mt-16 border-t-[1.5px] border-bone/15 md:mt-24">
        {projects.map((p) => (
          <li key={p.n} className="border-b-[1.5px] border-bone/15">
            <Clip p={p} />
          </li>
        ))}
      </ol>
    </section>
  );
}

const ROW =
  "grid grid-cols-[1fr_auto] gap-x-6 gap-y-4 px-[var(--gutter)] py-8 md:grid-cols-[6rem_1fr_auto] md:py-12";

function Clip({ p }: { p: Project }) {
  if (!p.href) {
    return (
      <div className={ROW}>
        <ClipBody p={p} />
        <span className="label col-start-2 row-start-1 self-start justify-self-end text-mist md:col-start-3">
          [ Private ]
        </span>
      </div>
    );
  }

  const where = p.href.includes("github.com") ? "view source on GitHub" : "open project";

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${p.title} — ${where}`}
      aria-describedby={`work-${p.n}-sum`}
      className={`group ${ROW} hover:bg-flame hover:text-void focus-visible:bg-flame focus-visible:text-void focus-visible:[outline-offset:-8px] focus-visible:[outline:2px_solid_var(--void)]`}
    >
      <ClipBody p={p} />
      <span
        aria-hidden="true"
        className="col-start-2 row-start-1 self-start justify-self-end text-[clamp(1.75rem,4vw,3.5rem)] font-black leading-none transition-transform duration-200 ease-out group-hover:-translate-y-2 group-hover:translate-x-2 group-focus-visible:-translate-y-2 group-focus-visible:translate-x-2 md:col-start-3"
      >
        ↗
      </span>
    </a>
  );
}

function ClipBody({ p }: { p: Project }) {
  return (
    <>
      <span className={`mono col-start-1 row-start-1 pt-1 text-sm text-flame md:pt-3 ${FLIP}`}>/{p.n}</span>

      <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
        <h3
          className="display"
          style={{ fontStretch: "110%", fontSize: "clamp(1.75rem, 4.8vw, 4.5rem)", lineHeight: 0.92 }}
        >
          {p.title}
        </h3>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,60ch)] lg:gap-x-12">
          <p className={`label text-mist ${FLIP}`}>
            {p.client} · {p.year}
          </p>
          <div>
            <p id={`work-${p.n}-sum`} className="max-w-[60ch] text-[15px] leading-relaxed md:text-[17px]">
              {p.summary}
            </p>
            <ul className="mono mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" aria-label="Stack">
              {p.stack.map((s) => (
                <li key={s}>
                  <span className={`text-mist ${FLIP}`}>[</span> {s} <span className={`text-mist ${FLIP}`}>]</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
