"""Geocode each org location once with OpenStreetMap Nominatim (1 request/second, cached).
Writes research/geocode.json: {location string: [lat, lon] or null}."""
import json, pathlib, time, urllib.parse, urllib.request

R = pathlib.Path(__file__).parent
cache_path = R / "geocode.json"
cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
orgs = json.load(open(R.parent / "lib" / "orgs.json"))
locs = sorted({pl for o in orgs for pl in o.get("places", [])})

def query_for(loc):
    if loc == "Bay Area":
        return "Palo Alto, CA, USA"
    parts = [p.strip() for p in loc.split(",")]
    # "Canal Street, New York, NY, USA" -> "New York, NY, USA": neighborhood names confuse the geocoder.
    return ", ".join(parts[-3:]) if len(parts) > 3 else loc

for loc in locs:
    if loc in cache:
        continue
    q = urllib.parse.urlencode({"q": query_for(loc), "format": "json", "limit": 1})
    req = urllib.request.Request(f"https://nominatim.openstreetmap.org/search?{q}", headers={"User-Agent": "ir-tech-field-guide/1.0"})
    try:
        hits = json.load(urllib.request.urlopen(req, timeout=20))
        cache[loc] = [round(float(hits[0]["lat"]), 3), round(float(hits[0]["lon"]), 3)] if hits else None
    except Exception as e:  # keep going, record the miss
        print("miss", loc, e)
        cache[loc] = None
    cache_path.write_text(json.dumps(cache, indent=1))
    time.sleep(1.1)

print(len(cache), "located", sum(v is not None for v in cache.values()))
print("misses:", [k for k, v in cache.items() if v is None])
