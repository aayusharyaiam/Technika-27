import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/cultural");

export default function CulturalPage() {
  return <ReferencePortalPage config={portalPages["/cultural"]} breadcrumbPath="/cultural" />;
}
