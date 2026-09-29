"use client";

import { useEffect, useRef, useState } from "react";
import type { VizKind } from "@/lib/content";
import { clamp, easeInOutCubic } from "@/lib/motion";
import { VIZ } from "./index";

type Props = { kind: VizKind; dark?: boolean; className?: string; duration?: number };

/**
 * Plays a viz once when it is >= 40% in view. Starts at p=1 so server HTML (and
 * no-JS / reduced-motion) shows the finished graphic; only rewinds to p=0 when
 * it is fully off-screen on mount, so nothing visibly flashes.
 */
export default function LiveViz({ kind, dark = true, className, duration = 2.4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.bottom > 0 && box.top < window.innerHeight) return; // already on screen: keep the final frame

    setP(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.intersectionRatio < 0.4) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const q = clamp((now - t0) / (duration * 1000));
          setP(easeInOutCubic(q));
          if (q < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration]);

  const Viz = VIZ[kind];
  return (
    <div ref={ref} className={className}>
      <Viz p={p} dark={dark} />
    </div>
  );
}
