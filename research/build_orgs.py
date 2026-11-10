"""Build lib/orgs.json from the scraped Praxis board, the Bay Area Center directory and FaithTech Create.

Sources, read 2026-11-09:
- research/companies.json, jobs.json, ranked.csv: Getro API behind jobs.praxis.co (scrape.py, rank.py)
- research/fwt-directory-parsed.json: faithworktech.org/faith-and-work-directory, rendered, approved entries only.
  Contact names, emails and phones are dropped on purpose: this page is public.
- FaithTech Create stories: faithtech.com/create
"""
import csv, json, pathlib, re

R = pathlib.Path(__file__).parent
companies = json.load(open(R / "companies.json"))
jobs = json.load(open(R / "jobs.json"))
sector = {r["name"]: r["sector"] for r in csv.DictReader(open(R / "ranked.csv"))}

# Countries an org says it works in, read from its own description (where the work happens, not just HQ).
WORK_COUNTRIES = ["Uganda", "Kenya", "India", "Haiti", "Guatemala", "Cambodia", "Thailand", "Philippines", "Nepal", "Rwanda",
    "Ethiopia", "Ghana", "Nigeria", "Mexico", "Honduras", "Ukraine", "Bangladesh", "Peru", "Bolivia", "Colombia", "Brazil",
    "Zambia", "Malawi", "Tanzania", "South Africa", "Liberia", "Lebanon", "Jordan", "Indonesia", "Ecuador", "Burundi"]

GLOBAL = re.compile(
    r"\b(international|global|globally|worldwide|countries|nations|refugee|migrant|immigra|trafficking|africa|asia|latin america|"
    r"uganda|kenya|india|haiti|nepal|cambodia|thailand|philippines|guatemala|mexico|ukraine|middle east|developing world|"
    r"emerging markets|policy|government|justice|diaspora|cross-cultural)\b",
    re.I,
)

def short(text, n=220):
    t = re.sub(r"\s+", " ", (text or "")).strip()
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(" ", 1)[0].rstrip(",.;:")
    return cut + "..."

jobs_by_company = {}
for j in jobs:
    c = (j.get("organization") or {}).get("name")
    if c:
        jobs_by_company[c] = jobs_by_company.get(c, 0) + 1

orgs = []
for c in companies:
    if c["name"] == "Praxis":
        continue
    locs = [l for l in (c.get("locations") or []) if isinstance(l, str)]
    abroad = any(not re.search(r"USA|United States", l) for l in locs)
    desc = c.get("description") or ""
    sec = sector.get(c["name"], "Other")
    # Getro location lists are noisy: same-name US towns ("Lancaster, WI"), "Remote", territories.
    # Keep the first US location and every real place outside the US.
    us_first = [l for l in locs if re.search(r"USA|United States", l)][:1]
    abroad_locs = [l for l in locs if not re.search(r"USA|United States|usa|Remote|North America|Minor Outlying", l)]
    locs_clean = us_first + abroad_locs
    named = [w for w in WORK_COUNTRIES if re.search(rf"\b{w}\b", desc)]
    places = list(dict.fromkeys(locs_clean + named))
    orgs.append({
        "name": c["name"],
        "source": "praxis",
        "places": places,
        "href": f"https://{c['domain']}" if c.get("domain") else f"https://jobs.praxis.co/companies/{c['slug']}",
        "jobsHref": f"https://jobs.praxis.co/companies/{c['slug']}",
        "openRoles": jobs_by_company.get(c["name"], c.get("active_jobs_count") or 0),
        "description": short(desc),
        "location": locs[0] if locs else "",
        "sector": sec,
        "global": bool(abroad or GLOBAL.search(desc) or sec in ("Justice & anti-trafficking", "Economic development & livelihoods")),
    })

for o in json.load(open(R / "fwt-directory-parsed.json")):
    orgs.append({
        "name": o["name"], "source": "bayarea", "href": o["href"], "jobsHref": "", "openRoles": 0,
        "description": short(o["description"]), "location": "Bay Area" if "Bay" in o["tags"] else "National",
        "places": ["Bay Area"] if "Bay" in o["tags"] else [],
        "sector": "Faith and work", "global": bool(GLOBAL.search(o["description"]) or "Missions" in o["tags"]),
    })

