import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Gamepad2 } from "lucide-react";

export const metadata = createPageMetadata("/esports");

export default function EsportsPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/esports" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The E-Sports Arena</Eyebrow>
          <div className="coming-soon-icon">
            <Gamepad2 size={64} strokeWidth={1} />
          </div>
          <h1>
            E-Sports
            <br />
            <em>Tournament</em>
          </h1>
          <p>
            Competitive gaming battles and tournaments —
            <br />
            game titles and brackets coming soon.
          </p>
          <SoonBadge>E-Sports arena coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/esports");

export default function EsportsPage() {
  return <ReferencePortalPage config={portalPages["/esports"]} breadcrumbPath="/esports" />;
}
*/
