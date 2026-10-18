# Indom implementation plan

## Requirements
Next.js company website in Arabic and English. Light-first contemporary design with optional dark theme. Recreate supplied INDOM LABS logo as editable SVG in Figma. IN and DOM use independently configurable colors. Letter assembly animation: I appears, shifts and reveals N, followed by D, O, M. Respect reduced motion.
Landing page contains a concise introduction, clear services, a short process and contact invitation. No individual project content or product imagery appears on the landing page. Projects belong exclusively on Our Projects.
Working slogan: From Innovation to Domination / من الابتكار إلى الريادة.
No invented clients, statistics, awards, testimonials, contact details or product status.

## Checklist
- [x] Verify GitHub, Vercel, Supabase, MagicPath and Figma connections.
- [x] Create plan.md, agent.md, AGENTS.md, skills.md and architecture.md before implementation.
- [x] Reconstruct and export layered SVG in Figma.
- [x] Create Figma letter assembly animation prototype.
- [x] Build and validate motion component in MagicPath.
- [x] Scaffold Next.js with locale routes /en and /ar.
- [x] Build home, about, services, projects and contact pages.
- [x] Verify bilingual text, RTL, mobile layout and reduced motion.
- [x] Create GitHub repository and push milestone commits.
- [x] Deploy and verify Vercel production.
- [x] Add an accessible mobile menu, current-page indication and explicit desktop/SaaS services.

## Verified resources
GitHub: tranzillofficial
Supabase: Indom Site / nekzjsrheiwcxobgviuj
Vercel team: team_uSWcII9Ft57E10fR8aKDANoc
Figma: Mohamed Nedaa's team
MagicPath: Mohamed Nedaa personal workspace

## Remaining work
Company inquiry delivery needs a verified destination. Mobile-menu interaction checks remain pending; desktop live routes and locale switching are verified.

## Proposals & Pitch Portal Milestone, October 8, 2026
- [x] Added interactive Client Proposal & Pitch Manager in Admin Dashboard (`/admin/[locale]/dashboard`).
- [x] Supported custom endpoints (e.g. `/proposal/[slug]`), client name, passcode protection, and initial pricing/currency.
- [x] Supported flexible sections with images, scope descriptions, and bullet points.
- [x] Built dedicated secure client portal with access gate (`/proposal/[slug]`), bilingual AR/EN support, and interactive commercial breakdown.
- [x] Full TypeScript and Next.js production build verified.

## Implementation notes
SVG paths were reconstructed from the supplied raster contours, converted to smooth Bézier geometry in Figma and exported. The exact original vector source was not supplied. IN uses steel blue; DOM uses white on black.
Contact currently downloads a local project brief. No inquiry is sent until company contact details and destination are configured.
The deployment tool returned Tool not found. The user approved browser fallback; Vercel import and production deployment completed on 2026-10-02.
Figma timeline video was generated remotely; its download was blocked by the environment, so a local MP4 is not included.

## Validation milestone
Production build, strict TypeScript and dependency audit passed. Twenty desktop/mobile route checks passed, with no hydration errors or horizontal overflow. Locale switching preserves the page and updates html lang/dir. Reduced motion and brief download passed. Screenshots reviewed.

## GitHub milestone
Repository: https://github.com/tranzillofficial/INDOM
Source commit: d38e0f0c7b023c91d44ca27556b87dc4a335677a
The complete application source, SVG assets, planning files and motion component source were published on main. Desktop/mobile design screenshots remain in the saved deliverable rather than the production repository. Next.js production build passed again after synchronization. Vercel production is now live; see the production milestone below.

## Review on 2026-10-02
Existing GitHub source, Figma per-letter motion tracks, MagicPath component and healthy Supabase project were independently rechecked. Vercel lists no INDOM project and deploy_to_vercel still returns Tool not found. Mobile navigation now uses a collapsible bilingual menu with aria-expanded, current-page indication, close-on-navigation and Escape support. Software services explicitly cover desktop apps and SaaS. Production build and strict TypeScript passed. All ten prerendered pages passed language/direction and current-navigation checks; home has no product images or portfolio names, and SVG letter layers are present. New interactive browser checks could not run: this workspace has no Chromium executable and browser downloads returned invalid archives. Previous browser validation predates this navigation change.

## Production milestone, 2026-10-02
- User approved browser fallback and completed secure Vercel sign-in.
- Imported tranzillofficial/INDOM main as Vercel project indom.
- Project: prj_UgQFl9dYJeXTADxjdQ7Q1QptS8aO.
- Deployment: dpl_HzsAxsxKML7DCxKCYu9sPqyKRfPp; production status READY.
- Application commit: 492549a06c9be1ca8b65f65a22c7ac5fa841d94e.
- Live Arabic: https://indom-two.vercel.app/ar
- Live English: https://indom-two.vercel.app/en
- All ten live routes rendered with correct headings, document language/direction and no horizontal overflow at the browser viewport.
- Language switch preserved /contact. Arabic home screenshot visually reviewed.
- Existing contact form remains a local brief download; it does not submit inquiries.

## Redesign requested on 2026-10-02
- [x] Remove the logo frame, replay control and decorative IN block.
- [x] Rebuild the landing page with concise bilingual copy and explicit service categories.
- [x] Add a default light palette, optional persistent dark palette and theme-aware logo colors.
- [x] Rebuild the navbar as a compact single row with a mobile dropdown.
- [x] Limit the logo intro to one animation per document load; refresh/new visit can replay it.
- [x] Next.js build including TypeScript passed.
- [x] Review the Vercel preview and verify theme/navigation behavior.
- [x] Publish the redesign to production.

Redesign preview passed: light default, dark toggle, saved theme on refresh, and a static logo on client-side return to home. Header measured 75px at the desktop browser viewport. Arabic light/dark and English service cards were visually reviewed. No hydration errors were observed. Mobile breakpoint styles are implemented; this browser session did not expose viewport emulation for mobile interaction checks.

