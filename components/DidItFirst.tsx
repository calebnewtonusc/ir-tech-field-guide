"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { PathId } from "@/lib/data";

// Part 6. People in Scripture who did this exact work in a foreign power's government, one per path.
// References checked against the text; each line says only what the passage says.

const PEOPLE: {
  name: string;
  path: PathId;
  label: string;
  line: string;
  ref: string;
}[] = [
  {
    name: "Joseph",
    path: "risk",
    label: "Risk",
    line: "Read a famine seven years out and built Egypt's grain reserves before it hit.",
    ref: "Genesis 41:33-36",
  },
  {
    name: "Daniel",
    path: "policy",
    label: "Policy",
    line: "A foreign exile who advised the kings of Babylon and Persia and kept his integrity the whole way.",
    ref: "Daniel 6:3, 28",
  },
  {
    name: "Esther",
    path: "trust",
    label: "Trust and safety",
    line: "Risked her life to stop a government decree against her people.",
    ref: "Esther 4:14",
  },
  {
    name: "Nehemiah",
    path: "defense",
    label: "Defense",
    line: "Got the king's letters for safe passage, then rebuilt Jerusalem's walls while under threat.",
    ref: "Nehemiah 2:7-9, 4:17",
  },
  {
    name: "Paul",
    path: "expansion",
    label: "Expansion",
    line: "Crossed border after border, learned each culture, and knew his rights as a citizen.",
    ref: "Acts 22:25-28, 1 Corinthians 9:22",
  },
];

const ring: Record<PathId, string> = {
  policy: "border-policy text-policy",
  defense: "border-defense text-defense",
  trust: "border-trust text-trust",
  expansion: "border-expansion text-expansion",
  risk: "border-risk text-risk",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function DidItFirst() {
  const reduce = useReducedMotion();
  // After the passport quiz, the person who walked her path first gets lit up.
  const [match, setMatch] = useState<PathId | null>(null);
  useEffect(() => {
    const on = (e: Event) => setMatch((e as CustomEvent<PathId>).detail);
    window.addEventListener("path:match", on);
    return () => window.removeEventListener("path:match", on);
  }, []);
  return (
    <section
      id="faith"
      className="scroll-mt-14 bg-night px-4 py-28 text-on-night sm:px-6 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <blockquote className="max-w-4xl text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.08] tracking-[-0.025em]">
          &ldquo;Seek the welfare of the city where I have sent you into exile,
          and pray to the Lord on its behalf.&rdquo;
        </blockquote>
        <p className="mt-5 font-mono text-sm text-on-ink-muted">
          Jeremiah 29:7
        </p>

        <h2 className="mt-24 text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">
          They did it first.
        </h2>
        <p className="mt-3 max-w-lg text-on-ink-soft">
          Five people in Scripture who served foreign governments, one for every
          path above.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...PEOPLE].sort((a, b) => Number(b.path === match) - Number(a.path === match)).map((p, i) => (
            <motion.li
              key={p.name}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.06 }}
            >
              <a
                href="#visas"
                className={`group flex h-full flex-col rounded-xl border ${match === p.path ? "border-primary" : "border-white/10"} bg-night-2 p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/30 ${focusRing}`}
              >
                <span
                  className={`grid size-14 place-items-center rounded-full border-2 font-mono text-[9px] font-semibold tracking-[0.12em] uppercase ${ring[p.path]}`}
                  style={{ rotate: "-8deg" }}
                >
                  {p.label.split(" ")[0]}
                </span>
                <span className="mt-6 text-3xl tracking-[-0.02em]">
                  {p.name}
                </span>
                {match === p.path && (
                  <span className="mt-2 font-mono text-[11px] tracking-[0.15em] text-primary">
                    WALKED YOUR PATH FIRST
                  </span>
                )}
                <span className="mt-1 font-mono text-[11px] tracking-[0.12em] text-on-ink-muted uppercase">
                  {p.label}
                </span>
                <span className="mt-4 text-on-ink-soft">{p.line}</span>
                <span className="mt-auto pt-6 font-mono text-xs text-on-ink-muted group-hover:text-primary">
                  {p.ref}
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
