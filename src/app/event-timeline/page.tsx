import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Clock } from "lucide-react";

export const metadata = createPageMetadata("/event-timeline");

export default function EventTimelinePage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/event-timeline" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>Live Schedule</Eyebrow>
          <div className="coming-soon-icon">
            <Clock size={64} strokeWidth={1} />
          </div>
          <h1>
            Event
            <br />
            <em>Timeline</em>
          </h1>
          <p>
            Live event schedule and real-time updates —
            <br />
            will be activated during the festival.
          </p>
          <SoonBadge>Live timeline coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/event-timeline");

export default function EventTimelinePage() {
  return <ReferencePortalPage config={portalPages["/event-timeline"]} breadcrumbPath="/event-timeline" />;
}
*/
