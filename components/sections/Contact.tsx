import { channels, profile } from "@/lib/content";

const VALUE_SIZE = "clamp(1.4rem, 4vw, 3.25rem)";

/**
 * SC 14 — the whole scene is flame, so every piece of text is void (flame
 * text only works on dark). Channel rows hard-cut to void on hover/focus.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      data-scene="SC 14 · Contact"
      data-tone="light"
      aria-labelledby="contact-title"
      className="scene bg-flame text-void"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="label">SC 14 — CONTACT</p>
        <p className="label">
          {profile.status} · {profile.location}
        </p>
      </div>

      {/* Narrower on phones so "MODELING?" never has to break mid-word. */}
      <h2
        id="contact-title"
        className="display mt-10 [font-stretch:105%] sm:[font-stretch:125%] lg:[font-stretch:150%] md:mt-14"
        style={{ fontSize: "clamp(2.75rem, 9vw, 10rem)" }}
      >
        Got a problem worth modeling
        <span className="ml-[0.04em] inline-block bg-void px-[0.06em] text-flame">?</span>
      </h2>

      <div className="reveal mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
        <p className="max-w-[52ch] text-[1.25rem] leading-[1.45] md:col-span-7">{profile.pitch}</p>
        <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
          <a
            href={profile.resume}
            className="btn btn-void focus-visible:outline-void"
            target="_blank"
            rel="noreferrer"
          >
            Download résumé <span aria-hidden="true">↓</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      {/* Full-bleed rules: the list cancels the scene gutter, each row re-adds it. */}
      <ul className="mx-[calc(var(--gutter)*-1)] mt-20 border-t-[1.5px] border-void/30 md:mt-28">
        {channels.map((c) => (
          <li key={c.label} className="border-b-[1.5px] border-void/30">
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className="gutter group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-6 hover:bg-void hover:text-bone focus-visible:bg-void focus-visible:text-bone focus-visible:outline-offset-[-6px] md:grid-cols-[11rem_1fr_auto] md:py-8"
            >
              <span className="label col-span-2 md:col-span-1">{c.label}</span>
              <span
                className="display break-all"
                style={{ fontStretch: "100%", fontSize: VALUE_SIZE }}
              >
                {c.value}
              </span>
              <span
                aria-hidden="true"
                className="mono leading-none group-hover:text-flame group-focus-visible:text-flame"
                style={{ fontSize: VALUE_SIZE }}
              >
                {c.external ? "↗" : "→"}
              </span>
              {c.external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
