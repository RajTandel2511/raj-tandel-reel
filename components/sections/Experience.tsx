import {
  education,
  experience,
  formatDuration,
  formatMonth,
  monthsBetween,
  monthsFromStart,
  timelineMonths,
  timelineStart,
} from "@/lib/content";
import ExperienceTimeline, { type Clip, type Track } from "./ExperienceTimeline";

/** "All Air Mechanical Contractors" -> "All Air Mechanical", for track headers. */
const shortName = (company: string) => company.replace(/\s+(Contractors|Analytics|Solutions|Projects)\b/g, "");

type ClipInput = Pick<Clip, "id" | "track" | "title" | "org" | "where" | "body"> & {
  short: string;
  start: string;
  end: string | null;
};

function toClip({ short, start, end, ...rest }: ClipInput): Clip {
  const from = monthsFromStart(start);
  return {
    ...rest,
    start: Math.max(0, from),
    end: monthsFromStart(end),
    clipped: from < 0,
    isNow: end === null,
    dates: `${formatMonth(start)} — ${formatMonth(end)}`,
    duration: formatDuration(monthsBetween(start, end)),
    ariaLabel: `${rest.title}, ${short}, ${formatMonth(start)} to ${formatMonth(end)}`,
  };
}

// Built on the server: nowMonth-dependent geometry and durations are frozen
// here and handed to the client as plain data.
const tracks: Track[] = [
  ...experience.map((c, i): Track => {
    const track = `A${i + 1}`;
    const short = shortName(c.company);
    return {
      id: track,
      name: short,
      // Roles are newest first; each newer role starts where the older one ends.
      promotions: c.roles.slice(0, -1).map((r) => monthsFromStart(r.start)),
      clips: c.roles.map((r, j) =>
        toClip({ id: `${track}-${j}`, track, title: r.title, org: c.company, short, where: c.where, body: r.bullets, start: r.start, end: r.end })
      ),
    };
  }),
  {
    id: "ED",
    name: "Education",
    promotions: [],
    clips: education.map((e, j) =>
      toClip({
        id: `ED-${j}`,
        track: "ED",
        title: e.degree,
        org: e.school,
        short: e.school,
        where: e.where,
        body: e.focus ? [e.focus] : [],
        start: e.start,
        end: e.end,
      })
    ),
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      data-scene="SC 12 · Timeline"
      data-tone="light"
      aria-labelledby="experience-title"
      className="scene bg-bone text-void"
    >
      <div className="reveal flex items-baseline justify-between gap-4">
        <p className="label">SC 12 — Timeline</p>
        <p className="label text-ash">
          {timelineMonths} mo · {tracks.length} tracks
        </p>
      </div>
      <h2 id="experience-title" className="display reveal mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        The edit
        <br />
        so far.
      </h2>

      <div className="reveal mt-12 md:mt-20">
        <ExperienceTimeline
          tracks={tracks}
          total={timelineMonths}
          firstMonth={Number(timelineStart.slice(5, 7)) - 1}
          firstYear={Number(timelineStart.slice(0, 4))}
        />
      </div>
    </section>
  );
}
