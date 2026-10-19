import type { Metadata } from "next";
import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";

export const metadata: Metadata = { title: "Group Delegate Registration — Technika ’27", description: "The Technika ’27 group delegate registration portal is being prepared." };

export default function DelegateGroupRegistrationPage() {
  return <ReferencePortalPage config={portalPages["/delegate-group-registration"]} />;
}
