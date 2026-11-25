import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { CalendarDays } from "lucide-react";

export const metadata = createPageMetadata("/timeline");

export default function TimelinePage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/timeline" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>Programme Chronicle</Eyebrow>
          <div className="coming-soon-icon">
            <CalendarDays size={64} strokeWidth={1} />
          </div>
          <h1>
            Festival
            <br />
            <em>Timeline</em>
          </h1>
          <p>
            The complete three-day programme schedule —
            <br />
            dates and sessions coming soon.
          </p>
          <SoonBadge>Programme timeline coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/timeline");

export default function TimelinePage() {
  return <ReferencePortalPage config={portalPages["/timeline"]} breadcrumbPath="/timeline" />;
}
*/
