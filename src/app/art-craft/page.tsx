import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/art-craft");

export default function ArtCraftPage() {
  return <ReferencePortalPage config={portalPages["/art-craft"]} breadcrumbPath="/art-craft" />;
}
