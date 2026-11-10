"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { doors, type Door, type Kind } from "@/lib/opportunities";
import { DOORS_FOR } from "@/lib/forPath";
import type { PathId } from "@/lib/data";

// Open doors: every program in lib/opportunities.ts. Three ways in, top to bottom: what closes soon
// (a live countdown), the year at a glance (tap a month), and the full grid with filters.

const KIND_TINT: Record<Kind, string> = {
  Fellowship: "bg-[#e4ecf8] text-[#33558f]",
  Scholarship: "bg-[#f4ecd2] text-[#7c6417]",
  "Summer program": "bg-[#fbe6d8] text-[#9a4a1c]",
  Internship: "bg-[#e3f0e6] text-[#2f6b40]",
  Competition: "bg-[#f6e0e3] text-[#9b2f45]",
  Course: "bg-[#efe4f6] text-[#6a3f8f]",
  Community: "bg-[#e0eef0] text-[#26666e]",
  "Job board": "bg-[#e4eaf0] text-[#3c5468]",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const KINDS: Kind[] = [
  "Fellowship",
  "Scholarship",
  "Summer program",
  "Internship",
  "Competition",
  "Course",
  "Community",
  "Job board",
];
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// Counted from "now" in the visitor's browser, never at build time: a static page built on one day would
// otherwise show a stale countdown, and React would flag the server/client text mismatch.
const BUILT = Date.parse("2026-11-10T00:00:00");
let NOW = BUILT;
const daysUntil = (iso: string) => Math.ceil((new Date(`${iso}T23:59:00`).getTime() - NOW) / 86_400_000);

// A one-event .ics file for a confirmed deadline, built in the browser. All-day event on the deadline,
// with a reminder a week before.
function addToCalendar(d: Door) {
  if (!d.closes) return;
  const day = d.closes.replaceAll("-", "");
  const next = new Date(`${d.closes}T12:00:00`);
  next.setDate(next.getDate() + 1);
  const end = next.toISOString().slice(0, 10).replaceAll("-", "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IR x Tech//Open doors//EN",
    "BEGIN:VEVENT",
    `UID:${day}-${d.name.replace(/\W+/g, "-").toLowerCase()}@ir-tech-field-guide`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${d.name} deadline`,
    `DESCRIPTION:${d.blurb} ${d.href}`,
    `URL:${d.href}`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${d.name} closes in a week`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${d.name.replace(/\W+/g, "-")}-deadline.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Doors() {
  const reduce = useReducedMotion();
  const [kind, setKind] = useState<Kind | "All">("All");
  const [month, setMonth] = useState<number | null>(null);
  const [paysOnly, setPaysOnly] = useState(false);
  const [faithOnly, setFaithOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  // Six cards first: all 31 at once ran 12 phone screens (measured 2026-11-10).
  const [all, setAll] = useState(false);
  // After the passport quiz, her path's doors move to the front and get tagged.
  const [path, setPath] = useState<PathId | null>(null);
  useEffect(() => {
    const on = (e: Event) => setPath((e as CustomEvent<PathId>).detail);
    window.addEventListener("path:match", on);
    return () => window.removeEventListener("path:match", on);
  }, []);
  const mine = path ? DOORS_FOR[path] : [];
  const rank = (d: Door) => (mine.includes(d.name) ? mine.indexOf(d.name) : 99);
  // Saved doors live in her browser only. Wrapped: storage can be blocked (private mode), and the page
  // must work the same without it.
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("ir-doors-saved") || "[]"));
    } catch {
      setSaved([]);
    }
  }, []);
  function toggleSave(name: string) {
    setSaved((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      try {
        localStorage.setItem("ir-doors-saved", JSON.stringify(next));
      } catch {
        /* storage blocked: the star still works for this visit */
      }
      return next;
    });
  }
  const [today, setToday] = useState(BUILT);
  useEffect(() => {
    NOW = Date.now();
    setToday(NOW);
  }, []);

  // Months in order starting from the current one, so the strip reads as "the year ahead".
  const now = new Date(today);
  const startMonth = now.getMonth() + 1;
  const ahead = Array.from(
    { length: 12 },
    (_, i) => ((startMonth - 1 + i) % 12) + 1,
  );

  const soon = useMemo(
    () =>
      doors
        .filter(
          (d) =>
            d.closes && daysUntil(d.closes) >= 0 && daysUntil(d.closes) <= 120,
        )
        .sort((a, b) => daysUntil(a.closes!) - daysUntil(b.closes!)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today],
  );

  const byMonth = useMemo(() => {
    const m = new Map<number, Door[]>();
    doors.forEach((d) =>
      d.months.forEach((x) => m.set(x, [...(m.get(x) ?? []), d])),
    );
    return m;
  }, []);
  const maxInMonth = Math.max(1, ...[...byMonth.values()].map((v) => v.length));

  const shown = doors.filter(
    (d) =>
      (kind === "All" || d.kind === kind) &&
      (month === null || d.months.includes(month)) &&
      (!paysOnly || d.pays) &&
      (!faithOnly || d.faith) &&
      (!savedOnly || saved.includes(d.name)),
  ).sort((a, b) => rank(a) - rank(b));

  return (
    <section
      id="doors"
      className="scroll-mt-14 border-t border-hairline bg-canvas px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
          {doors.length} open doors most IR majors never hear about.
        </h2>
        {path && (
          <p className="mt-4 max-w-xl text-body">
            Your path&apos;s {mine.length} are up front, tagged in orange.
          </p>
        )}

        {/* Closing soon */}
        {soon.length > 0 && (
          <div className="mt-12">
            <p className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
              Closing soon
            </p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {soon.map((d) => {
                const left = daysUntil(d.closes!);
                return (
                  <li key={d.name}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener"
                      className={`group flex h-full items-center gap-5 rounded-xl bg-night p-5 text-on-night transition duration-150 hover:-translate-y-0.5 hover:bg-night-2 ${focusRing}`}
                    >
                      <span className="grid w-20 shrink-0 text-center">
                        <span
                          className={`font-mono text-5xl leading-none tracking-[-0.04em] tabular-nums ${left <= 14 ? "text-primary" : "text-on-night"}`}
                        >
                          {left}
                        </span>
                        <span className="mt-1 font-mono text-[11px] tracking-[0.15em] text-on-ink-muted">
                          {left === 1 ? "DAY LEFT" : "DAYS LEFT"}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug group-hover:text-primary">
                          {d.name}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-on-ink-soft">
                          {d.blurb}
                        </span>
                        <span className="mt-2 block font-mono text-[11px] text-on-ink-muted">
                          {d.money}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* The year at a glance */}
        <div className="mt-16">
          <p className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
            When they close, the year ahead. Tap a month.
          </p>
          <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-12">
            {ahead.map((m) => {
              const list = byMonth.get(m) ?? [];
              const on = month === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  disabled={list.length === 0}
                  onClick={() => setMonth(on ? null : m)}
                  className={`flex min-h-24 flex-col justify-end rounded-lg border p-2 text-left transition-colors duration-100 disabled:cursor-default disabled:opacity-40 ${focusRing} ${
                    on
                      ? "border-ink bg-ink text-canvas"
                      : "border-hairline bg-card hover:border-ink"
                  }`}
                >
                  <span className="flex flex-wrap gap-1">
                    {list.map((d) => (
                      <span
                        key={d.name}
                        className={`size-2 rounded-full ${on ? "bg-primary" : list.length === maxInMonth ? "bg-primary" : "bg-ink"}`}
                        title={d.name}
                      />
                    ))}
                  </span>
                  <span className="mt-2 font-mono text-xs">
                    {MONTHS[m - 1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters: one sideways row on a phone. Wrapped, the 11 chips filled most of a phone screen
            before the first card (seen 2026-11-10). */}
        <div className="-mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&>*]:shrink-0 [&>*]:whitespace-nowrap">
          {(["All", ...KINDS] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${
                kind === k
                  ? "border-ink bg-ink text-canvas"
                  : "border-hairline-strong bg-card text-ink hover:border-ink"
              }`}
            >
              {k}
            </button>
          ))}
          <button
            type="button"
            role="switch"
            aria-checked={paysOnly}
            onClick={() => setPaysOnly(!paysOnly)}
            className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${paysOnly ? "border-primary bg-match-soft text-primary-active" : "border-hairline-strong bg-card text-body hover:border-ink"}`}
          >
            Pays or funds you
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={faithOnly}
            onClick={() => setFaithOnly(!faithOnly)}
            className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${faithOnly ? "border-primary bg-match-soft text-primary-active" : "border-hairline-strong bg-card text-body hover:border-ink"}`}
          >
            Faith-rooted
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={savedOnly}
            onClick={() => setSavedOnly(!savedOnly)}
            className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${savedOnly ? "border-primary bg-match-soft text-primary-active" : "border-hairline-strong bg-card text-body hover:border-ink"}`}
          >
            &#9733; Saved ({saved.length})
          </button>
        </div>
        <p className="mt-6 font-mono text-sm text-muted" aria-live="polite">
          {shown.length} {shown.length === 1 ? "door" : "doors"}
          {month !== null && ` closing in ${MONTHS[month - 1]}`}
        </p>

        {shown.length === 0 ? (
          <div className="mt-4 rounded-xl border border-hairline bg-card px-6 py-10 text-center">
            <p className="text-ink">No doors match all of that.</p>
            <button
              type="button"
              onClick={() => {
                setKind("All");
                setMonth(null);
                setPaysOnly(false);
                setFaithOnly(false);
                setSavedOnly(false);
              }}
              className={`mt-3 min-h-10 text-sm text-primary-active underline underline-offset-4 hover:text-ink ${focusRing}`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.ul
            layout={!reduce}
            className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence initial={false}>
              {(all ? shown : shown.slice(0, 6)).map((d) => (
                <motion.li
                  layout={!reduce}
                  key={d.name}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="group relative flex flex-col rounded-xl border border-hairline bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_30px_-18px_rgba(38,37,30,0.35)]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${KIND_TINT[d.kind]}`}>{d.kind}</span>
                      {mine.includes(d.name) && (
                        <span className="font-mono text-[11px] tracking-[0.12em] text-primary">FOR YOUR PATH</span>
                      )}
                    </span>
                    <button
                      type="button"
                      aria-pressed={saved.includes(d.name)}
                      aria-label={saved.includes(d.name) ? `Remove ${d.name} from saved` : `Save ${d.name}`}
                      onClick={() => toggleSave(d.name)}
                      className={`relative z-10 grid size-10 place-items-center rounded-full border text-lg transition-colors duration-100 ${focusRing} ${
                        saved.includes(d.name) ? "border-primary bg-primary text-white" : "border-hairline-strong text-muted hover:border-ink hover:text-ink"
                      }`}
                    >
                      {saved.includes(d.name) ? "\u2605" : "\u2606"}
                    </button>
                  </span>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className={`mt-3 block text-lg leading-snug text-ink after:absolute after:inset-0 after:rounded-xl after:content-[''] group-hover:text-primary-active ${focusRing}`}
                  >
                    {d.name}
                  </a>
                  <span className="mt-2 block text-sm leading-relaxed text-body">{d.blurb}</span>
                  <span className="mt-auto grid gap-1 border-t border-dashed border-hairline pt-4 font-mono text-[11px] text-muted">
                    <span className="text-ink">{d.money}</span>
                    <span>{d.who}</span>
                    {d.closes ? (
                      <span className={daysUntil(d.closes) >= 0 && daysUntil(d.closes) <= 30 ? "text-primary-active" : "text-ink"}>Deadline: {d.when.replace(/^Closes /, "")}</span>
                    ) : (
                      <span>Typical timing: {d.when}. Confirm on their site.</span>
                    )}
                  </span>
                  {d.closes && daysUntil(d.closes) >= 0 && (
                    <button
                      type="button"
                      onClick={() => addToCalendar(d)}
                      className={`relative z-10 mt-4 inline-flex min-h-10 items-center self-start rounded-full border border-hairline-strong px-4 text-xs text-ink transition-colors duration-100 hover:border-ink ${focusRing}`}
                    >
                      Add deadline to calendar
                    </button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
        {shown.length > 6 && (
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            className={`mt-6 inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm text-ink transition-colors duration-100 hover:bg-ink hover:text-canvas ${focusRing}`}
          >
            {all ? "Show fewer" : `Show all ${shown.length} doors`}
          </button>
        )}
        <p className="mt-8 max-w-2xl text-sm text-muted">
          Deadlines checked November 2026. Campus deadlines often come weeks
          earlier, so check with your fellowships office.
        </p>
      </div>
    </section>
  );
}
