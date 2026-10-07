import type { Metadata } from "next";
import Image from "next/image";
import { LockKeyhole, Shield, Sparkles } from "lucide-react";
import { BackLink, CalendarButton, Countdown, SoonBadge } from "@/components/coming-soon";
import { Divider, Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { houses } from "@/lib/festival";

export const metadata: Metadata = { title: "Registrations — The Sorting Ceremony" };

export default function RegistrationsPage() {
  return <div className="inner-page registration-page"><div className="inner-backdrop"><Image src="/images/great-hall-1.webp" fill sizes="100vw" alt="" priority /></div><div className="shell">
    <Reveal className="inner-hero centered"><Eyebrow>Decree of the sorting ceremony</Eyebrow><h1>The Great Hall gates<br />will soon <em>unseal.</em></h1><p>The Sorting Hat is deliberating. Your place in the story is being prepared.<br className="desktop-break" /> Bring your curiosity. We’ll bring the magic.</p><SoonBadge>Registrations coming soon</SoonBadge></Reveal>
    <Reveal className="registration-clock"><Countdown /><div className="sorting-quote"><Sparkles size={20} /><blockquote>“It is our choices that show what we truly are,<br />far more than our abilities.”<cite>Choose your quest. Find your house.</cite></blockquote></div></Reveal>
    <section className="houses-section" id="houses"><Reveal className="section-heading-row"><div><Eyebrow>House guild alignments</Eyebrow><h2>Four houses. <em>One extraordinary journey.</em></h2></div><p>Different strengths. A shared spirit.<br />Which hall will claim you?</p></Reveal><div className="house-grid">{houses.map((house, i) => <Reveal delay={i * .08} key={house.name}><article className="house-card" style={{ "--house-color": house.color } as React.CSSProperties}><span className="house-watermark">{house.rune}</span><div className="house-seal"><Shield size={22} strokeWidth={1.25} /><b>{house.rune}</b></div><span className="house-track">{house.track}</span><h3>House {house.name}</h3><h4>{house.title}</h4><p>{house.description}</p><span className="house-locked"><LockKeyhole size={11} />Gate sealed</span></article></Reveal>)}</div></section>
    <Reveal className="sealed-notice"><div className="notice-seal"><LockKeyhole size={23} /></div><h2>Your invitation is <em>being written.</em></h2><p>Event passes, competition details, and the registration portal will appear here when the gates open. Until then, keep these three days free for a little magic.</p><CalendarButton /><Divider /><BackLink /></Reveal>
    <section className="faq-section"><Reveal><Eyebrow>Tomes of inquiry</Eyebrow><h2>A few answers <em>before the adventure.</em></h2><div className="faq-list"><details><summary>Who can take part in Technika ’27?</summary><p>Technika brings together college students, creators, and technology enthusiasts. Event-specific eligibility will be published with the final registration information.</p></details><details><summary>Can students from other colleges attend?</summary><p>The delegate portal is being prepared for visiting college contingents. College participation, team rules, and pass details will be announced when registrations open.</p></details><details><summary>When will the full programme be announced?</summary><p>The final programme and registration dates are coming soon. The January 8–10 timeline on the home page is an illustrative preview.</p></details><details><summary>Will accommodation be available?</summary><p>Accommodation arrangements and availability for outstation students will be announced on the delegate page alongside the final festival information.</p></details></div></Reveal></section>
  </div></div>;
}
