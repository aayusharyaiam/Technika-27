import type { Metadata } from "next";
import { ArrowUpRight, Bird, Compass, MapPin, ScrollText, Send } from "lucide-react";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Divider, Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Contact — The Owlery" };

export default function ContactPage() {
  return <div className="inner-page contact-page"><div className="shell">
    <Reveal className="inner-hero centered"><Eyebrow>The owlery & grand sanctum</Eyebrow><h1>Some messages<br />deserve <em>a little magic.</em></h1><p>Questions, ideas, or an extraordinary alliance?<br />Our owls are getting ready to carry your words.</p><SoonBadge>Contact channels coming soon</SoonBadge></Reveal>
    <div className="owlery-grid"><Reveal className="owl-letter"><span className="letter-corner corner-tl" /><span className="letter-corner corner-br" /><div className="letter-top"><ScrollText size={24} strokeWidth={1} /><span>OWL POST · TECHNIKA ’27</span></div><h2>Dear <em>future wizard,</em></h2><p>We’re putting the final touches on our Owlery. The festival’s official contacts and enquiry channels will be unveiled here soon.</p><p>Whether you’re looking for a place in the tournament, planning your college’s grand arrival, or dreaming of a partnership — we can’t wait to hear from you.</p><Divider /><div className="letter-signoff"><span>Until the gates open,<br /><b>The Order of Technika</b></span><div className="wax-seal"><span>T</span><small>’27</small></div></div><BackLink /></Reveal><Reveal className="owl-art" delay={.15}><div className="owl-moon" /><div className="owl-constellation"><i /><i /><i /><i /><i /></div><Bird className="owl-bird" size={130} strokeWidth={.6} /><span className="owl-flight-line" /><Send className="owl-envelope" size={38} strokeWidth={.9} /><div className="owl-art-caption"><span className="eyebrow">The next dispatch</span><h3>Words take flight.<br /><em>Magic finds a way.</em></h3><span>THE OWLERY OPENS SOON</span></div></Reveal></div>
    <Reveal className="contact-location"><div className="location-compass"><Compass size={52} strokeWidth={.8} /></div><div><Eyebrow>Your waypoint to the magic</Eyebrow><h2>The grand sanctum of <em>BIT Patna.</em></h2><p><MapPin size={14} />Birla Institute of Technology, Patna Campus<br />Near Patna Airport, Bihar · 800014</p></div><a className="button button-glass" href="https://www.google.com/maps/search/?api=1&query=Birla+Institute+of+Technology+Patna" target="_blank" rel="noreferrer">Find the campus <ArrowUpRight size={15} /></a></Reveal>
  </div></div>;
}
