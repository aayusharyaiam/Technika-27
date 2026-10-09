import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";

export function Footer() {
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div className="footer-about">
        <Link href="/" className="brand"><Image src="/images/crest.webp" width={55} height={55} alt="" /><span>TECHNIKA <b>’27</b><small>WHERE TECHNOLOGY MEETS MAGIC</small></span></Link>
        <p>The annual techno-cultural festival of Birla Institute of Technology, Patna. A gathering of curious minds and extraordinary possibilities.</p>
        <span className="footer-oath"><Sparkles size={13} /> Solemnly sworn. Spectacularly built.</span>
      </div>
      <div><h3>The grand halls</h3><Link href="/#timeline">Festival timeline</Link><Link href="/#about">Our story</Link><Link href="/#campus">BIT Patna</Link><Link href="/#sponsors">Our sponsors</Link></div>
      <div><h3>Order & portals</h3><Link href="/registrations">Registrations</Link><Link href="/members">The inner sanctum</Link><Link href="/delegate">Delegate enclave</Link><Link href="/alumni">Hall of legacies</Link><Link href="/login">Your common room</Link></div>
      <div><h3>Find the magic</h3><p className="footer-address"><MapPin size={16} />BIT Patna, Near Patna Airport<br />Bihar, India · 800014</p><Link className="footer-contact" href="/contact">Send an owl <ArrowUpRight size={13} /></Link><a href="https://www.bitmesra.ac.in" target="_blank" rel="noreferrer">Explore BIT Mesra <ArrowUpRight size={13} /></a></div>
    </div>
    <div className="shell footer-bottom"><span>© 2027 Technika · BIT Patna. Mischief managed.</span><span>Made of code. <i>Powered by magic.</i><Sparkles size={11} /></span></div>
  </footer>;
}
