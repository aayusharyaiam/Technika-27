import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { UserPlus } from "lucide-react";

export const metadata = createPageMetadata("/delegate-registration");

export default function DelegateRegistrationPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/delegate-registration" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>Individual Delegate</Eyebrow>
          <div className="coming-soon-icon">
            <UserPlus size={64} strokeWidth={1} />
          </div>
          <h1>
            Delegate
            <br />
            <em>Registration</em>
          </h1>
          <p>
            Register as an individual delegate from your college —
            <br />
            registration portal opening soon.
          </p>
          <SoonBadge>Delegate registration coming soon</SoonBadge>
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

export const metadata = createPageMetadata("/delegate-registration");

export default function DelegateRegistrationPage() {
  return <><BreadcrumbsSchema path="/delegate-registration" /><ReferencePortalPage config={portalPages["/delegate-registration"]} /></>;
}
*/
