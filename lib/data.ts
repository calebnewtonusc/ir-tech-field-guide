// Every number and posting here was read on 2026-11-09. Sources sit next to each entry.

export type PathId = "policy" | "defense" | "trust" | "expansion" | "risk";

export type Stat = {
  value: string;
  label: string;
  source: string;
  href: string;
};

export const stats: Stat[] = [
  {
    value: "$49.1B",
    label:
      "Venture money into defense tech in 2025, nearly double 2024's $27.2B. These startups' customers are governments.",
    source: "PitchBook via Defense News",
    href: "https://www.defensenews.com/industry/2026/01/20/defense-tech-startups-had-their-best-funding-year-ever-in-2025/",
  },
  {
    value: "$100M+",
    label:
      "Federal lobbying by the top tech and AI companies in 2025, the first year the category passed that mark.",
    source: "Axios",
    href: "https://www.axios.com/2026/01/23/ai-tech-lobbying-2025",
  },
  {
    value: "~$3M each",
    label:
      "What Anthropic ($3.13M) and OpenAI ($2.99M) spent on federal lobbying in 2025, the most either had ever reported.",
    source: "Forbes, from federal disclosures",
    href: "https://forbes.co/2026/02/23/ia/los-grandes-constructores-de-la-ia-son-ahora-los-mayores-lobistas/",
  },
  {
    value: "Aug 2, 2026",
    label:
      "The day EU regulators got power to enforce the AI Act. Every company selling AI in Europe now needs people who read regulation.",
    source: "Wilson Sonsini",
    href: "https://www.wsgrdataadvisor.com/2026/08/eu-ai-act-enforcement-phase-begins/",
  },
  {
    value: "100,000+",
    label:
      "People working in trust and safety worldwide, deciding what platforms allow in every country they run in.",
    source: "Trust & Safety Professional Association",
    href: "https://www.tspa.org/about-tspa/",
  },
  {
    value: "$171K to $280K",
    label:
      "Listed pay, plus equity, for OpenAI's US Executive Branch Lead on its Global Affairs team. A senior role, but it shows where the path goes.",
    source: "OpenAI posting, Feb 2026",
    href: "https://jobs.omegavp.com/companies/openai/jobs/67241167-us-executive-branch-lead-global-affairs",
  },
];

export const baseline = {
  text: "For comparison, the classic academic exit: BLS puts political scientists at a $142,080 median in May 2025, with jobs projected to shrink 2% by 2035.",
  href: "https://www.bls.gov/ooh/life-physical-and-social-science/political-scientists.htm",
};

// Real titles from 2026 postings, used in the hero ticker.
export const postings = [
  {
    title: "Policy Manager, Global Affairs",
    company: "OpenAI",
    href: "https://jobs.omegavp.com/companies/openai/jobs/67705685-policy-manager-global-affairs",
  },
  {
    title: "Global Defense Intern",
    company: "Anduril",
    href: "https://jobs.luxcapital.com/companies/anduril/jobs/72450924-global-defense-intern",
  },
  {
    title: "South America Lead, Global Affairs",
    company: "OpenAI",
    href: "https://jobs.thrivecap.com/companies/openai/jobs/91350393-south-america-lead-global-affairs-sao-paulo",
  },
  {
    title: "Director, Government Affairs UK",
    company: "Anduril",
    href: "https://builtintoronto.com/job/director-government-affairs-uk/7483739",
  },
  {
    title: "Head of APAC Growth Markets",
    company: "OpenAI",
    href: "https://jobs.omegavp.com/companies/openai/jobs/79305477-head-of-apac-growth-markets-global-affairs",
  },
  {
    title: "National Security Lead, State and Local",
    company: "OpenAI",
    href: "https://jobs.stripes.co/companies/openai/jobs/81277221-national-security-lead-state-and-local-government-global-affairs",
  },
  {
    title: "US Congressional Lead, Global Affairs",
    company: "OpenAI",
    href: "https://jobs.stripes.co/companies/openai/jobs/67183389-us-congressional-lead-global-affairs",
  },
];

export type Path = {
  id: PathId;
  name: string;
  oneLine: string;
  day: string[];
  hiring: string[];
  wayIn: string[];
  watchOut: string;
  firstMoves: string[];
};

