import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/accommodation");

export default function AccommodationPage() {
  return <ReferencePortalPage config={portalPages["/accommodation"]} breadcrumbPath="/accommodation" />;
}
