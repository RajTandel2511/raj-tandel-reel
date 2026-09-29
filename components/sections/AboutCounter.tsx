"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, easeOutCubic } from "@/lib/motion";

const DURATION = 1200;

/** Counts 0 -> value once, the first time it scrolls into view. */
export default function AboutCounter({ value, unit }: { value: number; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    const box = el.getBoundingClientRect();
    if (box.bottom > 0 && box.top < window.innerHeight) return; // on screen at mount: no flash to 0

    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = clamp((now - t0) / DURATION);
          setShown(Math.round(value * easeOutCubic(p)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {shown}
        <span className="text-flame">{unit}</span>
      </span>
      <span className="sr-only">
        {value}
        {unit}
      </span>
    </span>
  );
}
