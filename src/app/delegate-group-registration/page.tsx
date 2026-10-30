import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/delegate-group-registration");

export default function DelegateGroupRegistrationPage() {
  return <><BreadcrumbsSchema path="/delegate-group-registration" /><ReferencePortalPage config={portalPages["/delegate-group-registration"]} /></>;
}
