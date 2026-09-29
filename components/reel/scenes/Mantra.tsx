import { MANTRA, type MantraCut } from "@/lib/reel";
import { easeOutCubic, seg } from "@/lib/motion";

export const cutAt = (t: number): MantraCut =>
  MANTRA.find((c) => t < c.end) ?? MANTRA[MANTRA.length - 1];

/**
 * Advance width of each word in em (Anybody 900, incl. its trailing period),
 * measured with fontTools at the listed stretch — so fontSize = 92vw / em fits
 * the word to ~92vw exactly. DECISIONS drops to 70% width instead of shrinking.
 * ponytail: a new word falls back to a per-letter estimate; re-measure if MANTRA changes.
 */
const FIT: Record<string, { stretch: number; em: number }> = {
  "DATA IN": { stretch: 150, em: 6.97 },
  DECISIONS: { stretch: 70, em: 3.96 },
  OUT: { stretch: 150, em: 3.65 },
  NEVER: { stretch: 150, em: 5.29 },
  GUESSED: { stretch: 150, em: 7.71 },
};

const SLAM = 0.12;

/** SC 07 MANTRA (11.2-13.4). Five hard cuts; each word slams in whole, then holds. */
export default function Mantra({ t }: { t: number }) {
  const cut = cutAt(t);
  const fit = FIT[cut.word] ?? {
    stretch: 150,
    em: (cut.word.length + (cut.period ? 1 : 0)) * 0.95,
  };
  const k = 1 - easeOutCubic(seg(t, cut.start, cut.start + SLAM));

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p
        className="display whitespace-nowrap"
        style={{
          fontSize: `min(${(92 / fit.em).toFixed(2)}vw, 62vh)`,
          fontStretch: `${fit.stretch}%`,
          transform: `translateX(${k * 14}%) skewX(${k * -9}deg)`,
          filter: k > 0 ? `blur(${k * 10}px)` : undefined,
        }}
      >
        {cut.word}
        {cut.period && <span style={{ color: cut.period }}>.</span>}
      </p>
    </div>
  );
}
