import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/technical");

export default function TechnicalPage() {
  return <ReferencePortalPage config={portalPages["/technical"]} breadcrumbPath="/technical" />;
}
