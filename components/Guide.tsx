"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { paths, questions, type PathId } from "@/lib/data";
import { shareVisa } from "@/lib/visaCard";

// Parts 3 and 4: the passport and the visas. One object carries the quiz: a passport that
// opens, takes a stamp per answer, and ends on a visa page. The visa list below is the same
// five paths as stamped pages, the match on top. (Spec: SPEC.md, "The one object".)

const ink: Record<PathId, string> = {
  policy: "text-[#3f63a6] border-[#3f63a6]",
  defense: "text-[#b4532a] border-[#b4532a]",
  trust: "text-[#2f7a45] border-[#2f7a45]",
  expansion: "text-[#6f4aa8] border-[#6f4aa8]",
  risk: "text-[#9a6a12] border-[#9a6a12]",
};
const short: Record<PathId, string> = {
  policy: "POLICY",
  defense: "DEFENSE",
  trust: "TRUST",
  expansion: "GLOBAL",
  risk: "RISK",
};
// A stamp is never pressed square. Fixed angles per page so nothing jitters between renders.
const ANGLE = [-8, 6, -4, 9, -11, 4, -6];

// Employer marks pulled with logo-fetch into public/logos. Shield AI, Palantir, Meta and Rhodium only
// served blurry icons (refused under 64px), so those chips show a letter instead.
const EMPLOYER_LOGO: [RegExp, string][] = [
  [/openai/i, "openai"], [/anthropic/i, "anthropic"], [/anduril/i, "anduril"], [/saronic/i, "saronic"],
  [/helsing/i, "helsing"], [/discord/i, "discord"], [/roblox/i, "roblox"], [/tiktok/i, "tiktok"],
  [/stripe/i, "stripe"], [/deel/i, "deel"], [/^wise/i, "wise"], [/revolut/i, "revolut"],
  [/strider/i, "strider"], [/dataminr/i, "dataminr"], [/eurasia/i, "eurasia-group"],
];
const logoFor = (name: string) => EMPLOYER_LOGO.find(([re]) => re.test(name))?.[1];

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