Redesign production is READY: dpl_CNsVuE9Bn3sATHiJiYqfXQh9VgsZ for application commit 7de7256d698a66f5303b3ce568ca18e977c4a7c3. Verified the new Arabic homepage on https://indom-two.vercel.app/ar and saved the reviewed light-theme screenshot.

## AION embodiment, 2026-10-02
- [x] Confirm INDOM website as integration target.
- [x] Inspect character references and available providers.
- [x] Create bilingual ElevenLabs AION guide with premade Daniel voice.
- [x] Build editable Figma expression states.
- [x] Build responsive interactive 3D character and browser voice/chat controls.
- [ ] Generate reference-derived Meshy model after account authentication.
- [x] Validate build, preview text connection, local expressions and production deployment.
- [ ] Validate WebGL rendering, microphone/audio round-trip and mobile interactions on supported devices.

Meshy device authorization is pending. Tripo callable tools are unavailable. ElevenLabs quota/subscription inspection is unavailable through the connector; no free-unlimited or commercial-license claim is made. User confirmed ElevenLabs Free plan. Production will use browser speech for local guidance; provider conversations are preview-only. Trial agent limits: ten sessions/day, two concurrent sessions, three minutes/session; microphone recording disabled, transcripts retained for seven days.

AION validation: Next.js/TypeScript build passed; dependency audit reports zero vulnerabilities. Preview local topics and SVG fallback verified. ElevenLabs text session connected, greeted, answered a mobile-app inquiry and ended correctly. Cloud browser disables WebGL; 3D appearance/motion on a WebGL-capable device, mobile interaction and audio round-trip remain unverified. Meshy authorization expired twice; no paid Meshy create was submitted.

AION production: dpl_2b5HN3p7scvcsykXuzJ2479CGwZC READY, source bece21dad8bf243723a0b6aeb2a70d8f9e28cc83. Arabic/English production pages and locale switching verified. Arabic local guidance and curious SVG state verified; no horizontal overflow. Production has no ElevenLabs start controls. Cloud browser has no Arabic system voice, and displays the localized text fallback. Theme now reapplies the saved preference when locale changes.

## Site refinement, 2026-10-02
- [x] Remove all AION character views and voice; replace with a welcome chat assistant.
- [x] Remove founder name from all public text.
- [x] Improve Arabic/English self-hosted fonts.
- [x] Separate technology and marketing service paths.
- [x] Rename own projects to Products; add a distinct client Work portfolio.
- [x] Add bilingual privacy, terms and storage information based on actual behavior.
- [x] Verify build, chat navigation, pages, themes and deploy.
No client case studies or verified product URLs are currently supplied. Do not fabricate portfolio entries or live-product links.

Preview build passed. Welcome panel, quick question, guidance response and allowlisted links verified in the browser. Gateway AI replies are blocked: $0 team credit; Vercel requires card verification for free credit. No billing details added. Site guide fallback answers service/product questions honestly.

Production 348c5dd deployed READY (dpl_4fXxCaNMw9BrKH6dDVq3qBWrkaSY). Arabic and English services, product details, Work and privacy navigation verified. Production chat returns labeled guide response and marketing link; AI is not live. Both locales legal and business routes returned HTTP 200. Build and typecheck passed.
- [ ] Owner input: activate Gateway credit (card verification required) to enable generated replies.
- [ ] Owner input: provide approved client case studies, verified product links and a privacy/contact channel.

## AION launcher and admin interface, 2026-10-03
- [x] Compact custom SVG AION wordmark and AI chip launcher.
- [x] Publish MenuzQR only; remove unfinished products from cards and assistant knowledge.
- [x] Protected Arabic/English admin login with Supabase Auth.
- [x] Professional admin interface: overview, products, CRM, inquiry drafts and settings.
- [x] Verify authentication, interface interactions, build and deploy.
The requested scope is an interface prototype. No real visitor tracking, lead collection, message sending or content publication will be introduced. Product editing is explicitly local preview only.

Admin verification: Next.js build and TypeScript passed. HTTP checks passed for unauthenticated redirects, AR/EN login language, incorrect-password denial, valid-password login, Secure/HttpOnly/SameSite/scoped cookie, authenticated dashboard SSR, logout cookie removal, and MenuzQR-only product pages. Bootstrap function is disabled (HTTP 410). Browser verified the Arabic preview login screen. Browser verification exercised the identical dashboard component through a temporary preview-only sample fixture: Arabic/English overview, add-product preview, CRM journey dialog and inquiry draft confirmation passed. The fixture was removed before production; authenticated access was tested by HTTP.

Admin production release: bf6f6b50066fb5af24943dea630060a97bd1334c, deployment dpl_7xLNLP4oCAWmBcAJdwTf8TBtJ9yB READY. Production browser verified MenuzQR-only products, compact AION launcher and chat open/close, plus the protected login entry. Production HTTP sign-in, incorrect-password rejection, authenticated dashboard and logout passed.

## Admin password settings, 2026-10-03
- [x] Add bilingual current-password-verified password change.
- [x] Update requested login password without storing it in source.
- [x] Verify rejection, successful rotation, build and production deployment.

Password setting validation: production build and TypeScript passed. Local HTTP Server Action checks passed: missing-session denial, incorrect-current-password denial, confirmation mismatch denial, successful requested rotation, scoped cookie removal, new-password login and old-password rejection. No password value is committed.

Password settings production: application commit 8584df15cf5c3718679518590388ec7f90d04e53, deployment dpl_HEQqrQbKdAZa8ZVk59uPmFakT7Mk READY. Production password login verified.

## Kinetic brand intro, 2026-10-03
- [x] Attempt reference access: YouTube search/open unavailable; direct media returned invalid bytes. Motion follows the user’s description, not a claimed exact match.
- [x] Replace fade assembly with physical per-letter movement and a 2-second splash.
- [x] Compact icon-free AION launcher with slightly rounded corners.
- [x] Verify motion, once-per-load navigation, build and deployment; reduced-motion skip implemented (device preference not emulated).

