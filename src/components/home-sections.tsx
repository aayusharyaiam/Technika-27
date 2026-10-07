import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, Cpu, FlaskConical, Github, GraduationCap, MapPin, Orbit, Sparkles, Trophy, Users } from "lucide-react";
import { Divider, Eyebrow } from "./ornaments";
import { Reveal } from "./reveal";

export function About() {
  return <section className="section about-section" id="about"><div className="shell about-grid">
    <Reveal className="about-visual"><div className="crest-orbit orbit-one" /><div className="crest-orbit orbit-two" /><span className="orbit-star star-one">✧</span><span className="orbit-star star-two">✦</span><Image src="/images/crest.webp" width={500} height={500} alt="Technika 27 crest: a Golden Snitch, Elder Wand, and celestial gold seal" className="about-crest" /><span className="crest-caption">CODE. CREATE. CONJURE.</span><div className="crest-small-divider" /></Reveal>
    <Reveal className="about-copy parchment-sheet" delay={.15}><span className="notebook-overline">From the founder’s notebook · folio 027</span><Eyebrow>The story behind the spell</Eyebrow><h2>Where bright minds<br />make <em>their own magic.</em></h2><p>Some call it a festival. We call it a world of possibilities.</p><p>Technika is BIT Patna’s annual celebration of technology, creativity, and the people daring enough to bring them together. From the thrill of the robotics arena to ideas that outlive an overnight hackathon, this is where curiosity finds its tribe.</p><p>This year, we’re stepping into the Wizarding World. Bring your boldest ideas, your house spirit, and a willingness to believe in the extraordinary.</p><span className="coffee-ring" aria-hidden="true"/>
      <div className="about-features"><span><Code2 size={17} />Innovation without limits</span><span><Users size={17} />A community of creators</span><span><Trophy size={17} />Memories worth winning</span></div>
      <Link href="/registrations" className="text-link">Find your place in the story <ArrowUpRight size={17} /></Link>
    </Reveal>
  </div></section>;
}

export function Campus() {
  return <section className="section campus-section" id="campus"><div className="shell">
    <Reveal className="campus-panel"><div className="campus-art"><Image src="/images/great-hall-1.webp" fill sizes="(max-width: 768px) 100vw, 45vw" alt="An enchanted Gothic great hall with soaring arches and warm candlelight" /><div className="campus-art-shade" /><span className="campus-art-label"><MapPin size={13} />OUR REAL-WORLD HOGWARTS</span></div><div className="campus-copy"><Eyebrow>The home of the magic</Eyebrow><h2>A legacy of learning.<br /><em>A future of possibility.</em></h2><p>Birla Institute of Technology, Patna is an off-campus of BIT Mesra, established in 2006. Set in the historic heart of Bihar, it brings together engineering, research, and a vibrant student community.</p><p>For three extraordinary days, our classrooms become chambers of ideas, our grounds become arenas, and our campus becomes your home.</p><div className="campus-points"><span><GraduationCap size={19} /><b>Since 2006<small>A tradition of excellence</small></b></span><span><FlaskConical size={19} /><b>Built for discovery<small>Engineering meets imagination</small></b></span></div><a href="https://www.bitmesra.ac.in/" target="_blank" rel="noreferrer" className="text-link">Discover BIT <ArrowUpRight size={16} /></a></div></Reveal>
  </div></section>;
}

const partners = [
  { name: "Google Cloud", role: "Cloud ally", Icon: Orbit },
  { name: "GitHub", role: "Code companion", Icon: Github },
  { name: "intel", role: "Silicon sorcery", Icon: Cpu },
  { name: "Polygon", role: "Web3 portal", Icon: Code2 },
  { name: "Devfolio", role: "Innovation guild", Icon: BookOpen },
  { name: "Red Bull", role: "Energy elixir", Icon: Sparkles },
];

export function Sponsors() {
  return <section id="sponsors" className="section sponsors-section"><div className="shell">
    <Reveal className="section-intro"><Eyebrow>The Patronus alliance</Eyebrow><h2>Extraordinary things.<br /><em>Made possible together.</em></h2><p>The allies who help our ideas take flight.</p><Divider /></Reveal>
    <Reveal><div className="sponsor-grid">{partners.map(({ name, role, Icon }) => <div className="sponsor-card" key={name}><Icon size={25} strokeWidth={1.3} /><span>{name}</span><small>{role}</small></div>)}</div><p className="schedule-note">Concept partner lineup from the design reference. Official sponsors will be announced soon.</p></Reveal>
    <Reveal className="sponsor-invite"><div><span className="eyebrow">A little shared ambition</span><h3>Help us make the extraordinary happen.</h3><p>Join the Patronus Council and be part of the next chapter.</p></div><Link href="/contact" className="button button-glass">Become a partner <ArrowUpRight size={16} /></Link></Reveal>
  </div></section>;
}

export function Invitation() {
  return <section className="invitation-section"><Reveal className="shell invitation"><span className="invitation-star">✧</span><Eyebrow>Your letter has arrived</Eyebrow><h2>The ordinary can wait.<br /><em>Your adventure cannot.</em></h2><p>The castle is calling. Will you answer?</p><Link href="/registrations" className="button button-gold">Begin your next chapter <ArrowRight size={16} /></Link><span className="invitation-oath">08 — 10 JANUARY 2027 <i>✦</i> BIT PATNA</span></Reveal></section>;
}
