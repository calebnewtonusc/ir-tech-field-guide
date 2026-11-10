"use client";

import { useMemo, useState } from "react";
import orgsData from "@/lib/orgs.json";

type Org = {
  name: string;
  source: "praxis" | "bayarea" | "faithtech";
  href: string;
  jobsHref: string;
  openRoles: number;
  description: string;
  location: string;
  sector: string;
  global: boolean;
};

const orgs = orgsData as Org[];

const sources = [
  { id: "all", label: "All" },
  { id: "praxis", label: "Praxis portfolio" },
  { id: "bayarea", label: "Bay Area Center network" },
  { id: "faithtech", label: "FaithTech projects" },
] as const;

const sourceLabel: Record<Org["source"], string> = {
  praxis: "Praxis",
  bayarea: "Bay Area Center",
  faithtech: "FaithTech",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const PAGE = 24;

export default function Directory() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<(typeof sources)[number]["id"]>("all");
  const [globalOnly, setGlobalOnly] = useState(false);
  const [hiringOnly, setHiringOnly] = useState(false);
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter(
      (o) =>
        (source === "all" || o.source === source) &&
        (!globalOnly || o.global) &&
        (!hiringOnly || o.openRoles > 0) &&
        (!q ||
          `${o.name} ${o.description} ${o.sector} ${o.location}`
            .toLowerCase()
            .includes(q)),
    );
  }, [query, source, globalOnly, hiringOnly]);

  const counts = useMemo(
    () => ({
      all: orgs.length,
      praxis: orgs.filter((o) => o.source === "praxis").length,
      bayarea: orgs.filter((o) => o.source === "bayarea").length,
      faithtech: orgs.filter((o) => o.source === "faithtech").length,
    }),
    [],
  );
  const totalRoles = useMemo(
    () => orgs.reduce((n, o) => n + o.openRoles, 0),
    [],
  );
  const globalCount = useMemo(() => orgs.filter((o) => o.global).length, []);

  function reset<T>(fn: (v: T) => void) {
    return (v: T) => {
      fn(v);
      setShown(PAGE);
    };
  }

  return (
    <section id="orgs" className="scroll-mt-16 border-t border-hairline">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
          Every org in the network
        </h2>
        <p className="mt-3 max-w-2xl text-body">
          All {counts.praxis} ventures on the{" "}
          <a
            href="https://jobs.praxis.co/companies"
            target="_blank"
            rel="noopener"
            className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}
          >
            Praxis
          </a>{" "}
          board, all {counts.bayarea} groups in the{" "}
          <a
            href="https://faithworktech.org/faith-and-work-directory"
            target="_blank"
            rel="noopener"
            className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}
          >
            Bay Area Center for Faith, Work &amp; Tech
          </a>{" "}
          directory, and {counts.faithtech} projects out of{" "}
          <a
            href="https://faithtech.com/create"
            target="_blank"
            rel="noopener"
            className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}
          >
            FaithTech Create
          </a>
          . Pulled November 9, 2026.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
          <Figure value={String(orgs.length)} label="orgs" />
          <Figure
            value={String(globalCount)}
            label="work internationally or on justice"
          />
          <Figure
            value={String(totalRoles)}
            label="open roles on the Praxis board"
          />
        </div>

        <div className="mt-10 grid gap-4">
          <label className="block">
            <span className="sr-only">Search orgs</span>
            <input
              type="search"
              value={query}
              onChange={(e) => reset(setQuery)(e.target.value)}
              placeholder="Search: refugee, Africa, trafficking, AI, policy..."
              className={`min-h-12 w-full rounded-lg border border-hairline-strong bg-card px-4 text-base text-ink placeholder:text-muted transition-colors hover:border-ink ${focusRing}`}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={source === s.id}
                onClick={() => reset(setSource)(s.id)}
                className={`min-h-10 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${
                  source === s.id
                    ? "border-ink bg-ink text-canvas"
                    : "border-hairline-strong bg-card text-ink hover:border-ink"
                }`}
              >
                {s.label}{" "}
                <span className="font-mono text-xs opacity-70">
                  {counts[s.id]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Toggle
              on={globalOnly}
              onClick={() => reset(setGlobalOnly)(!globalOnly)}
              label="Works internationally or on justice"
            />
            <Toggle
              on={hiringOnly}
              onClick={() => reset(setHiringOnly)(!hiringOnly)}
              label="Hiring now"
            />
          </div>
        </div>

        <p className="mt-8 font-mono text-sm text-muted" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "org" : "orgs"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-lg border border-hairline bg-card px-6 py-10 text-center">
            <p className="text-ink">Nothing matches that.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSource("all");
                setGlobalOnly(false);
                setHiringOnly(false);
                setShown(PAGE);
              }}
              className={`mt-3 min-h-10 text-sm text-primary-active underline underline-offset-4 hover:text-ink ${focusRing}`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
            {filtered.slice(0, shown).map((o) => (
              <li
                key={`${o.source}-${o.name}`}
                className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-6"
              >
                <div>
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noopener"
                    className={`text-lg font-medium text-ink transition-colors hover:text-primary-active ${focusRing}`}
                  >
                    {o.name}
                  </a>
                  <p className="mt-1 leading-relaxed text-body">
                    {o.description}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted">
                    {[sourceLabel[o.source], o.sector, o.location]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </p>
                </div>
                {o.openRoles > 0 && (
                  <a
                    href={o.jobsHref}
                    target="_blank"
                    rel="noopener"
                    className={`inline-flex h-10 items-center self-start rounded-full border border-hairline-strong px-4 text-sm text-ink transition-colors duration-100 hover:border-primary hover:text-primary-active ${focusRing}`}
                  >
                    {o.openRoles} open {o.openRoles === 1 ? "role" : "roles"}{" "}
                    &rarr;
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {shown < filtered.length && (
          <button
            type="button"
            onClick={() => setShown(filtered.length)}
            className={`mt-8 inline-flex min-h-12 items-center rounded-full border border-hairline-strong bg-card px-6 text-ink transition duration-100 hover:border-ink active:scale-[0.97] ${focusRing}`}
          >
            Show all {filtered.length}
          </button>
        )}
      </div>
    </section>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card px-4 py-5 sm:px-6">
      <p className="text-3xl tracking-tight sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm leading-snug text-body">{label}</p>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-100 ${focusRing} ${
        on
          ? "border-ink bg-card text-ink"
          : "border-hairline-strong bg-card text-body hover:border-ink"
      }`}
    >
      <span
        aria-hidden
        className={`h-2.5 w-2.5 rounded-full transition-colors ${on ? "bg-primary" : "bg-hairline-strong"}`}
      />
      {label}
    </button>
  );
}
