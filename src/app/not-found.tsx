import Link from "next/link";
import { ArrowLeft, WandSparkles } from "lucide-react";
import { Divider, Eyebrow } from "@/components/ornaments";

export default function NotFound() {
  return <section className="not-found shell"><WandSparkles size={42} strokeWidth={1} /><Eyebrow>A little wrong turn</Eyebrow><span className="not-found-number">404</span><h1>This passage is <em>enchanted.</em></h1><p>Even the Marauder’s Map can’t find this page.<br />Let’s get you back to the castle.</p><Divider /><Link href="/" className="button button-gold"><ArrowLeft size={16} />Return home</Link></section>;
}
