"""Tag each org in lib/orgs.json with the passport paths its own description matches.

Keyword rules, checked by hand on 2026-11-10. Loose words pulled in junk ("data" tagged health apps as risk,
"defense" tagged a legal-aid fund as defense), so each rule only uses words that mean that kind of work.
Defense and risk come out thin on purpose: the faith-founded orgs here rarely do that work, and the page
only offers the "fits your path" filter when a path has at least 4 orgs.
"""
import json, pathlib, re

LIB = pathlib.Path(__file__).parent.parent / "lib" / "orgs.json"
RULES = {
    "policy": r"\b(policy|policymakers|government|governance|democra\w*|civic|legislat\w*|diplomac\w*)\b",
    "defense": r"\b(aerospace|national security|defense technology|hypersonic\w*|military)\b",
    "trust": r"\b(justice|trafficking|human rights|exploitation|refugees?|persecut\w*|slavery|online safety|misinformation)\b",
    "expansion": r"\b(global|international|emerging markets|cross-border|worldwide|developing (countries|world|nations))\b",
    "risk": r"\b(risk analysis|political risk|intelligence|forecast\w*|supply chains?|geopolitic\w*)\b",
}
# Hand fixes from reading the matches: a wine importer says "international producers", and an FX
# payments company is real cross-border risk work.
DROP = {"Kylix Bio": {"expansion"}}
ADD = {"Pangea": {"risk"}}
orgs = json.loads(LIB.read_text())
for o in orgs:
    text = f"{o['description']} {o['sector']}".lower()
    hit = {p for p, r in RULES.items() if re.search(r, text)}
    hit = (hit - DROP.get(o["name"], set())) | ADD.get(o["name"], set())
    o["paths"] = [p for p in RULES if p in hit]
LIB.write_text(json.dumps(orgs, indent=1, ensure_ascii=False))
for p in RULES:
    names = [o["name"] for o in orgs if p in o["paths"]]
    print(p, len(names), names[:12])