Preview checks passed: initial centered I and camera transform observed; letter opacity stays 1 while per-glyph translations/rotations/scales move the SVG paths. Splash removed after timeout, content is no longer inert and body scroll restores. Internal service navigation does not replay it. AION measures 84px wide with 8px radius and no chip icon; desktop has no horizontal overflow. Reduced-motion skip is implemented; this browser has no preference/viewport emulation.

Kinetic entrance production: 5a68b183c7efea3c1b919764befbaed8c54bb92c, dpl_67SuPFMWz2YkQPMmtNr2xS7gS2oe READY. Production screenshot captured during letter construction with Powered by AION below. After entrance: content visible, no remaining overlay, icon-free 84px launcher with 8px radius and no horizontal overflow. Preview English locale preservation and dark-theme toggle passed.

## Entrance hold and depth streaks, 2026-10-03
- [x] Hold completed logo for two seconds, then transition.
- [x] Add subtle outward radial streaks during the inward camera push.
- [x] Verify build and live entrance, then deploy and update plan.

Hold/depth production: 192188316e14d6540e917b72dc26ffe8e0a66662, deployment dpl_4npxGSkjLsDFBZaByPGjaPTi36Ag READY. Build and TypeScript passed. Browser observed 4s camera duration, 22 rays delayed 3.4s, and captured the complete logo with visible outward streaks during the final zoom. Post-intro homepage is usable.

## Redom digital growth landing page — 2026-10-06
- [x] Rebuild the bilingual home page around the supplied Digital Growth reference: architectural hero, two illustrated service paths, generic product banner, four-step approach and contact invitation.
- [x] Extract and optimize five decorative WebP assets from the user-supplied design. No individual product screenshots or client portfolio entries are shown.
- [x] Replace invented reference metrics with software, marketing and AI/R&D capability highlights. Omit unconfigured booking, social and Academy links.
- [x] Migrate visible legacy INDOM labels and metadata to Redom Labs, with an independently animated open-stem R and E while retaining existing DOM geometry.
- [x] Preserve bilingual navigation, persistent theme, AION, reduced motion and existing contact behavior.
- [x] Production build and TypeScript passed.
- [ ] Browser-based visual and interactive checks: unavailable in this workspace; Chromium is absent and its download is blocked/invalid. Responsive and RTL styles are implemented but actual rendering is not verified.
- [ ] Production deployment: not performed; deliver changes through a reviewable GitHub branch and pull request.

## Unsplash photography replacement — 2026-10-06
- [x] Replace every glass/cropped illustration with five topic-matched Unsplash photos: developer, code, marketing analytics, digital workspace and team collaboration.
- [x] Remove the old crop assets and discard the unshipped generated replacements after the owner changed direction.
- [x] Use responsive Next Image optimization, explicit sizes, high quality and hero preload; photos remain clear without gradient masks or dark filters.
- [x] Record source pages, photographers and CDN URLs in src/photos.ts. Retrieved source pages label each photo free under the Unsplash License. Photos illustrate topics and do not represent Redom employees or portfolio work.
- [ ] Publish and verify production image responses.

## Redom digital growth landing & seamless splash — 2026-10-07
- [x] Redesigned landing page with bilingual content, 5 core sections (Hero, Expertise, Products, 4-step Approach, Panoramic CTA banner).
- [x] Applied `border-radius: 6px` to hero artwork with directional shade fading seamlessly into background.
- [x] Replaced kinetic SVG intro with seamless fullscreen `/splash.mp4` video (centered, zero borders/outlines/shadows, no controls or PIP artifacts, auto-play with smooth fade-out).
- [x] Production build passed cleanly with strict TypeScript and 27 prerendered routes.


## Secondary pages and contact milestone, October 9, 2026
- [x] Added shared page gutters and restrained heading/card sizes for Work, Services, About, Products, Contact and legal pages.
- [x] Replaced alternating oversized service panels with a compact bilingual catalog using existing supplied assets. Removed fixed service count from heading and visible Arabic elongation characters.
- [x] Added real contact submission code, administrator inbox, editable bilingual address/phone/email, accurate failure feedback and updated privacy/assistant copy.
- [x] Production build and TypeScript passed.
- [ ] Apply supabase/contact-setup.sql to esastftdifqqoksylbwv and verify submission/settings/admin RLS. Target project is not accessible in either connected account; both new tables return PGRST205.
- [ ] Browser visual verification: local Chromium is unavailable and the browser download returned an invalid archive.

Validation: all eight Arabic/English services/work/about/contact HTTP routes returned 200 and contained the shared page container. Invalid form payloads returned 400 and foreign origins returned 403. Final production build and TypeScript passed after adjusting the origin check to the incoming Host header.
Publishing blocked: automatic approval review rejected the direct push to main because explicit authorization and repository ownership were not established. Local implementation remains available; no alternative remote write was attempted.

## Portfolio administration and manual setup, October 9, 2026
- [x] Separate persisted Products/Work management, public presentation and website links.
- [x] Image upload, thumbnail/gallery management, bilingual descriptions/features and publication state.
- [x] Expanded About content and preserved quiet responsive visual style.
- [x] Consolidated complete website SQL, bucket and permissions into supabase/redomlabs-setup.sql.
- [x] Fixed proposal persistence to use admin JWT and private passcode exchange; removed fake sample fallback.
- [x] Local PostgreSQL validation passed for creation/rerun and authorization rules.
- [ ] Owner runs SQL in esastftdifqqoksylbwv; remote MCP denied access.
- [ ] Full authenticated browser and deployed database verification after owner setup.


