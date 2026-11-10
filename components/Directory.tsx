"use client";

import { useEffect, useMemo, useState } from "react";
import WorldMap, { PLACE_EVENT } from "@/components/WorldMap";
import orgsData from "@/lib/orgs.json";
import type { PathId } from "@/lib/data";

type Org = {
  name: string;
  source: "praxis" | "bayarea" | "faithtech" | "global";
  places?: string[];
  href: string;
  jobsHref: string;
  openRoles: number;
  description: string;
  location: string;
  sector: string;
  global: boolean;
  logo?: string;
  paths?: PathId[]; // research/tag_paths.py
};

const orgs = orgsData as Org[];

const sources = [
  { id: "all", label: "All" },
  { id: "praxis", label: "Praxis portfolio" },
  { id: "bayarea", label: "Bay Area Center network" },
  { id: "faithtech", label: "FaithTech projects" },
  { id: "global", label: "Based abroad" },
] as const;

const sourceLabel: Record<Org["source"], string> = {
  praxis: "Praxis",
  bayarea: "Bay Area Center",
  faithtech: "FaithTech",
  global: "Global",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const PAGE = 12;

// One tint per sector so a page of cards reads as different kinds of work at a glance.
const SECTOR_TINT: Record<string, string> = {
  "Health & clinical": "bg-[#e3f0e6] text-[#2f6b40]",
  Education: "bg-[#e4ecf8] text-[#33558f]",
  "Consumer & marketplace": "bg-[#fbe6d8] text-[#9a4a1c]",
  "Justice & anti-trafficking": "bg-[#f6e0e3] text-[#9b2f45]",
  "Media & culture": "bg-[#efe4f6] text-[#6a3f8f]",
  "Capital & venture": "bg-[#f4ecd2] text-[#7c6417]",
  "Science & industry": "bg-[#e0eef0] text-[#26666e]",
  "Economic development & livelihoods": "bg-[#f1ead9] text-[#7a5a1f]",
  "Autism & disability": "bg-[#e7e9f8] text-[#454fa0]",
  "Attention & digital health": "bg-[#e8f3ec] text-[#2f6f52]",
  "Faith & church": "bg-[#f3e7da] text-[#8a5320]",
  "Software & B2B": "bg-[#e4eaf0] text-[#3c5468]",
  "Faith and work": "bg-[#f3e7da] text-[#8a5320]",
  "FaithTech Create project": "bg-[#fde6da] text-[#a8410f]",
};
const tintFor = (sector: string) => SECTOR_TINT[sector] ?? "bg-canvas text-body";

// The first cards she sees should look like IR work: global and justice orgs first, then faith and work.
// Plain file order put a UK disability nonprofit and a hypersonics company on top (seen 2026-11-10).
const FIT_SECTORS = ["Justice & anti-trafficking", "Economic development & livelihoods", "Faith and work", "Media & culture"];
const fit = (o: { global?: boolean; sector: string }) =>
  (o.global ? 4 : 0) + (FIT_SECTORS.includes(o.sector) ? 4 - FIT_SECTORS.indexOf(o.sector) * 0.5 : 0);

export default function Directory() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<(typeof sources)[number]["id"]>("all");
  const [globalOnly, setGlobalOnly] = useState(false);
  const [hiringOnly, setHiringOnly] = useState(false);
  // After the quiz, a "fits your path" filter, but only for paths with at least 4 honest matches.
  const [mine, setMine] = useState<PathId | null>(null);
  const [pathOnly, setPathOnly] = useState(false);
  const mineCount = mine ? orgs.filter((o) => o.paths?.includes(mine)).length : 0;
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<PathId>).detail;
      setMine(id);
      setPathOnly(orgs.filter((o) => o.paths?.includes(id)).length >= 4);
    };
    window.addEventListener("path:match", on);
    return () => window.removeEventListener("path:match", on);
  }, []);
  const [shown, setShown] = useState(PAGE);
  const [place, setPlace] = useState<{ locations: string[]; label: string } | null>(null);

  useEffect(() => {
    function onPlace(e: Event) {
      const detail = (e as CustomEvent<{ locations: string[]; label: string }>).detail;
      setPlace(detail);
      setQuery("");
      setSource("all");
      setGlobalOnly(false);
      setHiringOnly(false);
      setPathOnly(false);
      setShown(PAGE);
    }
    window.addEventListener(PLACE_EVENT, onPlace);
    return () => window.removeEventListener(PLACE_EVENT, onPlace);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter(
      (o) =>
        (!place || place.locations.some((l) => (o.places ?? [o.location]).includes(l))) &&
        (source === "all" || o.source === source) &&
        (!globalOnly || o.global) &&
        (!pathOnly || (!!mine && !!o.paths?.includes(mine))) &&
        (!hiringOnly || o.openRoles > 0) &&
        (!q ||
          `${o.name} ${o.description} ${o.sector} ${o.location}`
            .toLowerCase()
            .includes(q)),
    ).sort((a, b) => fit(b) - fit(a));
  }, [query, source, globalOnly, hiringOnly, place, pathOnly, mine]);

  const counts = useMemo(
    () => ({
      all: orgs.length,
      praxis: orgs.filter((o) => o.source === "praxis").length,
      bayarea: orgs.filter((o) => o.source === "bayarea").length,
      faithtech: orgs.filter((o) => o.source === "faithtech").length,
      global: orgs.filter((o) => o.source === "global").length,
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
    <section id="orgs" className="scroll-mt-14 border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.03em]">
          {orgs.length} companies and nonprofits started by people of faith.
        </h2>
        <p className="mt-4 max-w-2xl text-body">
          Every venture on the{" "}
          <a href="https://jobs.praxis.co/companies" target="_blank" rel="noopener" className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}>
            Praxis
          </a>{" "}
          board, the{" "}
          <a href="https://faithworktech.org/faith-and-work-directory" target="_blank" rel="noopener" className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}>
            Bay Area Center for Faith, Work &amp; Tech
          </a>{" "}
          network and{" "}
          <a href="https://faithtech.com/create" target="_blank" rel="noopener" className={`underline decoration-hairline-strong underline-offset-4 hover:text-primary-active ${focusRing}`}>
            FaithTech
          </a>
          , plus {counts.global} faith groups based outside the US, pinned everywhere they work.
        </p>

        <div className="mt-10 rounded-2xl bg-night p-4 sm:p-8">
          <WorldMap tone="dark" />
        </div>

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
            {mine && mineCount >= 4 && (
              <Toggle
                on={pathOnly}
                onClick={() => reset(setPathOnly)(!pathOnly)}
                label={`Fits your path (${mineCount})`}
              />
            )}
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
            {place && (
              <button
                type="button"
                onClick={() => setPlace(null)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-ink bg-ink px-4 text-sm text-canvas transition-colors hover:bg-body ${focusRing}`}
              >
                Based in {place.label} <span aria-hidden>&times;</span>
                <span className="sr-only">Remove place filter</span>
              </button>
            )}
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
                setPathOnly(false);
                setHiringOnly(false);
                setPlace(null);
                setShown(PAGE);
              }}
              className={`mt-3 min-h-10 text-sm text-primary-active underline underline-offset-4 hover:text-ink ${focusRing}`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, shown).map((o) => (
              <li
                key={`${o.source}-${o.name}`}
                className="group relative flex flex-col rounded-xl border border-hairline bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_30px_-18px_rgba(38,37,30,0.35)]"
              >
                <div className="flex items-start gap-4">
                  <Logo org={o} />
                  <div className="min-w-0 flex-1">
                    <a
                      href={o.href}
                      target="_blank"
                      rel="noopener"
                      className={`block font-medium leading-snug text-ink after:absolute after:inset-0 after:rounded-xl after:content-[''] ${focusRing}`}
                    >
                      {o.name}
                    </a>
                    <p className="mt-1 truncate font-mono text-[11px] text-muted">{o.location || "Online"}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-body">{o.description}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${tintFor(o.sector)}`}>{o.sector === "Other" ? sourceLabel[o.source] : o.sector}</span>
                  {o.openRoles > 0 && (
                    <a
                      href={o.jobsHref}
                      target="_blank"
                      rel="noopener"
                      className={`relative z-10 inline-flex min-h-10 items-center rounded-full bg-ink px-3.5 text-xs font-medium text-canvas transition-colors hover:bg-primary ${focusRing}`}
                    >
                      {o.openRoles} hiring &rarr;
                    </a>
                  )}
                </div>
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

function Logo({ org }: { org: Org }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-hairline bg-white">
      {org.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={org.logo} alt="" loading="lazy" className="size-full object-contain p-1.5" />
      ) : (
        <span className="text-lg font-medium text-muted">{org.name.charAt(0)}</span>
      )}
    </span>
  );
}
