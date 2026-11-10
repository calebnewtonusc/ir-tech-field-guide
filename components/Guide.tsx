"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { paths, questions, type PathId } from "@/lib/data";

const dotClass: Record<PathId, string> = {
  policy: "bg-policy",
  defense: "bg-defense",
  trust: "bg-trust",
  expansion: "bg-expansion",
  risk: "bg-risk",
};

const emptyScores: Record<PathId, number> = {
  policy: 0,
  defense: 0,
  trust: 0,
  expansion: 0,
  risk: 0,
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function scoreFor(answers: number[]): Record<PathId, number> {
  const total = { ...emptyScores };
  answers.forEach((choice, qi) => {
    const pts = questions[qi]?.options[choice]?.points ?? {};
    (Object.entries(pts) as [PathId, number][]).forEach(([id, n]) => {
      total[id] += n;
    });
  });
  return total;
}

function rank(scores: Record<PathId, number>): PathId[] {
  const order = paths.map((p) => p.id);
  return [...order].sort(
    (a, b) => scores[b] - scores[a] || order.indexOf(a) - order.indexOf(b),
  );
}

export default function Guide() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [openId, setOpenId] = useState<PathId | null>(null);

  const done = answers.length === questions.length;
  const scores = useMemo(() => scoreFor(answers), [answers]);
  const ranked = useMemo(() => rank(scores), [scores]);
  const maxScore = Math.max(1, ...Object.values(scores));
  const match = done ? ranked[0] : null;
  const matchPath = paths.find((p) => p.id === match);
  const orderedPaths = done
    ? ranked.map((id) => paths.find((p) => p.id === id)!)
    : paths;

  function choose(i: number) {
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
    else setOpenId(rank(scoreFor(next))[0]);
  }

  function back() {
    if (step === 0) return;
    setAnswers(answers.slice(0, step - 1));
    setStep(step - 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setOpenId(null);
  }

  const q = questions[step];
  const slide = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <>
      <section id="quiz" className="scroll-mt-16 bg-ink text-canvas">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
            Which path fits you?
          </h2>
          <p className="mt-3 text-on-ink-muted">
            Not sure which part of IR you like yet? That&apos;s what this is for. Seven questions, about two minutes. Your answers reorder the five
            paths below.
          </p>

          <div className="mt-10 min-h-[440px]" aria-live="polite">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={step}
                  {...slide}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-on-ink-muted">
                      {step + 1} / {questions.length}
                    </span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-primary"
                        initial={false}
                        animate={{
                          width: `${(step / questions.length) * 100}%`,
                        }}
                        transition={{ duration: reduce ? 0 : 0.3 }}
                      />
                    </div>
                  </div>
                  <p className="mt-8 text-2xl leading-snug sm:text-3xl">
                    {q.prompt}
                  </p>
                  <div className="mt-8 grid gap-3">
                    {q.options.map((o, i) => (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => choose(i)}
                        className={`group flex min-h-14 w-full items-center justify-between gap-4 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-4 text-left text-base transition duration-100 hover:border-primary hover:bg-white/[0.08] active:scale-[0.98] sm:text-lg ${focusRing}`}
                      >
                        <span>{o.label}</span>
                        <span
                          aria-hidden
                          className="text-on-ink-muted transition-colors group-hover:text-primary"
                        >
                          &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      className={`mt-6 min-h-11 text-sm text-on-ink-muted underline-offset-4 transition-colors hover:text-canvas hover:underline ${focusRing}`}
                    >
                      Back a question
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  {...slide}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <p className="font-mono text-sm text-on-ink-muted">
                    Your best fit
                  </p>
                  <p className="mt-3 text-4xl tracking-tight sm:text-5xl">
                    {matchPath?.name}
                  </p>
                  <p className="mt-4 max-w-xl text-lg text-on-ink-soft">
                    {matchPath?.oneLine}
                  </p>

                  <div className="mt-10 grid gap-3">
                    {ranked.map((id) => {
                      const p = paths.find((x) => x.id === id)!;
                      return (
                        <div key={id} className="flex items-center gap-4">
                          <span className="w-40 shrink-0 text-sm leading-tight text-on-ink-soft sm:w-56">
                            {p.name}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className={`h-full rounded-full ${dotClass[id]}`}
                              initial={{
                                width: reduce
                                  ? `${(scores[id] / maxScore) * 100}%`
                                  : 0,
                              }}
                              animate={{
                                width: `${(scores[id] / maxScore) * 100}%`,
                              }}
                              transition={{
                                duration: reduce ? 0 : 0.5,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <a
                      href="#paths"
                      className={`inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] ${focusRing}`}
                    >
                      See your path
                    </a>
                    <button
                      type="button"
                      onClick={restart}
                      className={`inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-canvas transition duration-100 hover:border-canvas active:scale-[0.97] ${focusRing}`}
                    >
                      Take it again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section
        id="paths"
        className="mx-auto max-w-5xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28"
      >
        <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
          {done ? "Your five paths, best fit first" : "Five paths"}
        </h2>
        <p className="mt-3 max-w-2xl text-body">
          Open one to see the day to day, who hires, how people get in, and what
          to do first.
        </p>

        <motion.ul layout={!reduce} className="mt-10 grid gap-3">
          {orderedPaths.map((p) => {
            const open = openId === p.id;
            const isMatch = match === p.id;
            return (
              <motion.li
                layout={!reduce}
                key={p.id}
                className={`overflow-hidden rounded-lg border bg-card transition-colors ${isMatch ? "border-primary" : "border-hairline"}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : p.id)}
                  className={`flex w-full items-start gap-4 px-5 py-5 text-left transition-colors duration-100 hover:bg-canvas-soft sm:px-7 sm:py-6 ${focusRing} focus-visible:-outline-offset-2`}
                >
                  <span
                    className={`mt-2 h-3 w-3 shrink-0 rounded-full ${dotClass[p.id]}`}
                    aria-hidden
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xl font-medium sm:text-2xl">
                        {p.name}
                      </span>
                      {isMatch && (
                        <span className="rounded-full bg-match-soft px-2.5 py-0.5 font-mono text-xs text-primary-active">
                          your match
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-body">{p.oneLine}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 text-2xl text-muted transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={
                        reduce ? { opacity: 1 } : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <div className="grid gap-8 border-t border-hairline px-5 py-7 sm:grid-cols-2 sm:px-7">
                        <Block title="A real Tuesday" items={p.day} />
                        <Block title="Who hires for it" items={p.hiring} />
                        <Block title="How undergrads get in" items={p.wayIn} />
                        <Block
                          title="Your first three moves"
                          items={p.firstMoves}
                          numbered
                        />
                        <p className="rounded-md bg-canvas px-4 py-3 text-sm text-body sm:col-span-2">
                          <span className="font-medium text-ink">
                            Know going in:{" "}
                          </span>
                          {p.watchOut}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>
    </>
  );
}

function Block({
  title,
  items,
  numbered = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        {title}
      </p>
      <ul className="mt-3 grid gap-2">
        {items.map((t, i) => (
          <li key={t} className="flex gap-3 text-ink">
            {numbered ? (
              <span className="font-mono text-sm text-primary-active">
                {i + 1}
              </span>
            ) : (
              <span
                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-hairline-strong"
                aria-hidden
              />
            )}
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