## Dashboard and image composition, October 9, 2026
- [x] Rebuilt quiet responsive administration workspace, navigation, typography, forms, tables, dialogs and login styling; removed decorative emoji, sample CRM content and fabricated counts.
- [x] Authenticated dashboard counts from existing project/inquiry/proposal tables, with honest unavailable state.
- [x] Shared keyboard-accessible image picker for project thumbnails, galleries and proposal sections: file selection, drop and focused clipboard paste, type/size/count validation and upload feedback.
- [x] Native modal thumbnail editor with pointer/touch dragging, keyboard arrows, zoom, reset and cancel. Exports the chosen composition as a 1200×750 image through the existing authenticated upload action; public project covers use the same 8:5 aspect ratio.
- [x] Final production build and strict TypeScript passed. Crop coverage invariants passed 324 cases.
- [x] Updated login identity and removed the obsolete prototype notice and assistant mark.
- [x] Chromium browser checks passed for drag/zoom/reset/cancel/export dimensions, gallery drop/paste, rejected unsupported files, Arabic RTL, mobile navigation and no horizontal overflow at 390px. Reviewed desktop dashboard and Arabic mobile settings/crop screenshots. Temporary unauthenticated review fixture removed before final build; no production auth bypass.
- [ ] End-to-end storage persistence remains dependent on owner applying the consolidated SQL and target-project access. No extra database migration is required for thumbnail framing.


## Short SVG splash, October 10, 2026
- [x] Replaced the opaque H.264 splash with the existing Redom SVG geometry on the site theme background; deleted the unused video asset.
- [x] Letter assembly, brief hold and page reveal finish within 1500 ms, with document-level replay, internal-navigation continuity and timer/scroll cleanup.
- [x] Production build/TypeScript passed after clearing corrupt generated Turbopack cache. Chromium measured 1499 ms and verified no video requests, desktop/mobile visuals, Arabic RTL, internal navigation, refresh replay, reduced motion, no-JavaScript access and scroll restoration.


## Inquiry deletion and contact publishing, October 10, 2026
- [x] Added explicit inquiry deletion confirmation, per-row pending state and accurate failure feedback. The authenticated action validates identifiers and requires an actual deleted row; RLS grants DELETE only to admin app metadata.
- [x] Added stable cursor loading of older inquiries, with created_at/id ordering and matching index, so administration is not limited to the latest 100 messages.
- [x] Added optional bilingual address details and eight optional HTTPS social page links, retaining editable phone/email/location. Published links appear on Contact and in the footer; removed generic placeholder social destinations.
- [x] Footer loads public settings in the background, retaining the static public page shell. Settings saves revalidate both locale layouts.
- [x] Updated the complete rerunnable SQL with additive settings columns, inquiry DELETE grant/policy and pagination index.
- [x] PGlite checked previous-schema upgrade, rerun preservation, admin deletion and denial for nonadmins/anonymous users. URL/payload validation checks passed. Chromium checked settings, cancel/failure/success deletion, mobile RTL and footer links through temporary dependency fixtures; fixtures removed before final production build.
- [ ] Owner applies updated supabase/redomlabs-setup.sql in target project; live authenticated persistence still unverified because target access is unavailable.


## Redom browser icons, October 10, 2026
- [x] Added a standalone custom R mark in turquoise on a forest rounded square, preserving the brand geometry and remaining legible at browser-tab sizes.
- [x] Added root Next.js icon.svg, a 16/32/48px favicon.ico, and a 180px apple-icon.png for public, administration and proposal routes.
- [x] Production build and generated icon metadata verified.


## Preserve Redom Labs name, October 10, 2026
- [x] Protected navbar/footer brand links and shared SVG brand with translate=no, notranslate and English language markers so browser translation preserves LABS in both locales.
- [x] Production build and Arabic/English rendered HTML checks passed. Attribute-only change preserves existing layout and SVG geometry; local Chromium could not launch for visual verification.

## Belmir Coffee proposal, October 11, 2026
- [x] Persist protected bilingual Belmir Coffee proposal in the existing proposals table; credentials are stored only in the database.
- [x] Add editable per-section starting price, billing cadence, optional flag and English copy.
- [x] Calculate base first-year, selected one-time, annual and monthly totals from section prices; preserve unpriced legacy proposals.
- [x] Refresh bilingual responsive password gate, concealed password/reveal, and remove stale proposal content caching from sessionStorage.
- [x] Generate and review six coordinated concept images; optimize as WebP for proposal sections.
- [x] Production build and TypeScript passed; live visual/authentication checks follow publication.
- [x] Fix pre-existing text/date mismatch in private proposal expiry RPC; apply migration and preserve authorization/redaction.

## Belmir offer revisions and marketing packages
- [x] Update hosting to EGP 3,200 annually; include the website menu at no additional charge.
- [x] Include table/bar/kitchen/cashier ordering with the system subscription (100/month or promotional 1,000/year).
- [x] Read current Genaan packages/care settings: from 4,000; annual care 1,200 for two or 2,200 for four visits. Merge care into Genaan section.
- [x] Add three bilingual marketing packages at 1,200/2,500/4,500 monthly and Custom, with matching proposal links and scope.
- [x] Remove customer option selection and offer expiry display; clear Belmir expiration. Show base 7,700 with one-time/annual breakdown and separate annual-system scenario.
- [x] Reduce proposal navbar logo width to 150px desktop / 120px mobile.

- [x] Restore interior spacing to the proposal introduction card: 36px horizontal desktop and 20px mobile, with the summary and highlights inset consistently.

