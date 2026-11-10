#!/usr/bin/env python3
"""Group and rank the Praxis portfolio against Caleb's constraints in
second-brain/domains/mission.md. Reads data/*.json, writes SECTORS.md,
SHORTLIST.md and data/ranked.csv. Deterministic, no network."""
import json, csv, math, collections, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
C = json.loads((ROOT/"data/companies.json").read_text())
J = json.loads((ROOT/"data/jobs.json").read_text())

# DATA QUALITY: NeuroNav's Getro "career_page" crawl points at a Pear VC talent
# collective, not NeuroNav's own jobs. 66 of its 102 listings are branded with
# other companies (Optexity, Blueberry, Gryps, Takt, Pear VC...) and the rest are
# SF/NY "Founding Engineer"-type roles inconsistent with a UK developmental-
# disability services org. All 102 are excluded from the ranking and written to
# BONUS-NON-PRAXIS.md instead. Verified 2026-09-15.
CONTAMINATED = {"NeuroNav"}

jobs_by_org = collections.defaultdict(list)
for j in J:
    org = (j.get("organization") or {}).get("name")
    if org in CONTAMINATED:
        continue
    jobs_by_org[org].append(j)

def blob(x):
    return (x["name"]+" "+x["description"]+" "+" ".join(x.get("industry_tags") or [])).lower()

# Sectors in priority order. First match wins, so the most specific
# and most mission-relevant categories are listed first.
SECTORS = [
 ("Autism & disability", 40,
  ["autis","developmental disab","disabilit","special needs","neurodiver"]),
 ("Attention & digital health", 38,
  ["screen time","screens","digital wellness","digital health so","captivated by life"]),
 ("Health & clinical", 30,
  ["health care","healthcare","clinical","hospital","patient","medicine","biotech",
   "mental health","caregiv","nursing","therapy","medical"]),
 ("Capital & venture", 26,
  ["venture capital","investor","investment fund","impact investing","private equity",
   "venture fund","capital to"]),
 ("Education", 22,
  ["education","school","student","teacher","curriculum","tutor","classroom","literacy"]),
 ("Justice & anti-trafficking", 20,
  ["trafficking","justice","refugee","incarcerat","foster care","legal aid","slavery"]),
 ("Economic development & livelihoods", 18,
  ["poverty","livelihood","artisan","smallholder","farmer","microfinance",
   "job training","workforce","economic opportunit","underbanked"]),
 ("Consumer & marketplace", 16,
  ["marketplace","e-commerce","consumer","retail","apparel","food","restaurant","hospitality"]),
 ("Media & culture", 12,
  ["media","film","music","publishing","storytelling","game","art ","journalism"]),
 ("Faith & church", 12,
  ["church","ministry","discipleship","gospel","bible","congregation","pastor"]),
 ("Science & industry", 14,
  ["aerospace","manufacturing","engineering","energy","water","agriculture","hardware"]),
 ("Software & B2B", 6,
  ["saas","b2b software","crm","enterprise software","developer tool"]),
]

# Roles that match what mission.md says he wants (operator/GTM seats),
# as opposed to the SWE and design identities he has ruled out.
ROLE_KW = ["growth","gtm","go-to-market","marketing","operations","business development",
           "partnership","community","strategy","chief of staff","associate","analyst",
           "program","development","fundraising","impact"]

rows = []
for x in C:
    b = blob(x)
    sector, mfit = "Other", 8
    for label, score, kws in SECTORS:
        if any(k in b for k in kws):
            sector, mfit = label, score
            break
    oj = jobs_by_org.get(x["name"], [])
    n = len(oj)
    # hiring signal, log-scaled so one 100-role org does not swamp the list
    hire = 0 if n == 0 else min(30, 10 + 10*math.log10(n+1))
    junior = [j for j in oj if (j.get("seniority") or "") in ("entry_level","internship","associate")]
    role = (12 if junior else 0) + (8 if any(
        any(k in (j.get("title") or "").lower() for k in ROLE_KW) for j in oj) else 0)
    # head_count is an ordinal size band (1..5), NOT an employee count.
    # Smaller band = a cold message is more likely to reach a decision maker.
    band = x.get("head_count") or 3
    reach = max(0, 10 - 2*(band-1))
    rows.append(dict(
        name=x["name"], sector=sector, score=round(mfit+hire+role+reach,1),
        mission_fit=mfit, open_jobs=n, junior_jobs=len(junior),
        stage=x.get("stage") or "", size_band=band,
        location=(x.get("locations") or [""])[0], domain=x["domain"],
        board=f"https://jobs.praxis.co/companies/{x['slug']}",
        description=" ".join(x["description"].split())[:400]))

rows.sort(key=lambda r: (-r["score"], r["name"]))

with open(ROOT/"data/ranked.csv","w",newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)

by_sector = collections.defaultdict(list)
for r in rows: by_sector[r["sector"]].append(r)

order = [s[0] for s in SECTORS] + ["Other"]
with open(ROOT/"SECTORS.md","w") as f:
    f.write("# All 180 Praxis portfolio companies, grouped\n\n")
    f.write(f"Scraped {len(C)} companies and {len(J)} open roles from the Praxis job "
            "board (Getro network 130) on 2026-09-15. Sorted within each group by "
            "score. See [README.md](README.md) for what the score means.\n\n")
    f.write("`size` is Getro's ordinal size band (1 smallest, 5 largest). "
            "**It is not an employee count** and is not reported as one.\n\n")
    for s in order:
        if s not in by_sector: continue
        g = by_sector[s]
        hiring = sum(1 for r in g if r["open_jobs"])
        f.write(f"## {s} ({len(g)} companies, {hiring} hiring)\n\n")
        f.write("| Company | Open roles | Junior | Stage | Size | Location |\n")
        f.write("|---|---|---|---|---|---|\n")
        for r in g:
            f.write(f"| [{r['name']}]({r['board']}) | {r['open_jobs'] or ''} | "
                    f"{r['junior_jobs'] or ''} | {r['stage']} | {r['size_band']} | "
                    f"{r['location']} |\n")
        f.write("\n")

print(f"companies {len(C)}  jobs {len(J)}  sectors {len(by_sector)}")
for s in order:
    if s in by_sector: print(f"  {len(by_sector[s]):4}  {s}")
