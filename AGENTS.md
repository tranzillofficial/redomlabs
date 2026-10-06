# Project instructions
Read plan.md and docs/architecture.md before edits. Update plan.md after each completed milestone and commit it with the work.
All user-facing content must have Arabic and English versions. Arabic pages use lang=ar and dir=rtl. Keep language switching on the same page.
Never show individual projects or product images on the home page. Show own products under /[locale]/products and client work under /[locale]/work. Never fabricate portfolio entries.
Preserve the reference logo geometry. REDOM uses independently animatable SVG letter groups; the R mark omits the traditional left vertical stem. Motion must respect prefers-reduced-motion.
Never fabricate company credentials or contact information. Never commit secrets. Supabase service-role keys must remain server-only. Verify build and visual behavior before deployment.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
