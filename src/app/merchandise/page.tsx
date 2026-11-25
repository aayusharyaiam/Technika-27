import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { ShoppingBag } from "lucide-react";

export const metadata = createPageMetadata("/merchandise");

export default function MerchandisePage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/merchandise" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Technika Emporium</Eyebrow>
          <div className="coming-soon-icon">
            <ShoppingBag size={64} strokeWidth={1} />
          </div>
          <h1>
            Festival
            <br />
            <em>Merchandise</em>
          </h1>
          <p>
            Official Technika &apos;27 merchandise is being crafted.
            <br />
            T-shirts, hoodies, and magical collectibles — coming soon.
          </p>
          <SoonBadge>Merchandise catalogue coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/merchandise");

export default function MerchandisePage() {
  return <ReferencePortalPage config={portalPages["/merchandise"]} breadcrumbPath="/merchandise" />;
}
*/
