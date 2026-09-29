"use client";

import { useState } from "react";

/**
 * Raj's career as an NLE timeline: a ruler, one track per company, clips on
 * the tracks, a playhead at "now". Every value arrives precomputed from the
 * server (components/sections/Experience.tsx) so this client file never
 * evaluates the build-time "now" itself — no hydration drift across a month
 * boundary.
 */

export type Clip = {
  id: string;
  track: string;
  title: string;
  org: string;
  where: string;
  /** Month-boundary offsets on the ruler (0..total). */
  start: number;
  end: number;
  /** Starts before the ruler; the left edge is clamped to 0. */
  clipped: boolean;
  isNow: boolean;
  dates: string;
  duration: string;
  body: string[];
  ariaLabel: string;
};

export type Track = { id: string; name: string; clips: Clip[]; promotions: number[] };

type Props = { tracks: Track[]; total: number; firstMonth: number; firstYear: number };

export default function ExperienceTimeline({ tracks, total, firstMonth, firstYear }: Props) {
  const clips = tracks.flatMap((t) => t.clips);
  const [selectedId, setSelectedId] = useState(() => (clips.find((c) => c.isNow) ?? clips[0]).id);
  const selected = clips.find((c) => c.id === selectedId) ?? clips[0];

  const x = (months: number) => `${(months / total) * 100}%`;
  // Month-of-year (0 = Jan) for each ruler offset. The tick at `total` is the
  // playhead's job; drawing it would poke 1px past the edge.
  const months = Array.from({ length: total }, (_, o) => (firstMonth + o) % 12);

  return (
    <>
      <p className="label mb-3 text-ash md:hidden" aria-hidden="true">
        ← drag the timeline →
      </p>

      <div className="overflow-x-auto">
        <div className="relative [--head:8.5rem] max-md:min-w-[760px] md:[--head:11rem] lg:[--head:15rem]">
          {/* January gridlines — painted first so the clips sit on top. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[var(--head)] right-0">
            {months.map((m, o) =>
              m === 0 ? <span key={o} className="absolute inset-y-0 w-px bg-void/10" style={{ left: x(o) }} /> : null
            )}
          </div>

          {/* Ruler */}
          <div className="flex h-12 border-b-[1.5px] border-void">
            <p className="label flex w-[var(--head)] shrink-0 items-end border-r border-void/20 pb-2 pr-3 text-ash">
              Seq · {total} mo
            </p>
            <div aria-hidden="true" className="relative flex-1">
              {months.map((m, o) => (
                <span
                  key={o}
                  className={`absolute bottom-0 w-px ${
                    m === 0 ? "h-full bg-void" : m % 3 === 0 ? "h-3 bg-void/40" : "h-2 bg-void/25"
                  }`}
                  style={{ left: x(o) }}
                />
              ))}
              {months.map((m, o) =>
                // ponytail: a January in the last 5 months would collide with the NOW flag; the flag wins.
                m === 0 && o < total - 5 ? (
                  <span key={`y${o}`} className="mono absolute top-1.5 pl-1.5 text-[11px] leading-none" style={{ left: x(o) }}>
                    {firstYear + (firstMonth + o) / 12}
                  </span>
                ) : null
              )}
            </div>
          </div>

          {/* Tracks */}
          <div role="group" aria-label="Career timeline. Select a clip to inspect it.">
            {tracks.map((t) => (
              <div key={t.id} className="flex h-[76px] border-b border-void/20">
                <p className="label flex w-[var(--head)] shrink-0 items-center border-r border-void/20 pr-3">
                  <span>
                    <span className="font-bold">{t.id}</span> · {t.name}
                  </span>
                </p>
                <div className="relative flex-1">
                  {t.clips.map((c) => (
                    <ClipButton
                      key={c.id}
                      clip={c}
                      left={x(c.start)}
                      right={`${((total - c.end) / total) * 100}%`}
                      isSelected={c.id === selected.id}
                      onSelect={() => setSelectedId(c.id)}
                    />
                  ))}
                  {t.promotions.map((m) => (
                    <span key={m} className="absolute top-1 flex -translate-x-1/2 flex-col items-center" style={{ left: x(m) }}>
                      <span className="label leading-none">Promoted</span>
                      <span
                        aria-hidden="true"
                        className="mt-1 h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-void"
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Playhead — a flame line at now, flag on the ruler. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[var(--head)] right-0">
            <span className="absolute inset-y-0 right-0 w-0.5 bg-flame" />
            <span className="label absolute right-0 top-0 bg-flame px-1.5 py-0.5 font-bold text-void">Now</span>
          </div>
        </div>
      </div>

      <Inspector clip={selected} />
    </>
  );
}

type ClipButtonProps = {
  clip: Clip;
  left: string;
  right: string;
  isSelected: boolean;
  onSelect: () => void;
};

function ClipButton({ clip, left, right, isSelected, onSelect }: ClipButtonProps) {
  const fill = isSelected ? "bg-void text-bone" : clip.isNow ? "bg-flame text-void" : "bg-void/5 text-void";
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={clip.ariaLabel}
      onClick={onSelect}
      className={`absolute bottom-2.5 top-[26px] flex items-center gap-1 overflow-hidden border-[1.5px] border-void px-2 text-left text-[13px] font-semibold leading-none hover:border-2 hover:bg-ion hover:text-void focus-visible:border-2 focus-visible:bg-ion focus-visible:text-void ${fill} ${
        clip.clipped ? "border-l-0 pl-1" : ""
      }`}
      style={{ left, right }}
    >
      {clip.clipped ? (
        <span aria-hidden="true" className="mono">
          ◂
        </span>
      ) : null}
      <span className="truncate">{clip.title}</span>
      {/* Keeps the live role marked once selection turns it void. */}
      {clip.isNow ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-flame" /> : null}
    </button>
  );
}

function Inspector({ clip }: { clip: Clip }) {
  return (
    <div
      aria-live="polite"
      className="mt-12 grid gap-8 border-t-2 border-void pt-8 md:mt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
    >
      <div>
        <p className="label flex justify-between gap-4">
          <span>{clip.org}</span>
          <span className="shrink-0 text-ash">Track {clip.track}</span>
        </p>
        <h3 className="display mt-5 text-[clamp(1.8rem,4.6vw,3.5rem)]" style={{ fontStretch: "105%" }}>
          {clip.title}
        </h3>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="mono text-sm">{clip.dates}</span>
          <span className="mono border-[1.5px] border-void px-2 py-1 text-xs uppercase leading-none">
            {clip.duration}
          </span>
          <span className="text-sm text-ash">{clip.where}</span>
        </div>
      </div>

      {clip.body.length > 0 ? (
        <ul className="grid content-start gap-4">
          {clip.body.map((line, i) => (
            <li key={line} className="grid grid-cols-[2.25rem_minmax(0,1fr)] border-t border-void/20 pt-4">
              <span className="mono pt-1 text-xs text-ash">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
