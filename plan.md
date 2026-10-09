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
