"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { clamp, easeInOutCubic, seg } from "@/lib/motion";
import {
  ENTER_DURATION,
  IRIS_ORIGIN,
  REEL_DURATION,
  SCENES,
  TONES,
  sceneAt,
  type Scene,
  type Tone,
} from "@/lib/reel";
import ReelHud from "./ReelHud";
import Ignite from "./scenes/Ignite";
import Name from "./scenes/Name";
import Craft from "./scenes/Craft";
import Mantra, { cutAt } from "./scenes/Mantra";
import Lockup from "./scenes/Lockup";

const SEEN_KEY = "reel-seen";

// Storage can throw (private mode, blocked site data); the reel then simply replays.
function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* not persisting "seen" only means the reel plays again next visit */
  }
}

/** The mantra re-colours per cut; every other scene has one tone. */
const toneAt = (scene: Scene, t: number): Tone =>
  scene.id === "mantra" ? cutAt(t).tone : scene.tone;

function SceneBody({ scene, t }: { scene: Scene; t: number }) {
  switch (scene.id) {
    case "ignite":
      return <Ignite t={t} />;
    case "name":
      return <Name t={t} />;
    case "mantra":
      return <Mantra t={t} />;
    case "lockup":
      return <Lockup t={t} />;
    default:
      return <Craft scene={scene} t={t} />;
  }
}

/** One full-bleed scene. `clip` + `edge` carry the enter transition. */
function Layer({ scene, t, clip, edge }: { scene: Scene; t: number; clip?: string; edge?: number }) {
  const tone = TONES[toneAt(scene, t)];
  return (
    <div
      // Only the lockup carries content a screen reader needs (the CTAs); the rest is motion.
      aria-hidden={scene.id === "lockup" ? undefined : true}
      className="absolute inset-0 overflow-hidden"
      style={{ background: tone.bg, color: tone.ink, clipPath: clip }}
    >
      <SceneBody scene={scene} t={t} />
      {edge !== undefined && (
        <span
          className="absolute inset-y-0 w-[2px]"
          style={{ left: `calc(${edge}% - 2px)`, background: tone.ink }}
        />
      )}
    </div>
  );
}

/**
 * The opening 15s reel, rendered live in the DOM as a pure function of `t`.
 * Server render is frame t=0 (void, nothing drawn) so hydration is clean.
 */
export default function Reel() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const frozen = useRef(false);

  const jump = useCallback((next: number) => {
    tRef.current = next;
    setT(next);
  }, []);

  const finish = useCallback(() => {
    jump(REEL_DURATION);
    setPlaying(false);
    if (!frozen.current) writeSeen();
  }, [jump]);

  const replay = useCallback(() => {
    jump(0);
    setPlaying(true);
  }, [jump]);

  // Decide how to start: ?t= freezes a frame (QA), otherwise play unless seen / reduced motion.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const raw = q.get("t");
    const at = raw === null || raw.trim() === "" ? NaN : Number(raw);
    if (Number.isFinite(at)) {
      frozen.current = true;
      jump(clamp(at, 0, REEL_DURATION));
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || (q.get("replay") !== "1" && readSeen())) {
      jump(REEL_DURATION);
      return;
    }
    setPlaying(true);
  }, [jump]);

  // The clock: rAF from performance.now(), paused while the tab is hidden, stopped at the end.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let base = 0;
    const tick = (now: number) => {
      const next = Math.max(0, (now - base) / 1000);
      if (next >= REEL_DURATION) {
        finish();
        return;
      }
      jump(next);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(raf);
    const start = () => {
      stop();
      base = performance.now() - tRef.current * 1000;
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playing, jump, finish]);

  const scene = sceneAt(t);
  const idx = SCENES.indexOf(scene);
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  const entering = prev !== null && scene.enter !== "cut" && t - scene.start < ENTER_DURATION;
  const e = entering ? easeInOutCubic(seg(t, scene.start, scene.start + ENTER_DURATION)) : 1;

  let clip: string | undefined;
  let edge: number | undefined;
  if (entering && scene.enter === "iris") {
    clip = `circle(${e * 150}% at ${IRIS_ORIGIN.x * 100}% ${IRIS_ORIGIN.y * 100}%)`;
  } else if (entering && scene.enter === "sweep") {
    clip = `inset(0 ${(1 - e) * 100}% 0 0)`;
    edge = e * 100;
  }

  // The HUD keeps the outgoing ink until the incoming scene covers most of the frame.
  const hudTone = entering && prev && e < 0.5 ? toneAt(prev, t) : toneAt(scene, t);

  return (
    <section
      id="top"
      data-scene="SC 01–08 · Reel"
      data-tone="light"
      aria-label="Intro reel"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-void"
    >
      <ReelHud t={t} scene={scene} tone={hudTone} onSkip={finish} onReplay={replay} />
      <h1 className="sr-only">
        {profile.name} — {profile.role}
      </h1>
      {entering && prev && <Layer key={prev.id} scene={prev} t={t} />}
      <Layer key={scene.id} scene={scene} t={t} clip={clip} edge={edge} />
    </section>
  );
}
