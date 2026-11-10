# IR x Tech: redesign spec (2026-11-09 night)

Caleb, 7:48pm: "Bro its a fat wall of text it is nowhere near as cool as other sites we hv made - this needs to be cooler than all of them". Earlier: "INTENTIONAL ui/ux", "NO SLOP", "pull cards from everything weve ever made". Reader: an IR major who opens it from a text on her phone. No name on the page.

## Why v2 read as a wall

Every section had the same shape: heading, gray paragraph, list. Nothing happened on scroll except the quiz. 1,900+ visible words.

## The one object

A passport. IR is the study of borders, and a career move is a crossing. The quiz stamps the passport page by page. The result is a visa for her path. The map is where it can take her. The plan is the route.

## Moves taken from past sites

- Firm Foundation `Stamped`: a seal presses down the first time a line is seen, then holds still.
- Joshua Newton Baseball: content becomes an object from its world (prints dealt onto dirt, price as a ticket stub). Here: stats as departure-board rows, paths as visas, plan as a flight route.
- Joshua Newton Baseball `SmoothScroll`: lenis at lerp 0.12, off under reduced motion.

## Parts (each one screen, each builds on the last)

1. Departure (dark). The dotted world, full bleed, pins pulsing. One line: "Every tech company is a foreign policy company now." One small line under it. Real 2026 postings run along the bottom like a departures board. Leaves behind: the world, and the question of where she fits.
2. The case (dark, pinned). One giant number at a time, the digits counting as you scroll, one line, one source. Four numbers. Leaves behind: proof the jobs are real.
3. Your passport (paper). A navy passport opens. Seven questions, one per page. Each answer presses a stamp in that path's color. Leaves behind: a filled passport and a match.
4. Visas (paper). Five visa pages, her match on top with an APPROVED stamp. Each shows one line and three employers. Tap one to open the details. Leaves behind: a path and who hires for it.
5. Where they are (paper). The map comes back small, with 203 faith-driven orgs to search. Tap a pin to filter. Leaves behind: real orgs she can join.
6. Why it matters (dark). Jeremiah 29:7, large. One sentence. Leaves behind: the reason.
7. The route (paper). Six stops on a dotted flight path that draws as you scroll. Each stop is a few words. Closes where part 1 began: a link back up to the world.
8. Packing list (paper). Resources as compact rows.

## Numbers

- Visible words before opening anything: under 650.
- Body copy per part: under 30 words, except the passport questions.
- Display type: 72px+ on desktop, 44px+ on a phone.
- Accent (#f54e00) means "tap this" or "a pin". Stamps use the five path colors.

## Checks before done

375 and 1440 with no sideways scroll, no console errors, quiz played through, a pin tapped through to the directory, and reduced motion showing everything stamped and static.
