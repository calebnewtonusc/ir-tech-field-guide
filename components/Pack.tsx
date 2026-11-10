"use client";

import { useEffect, useState } from "react";
import { paths, resources, type PathId, type Resource } from "@/lib/data";
import { doors } from "@/lib/opportunities";
import { DOORS_FOR, PACK_FOR } from "@/lib/forPath";

// The packing list: three picks up front (hers after the quiz), the full list behind one tap, then the
// last moment of the page. The full 20-link grid used to be the ending, and it ended on a list.

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const all: Resource[] = resources.flatMap((g) => g.items);

function Row({ r }: { r: Resource }) {
  return (
    <li>
      <a
        href={r.href}
        target="_blank"
        rel="noopener"
        className={`group flex min-h-14 items-center justify-between gap-4 py-3 ${focusRing}`}
      >
        <span>
          <span className="block text-ink transition-colors group-hover:text-primary-active">
            {r.name}
          </span>
          <span className="block text-sm text-muted">{r.note}</span>
        </span>
        <span
          aria-hidden
          className="text-muted transition-transform duration-100 group-hover:translate-x-0.5 group-hover:text-primary-active"
        >
          &rarr;
        </span>
      </a>
    </li>
  );
}

export default function Pack() {
  const [path, setPath] = useState<PathId | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setPath((e as CustomEvent<PathId>).detail);
    window.addEventListener("path:match", on);
    return () => window.removeEventListener("path:match", on);
  }, []);

  const picks = PACK_FOR[path ?? "start"]
    .map((n) => all.find((r) => r.name === n))
    .filter((r): r is Resource => !!r);
  const pathName = path ? paths.find((p) => p.id === path)?.name : null;
  const firstDoor = path
    ? doors.find((d) => d.name === DOORS_FOR[path][0])
    : null;

  return (
    <>
      <section
        id="resources"
        className="scroll-mt-14 border-t border-hairline bg-canvas-soft px-4 py-24 sm:px-6 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
            Pack these.
          </h2>
          <p className="mt-4 max-w-xl text-body">
            {path
              ? `The three to start with for ${pathName?.toLowerCase()}.`
              : "Three to start with. Take the passport quiz and these change to fit your path."}
          </p>
          <ul className="mt-10 max-w-2xl divide-y divide-hairline border-y border-hairline">
            {picks.map((r) => (
              <Row key={r.name} r={r} />
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`mt-8 inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm text-ink transition-colors duration-100 hover:bg-ink hover:text-canvas ${focusRing}`}
          >
            {open ? "Hide the full list" : `See all ${all.length}`}
          </button>

          {open && (
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((g) => (
                <div key={g.title}>
                  <h3 className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
                    {g.title}
                  </h3>
                  <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                    {g.items.map((r) => (
                      <Row key={r.name} r={r} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-night px-4 py-28 text-on-night sm:px-6 sm:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-primary">
            {path ? "STAMPED" : "ONE LAST THING"}
          </p>
          <h2 className="mt-6 text-[clamp(2.2rem,6vw,4.4rem)] leading-[1.02] tracking-[-0.03em]">
            {path
              ? `You're cleared for ${pathName?.toLowerCase()}.`
              : "The world needs people who can read it."}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-on-ink-soft">
            {firstDoor
              ? `Your first move: ${firstDoor.name}. ${firstDoor.when}.`
              : "Get stamped and this page points you at your first move."}
          </p>
          <a
            href={firstDoor ? firstDoor.href : "#quiz"}
            target={firstDoor ? "_blank" : undefined}
            rel={firstDoor ? "noopener" : undefined}
            className={`mt-10 inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] ${focusRing}`}
          >
            {firstDoor ? "Open it" : "Get stamped"}
          </a>
        </div>
      </section>
    </>
  );
}
