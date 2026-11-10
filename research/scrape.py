#!/usr/bin/env python3
"""Scrape the Praxis job board (jobs.praxis.co) via the Getro API behind it.

The board is a Getro Next.js app. Its network id is 130, readable from
__NEXT_DATA__ on any page. The search endpoint is POST-only and requires
Accept: application/json, or it answers 406. Page size is capped at 12 unless
the request uses the snake_case key `hits_per_page`; `hitsPerPage` is silently
ignored. Writes data/companies.json and data/jobs.json.
"""
import json, time, pathlib, urllib.request

NETWORK = 130
BASE = f"https://api.getro.com/api/v2/collections/{NETWORK}/search"
HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Origin": "https://jobs.praxis.co",
    "Referer": "https://jobs.praxis.co/",
    "User-Agent": "Mozilla/5.0",
}
OUT = pathlib.Path(__file__).resolve().parent.parent / "data"


def fetch_all(kind):
    """kind is 'companies' or 'jobs'."""
    seen, page, total = {}, 0, None
    while page < 20:
        body = json.dumps({"page": page, "hits_per_page": 100}).encode()
        req = urllib.request.Request(f"{BASE}/{kind}", data=body,
                                     headers=HEADERS, method="POST")
        res = json.loads(urllib.request.urlopen(req, timeout=60).read())["results"]
        total = res.get("count")
        batch = res.get(kind, [])
        if not batch:
            break
        for item in batch:
            seen[item.get("id") or item.get("slug")] = item
        print(f"  {kind} page {page}: +{len(batch)} unique={len(seen)}/{total}")
        if len(seen) >= (total or 0):
            break
        page += 1
        time.sleep(0.4)
    if total and len(seen) != total:
        raise SystemExit(f"FAILED: got {len(seen)} {kind}, expected {total}")
    return list(seen.values())


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for kind in ("companies", "jobs"):
        data = fetch_all(kind)
        (OUT / f"{kind}.json").write_text(json.dumps(data, indent=1))
        print(f"wrote data/{kind}.json ({len(data)})")
    print("\nnow run: python3 scripts/rank.py")