## Selectable service proposals — October 13, 2026
- [x] Added admin-created catalog proposals with passcode links, enabled sections, editable activity pricing/features and quote request inbox. Retained detailed legacy proposals.
- [x] Rebuilt MUNAYA catalog presentation around the supplied cream/white/teal reference: activity selector, three main service cards, product/creative sections, additional services and selected-service sidebar.
- [x] Removed the preselection headline total. Client totals start at zero and sum only selected one-time, annual and monthly charges independently; no projected first-year monthly multiplication is shown.
- [x] Added richer bilingual service explanations and a native accessible custom-quote dialog with required phone and optional notes/name. Blank contact names use the proposal client name.
- [x] Production build/TypeScript and browser checks passed: protected gate, 11 selectable services, activity-specific pricing/features, independent billing totals/removal, dialog, required phone/optional notes, Arabic/English and 320/390/768px layouts without horizontal overflow or page errors.
- [x] Live request RPC exists and rejects an incorrect passcode without inserting a lead. Earlier work created MUNAYA and verified request snapshots; this revision leaves stored commercial prices unchanged.

## Public general service proposal — October 14, 2026
- [x] Created `/proposal/general`, opening without a password and without a client dedication.
- [x] Public database RPC exposes only the active, unexpired `general` catalog with an explicitly blank passcode; private proposal access/RLS remains intact.
- [x] Ordered public services by technology/development, then marketing/creative, with MenuzQR, Genaan and ElNota in the last section titled خدمات منفذة من الشركة.
- [x] Added desktop/internal tools quoted to scope and ElNota at its verified EGP 1,000 core activation price; optional cloud pricing is described separately.
- [x] General catalog is editable in the existing admin manager. Quote requests use current database prices and the existing request inbox/RPC.
- [x] Production build and browser checks passed: no password/client badge, 13 choices, final product grouping, totals/scoped-pricing notice, contact dialog, Arabic/English, 320/390/768px without overflow, and private MUNAYA protection.
- [x] Transactional anonymous-role database checks passed for public read, private-access rejection, valid request saving and invalid-section rejection; validation inserts rolled back.
- [x] Security advisors show no finding on the added RPC; pre-existing RLS trigger execution and leaked-password Auth warnings are outside this change.

## CRM, proposal inbox and team access — October 14, 2026
- [x] Persistent CRM customer/service records with name, phone, business, notes, agreed total, deposit/paid amount, generated remaining balance, currency and customer/potential/follow-up stages. Added follow-up dates, search/stage filtering and pagination.
- [x] Per-user unread quote badge with 30-second/focus refresh; opening a request persists a read receipt. Added confirmed request deletion, database-attributed contact actor/time and idempotent conversion to potential CRM customer.
- [x] Owner-managed staff creation, named accounts, section permissions and immediate disabling. Existing owners keep full access; scopes are enforced in server actions and RLS with current database permissions.
- [x] Deployed additive schema and owner-authorized admin-team Edge Function to esastftdifqqoksylbwv. No service-role key is required in the Next.js environment or exposed to clients. No emails are sent by account creation.
- [x] Live transactional SQL checks passed: precise balance, overpayment rejection, scoped staff access, denied self-escalation, disabled access revocation, per-user reads, contact attribution/spoof prevention, receipt deletion cascade and anonymous CRM denial; public general proposal remains available. All test mutations rolled back. Security advisors found no new issue from this work.
- [x] Local browser contract fixtures passed CRM create/edit/reload, payment balance, follow-up, unread/contact/conversion, team creation/scopes/disable, denied tabs, deletion cancel/success, AR/EN and 320/390/768px layouts. Screenshots reviewed. Owner-only Edge handler contract tests passed, including failed-account-insert cleanup. Production build passed.
- [x] Published commit 0004b95 to main; production deployment dpl_26PFDY23PmYhaXJV7AGB8fAtgzd3 is READY on redomlabs.com. Deployed admin-team endpoint rejects anonymous calls with HTTP 403. Live login/account creation through an owner session is not claimed by fixture tests.

## Footer social links — October 14, 2026
- Replaced social text buttons with accessible SVG platform icons, 44px targets and keyboard focus states.
- Footer omits telephone when a valid WhatsApp link is configured; contact settings remain editable.
- Repaired missing production contact detail/social columns and verified authenticated upsert and public links.
- Production build and AR/EN static icon/accessibility checks passed. Local browser visual check unavailable: Chromium download returned an invalid archive.

## Expenses and financial privacy — October 15, 2026
- [x] Added bilingual Expenses with amount, purpose, category, date, account attribution, paginated history and per-currency spending totals.
- [x] Added separate owner-assigned financial permission, customer total/paid/remaining summaries, masked nonfinancial customer editing, RLS and safe RPC helpers. Existing staff remain denied financial access by default.
- [x] Added colored platform SVG icons across shared contact/footer social links; removed redundant footer phone when WhatsApp exists.
- [x] PostgreSQL isolation tests passed: hidden amounts, preserved balances on malicious writes, expense entry without read access, attribution spoof prevention, granted financial access, disabled account denial. All local test state is rolled back.
- [x] Browser fixtures passed AR/EN, mobile expense entry/history/attribution, customer financial restrictions, social icons/no footer telephone and no horizontal overflow. Screenshots reviewed. Team endpoint tests and TypeScript/build passed.
- [ ] Publish to tranzillofficial/redomlabs main and apply coordinated Supabase/Edge release after explicit production approval. Prior push was rejected by automatic approval review; no retry or indirect publishing attempted.

## Production release verified — October 15, 2026
User explicitly approved publication. Supabase migration company_expenses_financial_privacy applied successfully; admin-team v2 is ACTIVE with JWT verification. Live transactional financial-access SQL tests passed and rolled back. Published application source via GitHub connector as f072ca8e01d37fc2d98bbf24263522c065c3eb5b (tree exactly matches tested local source). Vercel deployment dpl_9aimg6tAkYcZVW8Ee3YxwNdU9gYa is READY and assigned to redomlabs.com/www.redomlabs.com. Public contact HTML exposes colored platform SVG classes. No new advisor warnings from this release; existing rls_auto_enable and leaked-password settings were not changed.

