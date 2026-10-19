# Automation Hub

Arabic: مركز الأتمتة. Route: `/admin/ar/dashboard?tab=automation` (English: `/admin/en/dashboard?tab=automation`).

## التشغيل الحالي / Current operation

النسخة تعمل يدويًا بدون اشتراكات جديدة: إدارة العملاء والحملات، الأدلة والتحليل المدخل يدويًا، درجة ملاءمة واضحة، القوالب ومسودات الرسائل ومراجعتها، تسجيل الإرسال والرد خارجيًا، المهام، والتقويم التحريري الاجتماعي. لا يتم إرسال بريد أو تشغيل إعلان أو فحص موقع آليًا.

This release supports manual lead/campaign management, evidence-based operator-entered analysis, scoring, template-based draft preparation, approval, externally sent message/response recording, follow-up tasks and a social editorial calendar. No email delivery, ads, autonomous website analysis, paid AI or persistent agent runs.

Score components: service fit 0–40, documented need 0–40, decision-maker reach 0–20. A nonzero need score requires an observation and HTTPS evidence URL. This is an operator rubric, not a validated purchase probability. No automatic website retrieval is performed, avoiding an unbounded network/SSRF surface.

## قاعدة البيانات والصلاحيات / Database and access

Apply `supabase/migrations/20261019093217_automation_hub.sql` after the October 19 foundation. `supabase/automation-hub-setup.sql` contains the identical rerunnable upgrade. The upgrade preserves existing records, renames foundation fields, retains prior score/domain as `legacy_score` / `legacy_domain`, and adds templates, tasks, social posts and markets. Existing unverified scores are retained in the legacy column; the evidence rubric starts at zero. Existing empty production foundation was confirmed before upgrade. No CRM/invoice/customer amounts are changed.

`automation` is a separate staff permission. Existing staff gain no new access. Owners retain access. RLS uses `redom_private.has_access` and every action validates the current authenticated administrator. Database triggers stamp audit actors, prevent send without prior approval and an external reference/time, reset edited approved drafts, reject pending follow-ups after replies/opt-out, and cancel pending messages/tasks when a lead replies or opts out. Integration/job/audit records cannot be authored by ordinary dashboard sessions. No service-role secret is sent to the browser.

The domain uniqueness rule normalizes case, www and standard HTTPS port. A duplicate import is stopped with a visible error; operators search the existing domain and edit that record. Imports are JSON arrays of up to 50 rows, using `company`, `website`, `country` (ISO code) and `source_url`; all other accepted fields are listed in `src/lib/automation.ts`. Imports can partially complete and report how many were saved. They never silently overwrite existing work.

CRM/proposal links reference existing records and require the corresponding module permission at both action and database layers. Customer options come from the existing safe CRM list, currently its first page; proposal options are limited to 100. Creating customers/proposals remains in the existing modules. The hub does not copy financial data into lead records.

## التكاملات اللاحقة / Future integrations

Apollo, Gmail, Metricool, optional self-hosted n8n and Meta Ads are explicitly disconnected placeholders. The site cannot reuse ChatGPT connector tokens. No OAuth flow or credential-entry form is exposed until a real adapter is implemented. Subsequent adapters must keep credentials server-side, verify provider health before marking Connected, enforce suppression and approval again at execution, and support provider idempotency before retries. n8n needs separately available hosting. Paid Meta campaigns require a separately approved budget and campaign.

Campaign Active/Pause/Stop values organize manual work only; they do not execute jobs. Worker control buttons are intentionally unavailable until a real runner is attached. Running jobs require runner/heartbeat data; stale heartbeats display as stale. API/credit usage comes only from actual job records.

Social dates are editorial plans, not platform scheduling. Publishing status requires an external published URL. Connected accounts and performance analytics require a real Metricool adapter. No fabricated performance, leads or counters are seeded.

## حدود العرض والتحقق / Limits and validation

Every screen loads at most the latest 1,000 records per entity. The UI labels counts as a filtered loaded cohort, not global totals. The date filter selects leads by creation date and their messages, not message delivery dates. Meeting/proposal/won counters reflect current lead stage. Time entry uses UTC explicitly. Historical funnel conversion is not inferred from current-stage distribution.

`tests/automation-access.cjs` uses isolated PostgreSQL via PGlite, with `LEGACY_SCHEMA=1` testing upgrade from the foundation; `tests/automation-validation.cjs` covers action field allowlists. Existing team endpoint tests cover staff administration. No production test lead is retained. Browser screenshots/interaction testing were unavailable in this session, so responsive CSS and dialog behavior have not received browser verification. Build/typecheck and database checks do not substitute for that check.
