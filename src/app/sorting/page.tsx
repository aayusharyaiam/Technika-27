import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "The Sorting Ceremony", description: "Discover your place in the Technika 27 wizarding world.", robots: { index: false, follow: false } };

// Compatibility for existing bookmarks; the ceremony now lives inside signup.
export default function SortingPage() { redirect("/signup?step=ceremony"); }