## Customer directory / Sales split — October 15, 2026
- [x] Renamed CRM navigation to Customers / العملاء; rebuilt responsive directory rows, toolbar, statuses, spacing and profile editor.
- [x] Moved all balance summaries, paid/remaining values and account editing into Sales / المبيعات, preserving current data.
- [x] Customer edits always preserve balances; separate sales + finance access enforced in actions/RLS/RPCs and team permission editor.
- [x] PostgreSQL isolation tests passed for customer masking, scope isolation, balance preservation and payment updates. AR/EN desktop/mobile browser tests passed profile editing, financial field separation and restricted sales denial. Production build passed before final spacing refinement.
- [ ] Apply coordinated schema/Edge update, publish and verify production.

Customer/Sales production release: schema changes applied in sales_staff_scope, sales_scoped_list, sales_row_access and customer_directory_mask_balances; admin-team v3 ACTIVE. Live transactional access tests passed and rolled back. GitHub source 6d2f290cd4fb9a068358ece964c7024613463492 matches tested local tree 8c37315746e8705cfeca793ed626d87e69f8b697. Explicit Git-source production deployment dpl_FAUnbF1g3N1jbFKZZLte4ktacgEc is READY with redomlabs.com/www aliases. No staff was automatically granted sales access.

## Reference customer UI — October 16, 2026
- [x] Inspected supplied desktop/mobile references; created compact desktop directory and expandable mobile cards preserving cream/green style.
- [x] Selection checkboxes render only after Select; individual selection, indeterminate select-all and select all on the current page are supported. Selection resets on page/search/status changes.
- [x] One keyboard-accessible contextual menu per customer contains all actions; expanded details have no duplicate edit/follow-up/note buttons. Menus close on outside click/Escape and flip within available viewport space.
- [x] Real search-scoped stage counts; information/follow-up/notes tabs show current saved data; sales links remain permission gated. Existing customer balances stay separate.
- [x] Browser fixtures passed selection/all, menu uniqueness, profile/notes persistence, tab/expand behavior, protected actions, keyboard focus, AR/EN and 320/390/768/1440 widths. Screenshots reviewed; refined compact mobile tabs and tablet breakpoint afterward.
- [x] Final production build and focused visual recheck passed.
- [ ] Verify production publication.

Reference UI production release verified: source 9b9f4c23f4484d867d2f212e9c106a90efb61590 matches tested tree 3df7f57ac50f0e266b271bfeb62195e23209311f. Vercel deployment dpl_7S9qrZqvXcSYLbKEWKV1k2WtNiqt is READY. Production admin route returns HTTP 200 and the new directory/menu stylesheet. No schema, grants or customer data changes.

## Reference sales UI — October 16, 2026
- [x] Reviewed supplied desktop/mobile references and implemented responsive financial cards, currency-specific totals/donut, expandable account rows/cards and a single actions menu.
- [x] Preserved cumulative account editing and sales+finance permissions. Current data has no transaction ledger: no invented invoices, dates, monthly changes or time-series graph.
- [x] AR/EN browser fixture passed 320/390/768/1440 widths, expansion, menu, payment persistence and denied staff access. Screenshots reviewed; refined typography/spacing afterward.
- [x] Final production build and refined AR/EN visual/interaction checks passed.
- [ ] Production publication.

Sales UI production verified: GitHub 039fc079923437c0c5cba99d9e2c831e924b3240 matches tested local tree ff43b88c720a6ebae977a53468ef1cb3bfef0681. Vercel dpl_Ds2vAKbCsbeiA7jdcfvdJFitcjcg is READY on redomlabs.com and www.redomlabs.com. No schema or account balance changes during release.

## New Invoice — October 16, 2026
- [x] Added New / جديد and New Invoice / فاتورة جديدة with customer search/pagination, description, amount, initial paid, currency and date.
- [x] Persistent numbered invoice history, authenticated actor, atomic balance increments, retry idempotency, currency lock and financial scope enforcement.
- [x] Applied additive invoice schema/RPC migrations; live SQL rollback tests passed legacy balance preservation, duplicate retry, amount validation, currency protection, actor attribution, scope changes and denied writes. Security advisor reports no new invoice findings (existing auto-enable trigger function grants and password protection warnings remain).
- [x] AR/EN 320/390/768/1440 browser checks passed new invoice, customer chooser, context action, history persistence, lost-confirmation retry without duplication and protected UI. Desktop/mobile screenshots reviewed; production build passed.
- [ ] Production publication.

Invoice release verified: applied sales_invoice_records and atomic_invoice_creation to esastftdifqqoksylbwv; live SQL tests rolled back all fixtures. Source 638d00c65b866ccf9ff51b9beca940644339b8a3 matches tested local tree 831edef189379fc4ac8f9200d548e7761a3c770a. Vercel dpl_FqQZrYAo5aTsd2W7VcZCxkRgFL8T READY on redomlabs.com/www. Existing balances were not migrated or reset.

## Compact sales heading — October 16, 2026
- [x] Removed the duplicate Sales overview title/subtitle and tightened page heading margins, typography and top padding. Currency selection remains available when multiple currencies exist.
- [x] Production build and AR/EN responsive browser checks passed at 320/390/768/1440. Desktop/mobile screenshots reviewed.
- [ ] Publish spacing refinement.

Compact sales header published: 01b4649174321264a07610ff068e4142a963ef76, tested tree 7b6471c1040b553d73ca5869da8a68b5adcc15a4, deployment dpl_8W19JAT6D4SHbTomr5BWuMGb6uSH READY with www/redomlabs.com aliases.

## Compact sales controls — October 16, 2026
- [x] Combined account heading and result count, removed redundant helper copy/count row, reduced card padding and control heights, bounded desktop search width, and compacted pagination. Kept mobile controls comfortable and RTL/EN copy.
- [x] Build passed; AR/EN browser checks passed at 320/390/768/1440 and desktop/mobile screenshots reviewed.
- [ ] Publish compact controls.