export const paths: Path[] = [
  {
    id: "policy",
    name: "Policy and global affairs",
    oneLine:
      "Help a tech company work with governments: track the laws coming, shape what the company says about them, and sit across from officials.",
    day: [
      "Brief the execs on an AI bill moving through Congress",
      "Draft the company's comments on an EU regulation",
      "Prep a meeting with a foreign ministry",
    ],
    hiring: [
      "OpenAI Global Affairs",
      "Anthropic policy team",
      "Anduril government relations",
      "Big Tech public policy teams",
    ],
    wayIn: [
      "Policy internship at a tech company or a tech-focused think tank",
      "A Hill or agency internship, then cross over",
      "Horizon Fellowship after graduating (no prior policy experience required)",
    ],
    watchOut:
      "Senior roles usually want years in government first. Start at a think tank or a fellowship and come back.",
    firstMoves: [
      "Pick one tech issue (AI rules, chip export controls) and follow it weekly",
      "Write a two-page memo on it and post it",
      "Read Lawfare and ChinaTalk for a month",
    ],
  },
  {
    id: "defense",
    name: "Defense and dual-use startups",
    oneLine:
      "Startups building drones, sensors and software sell to defense ministries around the world. You help them understand and win those customers.",
    day: [
      "Map how a country buys military tech and who signs off",
      "Prep a demo for a visiting foreign delegation",
      "Check a deal against export rules",
    ],
    hiring: ["Anduril", "Shield AI", "Palantir", "Saronic", "Helsing"],
    wayIn: [
      "Strategy, BD or operations analyst roles at defense startups",
      "Take a Hacking for Defense course if your school runs one",
      "Grad school opens the strategy-team internships (Anduril's asks for master's students)",
    ],
    watchOut:
      "Many roles need US citizenship or a clearance, and the moral weight of military work is real. Decide where you stand first.",
    firstMoves: [
      "Read War on the Rocks weekly",
      "Learn what ITAR and export controls are in plain words",
      "Look at a16z's American Dynamism portfolio and pick three companies to follow",
    ],
  },
  {
    id: "trust",
    name: "Trust and safety",
    oneLine:
      "Decide and enforce what a platform allows in every country it runs in, from election rules to extremist content to AI misuse.",
    day: [
      "Write the platform's rules for an election abroad",
      "Review the hardest escalations from moderators",
      "Work with regional experts on language and context",
    ],
    hiring: ["OpenAI", "Discord", "Roblox", "TikTok", "Meta"],
    wayIn: [
      "Trust and safety analyst or content policy associate, often open to new grads",
      "TSPA student membership and its free curriculum",
      "Research on online harms, extremism or elections in class projects",
    ],
    watchOut:
      "Some roles mean seeing disturbing content. Ask how a team supports people before you join.",
    firstMoves: [
      "Read TSPA's curriculum on team roles",
      "Pick one platform and read its full community rules",
      "Write a short case on how a platform handled an election",
    ],
  },
  {
    id: "expansion",
    name: "International expansion",
    oneLine:
      "Launch a product in a new country: local rules, partners, pricing and the first hires. Your language and region are the edge here.",
    day: [
      "Compare licensing rules across three target countries",
      "Find a local bank or distribution partner",
      "Build the launch plan for a new market",
    ],
    hiring: ["Stripe", "Deel", "Wise", "Revolut", "Any startup going global"],
    wayIn: [
      "BizOps or strategy and operations associate roles",
      "Launch or market-entry internships at fintechs",
      "Study abroad plus a language, and say so on your resume",
    ],
    watchOut:
      "It's fast and messy, and the job title changes a lot between companies. Search for the work, not one title.",
    firstMoves: [
      "Pick a region you know and list five startups expanding there",
      "Read Stratechery to learn how tech companies think",
      "Learn spreadsheets well enough to build a simple market model",
    ],
  },
  {
    id: "risk",
    name: "Geopolitical risk and intelligence",
    oneLine:
      "Turn world events into decisions for companies and investors: what a coup, an election or a sanction means for a business tomorrow.",
    day: [
      "Write a brief on what an election means for a supply chain",
      "Monitor a crisis as it breaks",
      "Score which countries are risky for a client",
    ],
    hiring: ["Strider", "Dataminr", "Eurasia Group", "Rhodium Group"],
    wayIn: [
      "Analyst roles at risk firms and intelligence startups",
      "Open-source investigation skills, which you can learn free",
      "Forecasting practice with a public track record",
    ],
    watchOut:
      "You'll be wrong in public sometimes. Good analysts track their calls and get better.",
    firstMoves: [
      "Work through Bellingcat's online investigation toolkit",
      "Make ten forecasts on Good Judgment Open",
      "Follow one region daily and write a weekly summary",
    ],
  },
];

