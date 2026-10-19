import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/timeline");

export default function TimelinePage() {
  return <ReferencePortalPage config={portalPages["/timeline"]} breadcrumbPath="/timeline" />;
}
