"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import data from "@/lib/courses.json";
import minorsData from "@/lib/minors.json";
import { paths, type PathId } from "@/lib/data";

// Classes at USC: five picks per path, an IYA and tech toolkit, and a row of fun 1-2 unit classes.
// One tab at a time so it never reads as a catalog. Seats and times are Spring 2027, read 2026-11-09.

type Course = {
  code: string;
  title: string;
  terms: string[];
  units: number | null;
  desc: string;
  why: string;
  href: string;
  spring: { openSeats: number; sections: number; when: string | null } | null;
};

const courses = data as unknown as {
  paths: Record<PathId, Course[]>;
  toolkit: Course[];
  fun: Course[];
};

export const MATCH_EVENT = "path:match";

const dot: Record<PathId, string> = {
  policy: "bg-policy",
  defense: "bg-defense",
  trust: "bg-trust",
  expansion: "bg-expansion",
  risk: "bg-risk",
};
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type Tab = PathId | "toolkit" | "fun" | "minors";
type Minor = { name: string; paths: PathId[]; why: string; courses: string[]; href: string };
const minors = minorsData as Minor[];

const to12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  return `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "pm" : "am"}`;
};
const when = (w: string | null) => {
  if (!w) return null;
  const [days, span] = w.split(" ");
  const [a, b] = (span ?? "").split("-");
  return a && b
    ? `${days.replaceAll("/", " ")} ${to12(a)} to ${to12(b)}`
    : days;
};

export default function Courses() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("fun");
  const [matched, setMatched] = useState<PathId | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<PathId>).detail;
      setMatched(id);
      setTab(id);
    };
    window.addEventListener(MATCH_EVENT, on);
    return () => window.removeEventListener(MATCH_EVENT, on);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "fun", label: "Fun 1 to 2 units" },
    { id: "minors", label: `Minors that fit (${minors.length})` },
    ...paths.map((p) => ({ id: p.id as Tab, label: p.name })),
    { id: "toolkit", label: "IYA and tech toolkit" },
  ];
  const list =
    tab === "minors" || tab === "fun"
      ? courses.fun
      : tab === "toolkit"
        ? courses.toolkit
        : courses.paths[tab];

  return (
    <section
      id="classes"
      className="scroll-mt-14 border-t border-hairline bg-canvas-soft px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
          Classes at USC worth taking.
        </h2>
        <p className="mt-4 max-w-xl text-body">
          Real classes from the Fall 2026 and Spring 2027 schedules. Five per
          path, plus the fun ones.
        </p>

        <div
          className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Class lists"
        >
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {tabs.map((t) => {
              const on = tab === t.id;
              const isPath = t.id !== "fun" && t.id !== "toolkit";
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${
                    on
                      ? "border-ink bg-ink text-canvas"
                      : "border-hairline-strong bg-card text-ink hover:border-ink"
                  }`}
                >
                  {isPath && (
                    <span
                      aria-hidden
                      className={`size-2 rounded-full ${dot[t.id as PathId]}`}
                    />
                  )}
                  {t.label}
                  {matched === t.id && (
                    <span className="font-mono text-[10px] tracking-[0.1em] text-primary">
                      YOURS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={tab}
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`mt-8 grid gap-4 ${tab === "fun" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {tab === "minors" &&
              [...minors]
                .sort((a, b) => Number(matched ? b.paths.includes(matched) : 0) - Number(matched ? a.paths.includes(matched) : 0))
                .map((m) => <MinorCard key={m.name} m={m} fits={!!matched && m.paths.includes(matched)} />)}
            {tab !== "minors" && list.map((c) =>
              tab === "fun" ? (
                <FunCard key={c.code} c={c} />
              ) : (
                <CourseCard key={c.code} c={c} />
              ),
            )}
          </motion.ul>
        </AnimatePresence>
        <p className="mt-8 text-sm text-muted">
          Seats and times are Spring 2027 as of November 9, 2026. A full class
          usually opens a waitlist, so check the schedule before you give up on
          it.
        </p>
      </div>
    </section>
  );
}

function Seats({ c }: { c: Course }) {
  if (!c.spring) return <span>{c.terms.join(" and ")}</span>;
  const full = c.spring.openSeats === 0;
  return (
    <span className={full ? "text-muted" : "text-ink"}>
      {full
        ? "Spring: full, try the waitlist"
        : `Spring: ${c.spring.openSeats} seats open`}
    </span>
  );
}

function CourseCard({ c }: { c: Course }) {
  return (
    <li>
      <a
        href={c.href}
        target="_blank"
        rel="noopener"
        className={`group flex h-full flex-col rounded-xl border border-hairline bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_30px_-18px_rgba(38,37,30,0.35)] ${focusRing}`}
      >
        <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-muted">
          <span className="text-ink">{c.code}</span>
          <span>{c.units ? `${c.units} units` : ""}</span>
        </span>
        <span className="mt-3 block text-lg leading-snug text-ink group-hover:text-primary-active">
          {c.title}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-body">
          {c.why}
        </span>
        <span className="mt-auto grid gap-1 border-t border-dashed border-hairline pt-4 font-mono text-[11px] text-muted">
          <span>Offered: {c.terms.join(" and ")}</span>
          {c.spring && when(c.spring.when) && (
            <span>{when(c.spring.when)}</span>
          )}
          <Seats c={c} />
        </span>
      </a>
    </li>
  );
}

function FunCard({ c }: { c: Course }) {
  return (
    <li>
      <a
        href={c.href}
        target="_blank"
        rel="noopener"
        className={`group flex h-full flex-col rounded-xl border border-hairline bg-card p-4 transition duration-150 hover:-translate-y-0.5 hover:rotate-[-1deg] hover:border-ink ${focusRing}`}
      >
        <span className="font-mono text-[11px] text-muted">
          {c.code} &middot; {c.units}u
        </span>
        <span className="mt-2 block leading-snug text-ink group-hover:text-primary-active">
          {c.title}
        </span>
        {c.why.replace(/\.$/, "").toLowerCase() !== c.title.toLowerCase() && <span className="mt-1 block text-xs text-body">{c.why}</span>}
        <span className="mt-auto pt-3 font-mono text-[10px] text-muted">
          <Seats c={c} />
        </span>
      </a>
    </li>
  );
}

function MinorCard({ m, fits }: { m: Minor; fits: boolean }) {
  return (
    <li>
      <a
        href={m.href}
        target="_blank"
        rel="noopener"
        className={`group flex h-full flex-col rounded-xl border bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_30px_-18px_rgba(38,37,30,0.35)] ${fits ? "border-ink" : "border-hairline"} ${focusRing}`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="flex gap-1.5" aria-label={`Fits: ${m.paths.join(", ")}`}>
            {m.paths.map((p) => (
              <span key={p} className={`size-2.5 rounded-full ${dot[p]}`} />
            ))}
          </span>
          {fits && <span className="font-mono text-[10px] tracking-[0.12em] text-primary">FITS YOUR PATH</span>}
        </span>
        <span className="mt-3 block text-lg leading-snug text-ink group-hover:text-primary-active">{m.name}</span>
        <span className="mt-2 block text-sm leading-relaxed text-body">{m.why}</span>
        <span className="mt-auto flex flex-wrap gap-1.5 border-t border-dashed border-hairline pt-4">
          {m.courses.map((c) => (
            <span key={c} className="rounded-full bg-canvas px-2 py-0.5 font-mono text-[11px] text-body">
              {c}
            </span>
          ))}
        </span>
      </a>
    </li>
  );
}
