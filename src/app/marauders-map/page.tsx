import { BreadcrumbsSchema } from "@/components/structured-data";
import { MaraudersMapExplorer } from "@/components/marauders-map";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/marauders-map");

export default function MaraudersMapPage() {
  return <div className="marauders-route"><BreadcrumbsSchema path="/marauders-map" /><MaraudersMapExplorer /></div>;
}
