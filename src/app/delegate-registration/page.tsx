import type { Metadata } from "next";
import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";

export const metadata: Metadata = { title: "Delegate Registration — Technika ’27", description: "The Technika ’27 delegate registration portal is being prepared." };

export default function DelegateRegistrationPage() {
  return <ReferencePortalPage config={portalPages["/delegate-registration"]} />;
}
