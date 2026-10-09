import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import Image from "next/image";
import { BedDouble, ChevronRight, Palette, Shield, Trophy, Users } from "lucide-react";
import { BackLink, CalendarButton, SoonBadge } from "@/components/coming-soon";
import { Divider, Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";

export const metadata = createPageMetadata("/delegate");

const academies = [
  { name: "Beauxbatons", title: "The art of possibility", text: "For the creative technologists, designers, and storytellers who see the world a little differently.", Icon: Palette, color: "blue" },
  { name: "Durmstrang", title: "The courage to compete", text: "For the fearless engineers, roboticists, and digital defenders who rise to every challenge.", Icon: Shield, color: "crimson" },
  { name: "Hogwarts", title: "The spirit of discovery", text: "For the all-round innovators and spirited college contingents ready to make their house proud.", Icon: Trophy, color: "gold" },
];

export default function DelegatePage() {
  return <div className="inner-page delegate-page"><BreadcrumbsSchema path="/delegate" /><div className="shell">
    <Reveal className="inner-hero centered delegate-hero"><Eyebrow>The inter-academy alliance</Eyebrow><div className="delegate-emblem"><span className="delegate-ring" /><Image src="/images/crest.webp" alt="The Technika 27 Triwizard delegation seal" width={260} height={260} priority /></div><span className="inner-overline">One realm. Many academies.</span><h1>The Triwizard<br /><em>Delegate Conclave.</em></h1><p>Gather your fellowship. Raise your college banner.<br />A grand welcome at BIT Patna is being conjured for you.</p><SoonBadge>Delegate portal coming soon</SoonBadge><div className="delegate-hero-actions"><CalendarButton label="Mark your grand arrival" /><BackLink /></div></Reveal>
    <section className="academy-section"><Reveal className="section-intro"><Eyebrow>The three academies</Eyebrow><h2>Your college. Your colours.<br /><em>Your moment.</em></h2><p>Every visiting contingent brings its own kind of brilliance.</p></Reveal><div className="academy-grid">{academies.map(({ name, title, text, Icon, color }, i) => <Reveal key={name} delay={i * .1}><article className={`academy-card accent-${color}`}><Icon size={32} strokeWidth={1.1} /><span className="academy-label">The {name} spirit</span><h3>{title}</h3><p>{text}</p><div><span>Enclave preparing</span><ChevronRight size={16} /></div></article></Reveal>)}</div></section>
    <Reveal className="delegate-details"><div><Eyebrow>Passage to the extraordinary</Eyebrow><h2>We’re preparing<br /><em>a place for your people.</em></h2><p>College delegation passes, campus ambassador opportunities, travel guidance, and accommodation information will be published together when the portal opens.</p></div><div className="delegate-perks"><span><Users size={22} /><b>College contingents<small>Bring your whole fellowship</small></b></span><span><BedDouble size={22} /><b>Stay & explore<small>Accommodation details coming soon</small></b></span><span><Trophy size={22} /><b>Collective glory<small>Compete in the spirit of your house</small></b></span></div></Reveal><Divider className="delegate-end-divider" />
  </div></div>;
}
