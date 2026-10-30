import Link from "next/link";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { Divider, Eyebrow } from "@/components/ornaments";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/privacy-policy");

export default function PrivacyPolicyPage() {
  return <div className="inner-page legal-page"><BreadcrumbsSchema path="/privacy-policy" /><div className="shell legal-shell">
    <section className="inner-hero centered"><Eyebrow>The quiet room</Eyebrow><h1>Your privacy<br /><em>matters here.</em></h1><p>A clear, human explanation of how the Technika team handles information shared through this website.</p></section>
    <article className="legal-card parchment-sheet">
      <p className="legal-updated">Last updated: October 25, 2026</p>
      <h2>What we collect</h2><p>When you create an account, register interest, or send an enquiry, we may collect your name, college, contact details, email address, and the message you choose to share. We only ask for information needed to operate the festival experience.</p>
      <h2>How we use it</h2><p>We use information to provide account access, respond to enquiries, manage event participation when those flows open, improve the website, and understand anonymous traffic through Google Analytics when enabled.</p>
      <h2>Service providers</h2><p>Authentication and account data may be processed by Supabase. Analytics, when configured, is provided by Google. These services receive only the data needed for their specific function and are governed by their own policies.</p>
      <h2>Your choices</h2><p>You can request access, correction, or deletion of personal information by using the <Link href="/contact">contact form</Link>. You can also choose not to create an account or disable cookies in your browser.</p>
      <h2>Retention and security</h2><p>We retain information only for as long as it supports the purpose for which it was collected or as required by law. Reasonable safeguards are used, but no internet service can promise absolute security.</p>
      <Divider /><p className="legal-contact">Questions about this policy? <Link href="/contact">Send an owl to the Technika team.</Link></p>
    </article>
  </div></div>;
}
