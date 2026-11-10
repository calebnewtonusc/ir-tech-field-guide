"""Download every org's logo into public/logos so the site doesn't hotlink anyone.
Praxis logos come from the Getro CDN behind jobs.praxis.co (companies.json logo_url).
Bay Area Center orgs and employer chips go through logo-fetch, which refuses marks under 64px."""
import json, pathlib, re, subprocess, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "logos"
OUT.mkdir(parents=True, exist_ok=True)

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

companies = {c["name"]: c for c in json.load(open(ROOT / "research" / "companies.json"))}
orgs = json.load(open(ROOT / "lib" / "orgs.json"))
fetch_domains = {}
for o in orgs:
    s = slug(o["name"])
    c = companies.get(o["name"])
    if o["source"] == "praxis" and c and c.get("logo_url"):
        dest = OUT / f"{s}.webp"
        if not dest.exists():
            try:
                req = urllib.request.Request(c["logo_url"], headers={"User-Agent": "Mozilla/5.0"})
                dest.write_bytes(urllib.request.urlopen(req, timeout=20).read())
            except Exception as e:
                print("miss", o["name"], e)
                continue
        o["logo"] = f"/logos/{s}.webp"
    elif o["source"] == "bayarea" and o["href"]:
        dom = re.sub(r"^https?://(www\.)?", "", o["href"]).split("/")[0]
        fetch_domains[s] = dom
        o["logo"] = f"/logos/{s}.png"
    elif o["source"] == "faithtech":
        fetch_domains["faithtech"] = "faithtech.com"
        o["logo"] = "/logos/faithtech.png"

EMPLOYERS = {
    "openai": "openai.com", "anthropic": "anthropic.com", "anduril": "anduril.com", "shield-ai": "shield.ai",
    "palantir": "palantir.com", "saronic": "saronic.com", "helsing": "helsing.ai", "discord": "discord.com",
    "roblox": "roblox.com", "tiktok": "tiktok.com", "meta": "meta.com", "stripe": "stripe.com", "deel": "deel.com",
    "wise": "wise.com", "revolut": "revolut.com", "strider": "striderintel.com", "dataminr": "dataminr.com",
    "eurasia-group": "eurasiagroup.net", "rhodium-group": "rhg.com",
}
fetch_domains.update(EMPLOYERS)
args = [f"{k}={v}" for k, v in fetch_domains.items()]
r = subprocess.run(["logo-fetch", "--out", str(OUT), *args], capture_output=True, text=True)
print(r.stdout[-1500:], r.stderr[-1500:])
# Drop any logo path whose file never landed (refused as blurry), so the card shows its initial instead.
for o in orgs:
    if o.get("logo") and not (ROOT / "public" / o["logo"].lstrip("/")).exists():
        o.pop("logo")
json.dump(orgs, open(ROOT / "lib" / "orgs.json", "w"), indent=1, ensure_ascii=False)
print("with logos", sum(1 for o in orgs if o.get("logo")), "of", len(orgs))
print("employer logos", sorted(p.stem for p in OUT.glob("*.png") if p.stem in EMPLOYERS))
