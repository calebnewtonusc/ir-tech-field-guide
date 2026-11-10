"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import mapData from "@/lib/map.json";

type Pin = {
  location: string;
  locations: string[];
  label: string;
  country: string;
  x: number;
  y: number;
  abroad: boolean;
  orgs: string[];
};

const map = mapData as {
  width: number;
  height: number;
  dots: [number, number][];
  pins: Pin[];
  countries: string[];
};

export const PLACE_EVENT = "orgs:place";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function WorldMap({ tone = "light" }: { tone?: "light" | "dark" }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Pin | null>(null);
  // Hover opens a card and leaving the dot closes it. A short grace lets the pointer cross
  // from the dot onto the card without it vanishing. Tap and keyboard keep it open.
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActive(null), 220);
  };

  // One path of zero-length segments with round caps draws 4,674 dots in a single DOM node.
  const landPath = useMemo(
    () => map.dots.map(([x, y]) => `M${x} ${y}h0`).join(""),
    [],
  );
  const placed = useMemo(
    () => map.pins.reduce((n, p) => n + p.orgs.length, 0),
    [],
  );

  function seeInDirectory(pin: Pin) {
    window.dispatchEvent(
      new CustomEvent(PLACE_EVENT, {
        detail: { locations: pin.locations, label: pin.label },
      }),
    );
    document
      .getElementById("orgs")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  const tipLeft = active
    ? Math.min(Math.max((active.x / map.width) * 100, 18), 82)
    : 50;
  const tipAbove = active ? active.y / map.height > 0.45 : false;

  return (
    <figure className="relative">
      <div className="relative">
        <svg
          viewBox={`0 0 ${map.width} ${map.height}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Map of where ${placed} faith-driven orgs are based, across ${map.countries.length} countries`}
        >
          <path
            d={landPath}
            stroke={tone === "dark" ? "var(--color-night-dot)" : "var(--color-hairline-strong)"}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
          {[...map.pins].reverse().map((p, i) => {
            const r = Math.min(3 + Math.sqrt(p.orgs.length) * 1.6, 9);
            const isActive = active?.location === p.location;
            return (
              <g key={p.location}>
                {p.abroad && !reduce && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={1.2}
                    className="pin-pulse"
                    style={{ animationDelay: `${(i % 7) * 0.5}s` }}
                  />
                )}
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={isActive ? (tone === "dark" ? "var(--color-on-night)" : "var(--color-ink)") : "var(--color-primary)"}
                  initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: reduce ? 0 : 0.2 + Math.min(i * 0.003, 0.35) /* siblings arriving together, not a chain: 112 pins x 3ms capped at 350ms keeps the whole cascade under the 400ms stagger ceiling */,
                  }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                />
                {/* Invisible hit area, at least 24px on a phone-width map */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.label}: ${p.orgs.length} ${p.orgs.length === 1 ? "org" : "orgs"}`}
                  className="map-hit cursor-pointer"
                  onMouseEnter={() => {
                    cancelClose();
                    setActive(p);
                  }}
                  onMouseLeave={closeSoon}
                  onFocus={() => setActive(p)}
                  onClick={() => setActive(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      seeInDirectory(p);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>

        {active && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={closeSoon}
            /* Phone: the card sits under the map at full width (a floating 256px card clipped off the left edge at 390px).
               sm and up: it floats beside the dot, positioned through CSS variables. */
            className={`relative z-10 mt-4 w-full rounded-lg border border-hairline bg-card p-4 shadow-[0_8px_30px_rgba(38,37,30,0.12)] sm:absolute sm:mt-0 sm:w-64 sm:-translate-x-1/2 sm:left-[var(--tip-left)] sm:top-[var(--tip-top)] ${
              tipAbove ? "sm:-translate-y-full" : ""
            }`}
            style={
              {
                "--tip-left": `${tipLeft}%`,
                "--tip-top": `calc(${(active.y / map.height) * 100}% ${tipAbove ? "- 16px" : "+ 16px"})`,
              } as React.CSSProperties
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{active.label}</p>
                <p className="font-mono text-xs text-muted">{active.country}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className={`-mt-1 -mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink ${focusRing}`}
              >
                &times;
              </button>
            </div>
            <ul className="mt-3 grid gap-1 text-sm text-body">
              {active.orgs.slice(0, 4).map((n) => (
                <li key={n} className="truncate">
                  {n}
                </li>
              ))}
              {active.orgs.length > 4 && (
                <li className="text-muted">+{active.orgs.length - 4} more</li>
              )}
            </ul>
            <button
              type="button"
              onClick={() => seeInDirectory(active)}
              className={`mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] ${focusRing}`}
            >
              See {active.orgs.length === 1 ? "it" : "them"} in the directory
            </button>
          </div>
        )}
      </div>
      <figcaption className={`mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs ${tone === "dark" ? "text-on-ink-muted" : "text-muted"}`}>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-primary" />
          {placed} faith-driven orgs, where each is based
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full border border-primary"
          />
          pulsing: based outside the US
        </span>
        <span>Tap a dot</span>
      </figcaption>
    </figure>
  );
}
