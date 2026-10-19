export type PortalKind = "hub" | "category" | "catalogue" | "directory" | "timeline" | "live" | "form" | "profile";

export type PortalLink = {
  label: string;
  href: string;
  note: string;
  mark: string;
};

export type PortalPageConfig = {
  path: string;
  kind: PortalKind;
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  status: string;
  backHref?: string;
  backLabel?: string;
  links?: PortalLink[];
};

export const portalPages: Record<string, PortalPageConfig> = {
  "/events": {
    path: "/events",
    kind: "hub",
    eyebrow: "The event registry",
    title: "Choose your",
    emphasis: "chamber.",
    description: "The festival archives are being prepared. Choose a chamber to return to when the official programme is published.",
    status: "Event information coming soon",
    links: [
      { label: "Technical", href: "/technical", note: "Build, code, and invention", mark: "I" },
      { label: "Cultural", href: "/cultural", note: "Performance, music, and expression", mark: "II" },
      { label: "Art & Craft", href: "/art-craft", note: "Make something worth remembering", mark: "III" },
      { label: "Frame & Focus", href: "/frame-focus", note: "Images, stories, and perspective", mark: "IV" },
      { label: "E-sports", href: "/esports", note: "The competitive arena", mark: "V" },
    ],
  },
  "/technical": {
    path: "/technical",
    kind: "category",
    eyebrow: "The technical chamber",
    title: "Ideas become",
    emphasis: "incantations.",
    description: "The technical archive will hold the official challenges, rules, schedules, and registration paths once they are confirmed.",
    status: "Technical entries coming soon",
    backHref: "/events",
    backLabel: "Return to event registry",
  },
  "/cultural": {
    path: "/cultural",
    kind: "category",
    eyebrow: "The cultural chamber",
    title: "Let the hall",
    emphasis: "come alive.",
    description: "The cultural archive is reserved for the official performance programme and participation details.",
    status: "Cultural entries coming soon",
    backHref: "/events",
    backLabel: "Return to event registry",
  },
  "/art-craft": {
    path: "/art-craft",
    kind: "category",
    eyebrow: "The atelier chamber",
    title: "Make the",
    emphasis: "unseen visible.",
    description: "This chamber will reveal its official creative briefs, requirements, and entry paths when they are ready.",
    status: "Creative entries coming soon",
    backHref: "/events",
    backLabel: "Return to event registry",
  },
  "/frame-focus": {
    path: "/frame-focus",
    kind: "category",
    eyebrow: "The observatory chamber",
    title: "Find a new",
    emphasis: "point of view.",
    description: "The visual archive is waiting for its official briefs, formats, and submission details.",
    status: "Visual entries coming soon",
    backHref: "/events",
    backLabel: "Return to event registry",
  },
  "/esports": {
    path: "/esports",
    kind: "category",
    eyebrow: "The arena chamber",
    title: "Enter the",
    emphasis: "tournament.",
    description: "The arena will publish its official games, rules, schedules, and registration destinations in due course.",
    status: "Arena entries coming soon",
    backHref: "/events",
    backLabel: "Return to event registry",
  },
  "/merchandise": {
    path: "/merchandise",
    kind: "catalogue",
    eyebrow: "The trunk of treasures",
    title: "Wear the",
    emphasis: "next chapter.",
    description: "The official festival catalogue will appear here when the collection, prices, and ordering process are confirmed.",
    status: "Merchandise catalogue coming soon",
    backHref: "/",
    backLabel: "Return to the castle",
  },
  "/core": {
    path: "/core",
    kind: "directory",
    eyebrow: "The organising council",
    title: "Every spell needs",
    emphasis: "a keeper.",
    description: "The Order directory will be populated with the official organising structure when the roster is ready to be revealed.",
    status: "Council roster coming soon",
    backHref: "/members",
    backLabel: "Return to the Order",
  },
  "/devs": {
    path: "/devs",
    kind: "directory",
    eyebrow: "The web sorcerers",
    title: "Built behind the",
    emphasis: "curtain.",
    description: "The developers’ directory will be revealed here without inventing names, roles, or credits before they are supplied.",
    status: "Developer roster coming soon",
    backHref: "/members",
    backLabel: "Return to the Order",
  },
  "/timeline": {
    path: "/timeline",
    kind: "timeline",
    eyebrow: "The programme chronicle",
    title: "Time has a",
    emphasis: "little magic.",
    description: "The official festival timeline will be placed here when dates, sessions, and venues are confirmed.",
    status: "Programme timeline coming soon",
    backHref: "/",
    backLabel: "Return to the castle",
  },
  "/event-timeline": {
    path: "/event-timeline",
    kind: "live",
    eyebrow: "The live programme",
    title: "Keep your eyes on",
    emphasis: "the clock.",
    description: "A live operational view will appear here during the festival once the official schedule feed exists.",
    status: "Live schedule not published",
    backHref: "/timeline",
    backLabel: "Return to programme chronicle",
  },
  "/accommodation": {
    path: "/accommodation",
    kind: "form",
    eyebrow: "The guest quarters",
    title: "A place to",
    emphasis: "rest between quests.",
    description: "Accommodation information and enquiry actions will be added once the official arrangements are confirmed.",
    status: "Accommodation details coming soon",
    backHref: "/delegate",
    backLabel: "Return to delegate enclave",
  },
  "/delegate-registration": {
    path: "/delegate-registration",
    kind: "form",
    eyebrow: "The delegate registry",
    title: "Bring your",
    emphasis: "contingent.",
    description: "The delegate registration flow is reserved for the official form, eligibility, and pass information.",
    status: "Delegate registration coming soon",
    backHref: "/delegate",
    backLabel: "Return to delegate enclave",
  },
  "/delegate-group-registration": {
    path: "/delegate-group-registration",
    kind: "form",
    eyebrow: "The contingent chamber",
    title: "Gather your",
    emphasis: "house.",
    description: "Group registration will be enabled here after the official delegate process and member requirements are published.",
    status: "Group registration coming soon",
    backHref: "/delegate",
    backLabel: "Return to delegate enclave",
  },
  "/profile": {
    path: "/profile",
    kind: "profile",
    eyebrow: "The personal ledger",
    title: "Your story,",
    emphasis: "kept safe.",
    description: "Your profile portal will connect to the existing account experience when the profile fields and registration records are ready.",
    status: "Profile portal coming soon",
    backHref: "/account",
    backLabel: "Return to common room",
  },
};