create = [
    ("ShareBibles", "Waterloo", "App that tracks the distribution of Bibles worldwide, built by FaithTech volunteers.", True),
    ("Faith Network app", "Chennai", "A community app for believers in Chennai, built through FaithTech Create.", True),
    ("Ending Human Trafficking at the Point of Demand", "Vancouver", "A Create project going after trafficking by reaching the buyers.", True),
    ("Aviation charity app", "Waterloo", "Four volunteers built an app for a mission aviation charity.", True),
    ("Savok x FaithTech", "Bangkok", "Christian mentoring made accessible for everyone.", True),
]
for name, city, desc, g in create:
    orgs.append({"name": name, "source": "faithtech", "places": [city], "href": "https://faithtech.com/create", "jobsHref": "", "openRoles": 0,
                 "description": desc, "location": city, "sector": "FaithTech Create project", "global": g})

# Faith-driven orgs based outside the US (Caleb, 11/9: "why are there SOOOO many companies in the us").
# HQ cities: Tearfund from the UK Charity Commission register; IJM field offices named on ijm.org/fieldpartner
# and its annual report (Ghana, Philippines, India, Guatemala, Indonesia, Bangladesh, Poland); the rest from
# each org's own site.
INTERNATIONAL = [
    ("Tearfund", "https://www.tearfund.org", "Christian relief and development agency working through local churches in poor communities.", ["Teddington, UK"], "Economic development & livelihoods"),
    ("Medair", "https://www.medair.org", "Christian humanitarian group bringing emergency relief to people in crisis zones.", ["Ecublens, Switzerland"], "Health & clinical"),
    ("Open Doors International", "https://www.opendoors.org", "Supports Christians persecuted for their faith in more than 70 countries.", ["Ermelo, Netherlands"], "Justice & anti-trafficking"),
    ("IFES", "https://ifesworld.org", "A global movement of Christian university students in over 180 countries.", ["Oxford, UK"], "Education"),
    ("Christian Aid", "https://www.christianaid.org.uk", "Fights poverty and injustice with partners in dozens of countries.", ["London, UK"], "Economic development & livelihoods"),
    ("Langham Partnership", "https://langham.org", "Trains pastors and scholars across the Majority World.", ["London, UK"], "Education"),
    ("A Rocha International", "https://arocha.org", "Christian conservation projects on six continents.", ["London, UK"], "Science & industry"),
    ("L'Abri Fellowship", "https://labri.org", "A study community in the Swiss Alps where people bring their honest questions about faith.", ["Huémoz, Switzerland"], "Education"),
    ("Glorify", "https://glorify-app.com", "A London startup building a daily prayer and worship app.", ["London, UK"], "Consumer & marketplace"),
    ("International Justice Mission", "https://www.ijm.org", "Partners with local justice systems to stop violence against people in poverty.",
     ["Accra, Ghana", "Manila, Philippines", "Chennai, India", "Guatemala City, Guatemala", "Jakarta, Indonesia", "Dhaka, Bangladesh", "Warsaw, Poland"], "Justice & anti-trafficking"),
]
for name, href, desc, places, sec in INTERNATIONAL:
    orgs.append({"name": name, "source": "global", "places": places, "href": href, "jobsHref": "", "openRoles": 0,
                 "description": desc, "location": places[0] if len(places) == 1 else f"{len(places)} field offices", "sector": sec, "global": True})

orgs.sort(key=lambda o: (not o["global"], -o["openRoles"], o["name"].lower()))
out = pathlib.Path(__file__).parent.parent / "lib" / "orgs.json"
json.dump(orgs, open(out, "w"), indent=1, ensure_ascii=False)
from collections import Counter
print(len(orgs), Counter(o["source"] for o in orgs), "global", sum(o["global"] for o in orgs), "roles", sum(o["openRoles"] for o in orgs))
