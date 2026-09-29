import type { CSSProperties, ReactNode } from "react";
import { profile } from "@/lib/content";
import { seg } from "@/lib/motion";

/** Shared by NAME and LOCKUP so the wordmark is the same object in both. */
// TANDEL at 150% stretch is ~6.3x the font size: the 3.25rem floor fits a 375px
// phone, and 12.5vw fills ~80% of a 1440-1920 screen before the 16rem cap.
export const WORDMARK_SIZE = "clamp(3.25rem, 12.5vw, 16rem)";

/** RAJ / TANDEL stacked. `after` rides at the end of the first line (the lockup marker). */
export function Wordmark({
  stretch,
  after,
  className = "",
  style,
}: {
  stretch: number;
  after?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <p
      aria-hidden
      className={`display whitespace-nowrap ${className}`}
      style={{ fontSize: WORDMARK_SIZE, fontStretch: `${stretch}%`, ...style }}
    >
      {after ? (
        <span className="flex items-center gap-[0.28em]">
          {first}
          {after}
        </span>
      ) : (
        <span className="block">{first}</span>
      )}
      <span className="block">{rest.join(" ")}</span>
    </p>
  );
}

/**
 * Text typed in character by character over [start, end]. The untyped rest is
 * rendered invisible so the line never reflows while it types. The caret is
 * solid while typing, then blinks for `hold` seconds and is gone.
 */
export function Typed({
  text,
  t,
  start,
  end,
  hold,
  className = "",
}: {
  text: string;
  t: number;
  start: number;
  end: number;
  hold: number;
  className?: string;
}) {
  const p = seg(t, start, end);
  const n = Math.floor(p * text.length);
  const caret = t >= start && t < end + hold && (p < 1 || Math.floor((t - end) * 4) % 2 === 0);
  return (
    <p aria-hidden className={className}>
      {text.slice(0, n)}
      {/* zero-width anchor: adds no break opportunity to the line */}
      <span className="relative">
        <span
          className="absolute -bottom-[0.15em] left-0 top-[0.05em] w-[2px] bg-current"
          style={{ opacity: caret ? 1 : 0 }}
        />
      </span>
      <span className="invisible">{text.slice(n)}</span>
    </p>
  );
}

/** Four corner brackets — the "optimum" marker. Colour is currentColor. */
export function Brackets({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const arm = "absolute h-[28%] w-[28%] border-current";
  return (
    <span aria-hidden className={`block ${className}`} style={style}>
      <span className={`${arm} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${arm} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${arm} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${arm} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
