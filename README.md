# Technika ’27 · BIT Patna

A cinematic, dark Wizarding World–inspired festival website built from the supplied **Arcane Luminary / Stitch** designs. Next.js App Router, TypeScript, Tailwind CSS 4, **GSAP + ScrollTrigger + MotionPathPlugin**, Motion, and Lenis.

## Run locally

Requires Node.js 20.9 or newer (Node 22/24 recommended).

```bash
npm ci
npm run dev
```

Open **http://localhost:3000**. For a production preview:

```bash
npm run build
npm start
```

## Pages

| Route | Design |
| --- | --- |
| `/` | Moonlit Hogwarts hero, autonomous Golden Snitch, interactive three-day timeline, Technika story, BIT Patna, sponsors, invitation |
| `/registrations` | Great Hall, Sorting Ceremony, four house tracks, festival countdown, FAQs, calendar download |
| `/members` | The Order of Technika, veiled wizard portraits, interactive chamber filters |
| `/delegate` | Triwizard crest, three academy paths, contingent preview |
| `/alumni` | Hall of Legacies, Pensieve memory vials, ancient ledger |
| `/contact` | Owl Post letter, wax seal, celestial owlery, campus directions |

All five secondary pages intentionally announce **coming soon**. The custom 404 keeps the same theme.

## Magical details

- Full-screen loading experience with a **0–100 percentage counter**, progress bar, resource readiness, and automatic completion. “Enter Hogwarts” accelerates the counter to 100.
- GSAP orchestrates the post-loader castle zoom, staggered 3D title-letter reveal, subtitle, buttons, and supporting details.
- Multi-speed ScrollTrigger parallax for the castle, moonlight, mist, candles, Technika crest, and Great Hall.
- A larger, clearly visible Golden Snitch follows a **GSAP motion path**; it does **not** track the mouse. Its layer changes relative to the title, so the actual opaque letter shapes hide it on the background pass. Flight pauses when the hero is outside the viewport or the browser tab is hidden.
- Scroll-triggered reveals with staggered cards, 3D card tilts, pointer-position gold highlights, button shine, animated navigation underlines, route-transition veils, and a scroll progress indicator.
- Native Elder Wand cursor for fine-pointer devices, subtle spark trail, and click/tap spell bursts.
- Lenis smooth wheel scrolling synchronised to the GSAP ticker and ScrollTrigger, native touch scrolling, gold scrollbars.
- Responsive floating navigation and keyboard-accessible mobile menu, timeline tabs, filters, and native accordion FAQs.
- The floating wand button reflects the **actual** motion state. System reduced-motion preferences are honoured initially; “Enable magical effects” explicitly turns on the complete animation experience, including CSS microanimations.
- “Save the date” downloads a valid `.ics` calendar file; it does not submit a registration or email signup.

## Content & assets

The festival dates **8–10 January 2027** and the event programme are illustrative, as requested. Update `src/lib/festival.ts`, the calendar values in `src/components/coming-soon.tsx`, and metadata in `src/app/layout.tsx` when dates are confirmed.

Sponsor names are the **concept lineup from the supplied design**, labelled accordingly; they are not presented as confirmed partnerships. Update `partners` in `src/components/home-sections.tsx` for the final sponsor list. Member portraits and alumni memory cards are themed placeholders.

The original references are preserved in `image refs/`. Optimised versions of the provided castle/crest and hosted images from the exported Stitch HTML are in `public/images/`. All runtime images and fonts are local; no Stitch API key is required.

`npm run assets` regenerates assets from the reference folder (requires `curl` and network access for the hosted images and fonts). `npm run assets -- --fonts-only` only refreshes fonts. EB Garamond and Outfit are provided under the included SIL Open Font Licenses.

`npm run assets:social` regenerates the branded 1200×630 social preview and the Apple touch icon locally.

## SEO & crawl management

- Every page has a unique title, description, canonical URL, Open Graph card, and Twitter preview through `src/lib/seo.ts`.
- `/sitemap.xml` contains the six public pages. `/robots.txt` allows production crawling and advertises the sitemap. Vercel preview environments are marked `noindex` and disallow crawling.
- Server-rendered JSON-LD describes the website, festival organisation, BIT Patna, and page breadcrumbs.
- The provisional dates are **not** advertised as a confirmed Event rich result.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final public origin, especially for a custom domain. Otherwise Vercel’s production URL is used automatically.
- Optionally set `GOOGLE_SITE_VERIFICATION` to your Search Console HTML verification token, then submit the production `/sitemap.xml` URL in Search Console.
- Keep page descriptions, content, dates, and the sponsor list current when the festival details are confirmed.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite checks desktop/mobile routes, overflow, image loading, navigation, schedule tabs, filters, calendar downloads, FAQs, 0–100 loading, actual parallax, autonomous snitch depth changes, hover interactions, reduced-motion overrides, and server-rendered SEO/robots/sitemap output. Screenshots are generated under ignored `test-results/`.

## Deployment

Import the repository into Vercel with the **Next.js** preset, or deploy using any host that runs `npm run build` and `npm start`. No environment variables are needed for this frontend. Social image URLs use Vercel’s production URL automatically; on another host, optionally set `NEXT_PUBLIC_SITE_URL` to your public site origin.
