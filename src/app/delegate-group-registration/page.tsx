import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { UsersRound } from "lucide-react";

export const metadata = createPageMetadata("/delegate-group-registration");

export default function DelegateGroupRegistrationPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/delegate-group-registration" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>College Contingent</Eyebrow>
          <div className="coming-soon-icon">
            <UsersRound size={64} strokeWidth={1} />
          </div>
          <h1>
            Group
            <br />
            <em>Registration</em>
          </h1>
          <p>
            Register your entire college contingent together —
            <br />
            group registration portal opening soon.
          </p>
          <SoonBadge>Group registration coming soon</SoonBadge>
          <BackLink />
        </Reveal>
      </div>
    </div>
  );
}

/*
// ORIGINAL CODE - Commented out for coming soon
import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/delegate-group-registration");

export default function DelegateGroupRegistrationPage() {
  return <><BreadcrumbsSchema path="/delegate-group-registration" /><ReferencePortalPage config={portalPages["/delegate-group-registration"]} /></>;
}
*/
