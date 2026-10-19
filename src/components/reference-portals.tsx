import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarClock, CircleUserRound, Clock3, Compass, FileLock2, Image as ImageIcon, LockKeyhole, Package, ScrollText, Shield, Sparkles, UsersRound } from "lucide-react";
import { BreadcrumbsSchema } from "@/components/structured-data";
import { Divider, Eyebrow } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { SoonBadge } from "@/components/coming-soon";
import type { PortalLink, PortalPageConfig } from "@/lib/portal-pages";

const categoryIcons = [BookOpen, Sparkles, ImageIcon, Compass, Shield];

function PortalBackLink({ href = "/", label = "Return to the castle" }: { href?: string; label?: string }) {
  return <Link className="reference-back-link" href={href}><ArrowLeft size={14} />{label}</Link>;
}

function PortalHero({ config }: { config: PortalPageConfig }) {
  return <Reveal className="inner-hero centered reference-portal-hero">
    <Eyebrow>{config.eyebrow}</Eyebrow>
    <h1>{config.title}<br /><em>{config.emphasis}</em></h1>
    <p>{config.description}</p>
    <SoonBadge>{config.status}</SoonBadge>
  </Reveal>;
}

function PortalCard({ link, index }: { link: PortalLink; index: number }) {
  const Icon = categoryIcons[index % categoryIcons.length];
  return <Reveal delay={index * .06} className="reference-card-wrap"><Link className="reference-card" href={link.href}>
    <span className="reference-card-number">{link.mark}</span>
    <span className="reference-card-icon"><Icon size={22} strokeWidth={1.15} /></span>
    <span className="reference-card-kicker">Chamber {link.mark}</span>
    <h2>{link.label}</h2>
    <p>{link.note}</p>
    <span className="reference-card-action">Open chamber <ArrowUpRight size={14} /></span>
  </Link></Reveal>;
}

function HubPortal({ config }: { config: PortalPageConfig }) {
  return <>
    <section className="reference-hub-grid" aria-label="Event chambers">{config.links?.map((link, index) => <PortalCard link={link} index={index} key={link.href} />)}</section>
    <Reveal className="reference-document-strip"><div><span className="reference-strip-icon"><ScrollText size={19} /></span><div><span className="reference-strip-kicker">The locked document shelf</span><h2>Rulebooks and briefs will live here.</h2></div></div><span className="reference-disabled-label"><LockKeyhole size={12} />Not published</span></Reveal>
  </>;
}

function CategoryPortal({ config }: { config: PortalPageConfig }) {
  return <section className="reference-browser" aria-label={`${config.eyebrow} browser`}>
    <div className="reference-browser-visual"><div className="reference-rune"><span>✦</span><b>?</b></div><span className="reference-visual-caption">The archive is sealed</span></div>
    <div className="reference-browser-copy"><span className="reference-mini-label">Selected entry</span><h2>Awaiting the official <em>archive.</em></h2><p>No event names, rules, schedules, venues, registration links, or imagery have been added yet. This chamber is ready for the confirmed content.</p><div className="reference-action-row"><span className="reference-disabled-label"><FileLock2 size={13} />Details unavailable</span><span className="reference-disabled-label"><LockKeyhole size={13} />Registration unavailable</span></div></div>
    <div className="reference-browser-footer"><button type="button" disabled aria-label="Previous archive entry"><ArrowLeft size={14} /></button><span>No entries published yet</span><button type="button" disabled aria-label="Next archive entry"><ArrowRight size={14} /></button></div>
    <div className="reference-slots" aria-label="Reserved entry slots">{["01", "02", "03", "04"].map((slot) => <span key={slot}><i>{slot}</i><small>Reserved</small></span>)}</div>
  </section>;
}

function CataloguePortal() {
  return <section className="reference-catalogue" aria-label="Merchandise catalogue">
    <div className="reference-catalogue-note"><Package size={20} /><div><span className="reference-mini-label">The collection shelf</span><h2>The catalogue is still <em>under seal.</em></h2><p>Product names, images, prices, availability, and order actions will appear here only after they are officially supplied.</p></div></div>
    <div className="reference-product-grid">{["I", "II", "III"].map((mark) => <div className="reference-product-slot" key={mark}><span>{mark}</span><Package size={25} strokeWidth={1} /><small>Product slot reserved</small></div>)}</div>
  </section>;
}

