import type { PathId } from "@/lib/data";

// Which doors and resources fit each passport path, best first. Hand-picked 2026-11-10 from the names in
// lib/opportunities.ts and lib/data.ts; a name that stops matching there just drops out of the list.

export const DOORS_FOR: Record<PathId, string[]> = {
  policy: ["GovAI Summer Fellowship", "Horizon Fellowship", "Truman Scholarship", "Virtual Student Federal Service", "BlueDot AI Governance course", "Council on Foreign Relations internships", "Young Professionals in Foreign Policy", "Women in Foreign Policy Group", "PPIA Junior Summer Institute", "Diplomacy Lab", "State Department internships"],
  defense: ["Cyber 9/12 Strategy Challenge", "Boren Scholarship", "Critical Language Scholarship", "Horizon Fellowship", "GovAI Summer Fellowship", "Pickering Fellowship", "Foreign Service Officer Test"],
  trust: ["Trust & Safety Professional Association", "All Tech Is Human", "International Justice Mission internships", "BlueDot AI Governance course", "FaithTech", "Praxis Academy"],
  expansion: ["Critical Language Scholarship", "Gilman Scholarship", "Dorm Room Fund", "Praxis Academy", "Fulbright US Student Program", "Schwarzman Scholars", "Faith Driven Entrepreneur", "Bay Area Faith + Work Summit"],
  risk: ["Good Judgment Open", "Cyber 9/12 Strategy Challenge", "Rangel Summer Enrichment Program", "Schwarzman Scholars", "80,000 Hours job board", "Devex"],
};

export const PACK_FOR: Record<PathId | "start", string[]> = {
  start: ["ChinaTalk", "All Tech Is Human", "Good Judgment Open"],
  policy: ["Lawfare", "TechCongress", "Horizon Fellowship"],
  defense: ["War on the Rocks", "Hacking for Defense", "Anduril careers"],
  trust: ["TSPA", "All Tech Is Human", "Bellingcat toolkit"],
  expansion: ["Stratechery", "OpenAI careers", "Elements of AI"],
  risk: ["Good Judgment Open", "ChinaTalk", "Import AI"],
};
