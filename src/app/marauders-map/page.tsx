import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { BackLink, SoonBadge } from "@/components/coming-soon";
import { Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { Map } from "lucide-react";

export const metadata = createPageMetadata("/marauders-map");

export default function MaraudersMapPage() {
  return (
    <div className="inner-page">
      <BreadcrumbsSchema path="/marauders-map" />
      <div className="shell">
        <Reveal className="inner-hero centered">
          <Eyebrow>I solemnly swear that I am up to no good</Eyebrow>
          <div className="coming-soon-icon">
            <Map size={64} strokeWidth={1} />
          </div>
          <h1>
            The Marauder&apos;s
            <br />
            <em>Map</em>
          </h1>
          <p>
            The interactive event explorer and campus navigation
            <br />
            is being charted. Mischief managed — soon.
          </p>
          <SoonBadge>Map revealing soon</SoonBadge>
          <BackLink />
        </Reveal>
      </div>
    </div>
  );
}

/*
// ORIGINAL CODE - Commented out for coming soon
import { BreadcrumbsSchema } from "@/components/structured-data";
import { MaraudersMapExplorer } from "@/components/marauders-map";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/marauders-map");

export default function MaraudersMapPage() {
  return <div className="marauders-route"><BreadcrumbsSchema path="/marauders-map" /><MaraudersMapExplorer /></div>;
}
*/
