import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { CalendarDays } from "lucide-react";

export const metadata = createPageMetadata("/events");

export default function EventsPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/events" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Grand Tournament</Eyebrow>
          <div className="coming-soon-icon">
            <CalendarDays size={64} strokeWidth={1} />
          </div>
          <h1>
            Event
            <br />
            <em>Registry</em>
          </h1>
          <p>
            Technical challenges, cultural showcases, and competitions
            <br />
            are being prepared. The full event list arrives soon.
          </p>
          <SoonBadge>Event registry coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/events");

export default function EventsPage() {
  return <ReferencePortalPage config={portalPages["/events"]} breadcrumbPath="/events" />;
}
*/
