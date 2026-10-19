import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/esports");

export default function EsportsPage() {
  return <ReferencePortalPage config={portalPages["/esports"]} breadcrumbPath="/esports" />;
}
