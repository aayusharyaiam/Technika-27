# Technika ’27 · BIT Patna

A cinematic, dark Wizarding World–inspired festival website built from the supplied **Arcane Luminary / Stitch** designs. Next.js App Router, TypeScript, Tailwind CSS 4, **GSAP + ScrollTrigger + MotionPathPlugin**, Motion, Lenis, and **Supabase Auth**.

## Run locally

Requires **Node.js 22 or newer** (Node 24 recommended). The installed Supabase SDK requires Node 22+, even though Next.js itself supports Node 20.9+.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill in the Supabase URL and publishable key in `.env.local` before starting the server to enable account services. If `.env.local` already exists, keep its configured values rather than copying over it.

Open **http://localhost:3000**. For a production preview:

```bash
npm run build
npm start
```

## Pages

| Route | Design |
| --- | --- |
| `/` | Moonlit Hogwarts hero, autonomous Golden Snitch, house banners, interactive three-day timeline, Goblet of Fire, Deathly Hallows, Technika story, BIT Patna, sponsors, invitation |
| `/registrations` | Great Hall, Sorting Ceremony, four house tracks, festival countdown, FAQs, calendar download |
| `/members` | Ministry notice wall, framed Educational Decrees, sealed portraits, chamber filters, accessible decree dialogs |
| `/delegate` | Triwizard crest, three academy paths, contingent preview |
| `/alumni` | Hall of Legacies, Pensieve memory vials, ancient ledger |
| `/contact` | Owl Post letter, wax seal, celestial owlery, campus directions |
| `/login` | Email/password sign-in, house selection, and password-reset request |
| `/signup` | Account creation with name, strong password, and house selection |
| `/account` | Server-protected common room, saved profile house, and sign-out |
| `/reset-password` | Password change after opening a verified recovery link |
| `/auth/callback` | PKCE email-confirmation/recovery callback with allowlisted redirects |

The five festival portals intentionally announce **coming soon**. Account flows are connected to Supabase when the environment is configured. The custom 404 keeps the same theme.

## Magical details

- Full-screen loading experience with a **0–100 percentage counter**, progress bar, resource readiness, and automatic completion. “Enter Hogwarts” accelerates the counter to 100.
- GSAP orchestrates the post-loader castle zoom, staggered 3D title-letter reveal, subtitle, buttons, and supporting details.
- Multi-speed ScrollTrigger parallax for the castle, moonlight, mist, candles, Technika crest, and Great Hall.
- A larger, clearly visible Golden Snitch follows a **GSAP motion path**; it does **not** track the mouse. Its layer changes relative to the title, so the actual opaque letter shapes hide it on the background pass. Flight pauses when the hero is outside the viewport or the browser tab is hidden.
- Scroll-triggered reveals with staggered cards, 3D card tilts, pointer-position gold highlights, button shine, animated navigation underlines, route-transition veils, and a scroll progress indicator.
- Photographic Elder Wand cursor cut from a downloaded replica photo, with a high-resolution overlay, native PNG fallback, subtle spark trail, and click/tap spell bursts. Inputs retain a normal text cursor. Artwork attribution and license are in `public/images/ATTRIBUTION.md`.
- Lenis smooth wheel scrolling synchronised to the GSAP ticker and ScrollTrigger, native touch scrolling, gold scrollbars.
- Responsive floating navigation and keyboard-accessible mobile menu, timeline tabs, filters, and native accordion FAQs.
- The floating wand button reflects the **actual** motion state. System reduced-motion preferences are honoured initially; “Enable magical effects” explicitly turns on the complete animation experience, including CSS microanimations.
- “Save the date” downloads a valid `.ics` calendar file; it does not submit a registration or email signup.

## The Wizarding World components

- **House themes:** Gryffindor scarlet, Slytherin emerald/silver, Ravenclaw blue/bronze, and Hufflepuff yellow/black. The original gold theme remains the default. Choose a house on the login/sign-up page; the accent colours, castle tint/window light, cloth banners, buttons, navigation, particles, and scrollbars update across every page. A validated local preference persists between visits. Signed-in users can save the same choice to Supabase user metadata from `/account`.
- **Goblet of Fire:** a reusable layered tower scene, house-coloured windows/banner, carved bronze chalice, animated blue fire, drifting embers, and scroll parallax (`src/components/goblet-tower.tsx`).
- **Deathly Hallows:** the wand line, stone circle, and cloak triangle illuminate one at a time, with an accompanying original story. Visitors can choose a relic, use arrow keys, or pause the automatic rotation (`src/components/deathly-hallows.tsx`).
- **Ministry notice wall:** the members page uses Umbridge-inspired wooden/gilt Educational Decree frames. Chamber filters still work; each decree opens a keyboard-accessible dialog. The member identities remain placeholders until the actual roster is provided.
- **Aged notebooks:** coffee-toned, stained, deckled-edge parchment with self-hosted Caveat handwriting on the event cards, Technika story, contact letter, alumni ledger, and common-room note.

## Supabase authentication setup

Both `@supabase/supabase-js` and `@supabase/ssr` are dependencies. Configure these variables in **`.env.local`** for development and **Vercel → Project → Settings → Environment Variables** for deployment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-project-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

