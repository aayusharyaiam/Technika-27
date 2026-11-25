import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Code2 } from "lucide-react";

export const metadata = createPageMetadata("/devs");

export default function DevelopersPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/devs" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>The Web Sorcerers</Eyebrow>
          <div className="coming-soon-icon">
            <Code2 size={64} strokeWidth={1} />
          </div>
          <h1>
            The
            <br />
            <em>Developers</em>
          </h1>
          <p>
            Meet the wizards behind the magic — the development team
            <br />
            credits and profiles will be revealed soon.
          </p>
          <SoonBadge>Developer profiles coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/devs");

export default function DevelopersPage() {
  return <ReferencePortalPage config={portalPages["/devs"]} breadcrumbPath="/devs" />;
}
*/
