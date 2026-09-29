import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import { REEL_DURATION, SCENES, TONES, type Scene, type Tone } from "@/lib/reel";
import { timecode } from "@/lib/motion";
import { pad2 } from "./bits";

/** Four-corner reel HUD in the current scene's ink. First in the DOM so its button is first in tab order. */
export default function ReelHud({
  t,
  scene,
  tone,
  onSkip,
  onReplay,
}: {
  t: number;
  scene: Scene;
  tone: Tone;
  onSkip: () => void;
  onReplay: () => void;
}) {
  const { ink, bg } = TONES[tone];
  const ended = t >= REEL_DURATION;
  const vars = { color: ink, "--hud-ink": ink, "--hud-bg": bg } as CSSProperties;

  return (
    <div className="label pointer-events-none absolute inset-0 z-20" style={vars}>
      <p aria-hidden className="absolute left-[var(--gutter)] top-5">
        {profile.name}
        <span className="hidden sm:inline"> — Reel 12</span>
      </p>
      <p aria-hidden className="absolute right-[var(--gutter)] top-5">
        SC {pad2(SCENES.indexOf(scene) + 1)} / {pad2(SCENES.length)} · {scene.label}
      </p>
      <p aria-hidden className="absolute bottom-5 left-[var(--gutter)] tabular-nums">
        {timecode(t)}
      </p>
      <button
        type="button"
        onClick={ended ? onReplay : onSkip}
        aria-label={ended ? "Replay intro reel" : "Skip intro reel"}
        className="label pointer-events-auto absolute bottom-3 right-[calc(var(--gutter)-10px)] px-[10px] py-2 hover:bg-[color:var(--hud-ink)] hover:text-[color:var(--hud-bg)]"
      >
        {ended ? "REPLAY ↺" : "SKIP ▸▸"}
      </button>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px]"
        style={{ width: `${(t / REEL_DURATION) * 100}%`, background: ink, opacity: 0.4 }}
      />
    </div>
  );
}