Compact controls release verified: source 439e4215201f0baa816bfd3cebfeab4dcde3bfd9, tested tree 3e308c026ffec1c1d9b0393aa19e4b37b81904de, production dpl_b1zd9C5VKXDVMgaUqS6fcWNsfp29 READY on redomlabs.com/www. No data or database changes.

## Dashboard frame cleanup — October 16, 2026
- [x] Removed decorative bottom footer and reduced bottom page padding. Sidebar uses the canonical Brand SVG, wider layout, clearer larger navigation text/icons and improved scroll space.
- [x] Production build passed; bilingual 320/390/768/1440 browser checks passed, original SVG/footer removal and mobile drawer/Escape verified. Desktop/mobile screenshots reviewed.
- [ ] Publish dashboard frame cleanup.

Dashboard frame published: source 673c7889bba9016f6e46db4b26a1c59166930646 matches tested tree d2f1c64298fa0aa9979cfb4467da0637b18e853d. Deployment dpl_DUJqbpiA3D78phJYU2mQgY5qxmZr READY with redomlabs.com/www aliases. No database changes.

## Shared controls and bill form — October 16, 2026
- [x] Compact shared pagination across dashboard/customer/invoice pages, smaller sidebar SVG/links, removed workspace label and redundant heading brand text.
- [x] Renamed expense-facing section/copy to Bills / الفواتير while preserving internal scope, storage and outflow behavior. Rebuilt compact bill form and separated readable history/totals card.
- [x] Build passed. AR/EN 320/390/768/1440 browser checks passed bill recording/history/attribution, financial restrictions, small pagination, removed labels and overflow. Screenshots reviewed.
- [ ] Publish shared controls and bill form.

Shared controls/bills release verified: c96b0407d79db0c17668e67b66a6b7c6dca7247a matches tested tree 347e02da3af9203c9b71e7ec8b3c56af708c7342. Production dpl_9DK3rf6kCYwRLZ4iWU21CDEtxK7y READY with www/redomlabs.com aliases. No database/schema changes.

## Account row interaction fixes — October 16, 2026
- [x] Full customer/sales summary rows toggle expansion, excluding interactive controls to avoid duplicate toggles.
- [x] Sales menus use viewport-positioned overlays, flip upward near the bottom, clamp to screen bounds and reposition on scroll/resize. Outside click dismisses; only one is open.
- [x] Production build passed. AR/EN 320/390/768/1440 browser tests verified full-row toggles, keyboard identity button, excluded actions and bottom menu viewport bounds; screenshots reviewed.
- [ ] Publish row interaction fixes.

Row/menu fixes published: source 5931da2fbd1ed6cdc96af45a768ce829566ff4b2 matches tested tree 0106b34d522c06b53401287040d676665bde42e0. Production dpl_8wNz1kfFLP6wiVqGt4FykD2FPpSC READY on redomlabs.com/www. No data/schema changes.

## Central invoice workspace — October 16, 2026
- [x] Removed invoice creation from customer/sales account views; Invoices owns New and the Sales/Purchases type chooser. Existing purchase entries remain paid outflows.
- [x] Existing/new customer sales invoices, atomic new customer creation, retry protection, preserved balances and recurring purchases. Applied atomic_invoice_new_customer to the connected database.
- [x] Per-customer authorized balances/history in Customers; paginated sales/purchase registers. Sales+finance staff can reach Invoices without purchase access; new identities additionally require crm.
- [x] Live SQL rollback tests passed repeat purchases, atomic rollback/no orphans, duplicate retries, currency/actor/scope checks. Security advisor reports no new invoice findings; preexisting warnings unchanged.
- [x] AR/EN 320/390/768/1440 browser flows passed existing/new sales, lost-confirmation retries, customer history/totals, purchases, actor/history, type restrictions and sales-only navigation. Reviewed mobile/desktop screenshots; production build passed.
- [x] Publish centralized invoice workspace.

Central invoice release verified: source f0b22b5a46c13c1a1ca370290eab4824e3b2d121 matches tested local tree 2eaac463b0a4c8ddd26a0c2bd18d1a2f1e3476fd. Production dpl_AFFKo2K6hbh4ECcqBziRrBbLhJLG READY with redomlabs.com/www aliases. Public admin route responds and requires login. No error/fatal runtime logs found for this deployment in the initial check. Additive atomic_invoice_new_customer migration applied; live SQL fixtures rolled back.

## Invoice filter and card polish — October 16, 2026
- [x] Removed duplicate invoice heading/description and oversized standalone filter buttons; compact All/Sales/Purchases filter sits opposite New.
- [x] Unified authorized chronological feed with bounded, validated cursor pagination; clearer invoice cards and grouped amounts/currencies, actor, date and creation snapshots. Purchase totals preserved.
- [x] Existing/new sales and purchase save flows, history and financial restrictions passed browser regression checks.
- [x] AR/EN 320/390/768/1440 visual/filter checks, 51 mixed records across cursor pages including exact timestamp/ID ties and source boundaries, grouped large prices, purchase totals and restricted scopes passed. Production build and live read-only cursor-field query passed.
- [x] Publish invoice register polish.

Invoice register polish published: 32dc4e5194b6d883e84f56a7bf4ea27a2ee997a8 matches tested tree f6a9b510ff159d8885304683238787ef99d9603c. Production dpl_5a9RUEhNcVnnBG9hKg7mbLRZwSJQ READY on redomlabs.com/www. No data/schema changes.

## Compact invoice choices and design preference — October 16, 2026
- [x] Created, validated, committed and successfully pushed compact-ui-ux to the persistent Skills workspace (16f379b). Added project design defaults to AGENTS.md.
- [x] Replaced oversized invoice type cards with ordinary compact choices and an icon close control; tightened invoice form/dialog spacing and secondary controls while keeping mobile touch targets.
- [x] AR/EN 320/390/768/1440 measured dialog/control sizes and screenshots passed, together with creation, retry, history and permission regressions. Production build passed.
- [x] Publish compact invoice dialog.

