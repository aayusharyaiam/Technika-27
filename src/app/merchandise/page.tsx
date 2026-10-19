import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/merchandise");

export default function MerchandisePage() {
  return <ReferencePortalPage config={portalPages["/merchandise"]} breadcrumbPath="/merchandise" />;
}
