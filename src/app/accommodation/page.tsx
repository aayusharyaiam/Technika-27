import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { BedDouble } from "lucide-react";

export const metadata = createPageMetadata("/accommodation");

export default function AccommodationPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/accommodation" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>Guest Quarters</Eyebrow>
          <div className="coming-soon-icon">
            <BedDouble size={64} strokeWidth={1} />
          </div>
          <h1>
            Festival
            <br />
            <em>Accommodation</em>
          </h1>
          <p>
            Accommodation details for visiting delegates and participants
            <br />
            are being arranged. Stay tuned for booking information.
          </p>
          <SoonBadge>Accommodation details coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/accommodation");

export default function AccommodationPage() {
  return <ReferencePortalPage config={portalPages["/accommodation"]} breadcrumbPath="/accommodation" />;
}
*/
