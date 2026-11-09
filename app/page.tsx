import Guide from "@/components/Guide";
import { baseline, plan, postings, resources, stats } from "@/lib/data";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const textLink = `underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-primary-active hover:decoration-primary ${focusRing}`;

const nav = [
  { href: "#numbers", label: "Numbers" },
  { href: "#quiz", label: "Quiz" },
  { href: "#paths", label: "Paths" },
  { href: "#plan", label: "Plan" },
  { href: "#resources", label: "Resources" },
];

export default function Home() {
  const tickerItems = [...postings, ...postings];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/90 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            className={`font-medium tracking-tight transition-colors hover:text-primary-active ${focusRing}`}
          >
            IR x Tech
          </a>
          <div className="hidden items-center gap-6 text-sm text-body sm:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`transition-colors hover:text-ink ${focusRing}`}
              >
                {n.label}
              </a>
            ))}
          </div>
          <a
            href="#quiz"
            className={`inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] sm:hidden ${focusRing}`}
          >
            Take the quiz
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 sm:pt-28">
          <h1 className="max-w-4xl text-[2.6rem] leading-[1.05] font-normal tracking-[-0.03em] sm:text-7xl">
            Tech companies are hiring people who study what you study.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-body">
            AI labs negotiate rules with governments. Defense startups sell to
            ministries in a dozen countries. Fintechs launch country by country
            under different regulators. All of it needs someone who understands
            how states, borders and conflict work. Here are five of those jobs,
            a quiz to find yours, and what to do this semester.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#quiz"
              className={`inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-medium text-white transition duration-100 hover:bg-primary-active active:scale-[0.97] ${focusRing}`}
            >
              Find your path
            </a>
            <a
              href="#numbers"
              className={`inline-flex min-h-12 items-center rounded-full border border-hairline-strong px-6 text-ink transition duration-100 hover:border-ink active:scale-[0.97] ${focusRing}`}
            >
              See the numbers
            </a>
          </div>
        </section>

        {/* Real postings ticker */}
        <section
          aria-label="Real 2026 job postings"
          className="ticker overflow-hidden border-y border-hairline bg-card py-4"
        >
          <p className="mx-auto mb-3 max-w-5xl px-4 font-mono text-xs text-muted sm:px-6">
            Real postings from 2026
          </p>
          <div className="ticker-track flex w-max gap-3">
            {tickerItems.map((p, i) => (
              <a
                key={`${p.href}-${i}`}
                href={p.href}
                target="_blank"
                rel="noopener"
                aria-hidden={i >= postings.length}
                tabIndex={i >= postings.length ? -1 : 0}
                className={`flex shrink-0 items-center gap-3 rounded-full border border-hairline bg-canvas px-4 py-2 text-sm transition-colors hover:border-ink ${focusRing}`}
              >
                <span className="text-ink">{p.title}</span>
                <span className="font-mono text-xs text-muted">
                  {p.company}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section
          id="numbers"
          className="mx-auto max-w-5xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28"
        >
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
            The numbers behind it
          </h2>
          <p className="mt-3 text-body">
            Tap any number to see where it came from.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <a
                key={s.value}
                href={s.href}
                target="_blank"
                rel="noopener"
                className={`group flex flex-col gap-3 bg-card p-6 transition-colors duration-100 hover:bg-canvas-soft sm:p-7 ${focusRing} focus-visible:-outline-offset-2`}
              >
                <span className="text-4xl tracking-tight sm:text-5xl">
                  {s.value}
                </span>
                <span className="leading-relaxed text-body">{s.label}</span>
                <span className="mt-auto pt-2 font-mono text-xs text-muted transition-colors group-hover:text-primary-active">
                  {s.source} &rarr;
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-body">
            {baseline.text}{" "}
            <a
              href={baseline.href}
              target="_blank"
              rel="noopener"
              className={textLink}
            >
              BLS
            </a>
          </p>
        </section>

        <Guide />

        {/* Plan */}
        <section
          id="plan"
          className="scroll-mt-16 border-t border-hairline bg-card"
        >
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
            <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
              What to do, in order
            </h2>
            <p className="mt-3 max-w-2xl text-body">
              This works for every path. Your path above adds the moves specific
              to it.
            </p>
            <ol className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {plan.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="font-mono text-sm text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">
                      {s.when}
                    </p>
                    <p className="mt-1 text-xl font-medium">{s.title}</p>
                    <p className="mt-2 leading-relaxed text-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16 border-t border-hairline pt-10">
              <h3 className="text-2xl font-normal tracking-tight">
                The honest part
              </h3>
              <ul className="mt-6 grid gap-4 leading-relaxed text-body md:grid-cols-3 md:gap-8">
                <li>
                  Many senior policy roles want years in government first.
                  Anduril&apos;s DC government relations roles ask for national
                  security experience on the Hill or in the executive branch,
                  and its Global Defense internship is for master&apos;s
                  students.{" "}
                  <a
                    href="https://jobs.luxcapital.com/companies/anduril/jobs/72450924-global-defense-intern"
                    target="_blank"
                    rel="noopener"
                    className={textLink}
                  >
                    Posting
                  </a>
                </li>
                <li>
                  The way in as an undergrad is usually a broader role:
                  operations, business development, trust and safety analyst, or
                  research at a think tank. You specialize once you&apos;re in.
                </li>
                <li>
                  Startups move fast and some fold. The upside is you own real
                  work in year one that would take five years to reach somewhere
                  bigger.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section
          id="resources"
          className="mx-auto max-w-5xl scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28"
        >
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
            Resources
          </h2>
          <p className="mt-3 text-body">
            Start with one newsletter and one job board. That&apos;s enough for
            week one.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {resources.map((g) => (
              <div key={g.title}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
                  {g.title}
                </h3>
                <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                  {g.items.map((r) => (
                    <li key={r.name}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener"
                        className={`group flex items-start justify-between gap-4 py-4 transition-colors ${focusRing}`}
                      >
                        <span>
                          <span className="block font-medium text-ink transition-colors group-hover:text-primary-active">
                            {r.name}
                          </span>
                          <span className="mt-1 block text-sm text-body">
                            {r.note}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="mt-0.5 text-muted transition-transform duration-100 group-hover:translate-x-0.5 group-hover:text-primary-active"
                        >
                          &rarr;
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-10 text-sm text-body sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Made by a friend who thinks you&apos;d be great at this.</p>
          <p className="text-muted">
            Checked November 2026. Postings change, so confirm on each
            company&apos;s careers page.
          </p>
        </div>
      </footer>
    </>
  );
}
