# Sorting Hat frontend

This delivery is **frontend-only**, following the revised scope. The existing Next.js App Router, Supabase Auth, house palettes, and global motion controls are reused. No Firebase, database schema, API endpoint, privileged key, or membership rule has been added.

## Routes and behavior

- `/signup`: one continuous journey: **Create your account → Meet the Hat → Your common room**. The form has exactly five fields: full name, college, phone number, email, and password. It includes visibility, password/phone validation, busy/error/duplicate-account feedback. Profile metadata sent through the existing Supabase signup call is `display_name`, `college`, and `phone`; passwords stay with Supabase. Phone formatting is normalized, but this is a contact field, not a verified phone-login identity. No house is sent.
- After signup returns a session, the form is replaced by the ceremony **on the same `/signup` page**, without navigation. Signed-in users reopening signup resume their own preview, or see their saved profile house immediately. Confirmed-email signups still use `/auth/callback?next=/account`; the signup page detects the authenticated session when they return, and the account screen also links back to the same signup journey.
- `/signup?step=ceremony`: authenticated deep link to the skippable **ceremony preview within signup**. It offers three optional questions, the supplied hat image, all four house reveals, accessible focus management, reduced motion, and responsive layout. The existing Supabase auth proxy verifies the session and redirects signed-out visitors to `/login`. The client also waits for auth and never renders a guest ceremony. The query selects a presentation step only and grants no authentication or house membership.
- `/login`: “The Hat Remembers You”, existing password and recovery flows. Existing profile houses receive a short house-specific greeting and go to `/account`; they are never randomly drawn again by this UI. Unsorted users continue in the signup journey.
- `/sorting`: authenticated compatibility redirect to `/signup?step=ceremony`; signed-out visits go to `/login`. There is no separate ceremony screen here anymore.
- `/account`: displays the existing profile house (not the local palette) and a ceremony/reveal link. The browser UI no longer provides a house editor.

The auth/ceremony routes bypass the existing movie loader and use the supplied hat image with lightweight CSS animation. Other festival pages retain their original entry experience.

Login and signup show no public ceremony-preview links. A successful signup session transitions into the same-page ceremony; a successful login without a saved house goes to the authenticated ceremony step. Returning users with a saved house go to their common room. Expired sessions and stale local preview state cannot unlock the ceremony UI.

## Preview versus membership

For authenticated users without a saved profile house, the visual preview draws uniformly among the four houses using `crypto.getRandomValues`. Answers have no effect. The step and preview house are stored in per-user **sessionStorage**, solely to resume the presentation in the same tab after authentication. Restricted storage falls back to in-memory state. Malformed storage is ignored; legacy guest preview state is no longer read.

**The preview does not write `user_metadata.house`, does not call a house-assignment API, does not update counts, and does not change the global house palette. It is not official membership.** Local preview data must never be consumed by registration, QR, permissions, or event scoring.

The existing app stores legacy house preferences in editable Supabase user metadata. Reading those preserves the current experience; hiding editing controls does not make that legacy data authoritative. Concurrency-safe assignment, global balancing, capacities, immutable membership, and permissions require the separately deferred backend work. This frontend makes no guarantees about those acceptance criteria.

## Future backend integration boundary

Replace the preview action in `src/components/sorting-ceremony.tsx` with an authenticated call that returns a durable server-owned assignment. Load that same record in the auth/account views. The server must use the verified Supabase user ID, random tie-breaking among least-populated houses, a transactional ledger/count update, one immutable assignment per user, and idempotent retries. Never promote a sessionStorage value or legacy browser-editable metadata into membership. A backend outage must display a recoverable error rather than falling back to the preview as an assignment.

## Setup and verification

No new environment variables or migration steps are needed for this frontend. Existing Supabase public configuration and allowed callback URLs are still needed for real login/signup/recovery. Never expose service-role keys. Email confirmation still depends on the provider's dashboard settings.

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
PLAYWRIGHT_PORT=3100 npm run test:e2e -- tests/ceremony.spec.ts tests/wizarding.spec.ts
```

The ceremony tests cover all five signup fields and their payload, same-page signup-to-ceremony transitions, questions/skip/refresh, no membership writes, keyboard and reduced-motion behavior, narrow viewports, recovery requests/network errors, duplicate signup, and saved-house/unsorted login paths. Direct HTTP tests check signed-out and forged-session redirects; stale preview state is also tested. Frontend auth success/failure responses are mocked; the suite does not create real accounts or send emails. Production email confirmation and recovery should also be checked manually with a test account in the existing Supabase project.

## Artwork

`public/images/sorting-hat.png` is the user-supplied `hat.png`, renamed and served through `next/image` by `sorting-hat-artwork.tsx`. Its transparency and square proportions are preserved; the existing CSS floating/glow effects and reduced-motion behavior apply to it. `house-crest.tsx` uses original geometric shields and MIT-licensed Lucide icons.
