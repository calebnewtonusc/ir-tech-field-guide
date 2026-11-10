"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

// Part 2. One giant number at a time on a held screen. Each number counts up from zero across the
// first half of its stretch of scroll, then holds while its line reads. Sources from lib/data.ts stats.
const CASE = [
  {
    to: 49.1,
    format: (v: number) => `$${v.toFixed(1)}B`,
    line: "went into defense tech startups in 2025. Their customers are governments.",
    source: "PitchBook via Defense News",
    href: "https://www.defensenews.com/industry/2026/01/20/defense-tech-startups-had-their-best-funding-year-ever-in-2025/",
  },
  {
    to: 100,
    format: (v: number) => `$${Math.round(v)}M+`,
    line: "spent lobbying Washington by tech and AI companies in 2025, a first.",
    source: "Axios",
    href: "https://www.axios.com/2026/01/23/ai-tech-lobbying-2025",
  },
  {
    to: 100000,
    format: (v: number) => `${Math.round(v).toLocaleString("en-US")}+`,
    line: "people work in trust and safety, deciding what's allowed in every country.",
    source: "Trust & Safety Professional Association",
    href: "https://www.tspa.org/about-tspa/",
  },
  {
    to: 280,
    format: (v: number) => `$${Math.round(v)}K`,
    line: "top of the listed pay for OpenAI's US Executive Branch Lead. That's where the path goes.",
    source: "OpenAI posting, Feb 2026",
    href: "https://jobs.omegavp.com/companies/openai/jobs/67241167-us-executive-branch-lead-global-affairs",
  },
];

const N = CASE.length;
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function TheCase() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduce) {
    return (
      <section
        id="case"
        aria-label="Why this matters now"
        className="scroll-mt-14 bg-night px-4 py-24 text-on-night sm:px-6"
      >
        <div className="mx-auto grid max-w-6xl gap-16">
          {CASE.map((c) => (
            <Stat key={c.source} c={c} value={c.format(c.to)} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="case"
      aria-label="Why this matters now"
      className="relative scroll-mt-14 bg-night text-on-night"
      style={{ height: `${N * 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {CASE.map((c, i) => (
            <Beat key={c.source} c={c} i={i} progress={scrollYProgress} />
          ))}
          <div
            className="absolute right-4 bottom-10 flex gap-2 sm:right-6"
            aria-hidden
          >
            {CASE.map((c, i) => (
              <Tick key={c.source} i={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Beat({
  c,
  i,
  progress,
}: {
  c: (typeof CASE)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  const start = i / N;
  const end = (i + 1) / N;
  const span = end - start;
  // Fade in over the first 12% of the stretch, out over the last 12%. The first beat starts visible.
  const opacity = useTransform(
    progress,
    i === 0
      ? [0, end - span * 0.12, end]
      : i === N - 1
        ? [start, start + span * 0.12, 1]
        : [start, start + span * 0.12, end - span * 0.12, end],
    i === 0 ? [1, 1, 0] : i === N - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, start + span * 0.2], [24, 0]);
  const count = useTransform(progress, [start, start + span * 0.5], [0, c.to], {
    clamp: true,
  });
  const [value, setValue] = useState(c.format(i === 0 ? c.to * 0.0 : 0));
  useMotionValueEvent(count, "change", (v) => setValue(c.format(v)));

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-4 top-1/2 mx-auto max-w-6xl -translate-y-1/2 sm:inset-x-6"
    >
      <Stat c={c} value={value} />
    </motion.div>
  );
}

function Stat({ c, value }: { c: (typeof CASE)[number]; value: string }) {
  return (
    <div>
      <p className="font-mono text-[clamp(3.4rem,13vw,10rem)] leading-none tracking-[-0.04em] tabular-nums">
        {value}
      </p>
      <p className="mt-6 max-w-xl text-xl leading-snug text-on-ink-soft sm:text-2xl">
        {c.line}
      </p>
      <a
        href={c.href}
        target="_blank"
        rel="noopener"
        className={`mt-6 inline-flex min-h-10 items-center font-mono text-xs text-on-ink-muted underline-offset-4 transition-colors hover:text-primary hover:underline ${focusRing}`}
      >
        {c.source} &rarr;
      </a>
    </div>
  );
}

function Tick({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const on = useTransform(
    progress,
    [i / N, i / N + 0.001, (i + 1) / N - 0.001, (i + 1) / N],
    [0.25, 1, 1, i === N - 1 ? 1 : 0.25],
  );
  return (
    <motion.span
      style={{ opacity: on }}
      className="h-1 w-8 rounded-full bg-on-night"
    />
  );
}
