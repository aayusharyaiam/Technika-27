export const festival = {
  name: "Technika 2k27",
  dateLabel: "08 — 10 January 2027",
  start: "2027-01-08T09:00:00+05:30",
  location: "BIT Patna, Bihar",
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Registrations", href: "/registrations", dropdown: true },
  { label: "Members", href: "/members", dropdown: true },
  { label: "Delegate", href: "/delegate" },
  { label: "Alumni", href: "/alumni", dropdown: true },
  { label: "Contact", href: "/contact" },
];

export const houses = [
  { name: "Gryffindor", title: "Dare to build.", track: "Robotics & Hardware", color: "#df7465", rune: "G", description: "For the brave makers, machine architects, and fearless competitors of the arena." },
  { name: "Ravenclaw", title: "Think beyond.", track: "AI & Algorithms", color: "#8cc8e8", rune: "R", description: "For curious minds who turn clever ideas into extraordinary possibilities." },
  { name: "Slytherin", title: "Rewrite the rules.", track: "Cybersecurity & Web3", color: "#91c6a7", rune: "S", description: "For ambitious strategists, digital defenders, and masters of the unexpected." },
  { name: "Hufflepuff", title: "Make it matter.", track: "Design & Culture", color: "#edc96f", rune: "H", description: "For the creative collaborators who bring people, purpose, and magic together." },
];

export const schedule = [
  { day: "I", date: "08 JAN", title: "The Awakening", events: [
    { time: "10:00 AM", category: "Grand Opening", title: "The Sorting Ceremony", description: "The gates open. Meet your fellow wizards, find your house, and begin an unforgettable odyssey.", venue: "Central Amphitheatre", icon: "flame", color: "gold" },
    { time: "02:00 PM", category: "Aerial Sorcery", title: "Quidditch Drone Cup", description: "Take to the skies. Navigate enchanted hoops and race your way to house glory.", venue: "Campus Grounds", icon: "wind", color: "crimson" },
    { time: "06:00 PM", category: "Cybersecurity", title: "Defense Against Dark Code", description: "Break the cipher, capture the flag, and defend the digital realm from the darkest exploits.", venue: "Computing Labs", icon: "shield", color: "blue" },
  ] },
  { day: "II", date: "09 JAN", title: "The Trials", events: [
    { time: "09:00 AM", category: "Flagship Hackathon", title: "The Triwizard Spellathon", description: "An overnight adventure of ideas, algorithms, and invention. Build something the world has never seen.", venue: "Innovation Hall", icon: "code", color: "gold" },
    { time: "01:30 PM", category: "AI Workshop", title: "Potions & Algorithms", description: "A little curiosity, a dash of data, and the art of machine learning with fellow code alchemists.", venue: "Seminar Hall", icon: "flask", color: "blue" },
    { time: "05:00 PM", category: "Combat Robotics", title: "Robo-Duels Coliseum", description: "Metal meets mettle as student-built machines face off in the ultimate engineering arena.", venue: "Open Mech Arena", icon: "bot", color: "crimson" },
  ] },
  { day: "III", date: "10 JAN", title: "The Triumph", events: [
    { time: "11:00 AM", category: "Final Showcase", title: "The Goblet of Code", description: "The finest inventions take the stage. Present your creation and let your ingenuity shine.", venue: "Main Auditorium", icon: "trophy", color: "gold" },
    { time: "04:30 PM", category: "Felicitation", title: "The House Cup", description: "Honour the champions, celebrate every breakthrough, and crown this year’s winning house.", venue: "Main Auditorium", icon: "shield", color: "blue" },
    { time: "07:00 PM", category: "The Grand Finale", title: "The Yule Ball", description: "One last spell. An evening of music, lights, and memories beneath the enchanted night sky.", venue: "Open Air Stage", icon: "music", color: "crimson" },
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
