export const festival = {
  name: "Technika 2K26",
  dateLabel: "16 — 18 January 2026",
  start: "2026-01-16T09:00:00+05:30",
  location: "BIT Patna, Bihar",
};

export type NavigationItem = {
  label: string;
  href: string;
  dropdown?: boolean;
  authOnly?: boolean;
  children?: Array<{ label: string; href: string }>;
};

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", authOnly: true },
  { label: "Marauder's Map", href: "/marauders-map" },
  { label: "Registrations", href: "/registrations", dropdown: true, children: [
    { label: "Event registry", href: "/events" },
    { label: "Merchandise", href: "/merchandise" },
    { label: "Accommodation", href: "/accommodation" },
  ] },
  { label: "Members", href: "/members", dropdown: true, children: [
    { label: "Core team", href: "/core" },
    { label: "Developers", href: "/devs" },
  ] },
  { label: "Delegate", href: "/delegate" },
  { label: "Alumni", href: "/alumni", dropdown: true, children: [
    { label: "Alumni registration", href: "/alumni" },
  ] },
  { label: "Contact", href: "/contact" },
];

export const houses = [
  { name: "Gryffindor", theme: "gryffindor", title: "Dare to build.", track: "Robotics & Hardware", rune: "G", description: "For the brave makers, machine architects, and fearless competitors of the arena." },
  { name: "Ravenclaw", theme: "ravenclaw", title: "Think beyond.", track: "AI & Algorithms", rune: "R", description: "For curious minds who turn clever ideas into extraordinary possibilities." },
  { name: "Slytherin", theme: "slytherin", title: "Rewrite the rules.", track: "Cybersecurity & Web3", rune: "S", description: "For ambitious strategists, digital defenders, and masters of the unexpected." },
  { name: "Hufflepuff", theme: "hufflepuff", title: "Make it matter.", track: "Design & Culture", rune: "H", description: "For the creative collaborators who bring people, purpose, and magic together." },
];

export const schedule = [
  { day: "I", date: "16 JAN", title: "The Opening", events: [
    { time: "24 HOURS", category: "Flagship Hackathon", title: "Dev Conquest", description: "Build, collaborate, and compete in Technika’s 24-hour flagship hackathon.", venue: "Innovation Hall", icon: "code", color: "gold" },
    { time: "06:00 PM", category: "Inauguration", title: "Opening Ceremony", description: "Join the inauguration and welcome address as Technika 2K26 begins.", venue: "Main Auditorium", icon: "flame", color: "crimson" },
  ] },
  { day: "II", date: "17 JAN", title: "The Arena", events: [
    { time: "ALL DAY", category: "Technical Festival", title: "Technical Events", description: "Coding contests, robotics, E-Sports, and more across the BIT Patna campus.", venue: "BIT Patna Campus", icon: "bot", color: "blue" },
    { time: "ALL DAY", category: "Creative Festival", title: "Cultural & Fun", description: "Bring your energy to the cultural, creative, and fun experiences of Technika.", venue: "Festival Grounds", icon: "music", color: "crimson" },
  ] },
  { day: "III", date: "18 JAN", title: "The Finale", events: [
    { time: "07:00 PM", category: "Closing Ceremony", title: "Closing Ceremony", description: "Close the festival with a celebration featuring key artist Mohammed Irfan.", venue: "Open Air Stage", icon: "music", color: "gold" },
  ] },
];

export const orderMembers = [
  { title: "Supreme Mugwump", role: "The Chief Convener", category: "High Council", image: 1 },
  { title: "Chief Sorcerer", role: "Web & Systems", category: "Web Sorcerers", image: 2 },
  { title: "Grand Auror", role: "Security & Logistics", category: "Grand Aurors", image: 3 },
  { title: "Master of Potions", role: "Sponsorship & Treasury", category: "High Council", image: 4 },
  { title: "Keeper of Keys", role: "Events & Experiences", category: "Grand Aurors", image: 5 },
  { title: "Grand Diviner", role: "Design & Visual Sorcery", category: "Web Sorcerers", image: 6 },
  { title: "Owlery Dispatcher", role: "Media & Outreach", category: "High Council", image: 7 },
  { title: "Faculty Sentinel", role: "Our Faculty Mentors", category: "Faculty Sentinels", image: 8 },
];
