import { disciplines } from "@/lib/content";
import LiveViz from "@/components/viz/LiveViz";

// Flame text fails on bone (2.4:1); the accent period on a light scene is ember.
const Dot = () => <span className="text-ember">.</span>;

/** SC 10 — the four crafts from the reel, as a ruled 2x2 grid. */
export default function Disciplines() {
  return (
    <section
      id="disciplines"
      data-scene="SC 10 · Craft"
      data-tone="light"
      aria-labelledby="craft-title"
      className="scene bg-bone text-void"
    >
      <div className="label flex justify-between gap-4">
        <span>SC 10 — CRAFT</span>
        <span className="text-ash">{String(disciplines.length).padStart(2, "0")} Panels</span>
      </div>

      <h2
        id="craft-title"
        className="display mt-16 [font-stretch:115%] md:mt-24 md:[font-stretch:150%]"
        style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
      >
        Four crafts
        <Dot /> <br className="hidden md:inline" />
        One toolbox
        <Dot />
      </h2>

      <div className="mt-16 grid gap-[1.5px] border-[1.5px] border-void bg-void md:mt-24 md:grid-cols-2">
        {disciplines.map((d, i) => (
          <article
            key={d.viz}
            className="group flex flex-col bg-bone p-6 hover:bg-ion focus-within:bg-ion md:p-10"
          >
            <div className="label flex justify-between gap-4">
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ash group-hover:text-void group-focus-within:text-void">
                {d.viz}
              </span>
            </div>

            <LiveViz kind={d.viz} dark={false} className="mt-6 block w-full" />

            <h3
              className="display mt-8"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontStretch: "115%" }}
            >
              {d.title}
            </h3>
            <p className="mt-4 max-w-[48ch]">{d.body}</p>

            <ul
              aria-label={`${d.title} tools`}
              className="label mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-6 text-ash group-hover:text-void group-focus-within:text-void"
            >
              {d.tools.map((t) => (
                <li key={t}>[ {t} ]</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
