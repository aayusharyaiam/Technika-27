import { breadcrumbSchema, siteUrl, type SitePath } from "@/lib/seo";

export function JsonLd({ data, id }: { data: object; id: string }) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function BreadcrumbsSchema({ path }: { path: SitePath }) {
  return <JsonLd id="page-breadcrumbs" data={breadcrumbSchema(path)} />;
}

export function SiteSchema() {
  return <JsonLd id="festival-site-schema" data={{
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: "Technika ’27 — BIT Patna", description: "The techno-cultural festival of Birla Institute of Technology, Patna.", inLanguage: "en-IN", publisher: { "@id": `${siteUrl}/#festival` } },
      { "@type": "Organization", "@id": `${siteUrl}/#festival`, name: "Technika — BIT Patna", url: `${siteUrl}/`, logo: `${siteUrl}/images/crest.webp`, parentOrganization: { "@id": `${siteUrl}/#bit-patna` } },
      { "@type": "CollegeOrUniversity", "@id": `${siteUrl}/#bit-patna`, name: "Birla Institute of Technology, Patna", address: { "@type": "PostalAddress", addressLocality: "Patna", addressRegion: "Bihar", postalCode: "800014", addressCountry: "IN" } },
    ],
  }} />;
}
