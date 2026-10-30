import { breadcrumbSchema, siteName, siteUrl, socialImage, type SitePath } from "@/lib/seo";
import Link from "next/link";

export function JsonLd({ data, id }: { data: object; id: string }) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function BreadcrumbsSchema({ path }: { path: SitePath }) {
  return <>
    <JsonLd id="page-breadcrumbs" data={breadcrumbSchema(path)} />
    <nav className="breadcrumbs shell" aria-label="Breadcrumb">
      <Link href="/">{siteName}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{breadcrumbSchema(path).itemListElement.at(-1)?.name}</span>
    </nav>
  </>;
}

export function SiteSchema() {
  return <JsonLd id="festival-site-schema" data={{
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: siteName, description: "The annual technical festival of Birla Institute of Technology, Patna.", inLanguage: "en-IN", publisher: { "@id": `${siteUrl}/#festival` }, image: `${siteUrl}${socialImage}` },
      { "@type": "Organization", "@id": `${siteUrl}/#festival`, name: siteName, url: `${siteUrl}/`, logo: `${siteUrl}/images/crest.webp`, image: `${siteUrl}${socialImage}`, email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined, parentOrganization: { "@id": `${siteUrl}/#bit-patna` } },
      { "@type": "CollegeOrUniversity", "@id": `${siteUrl}/#bit-patna`, name: "Birla Institute of Technology, Patna", url: "https://www.bitmesra.ac.in/", address: { "@type": "PostalAddress", streetAddress: "Near Patna Airport", addressLocality: "Patna", addressRegion: "Bihar", postalCode: "800014", addressCountry: "IN" } },
    ],
  }} />;
}
