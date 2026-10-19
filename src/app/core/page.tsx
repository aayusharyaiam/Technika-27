import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/core");

export default function CorePage() {
  return <ReferencePortalPage config={portalPages["/core"]} breadcrumbPath="/core" />;
}
