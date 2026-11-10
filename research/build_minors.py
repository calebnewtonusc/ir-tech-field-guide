"""Build lib/minors.json: USC minors that fit an IR major headed for tech, from the 2026-27 catalogue.

Source: catalogue.usc.edu (catoid 22, "Programs, Minors and Certificates"), read 2026-11-09 and saved in
research/catalogue-minors-2026-27.json. Course codes come from each minor's own page; the one-line reason is ours.
"""
import json, pathlib

R = pathlib.Path(__file__).parent
M = {m["name"]: m for m in json.load(open(R / "catalogue-minors-2026-27.json"))}

PICKS = [
    ("Law and Regulation of Artificial Intelligence Minor", ["policy", "trust"], "How the law is catching up to AI, from privacy to regulation.", ["LAW 306", "LAW 206", "LAW 207"]),
    ("Cyber Governance Minor", ["defense", "policy"], "Cyber law, risk and security strategy, with some hands-on hacking.", ["LAW 401", "TAC 479", "RISK 380"]),
    ("Cultural Diplomacy Minor", ["policy", "expansion"], "How culture moves foreign affairs, built on USC's public diplomacy program.", ["PUBD 369", "PUBD 417", "COMM 324"]),
    ("Human Security and Geospatial Intelligence Minor", ["risk", "defense"], "Use maps and location data to spot and answer real human crises.", ["SSCI 202", "SSCI 420", "IR 210"]),
    ("Communication Policy and Law Minor", ["trust", "policy"], "Censorship, platforms and media law, the rules trust and safety lives by.", ["COMM 371", "COMM 422", "JOUR 462"]),
    ("Human Rights Minor", ["trust"], "Deep knowledge of the abuses platforms, NGOs and governments fight.", ["POSC 248", "IR 310", "POSC 366"]),
    ("Law and Migration Studies Minor", ["policy", "trust"], "Immigration law and what borders do to people, here and globally.", ["LAW 212", "LAW 310", "AMST 140"]),
    ("Global Communication Minor", ["expansion"], "Built for people heading into global firms, mixing IR with communication.", ["IR 303", "IR 330", "IR 333"]),
    ("Political Organizing in the Digital Age Minor", ["trust", "policy"], "How the internet changed campaigns and movements around the world.", ["POSC 437", "IR 371", "COMM 321"]),
    ("Disruptive Innovation Minor", ["expansion"], "IYA's minor for launching ventures, from idea to fundraising.", ["ACAD 181", "ACAD 222", "ACAD 406"]),
    ("Social Entrepreneurship Minor", ["expansion"], "Start ventures that do good, at home and abroad.", ["BAEP 491", "BAEP 471", "PPD 371"]),
    ("Nonprofits, Philanthropy and Volunteerism Minor", ["trust"], "How mission-driven orgs like IJM actually run.", ["PPD 371", "PPD 353", "IR 371"]),
    ("Middle East Studies Minor", ["risk", "defense"], "Morocco to Iran, with Arabic as an option.", ["MDES 201", "MDES 301", "ARAB 334"]),
    ("East Asian Area Studies Minor", ["risk", "expansion"], "No language required, and the region every tech company watches.", ["EALC 110", "EASC 150"]),
    ("Latin American Studies Minor", ["expansion", "risk"], "US-Latin American relations, plus area and language study.", ["IR 364", "IR 365", "POSC 350"]),
    ("Applied AI in Business Minor", ["expansion"], "Practical AI skills for any career, from Marshall.", ["DSO 461", "DSO 463", "MOR 458"]),
]

out = []
for name, paths, why, codes in PICKS:
    m = M[name]
    out.append({"name": name.replace(" Minor", ""), "paths": paths, "why": why, "courses": codes, "href": m["href"]})
json.dump(out, open(R.parent / "lib" / "minors.json", "w"), indent=1)
print(len(out), "minors")
