import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/events");

export default function EventsPage() {
  return <ReferencePortalPage config={portalPages["/events"]} breadcrumbPath="/events" />;
}
