"use client";

import { useEffect, useRef, useState } from "react";
import { timecode } from "@/lib/motion";
import { REEL_DURATION } from "@/lib/reel";

/** Each viewport of scroll past the reel is this many seconds of "footage". */
const SECONDS_PER_VIEWPORT = 4;
/** The HUD stays away while at least this much of the reel is on screen. */
const REEL_HIDE_AT = 0.3;
/** The current scene is the [data-scene] element crossing this viewport line. */
const SCENE_LINE = 0.4;

type Chapter = { id: string; label: string; num: string; name: string };

/** "SC 09 · About" -> { num: "SC 09", name: "About" }, read from the live DOM. */
function readChapters(): Chapter[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-scene][id]")).map((el) => {
    const label = el.dataset.scene ?? "";
    const i = label.indexOf("·");
    return {
      id: el.id,
      label,
      num: i < 0 ? "" : label.slice(0, i).trim(),
      name: i < 0 ? label : label.slice(i + 1).trim(),
    };
  });
}

const CONTROL =
  "pointer-events-auto hover:bg-bone hover:text-void focus-visible:bg-bone focus-visible:text-void";

export default function Hud() {
  const [shown, setShown] = useState(false);
  const [scene, setScene] = useState("");
  const [clock, setClock] = useState(() => timecode(REEL_DURATION));
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const indexBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  // Hidden while the reel (#top) owns the screen. Visibility is normalised by
  // min(reel, viewport) so a reel taller than the screen still counts as "on".
  useEffect(() => {
    const reel = document.getElementById("top");
    if (!reel || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        const full = Math.max(1, Math.min(e.boundingClientRect.height, window.innerHeight));
        setShown(e.intersectionRect.height / full < REEL_HIDE_AT);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    io.observe(reel);
    return () => io.disconnect();
  }, []);

  // Scene readout + scroll timecode, rAF-throttled.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * SCENE_LINE;
      let current: string | undefined;
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = el.dataset.scene;
      });
      if (current) setScene(current);

      const reel = document.getElementById("top");
      const reelEnd = reel ? reel.getBoundingClientRect().bottom + window.scrollY : 0;
      const past = Math.max(0, window.scrollY - reelEnd) / window.innerHeight;
      setClock(timecode(REEL_DURATION + past * SECONDS_PER_VIEWPORT));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Native modal <dialog>: inert background, Escape and top layer for free.
  useEffect(() => {
    const d = dialog.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    d.querySelector<HTMLAnchorElement>("ol a")?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openIndex = () => {
    setChapters(readChapters());
    setOpen(true);
  };
  // Unlock before the link's default hash jump runs, or the viewport can't scroll.
  const jump = () => {
    document.body.style.overflow = "";
    dialog.current?.close();
  };

  return (
    <>
      <nav
        aria-label="Reel HUD"
        className={`label pointer-events-none fixed inset-0 z-40 text-bone mix-blend-difference transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${
          shown ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <a
          href="#top"
          className={`absolute left-[calc(var(--gutter)_-_8px)] top-3 px-2 py-1.5 md:top-5 ${CONTROL}`}
        >
          Raj Tandel
        </a>
        <p className="absolute right-[calc(var(--gutter)_-_8px)] top-3 px-2 py-1.5 text-right md:top-5">
          {scene}
        </p>
        <p
          aria-hidden="true"
          className="absolute bottom-3 left-[calc(var(--gutter)_-_8px)] px-2 py-1.5 tabular-nums md:bottom-5"
        >
          {clock}
        </p>
        <button
          ref={indexBtn}
          type="button"
          onClick={openIndex}
          aria-expanded={open}
          aria-controls="scene-index"
          aria-haspopup="dialog"
          className={`absolute bottom-3 right-[calc(var(--gutter)_-_8px)] px-2 py-1.5 md:bottom-5 ${CONTROL}`}
        >
          Index
        </button>
      </nav>

      {/* Outside the blended layer so the index shows its true colours. */}
      <dialog
        id="scene-index"
        ref={dialog}
        aria-labelledby="scene-index-title"
        onClose={() => {
          setOpen(false);
          indexBtn.current?.focus();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-void p-0 text-bone backdrop:bg-void"
      >
        <div className="gutter sticky top-0 z-10 flex items-center justify-between bg-void py-4 md:py-6">
          <h2 id="scene-index-title" className="label text-mist">
            Index · {chapters.length} scenes
          </h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="label -mr-2 px-2 py-1.5 hover:bg-flame hover:text-void focus-visible:bg-flame focus-visible:text-void focus-visible:outline-none"
          >
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <ol className="border-t border-bone/15">
          {chapters.map((c) => {
            const now = c.label === scene;
            return (
              <li key={c.id} className="border-b border-bone/15">
                <a
                  href={`#${c.id}`}
                  onClick={jump}
                  aria-current={now ? "location" : undefined}
                  className="gutter group grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 py-4 hover:bg-flame hover:text-void focus-visible:bg-flame focus-visible:text-void focus-visible:outline-none md:grid-cols-[9rem_1fr] md:py-5"
                >
                  <span className="label text-flame group-hover:text-void group-focus-visible:text-void">
                    {c.num}
                    {now && <span className="block">● Now</span>}
                  </span>
                  <span
                    className="display"
                    style={{ fontSize: "clamp(2rem, 6vw, 5rem)", fontStretch: "120%" }}
                  >
                    {c.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </dialog>
    </>
  );
}
