import type { VizKind } from "@/lib/content";
import DecideViz from "./DecideViz";
import ForecastViz from "./ForecastViz";
import LearnViz from "./LearnViz";
import OptimizeViz from "./OptimizeViz";
import type { VizProps } from "./kit";

export type { VizProps };

/** Four craft demos, each a pure function of progress p (0..1). Server-safe, no hooks. */
export const VIZ: Record<VizKind, (props: VizProps) => JSX.Element> = {
  forecast: ForecastViz,
  optimize: OptimizeViz,
  learn: LearnViz,
  decide: DecideViz,
};
