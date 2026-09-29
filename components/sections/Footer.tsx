import { channels } from "@/lib/content";

const LINK =
  "label -mx-1 px-1 py-1 text-bone hover:bg-flame hover:text-void focus-visible:bg-flame focus-visible:text-void focus-visible:outline-none";

/** The end card. Plain <a> for replay: a full load lets the reel read ?replay=1 on mount. */
export default function Footer() {
  return (
    <footer data-tone="dark" className="gutter bg-void py-16 text-bone">
      <p className="display" style={{ fontSize: "clamp(5.5rem, 26vw, 24rem)" }}>
        FIN<span className="text-flame">.</span>
      </p>

      <div className="mt-12 flex flex-col gap-6 border-t border-bone/15 pt-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-mist">
          <li className="label">© {new Date().getFullYear()} RAJ TANDEL</li>
          <li className="label">REEL 12 · NEXT.JS</li>
          <li>
            <a href="#top" className={LINK}>
              BACK TO TOP <span aria-hidden="true">↑</span>
            </a>
          </li>
          <li>
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/?replay=1`} className={LINK}>
              REPLAY THE REEL <span aria-hidden="true">↺</span>
            </a>
          </li>
        </ul>

        <ul aria-label="Elsewhere" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className={LINK}
              >
                {c.label}
                {c.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
