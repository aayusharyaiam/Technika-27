import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { CoreShowcase } from "@/components/core-showcase";

export const metadata = createPageMetadata("/core");

export default function CorePage() {
  return (
    <>
      <BreadcrumbsSchema path="/core" />
      <CoreShowcase />
    </>
  );
}
