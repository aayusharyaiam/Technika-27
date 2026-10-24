import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Code2,
  Cpu,
  FlaskConical,
  GraduationCap,
  MapPin,
  Orbit,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Divider, Eyebrow } from "./ornaments";
import { Reveal } from "./reveal";

export function PrizePool() {
  return (
    <section className="prize-pool-section" id="prize-pool">
      <Reveal className="shell prize-pool-card">
        <div className="prize-pool-copy">
          <span className="prize-pool-label">The Technika 2K26 prize pool</span>
          <strong>5 Lakhs+</strong>
          <p>Cash prizes + goodies across Technical, Cultural &amp; Fun.</p>
        </div>
        <div className="prize-pool-actions">
          <Link href="/events" className="button button-glass">
            All events <ArrowUpRight size={15} />
          </Link>
          <Link href="/technical" className="button button-glass">
            Technical <Code2 size={15} />
          </Link>
          <Link href="/cultural" className="button button-glass">
            Cultural <Sparkles size={15} />
          </Link>
          <Link href="/esports" className="button button-glass">
            E-sports <Cpu size={15} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function PreviousTechnika() {
  const memories = [
    { src: "/images/memory-1.webp", alt: "A Technika festival memory" },
    { src: "/images/memory-2.webp", alt: "Students taking part in Technika" },
    { src: "/images/memory-3.webp", alt: "A Technika performance memory" },
  ];

  return (
    <section className="previous-section section" id="previous-technika">
      <div className="shell">
        <Reveal className="previous-panel">
          <div className="previous-heading">
            <span className="previous-kicker">Technika 2K26</span>
            <h2>Previous <em>Technika.</em></h2>
            <p>A look back at the ideas, energy, and memories that shaped our last chapter.</p>
          </div>
          <div className="previous-gallery" aria-label="Technika memories">
            {memories.map((memory, index) => (
              <figure className={`previous-memory previous-memory-${index + 1}`} key={memory.src}>
                <Image src={memory.src} width={700} height={520} alt={memory.alt} />
                <figcaption>Memory 0{index + 1}</figcaption>
              </figure>
            ))}
          </div>
          <Link href="/alumni" className="text-link">
            Visit the memory archive <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section about-section" id="about">
      <div className="shell about-grid">
        <Reveal className="about-visual">
          <div className="crest-orbit orbit-one" />
          <div className="crest-orbit orbit-two" />
          <span className="orbit-star star-one">✧</span>
          <span className="orbit-star star-two">✦</span>
          <Image
            src="/images/crest.webp"
            width={500}
            height={500}
            alt="Technika 2K26 festival crest"
            className="about-crest"
          />
          <span className="crest-caption">INNOVATE. CREATE. INSPIRE.</span>
          <div className="crest-small-divider" />
        </Reveal>
        <Reveal className="about-copy parchment-sheet" delay={0.15}>
          <span className="notebook-overline">Technika 2K26 · BIT Patna</span>
          <Eyebrow>Innovation in motion</Eyebrow>
          <h2>Where bright minds make <em>what&apos;s next.</em></h2>
          <p>Technika is the annual technical festival of Birla Institute of Technology, Patna — a celebration of innovation, creativity, and hands-on engineering excellence.</p>
          <p>Over the years, Technika has evolved into a dynamic platform where students demonstrate their skills through competitions, hackathons, workshops, exhibitions, and expert sessions by industry professionals.</p>
          <div className="about-features">
            <span><Code2 size={17} /><b>30+ <small>Events</small></b></span>
            <span><Users size={17} /><b>1000+ <small>Participants</small></b></span>
            <span><Trophy size={17} /><b>10+ <small>Colleges</small></b></span>
          </div>
          <Link href="/events" className="text-link">Explore all events <ArrowUpRight size={17} /></Link>
          <span className="coffee-ring" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}

export function Campus() {
  return (
    <section className="section campus-section" id="campus">
      <div className="shell">
        <Reveal className="campus-panel">
          <div className="campus-art">
            <Image
              src="/images/great-hall-1.webp"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              alt="BIT Patna campus and community"
            />
            <div className="campus-art-shade" />
            <span className="campus-art-label"><MapPin size={13} />ABOUT BIT PATNA</span>
          </div>
          <div className="campus-copy">
            <Eyebrow>Institution</Eyebrow>
            <h2>About BIT <em>Patna.</em></h2>
            <p>Birla Institute of Technology, Patna Campus is an extension of BIT Mesra, established to foster quality technical education and innovation in Eastern India.</p>
            <p>The campus provides a modern academic environment with strong research culture, experienced faculty, and a vibrant student community focused on holistic growth.</p>
            <div className="campus-points">
              <span><GraduationCap size={19} /><b>BIT legacy<small>Rooted in BIT Mesra excellence</small></b></span>
              <span><FlaskConical size={19} /><b>Modern campus<small>Innovation &amp; technical growth</small></b></span>
            </div>
            <a href="https://www.bitmesra.ac.in/" target="_blank" rel="noreferrer" className="text-link">Discover BIT <ArrowUpRight size={16} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const partners = [
  { name: "GAIL", role: "Official Partner", Icon: Orbit },
  { name: "PANIKA", role: "Hydration Partner", Icon: Sparkles },
  { name: "tiqr event", role: "Digital Media Partner", Icon: Orbit },
  { name: "ADBARK THREADS", role: "Merchandise Partner", Icon: Code2 },
  { name: "unique PATNA", role: "Social Media Partner", Icon: Users },
  { name: "Jio Saavn", role: "Official Music Streaming Partner", Icon: BookOpen },
];

export function Sponsors() {
  return (
    <section id="sponsors" className="section sponsors-section">
      <div className="shell">
        <Reveal className="section-intro">
          <Eyebrow>Collaborating with the best</Eyebrow>
          <h2>Technika 2K26.<br /><em>Made possible together.</em></h2>
          <p>The partners who helped bring ideas, energy, and opportunity to the festival.</p>
          <Divider />
        </Reveal>
        <Reveal>
          <div className="sponsor-grid">
            {partners.map(({ name, role, Icon }) => (
              <div className="sponsor-card" key={name}>
                <Icon size={25} strokeWidth={1.3} />
                <span>{name}</span>
                <small>{role}</small>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="sponsor-invite">
          <div>
            <span className="eyebrow">Build the next chapter</span>
            <h3>Partner with Technika.</h3>
            <p>Bring your brand, ideas, and ambition to BIT Patna.</p>
          </div>
          <Link href="/contact" className="button button-glass">Become a partner <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Invitation() {
  return (
    <section className="invitation-section">
      <Reveal className="shell invitation">
        <span className="invitation-star">✧</span>
        <Eyebrow>The next chapter starts here</Eyebrow>
        <h2>Bring your ideas.<br /><em>Make them matter.</em></h2>
        <p>Join the festival where technology meets creativity, competition, and community.</p>
        <Link href="/registrations" className="button button-gold">Register now <ArrowRight size={16} /></Link>
        <span className="invitation-oath"><CalendarDays size={11} /> 16 — 18 JANUARY 2026 <i>✦</i> BIT PATNA</span>
      </Reveal>
    </section>
  );
}