The supplied local configuration is stored in ignored `.env.local`. No live keys are committed. Copy the project’s **publishable** key from Supabase; a service-role/secret key is never needed in the frontend. Redeploy after setting `NEXT_PUBLIC_*` values because Next.js embeds them during the build.

### Supabase dashboard settings

1. In **Authentication → URL Configuration**, set **Site URL** to the production origin.
2. Allow the exact local and production callback URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.example/auth/callback`
   - If required by your redirect rules, also allow the same callback with `?next=/account` and `?next=/reset-password`.
3. In **Authentication → Sign In / Providers → Email**, enable **Confirm email** to require inbox verification. With confirmation disabled, Supabase can return a session immediately after sign-up. This behaviour is controlled in the dashboard.
4. Configure SMTP/delivery and Supabase Auth rate limits for the expected festival traffic.

### Session and access behaviour

- Supabase handles passwords and account sessions; the app does not put passwords in local storage or run a custom password database.
- Registration/new-password forms require at least 12 characters, a letter, and a number, and matching confirmation. Existing-password login is not restricted by that new-password rule.
- `src/proxy.ts` is the **Next.js 16** equivalent of middleware. It refreshes sessions on account/auth routes, uses `getClaims()` to verify signed tokens, preserves refreshed cookies, and uses private/no-store responses. Production cookies are Secure and SameSite=Lax.
- `/account` independently calls server-side `getUser()` before rendering user data. Forged, expired, or missing sessions redirect to `/login`. Public festival pages stay publicly accessible.
- Email confirmation and recovery use a PKCE code exchange. The callback only redirects to `/account` or `/reset-password`; arbitrary external redirect URLs are ignored.
- Password recovery changes require a verified Supabase user. Sign-out uses Supabase and returns to the login page.
- User metadata stores `display_name` and the validated `house` preference. It is cosmetic profile information and is never used to grant admin/core-member permissions. No custom database tables are required for these flows. If event-registration tables are added later, enforce their permissions with Supabase Row Level Security.
- With no Supabase configuration, account submission reports that setup is needed; it never displays a simulated successful login.

## Content & assets

The festival dates **8–10 January 2027** and the event programme are illustrative, as requested. Update `src/lib/festival.ts`, the calendar values in `src/components/coming-soon.tsx`, and metadata in `src/app/layout.tsx` when dates are confirmed.

Sponsor names are the **concept lineup from the supplied design**, labelled accordingly; they are not presented as confirmed partnerships. Update `partners` in `src/components/home-sections.tsx` for the final sponsor list. Member portraits and alumni memory cards are themed placeholders.

The original references are preserved in `image refs/`. Optimised versions of the provided castle/crest and hosted images from the exported Stitch HTML are in `public/images/`. All runtime images and fonts are local; no Stitch API key is required.

`npm run assets` regenerates assets from the reference folder (requires `curl` and network access for the hosted images and fonts). `npm run assets -- --fonts-only` only refreshes fonts. EB Garamond and Outfit are provided under the included SIL Open Font Licenses.

`npm run assets:social` regenerates the branded 1200×630 social preview and the Apple touch icon locally. `npm run assets:wizard` regenerates the photographic wand cutouts/cursors and downloads the handwriting font. Font licenses are included under `public/fonts/`.

## SEO & crawl management

- Every page has a unique title, description, canonical URL, Open Graph card, and Twitter preview through `src/lib/seo.ts`.
- `/sitemap.xml` contains the six public pages. `/robots.txt` allows production crawling and advertises the sitemap. Vercel preview environments are marked `noindex` and disallow crawling.
- Login, sign-up, password recovery, and private account pages have `noindex` metadata and are excluded from the public sitemap.
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

The Playwright suite checks desktop/mobile routes, overflow, image loading, navigation, schedule tabs, filters/decree dialogs, calendar downloads, FAQs, 0–100 loading, actual parallax, autonomous snitch depth changes, hover interactions, reduced-motion overrides, house persistence, Hallows controls, authentication validation/protected-route redirects, and server-rendered SEO/robots/sitemap output. Screenshots are generated under ignored `test-results/`. Automated checks do not create real Supabase accounts or send real signup/recovery email.

Browser tests use the production build, so run `npm run build` first. They start the server automatically on port 3000. To use a different port on macOS/Linux/WSL:

```bash
PLAYWRIGHT_PORT=3100 npm run test:e2e
```

For an end-to-end email check against your configured Supabase project, create a test account, open its confirmation link in the same browser, sign in, save a house from `/account`, sign out, and follow a password-reset email to set a new password. PKCE confirmation/recovery links need the browser that initiated the request.

## Deployment

Import the repository into Vercel with the **Next.js** preset, select **Node.js 22 or 24**, set the Supabase environment variables above, configure the production auth callback URLs, and redeploy. The production command is `npm run build`; other Node hosts can serve it with `npm start`. Social image URLs use Vercel’s production URL automatically; set `NEXT_PUBLIC_SITE_URL` to your final public/custom-domain origin for canonical URLs and sharing cards.
