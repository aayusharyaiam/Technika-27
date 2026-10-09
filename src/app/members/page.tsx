import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { ScrollText, Sparkles } from "lucide-react";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { OrderGallery } from "@/components/order-gallery";
import { Divider, Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";

export const metadata = createPageMetadata("/members");

export default function MembersPage() {
  return <div className="inner-page members-page"><BreadcrumbsSchema path="/members" /><div className="shell">
    <Reveal className="inner-hero centered"><Eyebrow>Technika ’27 organising team at BIT Patna</Eyebrow><span className="inner-overline">The student council, volunteers & faculty mentors</span><h1>The Order of <em>Technika.</em></h1><p>Meet the organisers, designers, developers, volunteers, and faculty mentors behind BIT Patna’s techno-cultural festival.<br className="desktop-break" /> The complete roster is being prepared.</p><SoonBadge>The roster is under an enchanted veil</SoonBadge><Divider /></Reveal>
    <Reveal className="order-decree"><div className="notice-seal"><ScrollText size={21} /></div><div><span className="eyebrow">Classified enchantment</span><h3>The Order shall be unveiled soon.</h3><p>The portraits are in place. Their stories are still being written.</p></div><span className="decree-number">DECREE<br /><b>VII</b></span></Reveal>
    <Reveal><OrderGallery /></Reveal>
    <Reveal className="order-invitation"><Sparkles size={25} strokeWidth={1} /><Eyebrow>Every great festival begins with its people</Eyebrow><h2>Many hands. <em>One magnificent spell.</em></h2><p>Creators, organisers, designers, and dreamers.<br />The complete council and volunteer opportunities will be revealed here.</p><BackLink /></Reveal>
  </div></div>;
}
