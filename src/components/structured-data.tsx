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
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Technika 2k27 — BIT Patna",
        alternateName: ["Technika 2k27", "Technika '27", "Technika 2027", "BIT Patna Fest"],
        description: "Official portal of Technika 2k27, the flagship annual techno-cultural festival of Birla Institute of Technology, Patna.",
        inLanguage: "en-IN",
        publisher: { "@id": `${siteUrl}/#festival` }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#festival`,
        name: "Technika 2k27 — BIT Patna",
        alternateName: ["Technika '27", "Technika 2027", "Technika BIT Patna"],
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/crest.webp`,
        parentOrganization: { "@id": `${siteUrl}/#bit-patna` }
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": `${siteUrl}/#bit-patna`,
        name: "Birla Institute of Technology, Patna",
        alternateName: "BIT Patna",
        url: "https://www.bitmesra.ac.in/",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near Patna Airport",
          addressLocality: "Patna",
          addressRegion: "Bihar",
          postalCode: "800014",
          addressCountry: "IN"
        }
      },
      {
        "@type": "Festival",
        "@id": `${siteUrl}/#event`,
        name: "Technika 2k27 — The Triwizard Tech Odyssey",
        alternateName: ["Technika 2k27", "Technika '27", "Technika 2027 Fest"],
        startDate: "2027-01-08T09:00:00+05:30",
        endDate: "2027-01-10T22:00:00+05:30",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "BIT Patna Campus",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Patna",
            addressRegion: "Bihar",
            postalCode: "800014",
            addressCountry: "IN"
          }
        },
        organizer: { "@id": `${siteUrl}/#festival` },
        description: "Technika 2k27 is the annual inter-college techno-cultural festival hosted by BIT Patna featuring hackathons, robotics tournaments, AI challenges, cybersecurity capture-the-flag, gaming, and musical pro-nights."
      }
    ],
  }} />;
}
