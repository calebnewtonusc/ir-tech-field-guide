// Open doors: real programs an IR undergrad can apply to. Facts checked 2026-11-09 against the program's
// own site or its university fellowship-office listings. `closes` is an exact national deadline only when a
// source gave one; otherwise `months` holds the usual closing month(s) and `when` says it in words.

export type Kind =
  | "Fellowship"
  | "Scholarship"
  | "Summer program"
  | "Internship"
  | "Competition"
  | "Course"
  | "Community"
  | "Job board";

export type Door = {
  name: string;
  kind: Kind;
  blurb: string;
  who: string;
  money: string;
  when: string;
  closes?: string; // ISO date of a confirmed national deadline
  months: number[]; // 1-12, usual closing month(s); empty = rolling
  href: string;
  logo?: string; // file in public/logos
  faith?: boolean;
  pays?: boolean;
};

export const doors: Door[] = [
  {
    name: "Critical Language Scholarship",
    kind: "Scholarship",
    blurb:
      "A fully funded summer abroad learning a language the State Department needs.",
    who: "US undergrads and grad students",
    money: "Fully funded",
    when: "Closes Nov 17, 2026",
    closes: "2026-11-17",
    months: [11],
    href: "https://clscholarship.org",
    pays: true,
  },
  {
    name: "GovAI Summer Fellowship",
    kind: "Fellowship",
    blurb:
      "Three paid months doing AI governance research or policy work in London or DC.",
    who: "Early career, any background",
    money: "£14,000 (UK track)",
    when: "Closes Nov 22, 2026",
    closes: "2026-11-22",
    months: [11],
    href: "https://www.governance.ai/opportunities",
    pays: true,
  },
  {
    name: "Boren Scholarship",
    kind: "Scholarship",
    blurb:
      "Study a critical language abroad on the government's dime, then serve in national security.",
    who: "US undergrads",
    money: "Up to $25,000",
    when: "Late January (Jan 27, 2027 at most schools)",
    closes: "2027-01-27",
    months: [1],
    href: "https://www.borenawards.org",
    pays: true,
  },
  {
    name: "Truman Scholarship",
    kind: "Scholarship",
    blurb:
      "Funding for grad school if you're headed for a life in public service.",
    who: "College juniors, nominated by your school",
    money: "Up to $30,000",
    when: "Feb 2, 2027 (campus deadline earlier)",
    closes: "2027-02-02",
    months: [2],
    href: "https://www.truman.gov",
    pays: true,
  },
  {
    name: "Rangel Summer Enrichment Program",
    kind: "Summer program",
    blurb:
      "Six weeks at Howard in DC learning foreign affairs from the people who run it.",
    who: "Sophomores and up",
    money: "Tuition, travel, housing + $3,300",
    when: "Usually early February",
    months: [2],
    href: "https://www.rangelprogram.org",
    pays: true,
  },
  {
    name: "PPIA Junior Summer Institute",
    kind: "Summer program",
    blurb: "A fully funded policy boot camp at Princeton, Harvard or Michigan.",
    who: "Juniors (summer before senior year)",
    money: "Fully funded + stipend",
    when: "Opens mid-September, closes early November",
    months: [11],
    href: "https://www.ppiaprogram.org",
    pays: true,
  },
  {
    name: "Gilman Scholarship",
    kind: "Scholarship",
    blurb: "Money to study or intern abroad, for students on Pell Grants.",
    who: "Pell Grant recipients",
    money: "Up to $5,000",
    when: "October and early spring cycles",
    months: [3, 10],
    href: "https://www.gilmanscholarship.org",
    pays: true,
  },
  {
    name: "Virtual Student Federal Service",
    kind: "Internship",
    blurb:
      "A remote internship with the State Department and other agencies, 10 hours a week from your dorm.",
    who: "US college students",
    money: "Unpaid, goes on your resume",
    when: "Applications in July on USAJOBS",
    months: [7],
    href: "https://careers.state.gov/interns-fellows/virtual-student-federal-service/",
  },
  {
    name: "State Department internships",
    kind: "Internship",
    blurb:
      "Student internships and Pathways roles inside embassies and DC bureaus.",
    who: "US undergrads",
    money: "Varies by program",
    when: "Several cycles a year",
    months: [],
    href: "https://careers.state.gov/interns-fellows/",
  },
  {
    name: "Cyber 9/12 Strategy Challenge",
    kind: "Competition",
    blurb:
      "Your team gets a fictional cyber crisis and briefs real officials on what to do.",
    who: "Student teams, any major",
    money: "Free to compete",
    when: "Team applications open in the fall",
    months: [],
    href: "https://www.atlanticcouncil.org/programs/cyber-statecraft-initiative/cyber-912/",
  },
  {
    name: "Diplomacy Lab",
    kind: "Course",
    blurb:
      "The State Department hands real research questions to university classes. Ask if yours is in.",
    who: "Students at member universities",
    money: "Part of a class",
    when: "Each semester",
    months: [],
    href: "https://www.state.gov/diplomacy-lab/",
  },
  {
    name: "Horizon Fellowship",
    kind: "Fellowship",
    blurb:
      "Places people in emerging tech policy jobs in government and think tanks.",
    who: "Recent grads and up, no policy experience needed",
    money: "Paid placement",
    when: "Usually late summer",
    months: [8],
    href: "https://horizonpublicservice.org",
    pays: true,
  },
  {
    name: "BlueDot AI Governance course",
    kind: "Course",
    blurb: "A free cohort course on how governments can regulate advanced AI.",
    who: "Anyone",
    money: "Free",
    when: "Rolling cohorts",
    months: [],
    href: "https://bluedot.org",
  },
  {
    name: "Dorm Room Fund",
    kind: "Fellowship",
    blurb:
      "Become a student venture capitalist and invest real money in student founders.",
    who: "Current students",
    money: "You invest the fund's money",
    when: "Partner recruiting cycles",
    months: [],
    href: "https://www.dormroomfund.com/join",
  },
  {
    name: "Fulbright US Student Program",
    kind: "Fellowship",
    blurb:
      "A year abroad teaching English or doing research, right after graduation.",
    who: "Seniors and recent grads",
    money: "Fully funded",
    when: "Usually early October",
    months: [10],
    href: "https://us.fulbrightonline.org",
    pays: true,
  },
  {
    name: "Pickering Fellowship",
    kind: "Fellowship",
    blurb: "Pays for a master's and leads into a career as a US diplomat.",
    who: "Seniors heading to grad school",
    money: "Grad school funded",
    when: "Usually fall of senior year",
    months: [9],
    href: "https://pickeringfellowship.org",
    pays: true,
  },
  {
    name: "Schwarzman Scholars",
    kind: "Fellowship",
    blurb: "A one-year master's in global affairs in Beijing.",
    who: "Seniors and young grads",
    money: "Fully funded",
    when: "Usually September",
    months: [9],
    href: "https://www.schwarzmanscholars.org",
    pays: true,
  },
  {
    name: "Foreign Service Officer Test",
    kind: "Job board",
    blurb:
      "The first step to becoming a diplomat. You can take it as an undergrad.",
    who: "US citizens 20+",
    money: "Free",
    when: "Testing windows through the year",
    months: [],
    href: "https://careers.state.gov/career-paths/foreign-service-officer/",
  },
  {
    name: "International Justice Mission internships",
    kind: "Internship",
    blurb: "Fight violence against the poor in DC or a field office overseas.",
    who: "2+ years of college done",
    money: "Monthly stipend",
    when: "Summer cycle has closed around Dec 31",
    months: [12],
    href: "https://www.ijm.org",
    faith: true,
    pays: true,
  },
  {
    name: "Praxis Academy",
    kind: "Summer program",
    blurb:
      "A few days with faith-driven founders on starting things that renew culture.",
    who: "Christian college students",
    money: "Schools often sponsor",
    when: "Usually spring",
    months: [],
    href: "https://www.praxislabs.org",
    faith: true,
  },
  {
    name: "FaithTech",
    kind: "Community",
    blurb:
      "Christians building tech together in local city chapters, plus Create projects.",
    who: "Anyone",
    money: "Free",
    when: "Find a city anytime",
    months: [],
    href: "https://faithtech.com",
    faith: true,
  },
  {
    name: "Bay Area Faith + Work Summit",
    kind: "Community",
    blurb:
      "A day on how faith shapes the way people work, lead and build, in Burlingame.",
    who: "Anyone",
    money: "Ticketed",
    when: "Feb 27, 2027",
    months: [],
    href: "https://faithworktech.org",
    faith: true,
  },
  {
    name: "Faith Driven Entrepreneur",
    kind: "Community",
    blurb: "Groups, a podcast and a book for Christians who build companies.",
    who: "Anyone",
    money: "Free",
    when: "Anytime",
    months: [],
    href: "https://faithdrivenentrepreneur.org",
    faith: true,
  },
  {
    name: "Young Professionals in Foreign Policy",
    kind: "Community",
    blurb:
      "A network of 20,000+ young foreign policy people, with mentoring and a Rising Experts program.",
    who: "Students and young pros",
    money: "Member dues",
    when: "Anytime",
    months: [],
    href: "https://www.ypfp.org",
  },
  {
    name: "Women in Foreign Policy Group",
    kind: "Community",
    blurb: "Mentoring and events for women going into international affairs.",
    who: "Students and under-30s",
    money: "$60 student membership",
    when: "Anytime",
    months: [],
    href: "https://www.wfpg.org",
  },
  {
    name: "Trust & Safety Professional Association",
    kind: "Community",
    blurb:
      "The home of trust and safety work, with a free curriculum and student membership.",
    who: "Students welcome",
    money: "Student rate",
    when: "Anytime",
    months: [],
    href: "https://www.tspa.org",
  },
  {
    name: "All Tech Is Human",
    kind: "Community",
    blurb: "Mentorship, a job board and guides for responsible tech careers.",
    who: "Anyone",
    money: "Free",
    when: "Anytime",
    months: [],
    href: "https://alltechishuman.org",
  },
  {
    name: "80,000 Hours job board",
    kind: "Job board",
    blurb: "AI policy and global affairs roles, filterable for entry level.",
    who: "Anyone",
    money: "Free",
    when: "Updated daily",
    months: [],
    href: "https://jobs.80000hours.org",
  },
  {
    name: "Devex",
    kind: "Job board",
    blurb: "Jobs and news across international development.",
    who: "Anyone",
    money: "Free to browse",
    when: "Updated daily",
    months: [],
    href: "https://www.devex.com",
  },
  {
    name: "Council on Foreign Relations internships",
    kind: "Internship",
    blurb: "Work alongside foreign policy researchers in New York or DC.",
    who: "Undergrads and grads",
    money: "Paid",
    when: "Rolling, by semester",
    months: [],
    href: "https://www.cfr.org/career-opportunities",
    pays: true,
  },
  {
    name: "Good Judgment Open",
    kind: "Course",
    blurb:
      "Forecast real world events against thousands of people and build a track record.",
    who: "Anyone",
    money: "Free",
    when: "Anytime",
    months: [],
    href: "https://www.gjopen.com",
  },
];
