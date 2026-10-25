export type MapCategory = "technical" | "fun" | "cultural";
export type EventStatus = "established" | "proposed";

export type MapPosition = {
  x: number;
  y: number;
};

export type MapVenue = {
  id: string;
  label: string;
  regionId: string;
  position: MapPosition;
  note: string;
  isIllustrative: true;
};

export type MapRegion = {
  id: string;
  label: string;
  shortLabel: string;
  category: MapCategory;
  description: string;
  position: MapPosition;
  size: { width: number; height: number };
};

export type FestivalEvent = {
  id: string;
  name: string;
  category: MapCategory;
  status: EventStatus;
  description: string;
  venueId: string;
  start?: string;
  end?: string;
  registrationUrl?: string;
  image?: string;
};

export const mapCategories: Record<MapCategory, {
  label: string;
  accent: string;
  regionLabel: string;
}> = {
  technical: { label: "Technical", accent: "var(--fg-highlight)", regionLabel: "Wizarding Labs" },
  fun: { label: "Fun & E-sports", accent: "var(--fg-brand)", regionLabel: "Forbidden Grounds" },
  cultural: { label: "Cultural", accent: "var(--fg-accent)", regionLabel: "Great Hall of Arts" },
};

/**
 * These are themed planning anchors, not a survey of BIT Patna. They are kept
 * separate from events so official venue coordinates can replace them later.
 */
export const mapRegions: MapRegion[] = [
  {
    id: "wizarding-labs-region",
    label: "Wizarding Labs",
    shortLabel: "Technical",
    category: "technical",
    description: "A fictional region for build, code, robotics, and innovation events.",
    position: { x: 105, y: 118 },
    size: { width: 430, height: 430 },
  },
  {
    id: "forbidden-grounds-region",
    label: "Forbidden Grounds",
    shortLabel: "Fun & E-sports",
    category: "fun",
    description: "A fictional region for games, challenges, showcases, and friendly chaos.",
    position: { x: 585, y: 105 },
    size: { width: 500, height: 300 },
  },
  {
    id: "great-hall-of-arts-region",
    label: "Great Hall of Arts",
    shortLabel: "Cultural",
    category: "cultural",
    description: "A fictional region for performance, expression, music, theatre, and style.",
    position: { x: 585, y: 418 },
    size: { width: 500, height: 215 },
  },
];

export const mapVenues: MapVenue[] = [
  {
    id: "wizarding-labs",
    label: "Wizarding Labs",
    regionId: "wizarding-labs-region",
    position: { x: 318, y: 330 },
    note: "Illustrative themed region — official venue to be announced.",
    isIllustrative: true,
  },
  {
    id: "forbidden-grounds",
    label: "Forbidden Grounds",
    regionId: "forbidden-grounds-region",
    position: { x: 835, y: 255 },
    note: "Illustrative themed region — official venue to be announced.",
    isIllustrative: true,
  },
  {
    id: "great-hall-of-arts",
    label: "Great Hall of Arts",
    regionId: "great-hall-of-arts-region",
    position: { x: 835, y: 520 },
    note: "Illustrative themed region — official venue to be announced.",
    isIllustrative: true,
  },
];