// The path an answer leans toward most: that's the stamp it leaves.
function leanOf(qi: number, choice: number): PathId {
  const pts = questions[qi].options[choice].points;
  return (Object.entries(pts) as [PathId, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
}

export default function Guide() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pressing, setPressing] = useState<number | null>(null);
  const [openId, setOpenId] = useState<PathId | null>(null);

  const done = answers.length === questions.length;
  const scores = useMemo(() => scoreFor(answers), [answers]);
  const ranked = useMemo(() => rank(scores), [scores]);
  const match = done ? ranked[0] : null;
  const matchPath = paths.find((p) => p.id === match);
  const ordered = done
    ? ranked.map((id) => paths.find((p) => p.id === id)!)
    : paths;

  function choose(i: number) {
    if (pressing !== null) return;
    setPressing(i);
    // The stamp lands, holds a beat so it can be seen, then the page turns.
    window.setTimeout(
      () => {
        const next = [...answers.slice(0, step), i];
        setAnswers(next);
        setPressing(null);
        if (step < questions.length - 1) setStep(step + 1);
        else {
          const best = rank(scoreFor(next))[0];
          setOpenId(best);
          // Tell the classes section which path won, so it opens on her picks.
          window.dispatchEvent(new CustomEvent("path:match", { detail: best }));
        }
      },
      reduce ? 0 : 520,
    );
  }

  function back() {
    if (step === 0 || pressing !== null) return;
    setAnswers(answers.slice(0, step - 1));
    setStep(step - 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setOpenId(null);
  }

  const q = questions[step];
  const turn = reduce
    ? {}
    : {
        initial: { opacity: 0, rotateY: -14, x: 30 },
        animate: { opacity: 1, rotateY: 0, x: 0 },
        exit: { opacity: 0, rotateY: 10, x: -30 },
      };

  return (
    <>
      <section
        id="quiz"
        className="scroll-mt-14 bg-canvas px-4 py-24 sm:px-6 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
            Get your passport stamped.
          </h2>
          <p className="mt-4 max-w-md text-lg text-body">
            Seven pages. Every answer leaves a stamp, and the stamps pick your
            path.
          </p>

          <div className="mt-12 [perspective:1600px]">
            <AnimatePresence mode="wait" initial={false}>
              {!open ? (
                <motion.button
                  key="cover"
                  type="button"
                  onClick={() => setOpen(true)}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          rotateY: -80,
                          opacity: 0,
                          transition: { duration: 0.45, ease: "easeIn" },
                        }
                  }
                  style={{ transformOrigin: "left center" }}
                  className={`group relative mx-auto flex aspect-[5/7] w-full max-w-[340px] flex-col items-center justify-between rounded-r-2xl rounded-l-md bg-passport px-8 py-12 text-foil shadow-[0_30px_60px_-20px_rgba(20,19,15,0.55)] transition-transform duration-150 hover:-translate-y-1 active:scale-[0.98] ${focusRing}`}
                >
                  <span className="font-mono text-[11px] tracking-[0.35em]">
                    FIELD GUIDE
                  </span>
                  <Crest />
                  <span className="text-center">
                    <span className="block font-mono text-2xl tracking-[0.3em]">
                      PASSPORT
                    </span>
                    <span className="mt-6 inline-flex min-h-11 items-center rounded-full border border-foil/60 px-5 text-sm tracking-normal text-foil transition-colors group-hover:border-foil group-hover:bg-foil group-hover:text-passport">
                      Open it &rarr;
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-3 w-px bg-foil/25"
                  />
                </motion.button>
              ) : !done ? (
                <motion.div
                  key={`page-${step}`}
                  {...turn}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  style={{ transformOrigin: "left center" }}
                  className="mx-auto w-full max-w-2xl"
                >
                  <Page>
                    <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-[#8a7f66]">
                      <span>
                        PAGE {String(step + 1).padStart(2, "0")} /{" "}
                        {String(questions.length).padStart(2, "0")}
                      </span>
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={back}
                          className={`min-h-10 tracking-normal underline-offset-4 hover:text-ink hover:underline ${focusRing}`}
                        >
                          &larr; back a page
                        </button>
                      )}
                    </div>
                    <p className="mt-6 text-[1.7rem] leading-tight tracking-[-0.01em] text-ink sm:text-3xl">
                      {q.prompt}
                    </p>
                    <div className="mt-8 grid gap-2.5">
                      {q.options.map((o, i) => {
                        const lean = leanOf(step, i);
                        const isPressed = pressing === i;
                        return (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => choose(i)}
                            className={`relative flex min-h-14 w-full items-center justify-between gap-4 rounded-lg border bg-white/60 px-5 py-3.5 text-left text-base text-ink transition duration-100 hover:border-ink hover:bg-white active:scale-[0.98] sm:text-lg ${
                              isPressed
                                ? "border-ink bg-white"
                                : "border-page-line"
                            } ${focusRing}`}
                          >
                            <span>{o.label}</span>
                            <AnimatePresence>
                              {isPressed && (
                                <motion.span
                                  initial={
                                    reduce
                                      ? { opacity: 1 }
                                      : { scale: 1.8, opacity: 0 }
                                  }
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.16,
                                    ease: "easeIn",
                                  }}
                                  className={`pointer-events-none shrink-0 rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-[0.15em] ${ink[lean]}`}
                                  style={{ rotate: ANGLE[step] }}
                                >
                                  {short[lean]}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        );
                      })}
                    </div>
                    <StampTray answers={answers} />
                  </Page>
                </motion.div>
              ) : (
                <motion.div
                  key="visa"
                  {...turn}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ transformOrigin: "left center" }}
                  className="mx-auto w-full max-w-2xl"
                >
                  <Page>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-[#8a7f66]">
                      VISA &middot; ISSUED NOV 2026
                    </p>
                    <div className="mt-6 flex items-start justify-between gap-4">
                      <p className="text-[clamp(2rem,6vw,3.4rem)] leading-[1.02] tracking-[-0.02em] text-ink">
                        {matchPath?.name}
                      </p>
                      {match && (
                        <motion.span
                          initial={reduce ? false : { scale: 2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.2,
                            delay: 0.25,
                            ease: "easeIn",
                          }}
                          className={`mt-2 shrink-0 rotate-[-9deg] rounded-md border-[3px] px-3 py-1 font-mono text-sm font-semibold tracking-[0.2em] ${ink[match]}`}
                        >
                          APPROVED
                        </motion.span>
                      )}
                    </div>
                    <p className="mt-5 max-w-lg text-lg text-body">
                      {matchPath?.oneLine}
                    </p>
                    <StampTray answers={answers} />
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href="#visas"
                        className={`inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] ${focusRing}`}
                      >
                        See what it opens &darr;
                      </a>
                      {matchPath && (
                        <button
                          type="button"
                          onClick={() => shareVisa(matchPath)}
                          className={`inline-flex min-h-12 items-center rounded-full border border-ink px-6 text-ink transition duration-100 hover:bg-ink hover:text-canvas active:scale-[0.97] ${focusRing}`}
                        >
                          Save my visa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={restart}
                        className={`inline-flex min-h-12 items-center rounded-full border border-hairline-strong px-6 text-ink transition duration-100 hover:border-ink active:scale-[0.97] ${focusRing}`}
                      >
                        Start over
                      </button>
                    </div>
                  </Page>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section
        id="visas"
        className="scroll-mt-14 border-t border-hairline bg-canvas-soft px-4 py-24 sm:px-6 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
            {done ? "Your visas, best fit first." : "Five visas. Pick one."}
          </h2>

          <motion.ul layout={!reduce} className="mt-12 grid gap-4">
            {ordered.map((p) => {
              const isOpen = openId === p.id;
              const isMatch = match === p.id;
              return (
                <motion.li
                  layout={!reduce}
                  key={p.id}
                  className={`relative overflow-hidden rounded-xl border bg-page ${isMatch ? "border-ink" : "border-page-line"}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : p.id)}
                    className={`relative flex w-full flex-col gap-4 px-5 py-6 text-left transition-colors duration-100 hover:bg-white/60 sm:flex-row sm:items-center sm:gap-8 sm:px-8 ${focusRing} focus-visible:-outline-offset-2`}
                  >
                    <span
                      className={`grid size-16 shrink-0 place-items-center rounded-full border-2 font-mono text-[10px] font-semibold tracking-[0.15em] ${ink[p.id]}`}
                      style={{ rotate: "-8deg" }}
                    >
                      {short[p.id]}
                    </span>
                    <span className="flex-1">
                      <span className="block text-2xl tracking-[-0.01em] text-ink sm:text-3xl">
                        {p.name}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-2">
                        {p.hiring.slice(0, 3).map((h) => (
                          <span key={h} className="inline-flex items-center gap-2 rounded-full border border-page-line bg-white/80 py-1 pr-3 pl-1 text-sm text-ink">
                            {logoFor(h) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={`/logos/${logoFor(h)}.png`} alt="" className="size-6 rounded-full bg-white object-contain" />
                            ) : (
                              <span className="grid size-6 place-items-center rounded-full bg-page-line text-[11px] text-body">{h.charAt(0)}</span>
                            )}
                            {h}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`absolute top-6 right-5 text-2xl text-muted transition-transform duration-200 sm:static ${isOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                    {isMatch && (
                      <span
                        className={`absolute top-5 right-14 rotate-[8deg] rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-[0.15em] sm:right-20 ${ink[p.id]}`}
                      >
                        YOUR MATCH
                      </span>
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={
                          reduce ? { opacity: 1 } : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduce ? { opacity: 0 } : { height: 0, opacity: 0 }
                        }
                        transition={{
                          duration: reduce ? 0 : 0.28,
                          ease: "easeOut",
                        }}
                      >
                        <div className="grid gap-8 border-t border-dashed border-page-line px-5 py-7 sm:grid-cols-3 sm:px-8">
                          <p className="text-lg leading-snug text-ink sm:col-span-3">
                            {p.oneLine}
                          </p>
                          <Block title="A real Tuesday" items={p.day} />
                          <Block
                            title="How undergrads get in"
                            items={p.wayIn}
                          />
                          <Block
                            title="First three moves"
                            items={p.firstMoves}
                            numbered
                          />
                          <p className="text-sm text-body sm:col-span-3">
                            <span className="font-mono text-[11px] tracking-[0.15em] text-[#8a7f66]">
                              KNOW GOING IN&nbsp;&nbsp;
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
        </div>
      </section>
    </>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-page-line bg-page px-5 py-7 shadow-[0_24px_50px_-24px_rgba(20,19,15,0.35)] sm:px-10 sm:py-10">
      {/* Guilloche: the fine curved lines printed on every real passport page. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 size-[380px] text-page-line"
        viewBox="0 0 200 200"
        fill="none"
      >
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx={30 + i * 5}
            ry={18 + i * 6}
            stroke="currentColor"
            strokeWidth="0.6"
            transform={`rotate(${i * 13} 100 100)`}
          />
        ))}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

function StampTray({ answers }: { answers: number[] }) {
  return (
    <div
      className="mt-8 flex flex-wrap items-center gap-2 border-t border-dashed border-page-line pt-5"
      aria-label={`${answers.length} of ${questions.length} stamps`}
    >
      {questions.map((_, qi) => {
        const lean = answers[qi] !== undefined ? leanOf(qi, answers[qi]) : null;
        return lean ? (
          <span
            key={qi}
            className={`grid size-12 place-items-center rounded-full border-2 font-mono text-[8px] font-semibold tracking-[0.04em] ${ink[lean]}`}
            style={{ rotate: `${ANGLE[qi]}deg` }}
          >
            {short[lean]}
          </span>
        ) : (
          <span
            key={qi}
            className="size-9 rounded-full border border-dashed border-page-line"
          />
        );
      })}
    </div>
  );
}

function Crest() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="size-28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="50" cy="50" r="38" />
      <ellipse cx="50" cy="50" rx="16" ry="38" />
      <ellipse cx="50" cy="50" rx="30" ry="38" />
      <path d="M12 50h76M18 32h64M18 68h64" />
      <circle cx="50" cy="50" r="46" strokeDasharray="2 3" />
    </svg>
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
      <p className="font-mono text-[11px] tracking-[0.15em] text-[#8a7f66] uppercase">
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
                className="mt-2.5 size-1 shrink-0 rounded-full bg-hairline-strong"
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
