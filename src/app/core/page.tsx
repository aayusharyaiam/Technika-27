import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Crown } from "lucide-react";

export const metadata = createPageMetadata("/core");

export default function CorePage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/core" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Organising Council</Eyebrow>
          <div className="coming-soon-icon">
            <Crown size={64} strokeWidth={1} />
          </div>
          <h1>
            Core
            <br />
            <em>Committee</em>
          </h1>
          <p>
            The leadership behind Technika &apos;27 —
            <br />
            profiles and roles coming soon.
          </p>
          <SoonBadge>Core team reveal coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/core");

export default function CorePage() {
  return <ReferencePortalPage config={portalPages["/core"]} breadcrumbPath="/core" />;
}
*/
