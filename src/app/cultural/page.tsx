import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Music } from "lucide-react";

export const metadata = createPageMetadata("/cultural");

export default function CulturalPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/cultural" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Cultural Chamber</Eyebrow>
          <div className="coming-soon-icon">
            <Music size={64} strokeWidth={1} />
          </div>
          <h1>
            Cultural
            <br />
            <em>Events</em>
          </h1>
          <p>
            Dance, music, drama, and artistic showcases —
            <br />
            the cultural programme is being curated.
          </p>
          <SoonBadge>Cultural events coming soon</SoonBadge>
          <BackLink />
        </Reveal>
      </div>
    </div>
  );
}

/*
// ORIGINAL CODE - Commented out for coming soon
import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/cultural");

export default function CulturalPage() {
  return <ReferencePortalPage config={portalPages["/cultural"]} breadcrumbPath="/cultural" />;
}
*/
