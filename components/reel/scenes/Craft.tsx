import { VIZ } from "@/components/viz";
import type { VizKind } from "@/lib/content";
import { SCENES, TONES, type Scene } from "@/lib/reel";
import { easeOutCubic, seg } from "@/lib/motion";
import { pad2 } from "../bits";

/**
 * md+ composition per craft scene, so the four beats never read as one template.
 * Below md everything stacks: viz above text.
 */
const LAYOUT: Record<VizKind, { viz: string; text: string; group?: string }> = {
  // viz upper-right, verb bottom-left
  forecast: {
    viz: "md:absolute md:right-[var(--gutter)] md:top-[10%] md:w-[min(62vw,100vh)]",
    text: "md:absolute md:bottom-[12%] md:left-[var(--gutter)]",
  },
  // viz centred large, verb top-left
  optimize: {
    viz: "md:absolute md:left-1/2 md:top-[57%] md:w-[min(70vw,110vh)] md:-translate-x-1/2 md:-translate-y-1/2",
    text: "md:absolute md:left-[var(--gutter)] md:top-[11%]",
  },
  // viz left, verb right-aligned
  learn: {
    viz: "md:absolute md:left-[var(--gutter)] md:top-1/2 md:w-[min(56vw,92vh)] md:-translate-y-1/2",
    text: "md:absolute md:right-[var(--gutter)] md:top-1/2 md:-translate-y-1/2 md:items-end md:text-right",
    group: "md:items-end",
  },
  // viz on top, verb along the bottom edge with the result opposite it
  decide: {
    viz: "md:absolute md:left-1/2 md:top-[9%] md:w-[min(64vw,92vh)] md:-translate-x-1/2",
    text: "md:absolute md:inset-x-[var(--gutter)] md:bottom-[9%] md:flex-row md:items-end md:justify-between",
  },
};

/** SC 03-06 CRAFT. One verb, one live viz, one real result. */
export default function Craft({ scene, t }: { scene: Scene; t: number }) {
  const kind = scene.id as VizKind;
  const Viz = VIZ[kind];
  const layout = LAYOUT[kind];
  const tone = TONES[scene.tone];

  // Ease-out: the graphic builds fast, then holds its payoff (x*, the lit path)
  // for the back half of the beat, so there is time to read the result.
  const vizP = easeOutCubic(seg(t, scene.start + 0.12, scene.end - 0.15));
  const verb = easeOutCubic(seg(t, scene.start + 0.1, scene.start + 0.5));
  const result = easeOutCubic(seg(t, scene.start + 0.6, scene.start + 0.9));

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-8 px-[var(--gutter)] py-20 md:block md:p-0">
      <div aria-hidden className={`w-full ${layout.viz}`}>
        <Viz p={vizP} dark={tone.dark} className="block h-auto w-full" />
      </div>

      <div className={`flex flex-col gap-3 ${layout.text}`}>
        <div className={`flex flex-col gap-3 ${layout.group ?? ""}`}>
          <p className="label" style={{ color: tone.dim }}>
            {pad2(SCENES.indexOf(scene) + 1)} / {pad2(SCENES.length)}
          </p>
          <div className="overflow-hidden">
            <p
              className="display whitespace-nowrap max-sm:[font-stretch:120%]"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
                transform: `translateY(${(1 - verb) * 105}%)`,
              }}
            >
              {scene.caption?.verb}
            </p>
          </div>
        </div>
        <p
          className="mono text-[14px] leading-snug"
          style={{ opacity: result, transform: `translateY(${(1 - result) * 8}px)` }}
        >
          {scene.caption?.result}
        </p>
      </div>
    </div>
  );
}
