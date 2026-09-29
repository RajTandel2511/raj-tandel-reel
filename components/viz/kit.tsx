import type { ReactNode } from "react";

export type VizProps = { p: number; dark?: boolean; className?: string };

/** Scene-aware colours. Accent is never used for text (flame text fails on bone). */
export const palette = (dark = true) => ({
  ink: dark ? "var(--bone)" : "var(--void)",
  dim: dark ? "rgb(var(--bone-rgb) / 0.22)" : "rgb(var(--void-rgb) / 0.22)",
  accent: "var(--flame)",
  alt: dark ? "var(--ion)" : "var(--void)",
});

export const MONO = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" } as const;

export function Frame({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 240"
      role="img"
      aria-label={label}
      className={className}
      style={{ width: "100%", height: "auto", display: "block", overflow: "hidden" }}
    >
      {children}
    </svg>
  );
}
