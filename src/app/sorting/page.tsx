import { redirect } from "next/navigation";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata("The Sorting Ceremony", "Discover your place in the Technika 2K26 wizarding world.", "/sorting");

// Compatibility for existing bookmarks; the ceremony now lives inside signup.
export default function SortingPage() { redirect("/signup?step=ceremony"); }