export type Question = {
  prompt: string;
  options: { label: string; points: Partial<Record<PathId, number>> }[];
};

export const questions: Question[] = [
  {
    prompt: "Which class did you actually enjoy most?",
    options: [
      { label: "International law or organizations", points: { policy: 2 } },
      { label: "Security studies", points: { defense: 2, risk: 1 } },
      { label: "Human rights or ethics", points: { trust: 2, policy: 1 } },
      {
        label: "Political economy or trade",
        points: { expansion: 2, risk: 1 },
      },
      {
        label: "A region or conflict studies course",
        points: { risk: 2, expansion: 1 },
      },
    ],
  },
  {
    prompt: "Pick your ideal Tuesday.",
    options: [
      {
        label: "Meeting a senator's staff about a new bill",
        points: { policy: 2 },
      },
      {
        label: "Pitching a defense ministry on new tech",
        points: { defense: 2 },
      },
      {
        label: "Deciding where the line sits on what a platform allows",
        points: { trust: 2 },
      },
      {
        label: "Figuring out how to launch in Brazil",
        points: { expansion: 2 },
      },
      {
        label: "Writing a brief on what a crisis means for markets",
        points: { risk: 2 },
      },
    ],
  },
  {
    prompt: "Which headline do you click first?",
    options: [
      { label: "Congress moves on AI bill", points: { policy: 2 } },
      { label: "Drones reshape the war in Ukraine", points: { defense: 2 } },
      { label: "Platform fails to stop election lies", points: { trust: 2 } },
      {
        label: "India opens its market to foreign fintech",
        points: { expansion: 2 },
      },
      {
        label: "Tensions rise in the Taiwan Strait",
        points: { risk: 2, defense: 1 },
      },
    ],
  },
  {
    prompt: "How do you want to spend most of your day?",
    options: [
      {
        label: "Mostly talking to people and persuading them",
        points: { policy: 1, expansion: 2, defense: 1 },
      },
      {
        label: "A mix of people and analysis",
        points: { policy: 1, defense: 1, trust: 1 },
      },
      {
        label: "Mostly deep reading, research and writing",
        points: { risk: 2, trust: 1 },
      },
    ],
  },
  {
    prompt: "Which kind of pressure can you handle?",
    options: [
      { label: "High stakes and public scrutiny", points: { policy: 2 } },
      { label: "The moral weight of military work", points: { defense: 2 } },
      {
        label: "Seeing hard content so others don't have to",
        points: { trust: 2 },
      },
      { label: "Moving fast with no playbook", points: { expansion: 2 } },
      { label: "Making calls that might turn out wrong", points: { risk: 2 } },
    ],
  },
  {
    prompt: "Where do you want to live after school?",
    options: [
      { label: "DC", points: { policy: 2, defense: 1 } },
      {
        label: "SF, LA or New York",
        points: { trust: 2, expansion: 1, defense: 1 },
      },
      { label: "Abroad, or anywhere", points: { expansion: 2, risk: 1 } },
    ],
  },
  {
    prompt: "Do you speak a second language?",
    options: [
      { label: "Yes, fluently", points: { expansion: 2, risk: 1 } },
      { label: "I'm learning one", points: { expansion: 1, risk: 1 } },
      { label: "Not really", points: { policy: 1, trust: 1 } },
    ],
  },
];

export type Resource = { name: string; note: string; href: string };
export type ResourceGroup = { title: string; items: Resource[] };

