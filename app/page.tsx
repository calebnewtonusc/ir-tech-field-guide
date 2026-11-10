import DidItFirst from "@/components/DidItFirst";
import Directory from "@/components/Directory";
import Courses from "@/components/Courses";
import Doors from "@/components/Doors";
import Guide from "@/components/Guide";
import Route from "@/components/Route";
import { SmoothScroll } from "@/components/SmoothScroll";
import StoryMap from "@/components/StoryMap";
import Pack from "@/components/Pack";
import { postings } from "@/lib/data";

// One story in eight parts (SPEC.md): departure, the case, the passport, the visas,
// where they are, why it matters, the route, the packing list.

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const nav = [
  { href: "#quiz", label: "Passport" },
  { href: "#visas", label: "Visas" },
  { href: "#faith", label: "Faith" },
  { href: "#classes", label: "Classes" },
  { href: "#doors", label: "Doors" },
  { href: "#orgs", label: "Orgs" },
  { href: "#route", label: "Route" },
];

export default function Home() {
  const board = [...postings, ...postings];

  return (
    <>
      <SmoothScroll />
      <header className="fixed inset-x-0 top-0 z-30 bg-night/80 text-on-night backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            className={`font-mono text-sm tracking-[0.2em] transition-colors hover:text-primary ${focusRing}`}
          >
            IR &times; TECH
          </a>
          <div className="hidden items-center gap-7 text-sm text-on-ink-muted sm:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`transition-colors hover:text-on-night ${focusRing}`}
              >
                {n.label}
              </a>
            ))}
          </div>
          <a
            href="#quiz"
            className={`inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] sm:hidden ${focusRing}`}
          >
            Get stamped
          </a>
        </nav>
      </header>

      <main id="top">
        {/* 1. Departure: the story map */}
        <StoryMap />
        <div className="ticker overflow-hidden border-y border-white/10 bg-night py-4" aria-label="Real job postings from 2026">
          <div className="ticker-track flex w-max gap-10">
            {board.map((p, i) => (
              <a
                key={`${p.href}-${i}`}
                href={p.href}
                target="_blank"
                rel="noopener"
                aria-hidden={i >= postings.length}
                tabIndex={i >= postings.length ? -1 : 0}
                className={`flex shrink-0 items-baseline gap-3 font-mono text-sm transition-colors hover:text-primary ${focusRing}`}
              >
                <span className="text-[11px] tracking-[0.2em] text-primary">NOW HIRING</span>
                <span className="text-on-night">{p.title}</span>
                <span className="text-on-ink-muted">{p.company}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 3 + 4. Passport and visas */}
        <Guide />

        {/* 6. They did it first */}
        <DidItFirst />

        {/* Classes at USC */}
        <Courses />

        {/* Open doors */}
        <Doors />

        {/* 5. Where they are */}
        <Directory />

        {/* 7. The route */}
        <Route />

        {/* 8. Packing list, then the last moment */}
        <Pack />
      </main>

      <footer className="bg-night text-on-ink-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-on-night">
            Made by a friend who thinks you&apos;d be great at this.
          </p>
          <p>
            Checked November 2026. Postings change, so confirm on each careers
            page.
          </p>
        </div>
      </footer>
    </>
  );
}
