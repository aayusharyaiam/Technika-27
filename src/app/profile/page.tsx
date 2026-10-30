import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("Profile Ledger — Technika ’27", "The Technika ’27 profile portal is being prepared.", "/profile");

export default function ProfilePage() {
  return <ReferencePortalPage config={portalPages["/profile"]} />;
}
