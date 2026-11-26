import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Cpu } from "lucide-react";

export const metadata = createPageMetadata("/technical");

export default function TechnicalPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/technical" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Technical Chamber</Eyebrow>
          <div className="coming-soon-icon">
            <Cpu size={64} strokeWidth={1} />
          </div>
          <h1>
            Technical
            <br />
            <em>Events</em>
          </h1>
          <p>
            Hackathons, robotics, coding challenges —
            <br />
            technical events are being prepared.
          </p>
          <SoonBadge>Technical events coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/technical");

export default function TechnicalPage() {
  return <ReferencePortalPage config={portalPages["/technical"]} breadcrumbPath="/technical" />;
}
*/
