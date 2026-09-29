import type { ReactNode } from "react";
import { certifications, education, reading } from "@/lib/content";

/**
 * SC 13 — Credits. Film end credits: role right-aligned on the left of a centre
 * gutter, name left-aligned on the right, meeting at the centre line. Static —
 * no auto-scroll. Below 640px each row stacks role over name, centred.
 */

type Credit = { key: string; role: ReactNode; name: ReactNode };

const groups: { title: string; rows: Credit[] }[] = [
  {
    title: "Education",
    rows: education.map((e) => ({
      key: e.school,
      role: (
        <>
          {e.degree}
          <span className="mt-1 block">{e.period}</span>
        </>
      ),
      name: (
        <>
          {e.school}
          {e.focus && (
            <span className="mt-2 block text-[15px] font-normal text-mist" style={{ fontStretch: "100%" }}>
              {e.focus}
            </span>
          )}
        </>
      ),
    })),
  },
  {
    title: "Certifications",
    rows: certifications.map((c) => ({ key: c.name, role: c.issuer, name: c.name })),
  },
  {
    title: "Currently reading",
    rows: [{ key: reading.title, role: reading.authors, name: <cite className="not-italic">{reading.title}</cite> }],
  },
];

export default function Credits() {
  return (
    <section
      id="credits"
      data-scene="SC 13 · Credits"
      data-tone="dark"
      aria-labelledby="credits-title"
      className="scene bg-space text-bone"
    >
      <p className="label text-center text-flame">SC 13 — Credits</p>
      <h2
        id="credits-title"
        className="display reveal mt-8 text-center [font-stretch:110%] sm:[font-stretch:150%]"
        style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}
      >
        Credits
      </h2>

      <div className="mx-auto mt-20 max-w-5xl space-y-24 sm:mt-28 sm:space-y-32">
        {groups.map((g) => (
          <div key={g.title} className="reveal">
            <h3 className="label text-center text-flame">{g.title}</h3>
            {/* sm:before = the centre line the two columns meet at (a pseudo, so the dl stays valid). */}
            <dl className="relative mt-10 space-y-10 sm:mt-12 sm:space-y-12 sm:before:absolute sm:before:inset-y-0 sm:before:left-1/2 sm:before:w-px sm:before:bg-bone/10">
              {g.rows.map((r) => (
                <div key={r.key} className="grid gap-2 sm:grid-cols-2 sm:items-baseline sm:gap-x-16">
                  <dt className="label text-center text-mist sm:text-right">{r.role}</dt>
                  <dd
                    className="text-center text-[clamp(1.25rem,2.6vw,2rem)] font-bold leading-tight sm:text-left"
                    style={{ fontStretch: "110%" }}
                  >
                    {r.name}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
