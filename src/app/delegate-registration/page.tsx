import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/delegate-registration");

export default function DelegateRegistrationPage() {
  return <><BreadcrumbsSchema path="/delegate-registration" /><ReferencePortalPage config={portalPages["/delegate-registration"]} /></>;
}