Compact invoice dialog published: source 6bb0c5158d5e4fc7e3f47a8f8a366f95f0180b02 matches tested tree 4fe39662ce73e0222bc5ebb52accf20ec41dfd08. Git deployment dpl_5WdxtdVeX3xeQ6gtwWN1WBh4QDwB READY with www/redomlabs.com aliases. Skill compact-ui-ux persisted via Skills repository push 16f379b. Git-triggered deployments are working again: inspect the webhook deployment before requesting an explicit fallback to avoid duplicate builds.

## Named secondary customer contact — October 16, 2026
- [x] Added optional second phone and contact name to customer profiles and atomic invoice/new-customer creation. Secondary names display only in expanded details; primary customer identity stays unchanged.
- [x] Applied additive customer_optional_secondary_contact migration; existing records default blank, old payloads preserve existing contact, and both directories can search the second number.
- [x] Live SQL rollback tests passed profile/invoice saves, retry safety, invalid-phone rejection, clearing, masked finance, legacy payloads and unchanged main name/balances. Security advisor reports no new findings.
- [x] AR/EN 320/390/768/1440 edit/reload/details/identity checks, invalid-phone handling, invoice-new-customer contact save and remove/reset flows passed. Desktop/mobile screenshots reviewed; production build passed.
- [x] Publish named secondary contact.

Named secondary contact release verified: source 28cb0d815bef72a01b228cedd8a8c4c844f88068 matches tested tree eba187affa42343fcdca9c130eb86849c298686d. Production dpl_6DmEiovgs9fbjmYJrq3C47tNXKGW READY with www/redomlabs.com aliases. Additive customer_optional_secondary_contact migration applied; live SQL fixtures rolled back.

## Requested invoice/account cleanup — October 16, 2026
- [x] Saved private database snapshots before changes. Direct hard-delete requests failed with expired connector requestState; used reversible archival instead.
- [x] Archived only the supplied image-subscription invoice. Concurrently entered invoices triggered the original guard and were preserved. Retained invoices were renumbered from 1,2 onward, identity generation restored and next number verified.
- [x] Preserved the protected customer's original balance; cleared other legacy balances while retaining amounts from the newly entered invoices. Customer profiles/contact details remain intact.
- [x] Authenticated owner-session rollback query verified eight visible invoices numbered 1–8 and zero archived rows visible. Next sequence value is 9. No frontend release required.

## Compact overview redesign — October 16, 2026
- [x] Replaced promotional/welcome panels and oversized shortcuts with compact customer counts, actual account totals grouped by currency, recent customer records and a small content/activity strip.
- [x] Reused session-scoped CRM helpers and authorized financial RPCs; unauthorized domains are neither fetched nor serialized. Added loading, retry, empty and partial-error presentation.
- [x] Production build passed; AR/EN 320/390/768/1440 screenshots reviewed. Browser checks cover exact stage counts, currency separation, navigation and staff financial read suppression.
- [x] Publish overview redesign.

Overview release verified: source 49692b6fceac178bfe250be316d2bf931f54d6d1 matches tested tree 4f739b6f8dbe4e6c22208753bf93b93a864cacd4. Production dpl_AZLeqzx3L29on28A7FhswNik18So READY with www/redomlabs.com aliases. No data/schema changes.

## Multiple public company contacts — October 17, 2026
- [x] Added compact add/remove phone rows in contact settings with optional name, job title and email; general company email remains separate. Phone-only contacts render only their number.
- [x] Applied additive company_multiple_contact_people migration, preserving the existing phone and current settings RLS. Contact list validation exists in both the server payload and database constraint; the first phone remains mirrored to the legacy field.
- [x] Unit validation and live rollback SQL tests passed owner CRUD, invalid field rejection, public reads and CRM-only write denial. Security advisor shows only existing findings.
- [x] AR/EN 320/390/768/1440 browser flows passed add/save/retry/reload/remove, optional fields, phone-only rendering and the existing WhatsApp footer rule. Production build passed.
- [x] Publish multiple company contacts.

Multiple company contacts release verified: source 7627d5813094a136edd15955a9c815a51e6544ff matches tested tree b1ac3f87dd52f4e7d0fa49e99f5eccb6a3c4ae7d. Production dpl_3vxYs6YySAJ3FbVDgBwXTTkiervv READY with www/redomlabs.com aliases. Additive migration applied and existing phone preserved; no error/fatal runtime logs for this deployment at release check.

## Admin PWA and audited financial edits — October 18, 2026
- [x] Added bilingual scoped admin manifests, standalone display, original R mark PNG/maskable icons, install action with browser/iOS guidance and a network-only service worker with a static offline screen. No authenticated responses or financial writes are cached/queued.
- [x] Applied additive audited_invoice_discounts_and_payment_edits schema. Sales invoices support gross/discount/net values, sales and purchase edits use revision guards and stable retry IDs, and private audit records stamp the actual actor. Invoice changes update cumulative balances only by their deltas, preserving legacy balances.
- [x] Added invoice editing from Invoices and customer invoice history, plus cumulative paid-total correction from customer details. Account-wide payments remain separate from invoice-specific payments and the UI explains this. Existing Sales paid edits now use the audited guarded payment path.
- [x] Live rollback SQL checks passed discounts, legacy preservation, atomic delta/retry safety, stale/invalid edits, purchases, actor audit and domain/anon write denial. Test fixture preserves the invoice sequence; next invoice remains 9 after verification. Advisor adds only the expected private audit table RLS-with-no-client-policy INFO.
- [x] AR/EN browser checks passed edits, lost-confirmation retry, conflicts, customer paid/history updates, purchases, financial restrictions, 320/390/768/1440 layouts, install guidance/event, manifests/icons/SW headers and an uncached offline navigation. Existing/new-customer invoice creation regression passed. Production build passed.
- [ ] Publish PWA and invoice/payment edits.
