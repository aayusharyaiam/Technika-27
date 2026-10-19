import { ReferencePortalPage } from "@/components/reference-portals";
import { createPageMetadata } from "@/lib/seo";
import { portalPages } from "@/lib/portal-pages";

export const metadata = createPageMetadata("/frame-focus");

export default function FrameFocusPage() {
  return <ReferencePortalPage config={portalPages["/frame-focus"]} breadcrumbPath="/frame-focus" />;
}
