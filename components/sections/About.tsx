import { metrics, profile } from "@/lib/content";
import { timecode } from "@/lib/motion";
import { REEL_DURATION } from "@/lib/reel";
import AboutCounter from "./AboutCounter";
import AboutHeadline from "./AboutHeadline";

/** SC 09 — the reel has just ended; the first scene after it says what the reel meant. */
export default function About() {
  const [lead, rest] = profile.bio;

  return (
    <section
      id="about"
      data-scene="SC 09 · About"
      data-tone="dark"
      aria-labelledby="about-title"
      className="scene bg-void text-bone"
    >
      <div className="label flex justify-between gap-4">
        <span>SC 09 — ABOUT</span>
        <span className="text-mist">{timecode(REEL_DURATION)}</span>
      </div>

      <div className="mt-16 md:mt-24">
        <AboutHeadline id="about-title" />
      </div>

      <div className="reveal mt-16 grid gap-8 md:mt-24 md:grid-cols-2 md:gap-16">
        <p className="text-[1.35rem] leading-snug">{lead}</p>
        <p>{rest}</p>
      </div>

      <dl className="reveal mt-20 grid grid-cols-2 gap-[1.5px] border-y-[1.5px] border-bone/15 bg-bone/15 md:mt-28 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse gap-4 bg-void px-4 py-8 md:px-6 md:py-10">
            <dt className="label text-mist">{m.label}</dt>
            <dd
              className="display [font-stretch:100%] md:[font-stretch:125%]"
              style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
            >
              <AboutCounter value={m.value} unit={m.unit} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="label mt-10 flex flex-wrap gap-x-10 gap-y-3">
        <span>
          <span className="text-mist">Base </span>
          {profile.location}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 bg-flame" />
          {profile.status}
        </span>
      </div>
    </section>
  );
}