export const resources: ResourceGroup[] = [
  {
    title: "Read every week",
    items: [
      {
        name: "ChinaTalk",
        note: "Tech, China and US policy, in depth",
        href: "https://www.chinatalk.media",
      },
      {
        name: "Import AI",
        note: "Jack Clark's weekly on AI research and policy",
        href: "https://importai.substack.com",
      },
      {
        name: "Lawfare",
        note: "National security law and tech policy",
        href: "https://www.lawfaremedia.org",
      },
      {
        name: "War on the Rocks",
        note: "Defense and strategy, written by practitioners",
        href: "https://warontherocks.com",
      },
      {
        name: "Stratechery",
        note: "How tech companies think about business",
        href: "https://stratechery.com",
      },
    ],
  },
  {
    title: "Programs and fellowships",
    items: [
      {
        name: "Horizon Fellowship",
        note: "Places people in emerging-tech policy roles, no policy experience needed",
        href: "https://horizonpublicservice.org",
      },
      {
        name: "TechCongress",
        note: "Puts technologists on Capitol Hill for a year",
        href: "https://techcongress.io",
      },
      {
        name: "Hacking for Defense",
        note: "University course solving real defense problems with startups' methods",
        href: "https://www.h4d.us",
      },
      {
        name: "TSPA",
        note: "Trust and safety association with student membership and a free curriculum",
        href: "https://www.tspa.org",
      },
    ],
  },
  {
    title: "Where the jobs are posted",
    items: [
      {
        name: "80,000 Hours job board",
        note: "AI policy and governance roles, filterable by entry level",
        href: "https://jobs.80000hours.org",
      },
      {
        name: "All Tech Is Human",
        note: "Responsible tech job board, lots of trust and safety",
        href: "https://alltechishuman.org",
      },
      {
        name: "a16z American Dynamism",
        note: "Portfolio of defense and government-facing startups",
        href: "https://a16z.com/american-dynamism/",
      },
      {
        name: "OpenAI careers",
        note: "Search Global Affairs",
        href: "https://openai.com/careers",
      },
      {
        name: "Anduril careers",
        note: "Search Strategy and Government Relations",
        href: "https://www.anduril.com/careers",
      },
    ],
  },
  {
    title: "Skills you can learn free",
    items: [
      {
        name: "Bellingcat toolkit",
        note: "Open-source investigation methods used by real analysts",
        href: "https://bellingcat.gitbook.io/toolkit",
      },
      {
        name: "Good Judgment Open",
        note: "Practice forecasting world events and build a track record",
        href: "https://www.gjopen.com",
      },
      {
        name: "Elements of AI",
        note: "Free course on how AI works, no coding",
        href: "https://www.elementsofai.com",
      },
    ],
  },
  {
    title: "Faith and work",
    items: [
      { name: "International Justice Mission", note: "Christian org fighting violence against the poor worldwide, hires for policy and tech", href: "https://www.ijm.org" },
      { name: "FaithTech", note: "Christians building technology, with local chapters and hackathons", href: "https://faithtech.com" },
      { name: "Praxis", note: "Fellowships for Christians starting and joining ventures", href: "https://www.praxislabs.org" },
      { name: "Every Good Endeavor", note: "Tim Keller on how faith connects to any job", href: "https://www.goodreads.com/search?q=every+good+endeavor+keller" },
    ],
  },
  {
    title: "Books",
    items: [
      {
        name: "Chip War",
        note: "Chris Miller on how semiconductors became geopolitics",
        href: "https://www.goodreads.com/search?q=chip+war+chris+miller",
      },
      {
        name: "The Technological Republic",
        note: "Alex Karp and Nicholas Zamiska on tech and the state",
        href: "https://www.goodreads.com/search?q=the+technological+republic+karp",
      },
      {
        name: "Zero to One",
        note: "Peter Thiel on how startups think",
        href: "https://www.penguinrandomhouse.com/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/",
      },
    ],
  },
];

export const plan = [
  {
    when: "This semester",
    title: "Learn enough tech to keep up",
    body: "Pick one: how AI models work, basic SQL, or how a drone company makes money. You won't build it. You need to follow the people who do.",
  },
  {
    when: "This semester",
    title: "Write one public memo",
    body: "Two pages on a live question, like what the EU AI Act means for a US startup. Post it. Hiring managers here read writing first.",
  },
  {
    when: "Next summer",
    title: "Get inside any tech team",
    body: "An ops, policy, BD or trust and safety internship at a startup beats a prestige internship with no tech in it.",
  },
  {
    when: "Ongoing",
    title: "Know ten people in the field",
    body: "Message people with your target title, mention your memo, ask one specific question. Most startup hires come through someone inside.",
  },
  {
    when: "Senior year",
    title: "Apply to a fellowship too",
    body: "Horizon and similar programs place people in tech policy roles. A strong backup and a strong front door.",
  },
  {
    when: "Always",
    title: "Keep your language and region",
    body: "A second language plus deep knowledge of one region is the edge engineers can't copy.",
  },
];
