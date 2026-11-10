"""Build lib/courses.json: hand-picked USC classes for an IR major, from the live schedule of classes.


Data: classes.usc.edu/api/Courses/CoursesByTermSchoolProgram for Fall 2026 (20263) and Spring 2027 (20271),
saved in research/soc/. Every title, unit count, term, day, time and seat count below is read from that data;
only the picks and the one-line "why" are ours.
"""
import glob, json, pathlib, re

# USC's schedule moved to /term/<code>/catalogue/school/<school>/program/<prefix>; the old
# /term-<code>/classes/<prefix>/ links landed on the "pick a semester" home page (checked 2026-11-10).
SCHOOL = {"ACAD": "ACAD", "MUSC": "MUS", "MPGU": "MUS", "THTR": "THTR"}
def href(code, terms):
    pre = code.split()[0]
    term = "20271" if "Spring" in terms else "20263"
    return f"https://classes.usc.edu/term/{term}/catalogue/school/{SCHOOL.get(pre, 'DRNS')}/program/{pre}"

R = pathlib.Path(__file__).parent
SEASON = {"20263": "Fall", "20271": "Spring"}

catalog = {}
for f in sorted(glob.glob(str(R / "soc" / "*.json"))):
    term = pathlib.Path(f).name[:5]
    try:
        courses = json.load(open(f))["courses"]
    except Exception:
        continue
    for c in courses:
        code = c["fullCourseName"].strip()
        e = catalog.setdefault(code, {"code": code, "title": (c.get("name") or "").strip(), "terms": [], "units": 0, "desc": "", "spring": None})
        if SEASON[term] not in e["terms"]:
            e["terms"].append(SEASON[term])
        units = [float(u) for s in (c.get("sections") or []) for u in (s.get("units") or []) if re.fullmatch(r"\d+(\.\d+)?", str(u))]
        if units:
            e["units"] = max(e["units"], max(units))
        e["desc"] = e["desc"] or re.sub(r"\s+", " ", c.get("description") or "").strip()
        if term == "20271":
            secs = [s for s in (c.get("sections") or []) if not s.get("isCancelled") and (s.get("rnrMode") or "").lower() in ("lecture", "lecture-lab", "lecture-discussion", "seminar", "studio", "laboratory", "")]
            open_seats = sum(max(0, (s.get("totalSeats") or 0) - (s.get("registeredSeats") or 0)) for s in (c.get("sections") or []) if not s.get("isCancelled"))
            first = next((s for s in secs if s.get("schedule")), None)
            when = None
            if first:
                sc = first["schedule"][0]
                when = f'{"/".join(sc.get("days") or [])} {sc.get("startTime","")}-{sc.get("endTime","")}'.strip()
            e["spring"] = {"openSeats": open_seats, "sections": len(c.get("sections") or []), "when": when}

def short(t, n=150):
    t = re.sub(r"\s+", " ", t).strip()
    return t if len(t) <= n else t[:n].rsplit(" ", 1)[0].rstrip(",.;:") + "..."

PICKS = {
    "policy": [
        ("IR 303", "How diplomacy actually gets done, from people who led."),
        ("IR 306", "The UN, WTO and the rest: who really sets the rules."),
        ("IR 343", "The decisions that built the world tech companies sell into."),
        ("POSC 438", "The class version of a DC internship."),
        ("POSC 345", "The legal language every policy team speaks."),
    ],
    "defense": [
        ("IR 381", "The front door to the whole defense world."),
        ("IR 304", "How intelligence turns into decisions."),
        ("IR 386", "Threats defense startups are built to stop."),
        ("IR 342", "Deterrence, the oldest strategy problem there is."),
        ("IR 384", "Taiwan, the Koreas, the South China Sea."),
    ],
    "trust": [
        ("IR 320", "Literally this website's thesis, as a class."),
        ("PHIL 349", "The ethics questions trust and safety teams argue about daily."),
        ("POSC 248", "The rights platforms decide whether to protect."),
        ("POSC 437", "How information shapes politics, and who controls it."),
        ("IR 397", "Human rights research in the field."),
    ],
    "expansion": [
        ("IR 213", "How money and goods move across borders."),
        ("IR 330", "Why some markets open and others close."),
        ("ECON 451", "Trade fights, tariffs and who wins them."),
        ("IR 364", "A region fintechs are racing into."),
        ("EALC 412B", "Do business in Chinese, not just about China."),
    ],
    "risk": [
        ("IR 412", "Data science for IR, two units, no CS major needed."),
        ("IR 413", "Part two: build real analysis from world data."),
        ("SSCI 202", "Read satellites and maps the way analysts do."),
        ("SSCI 420", "Geospatial intelligence on real human security problems."),
        ("ECON 361", "How crises start, spread and end."),
    ],
}
TOOLKIT = [
    ("ACAD 191", "Python for people who don't code yet. Two units, in IYA."),
    ("ACAD 222", "How AI actually works, taught in IYA."),
    ("ACAD 280", "Make data and ideas look clear at a glance."),
    ("ACAD 174", "Two units of hearing from founders and innovators."),
    ("ACAD 406", "Two units building a venture that does good, in IYA."),
    ("ECON 333", "Innovation economics through beer, AI and video games."),
]
FUN = [
    ("PHED 140A", "Tennis."),
    ("PHED 115", "Surfing, for a grade."),
    ("PHED 135", "Backpacking, with real trips."),
    ("PHED 126", "AcroYoga."),
    ("PHED 148A", "Archery."),
    ("PHED 144", "Pickleball."),
    ("PHED 138", "Beach volleyball."),
    ("PHED 118", "A class on sleeping better. Truly."),
    ("MPGU 120B", "Guitar, the sequel."),
    ("MPGU 126", "Beatles songs on fingerstyle guitar."),
    ("SLL 199", "Chess and critical thinking."),
    ("EALC 102", "Chinese calligraphy."),
    ("THTR 122", "Improv and theatre games."),
    ("THTR 318", "Make a podcast people actually listen to."),
    ("THTR 290", "Medical clowning, for hospital patients."),
    ("MUSC 255", "Write your own songs."),
    ("CORE 200", "A reading salon, two units."),
    ("PHIL 122A", "Learn to win arguments, fairly."),
]

def pick(code, why):
    c = catalog.get(code)
    if not c:
        print("MISSING", code)
        return None
    return {**c, "desc": short(c["desc"]), "why": why, "units": c["units"] or None,
            "href": href(code, c['terms'])}

out = {
    "paths": {k: [p for p in (pick(*x) for x in v) if p] for k, v in PICKS.items()},
    "toolkit": [p for p in (pick(*x) for x in TOOLKIT) if p],
    "fun": [p for p in (pick(*x) for x in FUN) if p],
    "funCount": sum(1 for c in catalog.values() if c["units"] and c["units"] <= 2 and re.match(r"(PHED|MPGU|THTR|MUSC|SLL|EALC|PHIL|CORE|ACAD)\s1|2", c["code"])),
}
json.dump(out, open(R.parent / "lib" / "courses.json", "w"), indent=1, ensure_ascii=False)
print({k: len(v) for k, v in out["paths"].items()}, "toolkit", len(out["toolkit"]), "fun", len(out["fun"]))
print([ (f["code"], f["units"], f["terms"], f["spring"]) for f in out["fun"][:4]])
