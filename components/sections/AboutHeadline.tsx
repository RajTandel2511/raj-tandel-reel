"use client";

import { useEffect, useRef } from "react";
import { clamp, easeOutCubic, lerp } from "@/lib/motion";

const MIN = 60;
const MAX = 150;

const Dot = () => <span className="text-flame">.</span>;

/**
 * "SPREADSHEET IN. MODEL OUT." — its width axis is scroll-linked: the words
 * stretch open (60% -> 150%) as the section rises through the viewport.
 * The top of the range is capped so the widest line never overflows the column.
 */
export default function AboutHeadline({ id }: { id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>("[data-fit]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = (s: number) => {
      el.style.fontStretch = `${s}%`;
    };
    const fits = () => Math.max(...lines.map((l) => l.offsetWidth)) <= el.clientWidth;

    // ponytail: bisection on resize only (~8 layouts), never during scroll.
    const fitCap = () => {
      set(MAX);
      if (fits()) return MAX;
      let lo = MIN;
      let hi = MAX;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        set(mid);
        if (fits()) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    let cap = MAX;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduced) return set(cap);
      const vh = window.innerHeight;
      const p = easeOutCubic(clamp((vh - el.getBoundingClientRect().top) / (vh * 0.7)));
      set(lerp(MIN, cap, p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      cap = fitCap();
      update();
    };

    onResize();
    document.fonts?.ready.then(onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <h2
      id={id}
      ref={ref}
      className="display max-w-full"
      style={{ fontSize: "clamp(2.75rem, 9vw, 9rem)", fontStretch: `${MIN}%` }}
    >
      <span data-fit className="inline-block whitespace-nowrap">
        SPREADSHEET
        <br className="md:hidden" /> IN
        <Dot />
      </span>
      <br />
      <span data-fit className="inline-block whitespace-nowrap">
        MODEL OUT
        <Dot />
      </span>
    </h2>
  );
}
