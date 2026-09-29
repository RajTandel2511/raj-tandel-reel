import { profile } from "@/lib/content";
import { REEL_DURATION } from "@/lib/reel";
import { easeOutBack, easeOutCubic, easeOutQuint, lerp, seg } from "@/lib/motion";
import { Brackets, Typed, Wordmark } from "../bits";
import styles from "./Lockup.module.css";

const MARKER = "clamp(40px, 0.42em, 84px)";

/** Void ball in four brackets — IGNITE's optimum, echoed beside the wordmark. */
function Marker({ p, ended }: { p: number; ended: boolean }) {
  const e = easeOutCubic(p);
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 text-void"
      style={{ width: MARKER, height: MARKER, opacity: p > 0 ? 1 : 0 }}
    >
      {ended && (
        <span
          className={`${styles.breathe} absolute left-1/2 top-1/2 h-[64%] w-[64%] rounded-full border-[1.5px] border-void`}
        />
      )}
      <Brackets className="absolute inset-0" style={{ transform: `scale(${lerp(1.6, 1, e)})` }} />
      <span
        className="absolute left-1/2 top-1/2 h-[38%] w-[38%] rounded-full bg-void"
        style={{ transform: `translate(-50%, -50%) scale(${easeOutBack(p)})` }}
      />
    </span>
  );
}

/** SC 08 LOCKUP (13.4-15). Settles into the hero and stays there after the reel ends. */
export default function Lockup({ t }: { t: number }) {
  const ring = seg(t, 13.4, 13.8);
  const open = easeOutQuint(seg(t, 13.7, 14.3));
  const cta = easeOutCubic(seg(t, 14.5, 15));
  const ended = t >= REEL_DURATION;
  const ringSize = `${easeOutCubic(ring) * 170}vmax`;

  return (
    <div className="absolute inset-0">
      {ring > 0 && ring < 1 && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bone"
          style={{ width: ringSize, height: ringSize, opacity: 1 - ring }}
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-center gap-6 px-[var(--gutter)] py-24 md:gap-8">
        <Wordmark
          stretch={lerp(50, 150, open)}
          after={<Marker p={seg(t, 13.55, 13.9)} ended={ended} />}
          style={{ color: t < 13.7 ? "transparent" : undefined }}
        />
        <Typed
          text={profile.role}
          t={t}
          start={14.1}
          end={14.7}
          hold={0.3}
          className="mono text-[clamp(15px,1.35vw,26px)] leading-snug"
        />
        <div
          className="flex flex-col gap-5"
          style={{
            opacity: cta,
            transform: `translateY(${(1 - cta) * 24}px)`,
            visibility: cta > 0 ? "visible" : "hidden",
          }}
        >
          <div className="flex flex-wrap gap-3">
            <a href="#work" className="btn btn-void focus-visible:outline-void">
              See the work <span aria-hidden>↓</span>
            </a>
            <a href="#contact" className="btn btn-line text-void focus-visible:outline-void">
              Get in touch
            </a>
          </div>
          <p className="label flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-void" />
            {profile.location} · {profile.status}
          </p>
        </div>
      </div>

      {ended && (
        <p aria-hidden className="label absolute bottom-14 left-1/2 -translate-x-1/2">
          Scroll ↓
        </p>
      )}
    </div>
  );
}
