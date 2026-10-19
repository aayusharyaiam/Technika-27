import type { Metadata } from "next";
import { ReferencePortalPage } from "@/components/reference-portals";
import { portalPages } from "@/lib/portal-pages";

export const metadata: Metadata = { title: "Profile Ledger — Technika ’27", description: "The Technika ’27 profile portal is being prepared." };

export default function ProfilePage() {
  return <ReferencePortalPage config={portalPages["/profile"]} />;
}
