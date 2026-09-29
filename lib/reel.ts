/**
 * THE SHOT LIST.
 *
 * Repurposed from a 15-second motion-design showreel. What was kept is the
 * core idea and the pacing; the script, visuals and structure are original.
 *
 *   source beat (time)          ->  this reel
 *   ignite: spark bursts 0-1.9  ->  a data point rolls down a loss curve and
 *                                   settles in the minimum (gradient descent)
 *   name: wordmark 1.9-3.5      ->  RAJ TANDEL stretches open from the minimum
 *   four craft demos 3.5-11.2   ->  forecast / optimize / learn / decide, each
 *                                   drawn live and captioned with a real result
 *   mantra burst 11.2-13.1      ->  DATA IN. / DECISIONS / OUT. / NEVER / GUESSED.
 *   lockup hold 13.1-15.0       ->  the lockup does not end the video: it IS
 *                                   the hero, and the site scrolls on from it
 *
 * Pacing parity: slow 1.8s open, ~1.8s name, four ~1.9s beats, five 0.44s
 * cuts (the source cuts every ~0.45s), a calm 1.6s settle.
 */

export type Tone = "void" | "space" | "flame" | "bone" | "ion" | "leaf";

/** Background + ink pairs. Every pair clears WCAG AA for body text. */
export const TONES: Record<Tone, { bg: string; ink: string; dim: string; dark: boolean }> = {
  void: { bg: "var(--void)", ink: "var(--bone)", dim: "var(--mist)", dark: true },
  space: { bg: "var(--space)", ink: "var(--bone)", dim: "var(--mist)", dark: true },
  flame: { bg: "var(--flame)", ink: "var(--void)", dim: "var(--void)", dark: false },
  bone: { bg: "var(--bone)", ink: "var(--void)", dim: "var(--ash)", dark: false },
  ion: { bg: "var(--ion)", ink: "var(--void)", dim: "var(--void)", dark: false },
  leaf: { bg: "var(--leaf)", ink: "var(--void)", dim: "var(--void)", dark: false },
};

/** How a scene arrives. `iris` opens a circle from IRIS_ORIGIN; `sweep` wipes left to right. */
export type Enter = "cut" | "iris" | "sweep";

export type SceneId =
  | "ignite"
  | "name"
  | "forecast"
  | "optimize"
  | "learn"
  | "decide"
  | "mantra"
  | "lockup";

export type Scene = {
  id: SceneId;
  label: string;
  start: number;
  end: number;
  tone: Tone;
  enter: Enter;
  /** Craft scenes only: the verb and a real, sourced result. */
  caption?: { verb: string; result: string };
};

export const REEL_DURATION = 15;

/** Length of the enter transition at the head of a scene. */
export const ENTER_DURATION = 0.34;

/** Where the ignite ball comes to rest, in viewport fractions — the iris opens from here. */
export const IRIS_ORIGIN = { x: 0.5, y: 0.62 };

export const SCENES: Scene[] = [
  { id: "ignite", label: "Ignite", start: 0, end: 1.8, tone: "void", enter: "cut" },
  { id: "name", label: "Name", start: 1.8, end: 3.6, tone: "flame", enter: "iris" },
  {
    id: "forecast",
    label: "Forecast",
    start: 3.6,
    end: 5.5,
    tone: "bone",
    enter: "sweep",
    caption: { verb: "Forecast", result: "+20% forecasting accuracy" },
  },
  {
    id: "optimize",
    label: "Optimize",
    start: 5.5,
    end: 7.4,
    tone: "ion",
    enter: "cut",
    caption: { verb: "Optimize", result: "scheduling · capacity · allocation" },
  },
  {
    id: "learn",
    label: "Learn",
    start: 7.4,
    end: 9.3,
    tone: "void",
    enter: "cut",
    caption: { verb: "Learn", result: "0.86 AUC on 10,000+ records" },
  },
  {
    id: "decide",
    label: "Decide",
    start: 9.3,
    end: 11.2,
    tone: "space",
    enter: "sweep",
    caption: { verb: "Decide", result: "1,000+ invoices a month, automated" },
  },
  { id: "mantra", label: "Mantra", start: 11.2, end: 13.4, tone: "flame", enter: "cut" },
  { id: "lockup", label: "Lockup", start: 13.4, end: REEL_DURATION, tone: "flame", enter: "cut" },
];

export type MantraCut = {
  word: string;
  start: number;
  end: number;
  tone: Tone;
  /** Colour of a trailing period, if the word has one — the accent beat of each cut. */
  period?: string;
};

/** Five hard cuts, 0.44s each. Reads: "Data in. Decisions out. Never guessed." */
export const MANTRA: MantraCut[] = [
  { word: "DATA IN", start: 11.2, end: 11.64, tone: "flame", period: "var(--bone)" },
  { word: "DECISIONS", start: 11.64, end: 12.08, tone: "bone" },
  { word: "OUT", start: 12.08, end: 12.52, tone: "ion", period: "var(--flame)" },
  { word: "NEVER", start: 12.52, end: 12.96, tone: "leaf" },
  { word: "GUESSED", start: 12.96, end: 13.4, tone: "void", period: "var(--flame)" },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];

export const sceneIndex = (id: SceneId) => SCENES.findIndex((s) => s.id === id);
