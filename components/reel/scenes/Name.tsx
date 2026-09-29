import { profile } from "@/lib/content";
import { easeOutQuint, lerp, seg } from "@/lib/motion";
import { Typed, Wordmark } from "../bits";

/** SC 02 NAME (1.8-3.6). The wordmark stretch-opens out of the minimum, then the role types in. */
export default function Name({ t }: { t: number }) {
  const open = easeOutQuint(seg(t, 1.85, 2.6));
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-[var(--gutter)] text-center md:gap-8">
      <Wordmark
        stretch={lerp(50, 150, open)}
        style={{ transform: `scale(${lerp(1.12, 1, open)})` }}
      />
      <Typed
        text={profile.role}
        t={t}
        start={2.7}
        end={3.4}
        hold={0.2}
        className="mono text-[clamp(15px,1.35vw,26px)] leading-snug"
      />
    </div>
  );
}
