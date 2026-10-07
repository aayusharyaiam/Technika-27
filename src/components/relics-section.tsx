import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GobletTower } from "./goblet-tower";
import { DeathlyHallows } from "./deathly-hallows";
import { Eyebrow } from "./ornaments";
import { Reveal } from "./reveal";

export function RelicsSection() {
  return <section className="section relics-section" id="relics"><div className="shell"><Reveal className="section-intro"><Eyebrow>Relics of an extraordinary world</Eyebrow><h2>Some legends are read.<br /><em>Others are lived.</em></h2><p>Fire that chooses its champions. A tale that outlives its tellers.</p></Reveal><div className="relics-grid"><Reveal className="goblet-chapter"><GobletTower/><div className="goblet-chapter-copy"><Eyebrow>The fourth tournament</Eyebrow><h3>The Goblet is <em>calling.</em></h3><p>Not for a name on a piece of parchment. For your curiosity, your courage, and the idea only you can bring.</p><Link href="/signup" className="text-link">Put your name into the story <ArrowUpRight size={15}/></Link></div></Reveal><Reveal delay={.15} className="hallows-chapter"><DeathlyHallows/></Reveal></div></div></section>;
}