function DirectoryPortal({ config }: { config: PortalPageConfig }) {
  const Icon = UsersRound;
  return <section className="reference-directory" aria-label="Directory">
    <Reveal className="reference-directory-intro"><span className="reference-seal"><Icon size={23} strokeWidth={1.1} /></span><div><span className="reference-mini-label">The directory shelf</span><h2>The names will be revealed <em>in time.</em></h2><p>{config.status}. Official team names, roles, biographies, and credits have not been published yet.</p></div></Reveal>
    <div className="reference-directory-grid">{["I", "II", "III", "IV", "V", "VI"].map((mark, index) => <Reveal delay={index * .05} className="reference-person-slot" key={mark}><span>{mark}</span><CircleUserRound size={27} strokeWidth={1} /><small>Roster slot reserved</small></Reveal>)}</div>
  </section>;
}

function TimelinePortal({ live = false }: { live?: boolean }) {
  return <section className={`reference-timeline ${live ? "reference-live-timeline" : ""}`} aria-label={live ? "Live timeline" : "Festival timeline"}>
    <div className="reference-timeline-topline"><span><Clock3 size={14} />{live ? "Live programme interface" : "Chronicle interface"}</span><span className="reference-live-pill"><i />{live ? "Awaiting schedule" : "Draft view"}</span></div>
    {[
      { mark: "I", label: "First chapter", note: "Official programme entry to be announced." },
      { mark: "II", label: "Second chapter", note: "Official programme entry to be announced." },
      { mark: "III", label: "Final chapter", note: "Official programme entry to be announced." },
    ].map((entry, index) => <Reveal delay={index * .08} className="reference-timeline-row" key={entry.mark}><span className="reference-timeline-mark">{entry.mark}</span><div><span className="reference-mini-label">Programme slot</span><h2>{entry.label}</h2><p>{entry.note}</p></div><span className="reference-disabled-label"><CalendarClock size={13} />Time TBA</span></Reveal>)}
  </section>;
}

function FormPortal({ config }: { config: PortalPageConfig }) {
  return <section className="reference-form-portal" aria-label="Portal status">
    <div className="reference-form-seal"><LockKeyhole size={25} strokeWidth={1} /></div>
    <span className="reference-mini-label">Portal status</span>
    <h2>The parchment is being <em>prepared.</em></h2>
    <p>{config.description} The form controls are intentionally unavailable until the official process exists.</p>
    <div className="reference-form-fields"><span><label>Field reserved</label><i /></span><span><label>Field reserved</label><i /></span><span><label>Field reserved</label><i /></span></div>
    <span className="reference-disabled-label"><LockKeyhole size={13} />No submission endpoint configured</span>
  </section>;
}

function ProfilePortal({ config }: { config: PortalPageConfig }) {
  return <section className="reference-profile-portal" aria-label="Profile portal">
    <div className="reference-profile-heading"><span className="reference-seal"><CircleUserRound size={25} strokeWidth={1} /></span><div><span className="reference-mini-label">Private account shelf</span><h2>Profile records are <em>not open yet.</em></h2></div></div>
    <p>{config.description} Use the existing Common Room for current account actions.</p>
    <Link href="/account" className="button button-gold">Open the Common Room <ArrowUpRight size={14} /></Link>
  </section>;
}

function PortalContent({ config }: { config: PortalPageConfig }) {
  switch (config.kind) {
    case "hub": return <HubPortal config={config} />;
    case "category": return <CategoryPortal config={config} />;
    case "catalogue": return <CataloguePortal />;
    case "directory": return <DirectoryPortal config={config} />;
    case "timeline": return <TimelinePortal />;
    case "live": return <TimelinePortal live />;
    case "form": return <FormPortal config={config} />;
    case "profile": return <ProfilePortal config={config} />;
  }
}

export function ReferencePortalPage({ config, breadcrumbPath }: { config: PortalPageConfig; breadcrumbPath?: Parameters<typeof BreadcrumbsSchema>[0]["path"] }) {
  return <div className={`inner-page reference-portal-page reference-portal-${config.kind}`}>{breadcrumbPath && <BreadcrumbsSchema path={breadcrumbPath} />}<div className="shell">
    <PortalHero config={config} />
    {config.backHref && <PortalBackLink href={config.backHref} label={config.backLabel} />}
    <PortalContent config={config} />
    <Reveal className="reference-portal-footer"><Divider /><p><Sparkles size={13} /> The page structure is ready. Official content will be added here later.</p></Reveal>
  </div></div>;
}
