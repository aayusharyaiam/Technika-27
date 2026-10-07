# Technika ’27 · BIT Patna

A cinematic, dark Wizarding World–inspired festival website built from the supplied **Arcane Luminary / Stitch** designs. Next.js App Router, TypeScript, Tailwind CSS 4, Motion, and Lenis.

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

- Full-screen, automatically dismissing loading experience; “Enter Hogwarts” also skips it.
- Castle and mist scroll parallax, drifting candles, fireflies, scroll reveals.
- The Golden Snitch follows a time-driven flight path; it does **not** track the mouse. Its layer changes relative to the title, so the actual opaque letter shapes hide it on the background pass.
- Native Elder Wand cursor for fine-pointer devices, subtle spark trail, and click/tap spell bursts.
- Lenis smooth wheel scrolling, native touch scrolling, gold scrollbars.
- Responsive floating navigation and keyboard-accessible mobile menu, timeline tabs, filters, and native accordion FAQs.
- The floating wand button pauses ambient magic. System reduced-motion preferences disable parallax, smooth scrolling, and autonomous flight.
- “Save the date” downloads a valid `.ics` calendar file; it does not submit a registration or email signup.

## Content & assets

The festival dates **8–10 January 2027** and the event programme are illustrative, as requested. Update `src/lib/festival.ts`, the calendar values in `src/components/coming-soon.tsx`, and metadata in `src/app/layout.tsx` when dates are confirmed.

Sponsor names are the **concept lineup from the supplied design**, labelled accordingly; they are not presented as confirmed partnerships. Update `partners` in `src/components/home-sections.tsx` for the final sponsor list. Member portraits and alumni memory cards are themed placeholders.

The original references are preserved in `image refs/`. Optimised versions of the provided castle/crest and hosted images from the exported Stitch HTML are in `public/images/`. All runtime images and fonts are local; no Stitch API key is required.

`npm run assets` regenerates assets from the reference folder (requires `curl` and network access for the hosted images and fonts). `npm run assets -- --fonts-only` only refreshes fonts. EB Garamond and Outfit are provided under the included SIL Open Font Licenses.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite checks desktop/mobile routes, overflow, image loading, navigation, schedule tabs, filters, calendar download, FAQs, autonomous motion, and reduced-motion support. Screenshots are generated under ignored `test-results/`.

## Deployment

Import the repository into Vercel with the **Next.js** preset, or deploy using any host that runs `npm run build` and `npm start`. No environment variables are needed for this frontend. Social image URLs use Vercel’s production URL automatically; on another host, optionally set `NEXT_PUBLIC_SITE_URL` to your public site origin.
