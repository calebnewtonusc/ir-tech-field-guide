"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// Part 7. The plan as a flight route: a dashed line that draws itself as you scroll, six stops on it.
// Each stop is a few words; the detail lives in the visas above.
const STOPS = [
  {
    when: "This semester",
    title: "Learn enough tech to keep up",
    body: "How AI models work, or how a drone company makes money.",
  },
  {
    when: "This semester",
    title: "Write one public memo",
    body: "Two pages on where tech meets a border. Post it.",
  },
  {
    when: "Next summer",
    title: "Get inside any tech team",
    body: "Ops, policy, BD or trust and safety, at a startup.",
  },
  {
    when: "All year",
    title: "Know ten people in the field",
    body: "Message your target title. Mention the memo.",
  },
  {
    when: "Senior year",
    title: "Apply to one fellowship",
    body: "Horizon takes people with no policy experience.",
  },
  {
    when: "Always",
    title: "Keep your language and region",
    body: "The edge an engineer can't copy.",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Route() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="route"
      className="scroll-mt-14 border-t border-hairline bg-canvas px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
          The route from here.
        </h2>

        <ol ref={ref} className="relative mt-14 grid gap-12 pl-12 sm:pl-20">
          {/* A rail and a drawn line over it. scaleY from the top tracks scroll; an SVG pathLength on a
              non-scaling stroke drew in broken chunks (seen at 390px, 2026-11-09). */}
          <span aria-hidden className="absolute top-3 bottom-3 left-[13px] w-[2px] bg-hairline sm:left-[14px]" />
          <motion.span aria-hidden className="absolute top-3 bottom-3 left-[13px] w-[2px] origin-top bg-ink sm:left-[14px]" style={{ scaleY: reduce ? 1 : draw }} />
          {STOPS.map((s, i) => (
            <Stop
              key={s.title}
              s={s}
              i={i}
              progress={scrollYProgress}
              reduce={!!reduce}
            />
          ))}
        </ol>

        <a
          href="#top"
          className={`mt-16 inline-flex min-h-12 items-center rounded-full border border-hairline-strong px-6 text-ink transition duration-100 hover:border-ink active:scale-[0.97] ${focusRing}`}
        >
          Back to the map &uarr;
        </a>
      </div>
    </section>
  );
}

function Stop({
  s,
  i,
  progress,
  reduce,
}: {
  s: (typeof STOPS)[number];
  i: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
}) {
  const at = i / (STOPS.length - 1);
  // The stop lights as the drawn line reaches it.
  const reached = useTransform(
    progress,
    [Math.max(at - 0.04, 0), at + 0.001],
    [0, 1],
  );
  const fill = useTransform(
    reached,
    [0, 1],
    ["var(--color-canvas)", "var(--color-ink)"],
  );
  const opacity = useTransform(reached, [0, 1], [0.45, 1]);

  return (
    <li className="relative">
      <motion.span
        aria-hidden
        className="absolute top-1.5 -left-12 size-[28px] rounded-full border-2 border-ink sm:-left-20 sm:size-[30px]"
        style={{ backgroundColor: reduce ? "var(--color-ink)" : fill }}
      />
      <motion.div style={{ opacity: reduce ? 1 : opacity }}>
        <p className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
          {s.when}
        </p>
        <p className="mt-1 text-2xl tracking-[-0.01em] text-ink sm:text-3xl">
          {s.title}
        </p>
        <p className="mt-1 text-body">{s.body}</p>
      </motion.div>
    </li>
  );
}
