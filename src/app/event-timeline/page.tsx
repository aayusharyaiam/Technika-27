import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/event-timeline");

export default function EventTimelinePage() {
  return <ReferencePortalPage config={portalPages["/event-timeline"]} breadcrumbPath="/event-timeline" />;
}