export const maraudersMapEvents: FestivalEvent[] = [
  // Technical — established
  { id: "algo-apex", name: "Algo Apex", category: "technical", status: "established", description: "Competitive programming and algorithmic problem-solving.", venueId: "wizarding-labs" },
  { id: "dev-conquest-hackathon", name: "Dev Conquest — Hackathon", category: "technical", status: "established", description: "Team-based hackathon to build and present solutions.", venueId: "wizarding-labs" },
  { id: "robo-gladiators", name: "Robo Gladiators", category: "technical", status: "established", description: "Custom-built robotics competition.", venueId: "wizarding-labs" },
  { id: "robo-soccer", name: "Robo Soccer", category: "technical", status: "established", description: "Robot-control football competition.", venueId: "wizarding-labs" },
  { id: "startup-sphere", name: "Startup Sphere", category: "technical", status: "established", description: "Innovation, entrepreneurship, and startup pitching.", venueId: "wizarding-labs" },
  { id: "cad-master", name: "CAD Master", category: "technical", status: "established", description: "CAD and 3D modelling challenge.", venueId: "wizarding-labs" },
  // Technical — proposed
  { id: "ai-mystery-room", name: "AI Mystery Room", category: "technical", status: "proposed", description: "AI-powered mystery experience involving clues and checkpoints.", venueId: "wizarding-labs" },
  { id: "hack-sprint", name: "Hack Sprint", category: "technical", status: "proposed", description: "Short-format build challenge.", venueId: "wizarding-labs" },
  { id: "campus-quest", name: "Campus Quest", category: "technical", status: "proposed", description: "QR-based campus challenge.", venueId: "wizarding-labs" },
  { id: "startup-live-pitch", name: "Startup Live Pitch", category: "technical", status: "proposed", description: "Rapid startup pitching and cross-questioning.", venueId: "wizarding-labs" },

  // Fun & E-sports — established
  { id: "bgmi-blitz", name: "BGMI Blitz", category: "fun", status: "established", description: "Team-based BGMI competition.", venueId: "forbidden-grounds" },
  { id: "battle-for-booyah", name: "Battle for Booyah", category: "fun", status: "established", description: "Battle-royale survival competition.", venueId: "forbidden-grounds" },
  { id: "legacy-of-valor", name: "Legacy of Valor", category: "fun", status: "established", description: "Team-based competitive gaming.", venueId: "forbidden-grounds" },
  { id: "paint-ball", name: "Paint Ball", category: "fun", status: "established", description: "Physical team battle.", venueId: "forbidden-grounds" },
  { id: "escape-room", name: "Escape Room", category: "fun", status: "established", description: "Collaborative puzzle-solving challenge.", venueId: "forbidden-grounds" },
  { id: "polaroid", name: "Polaroid", category: "fun", status: "established", description: "Casual photography and instant-photo experience.", venueId: "forbidden-grounds" },
  { id: "stunt-bike-show", name: "Stunt Bike Show", category: "fun", status: "established", description: "Professional motorcycle stunt showcase.", venueId: "forbidden-grounds" },
  // Fun & E-sports — proposed
  { id: "night-market", name: "Night Market", category: "fun", status: "proposed", description: "Student stalls, mini-games, and club showcases.", venueId: "forbidden-grounds" },
  { id: "creator-war", name: "Creator War", category: "fun", status: "proposed", description: "Short-form content competition around a common theme.", venueId: "forbidden-grounds" },

  // Cultural
  { id: "exuberance", name: "Exuberance", category: "cultural", status: "established", description: "Group dance performance.", venueId: "great-hall-of-arts" },
  { id: "solo-saga", name: "Solo Saga", category: "cultural", status: "established", description: "Solo dance performance.", venueId: "great-hall-of-arts" },
  { id: "fusion-fiesta", name: "Fusion Fiesta", category: "cultural", status: "established", description: "Group singing and multiple musical styles.", venueId: "great-hall-of-arts" },
  { id: "musical-marvel", name: "Musical Marvel", category: "cultural", status: "established", description: "Instrumental music showcase.", venueId: "great-hall-of-arts" },
  { id: "ekanki", name: "Ekanki", category: "cultural", status: "established", description: "Theatre and storytelling.", venueId: "great-hall-of-arts" },
  { id: "hulchul", name: "Hulchul", category: "cultural", status: "established", description: "Nukkad/street performance.", venueId: "great-hall-of-arts" },
  { id: "fashion-insta", name: "Fashion Insta", category: "cultural", status: "established", description: "Fashion and stage-presentation showcase.", venueId: "great-hall-of-arts" },
  { id: "literary", name: "Literary", category: "cultural", status: "established", description: "Literary event focused on language, expression, and ideas.", venueId: "great-hall-of-arts" },
];

export function getMapVenue(venueId: string) {
  return mapVenues.find((venue) => venue.id === venueId);
}

export function getMapRegion(regionId: string) {
  return mapRegions.find((region) => region.id === regionId);
}
