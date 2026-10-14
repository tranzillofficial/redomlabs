// Local contract fixtures only. No production credentials or customer data.
const http = require("node:http"),
  assert = require("node:assert/strict"),
  { spawn } = require("node:child_process"),
  { chromium } = require("playwright");
const owner = "11111111-1111-4111-8111-111111111111",
  staff = "22222222-2222-4222-8222-222222222222",
  requestId = "33333333-3333-4333-8333-333333333333";
const now = new Date().toISOString();
let customers = [],
  team = [],
  reads = [],
  requests = [
    {
      id: requestId,
      proposal_slug: "general",
      client_name: "General",
      contact_name: "Test quote customer",
      phone: "01012345678",
      business_type: "company",
      currency: "EGP",
      sections: [
        {
          id: "website",
          title: "موقع شركة",
          titleEn: "Company website",
          startingPrice: 4500,
          billing: "once",
        },
      ],
      notes: "Test quote only",
      created_at: now,
      contacted_at: null,
      contacted_by: null,
      contacted_by_name: null,
    },
  ];
const user = (id) => ({
  id,
  aud: "authenticated",
  role: "authenticated",
  email: id === owner ? "owner@example.invalid" : "team@example.invalid",
  app_metadata: id === owner ? { indom_admin: true } : {},
  user_metadata: {},
  created_at: now,
});
const backend = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://127.0.0.1:3106");
    let body = "";
    for await (const c of req) body += c;
    const input = body ? JSON.parse(body) : {};
    const id =
      req.headers.authorization === "Bearer fixture-staff" ? staff : owner;
    const reply = (data, status = 200, count) => {
      res.writeHead(status, {
        "Content-Type": "application/json",
        ...(count !== undefined
          ? { "Content-Range": `0-${Math.max(0, count - 1)}/${count}` }
          : {}),
      });
      res.end(JSON.stringify(data));
    };
    if (url.pathname === "/auth/v1/user") return reply(user(id));
    if (url.pathname === "/functions/v1/admin-team") {
      if (id !== owner) return reply({}, 403);
      if (input.user_id) {
        team = team.map((r) =>
          r.user_id === input.user_id
            ? {
                ...r,
                name: input.name,
                permissions: input.permissions,
                active: input.active,
              }
            : r,
        );
      } else
        team.push({
          user_id: staff,
          name: input.name,
          email: input.email,
          permissions: input.permissions,
          active: input.active,
          created_at: now,
        });
      return reply({ success: true });
    }
    if (url.pathname === "/rest/v1/rpc/unread_proposal_count")
      return reply(
        requests.filter(
          (r) => !reads.some((v) => v.request_id === r.id && v.user_id === id),
        ).length,
      );
    const table = url.pathname.split("/").pop();
    let rows = {
      admin_staff: team,
      crm_customers: customers,
      proposal_requests: requests,
      proposal_request_reads: reads,
      proposals: [],
      site_projects: [],
      contact_inquiries: [],
      contact_settings: [{ id: 1 }],
    }[table];
    if (!rows) return reply([], 404);
    const match = (r) =>
      [...url.searchParams].every(
        ([k, v]) => !v.startsWith("eq.") || String(r[k]) === v.slice(3),
      );
    if (req.method === "GET" || req.method === "HEAD") {
      let filtered = rows.filter(match);
      if (table === "proposal_request_reads")
        filtered = filtered.filter((v) => v.user_id === id);
      if (req.headers.accept?.includes("vnd.pgrst.object+json"))
        return reply(filtered[0] || null);
      return reply(filtered, 200, filtered.length);
    }
    if (req.method === "POST") {
      const added = Array.isArray(input) ? input : [input];
      for (const r of added) {
        if (table === "crm_customers") {
          r.id ??= crypto.randomUUID();
          r.total_amount ??= 0;
          r.paid_amount ??= 0;
          r.remaining_amount = r.total_amount - r.paid_amount;
          r.created_at ??= now;
          const old = customers.findIndex((v) => v.id === r.id);
          if (old >= 0) customers[old] = r;
          else customers.push(r);
        } else rows.push(r);
      }
      return reply(added, 201);
    }
    if (req.method === "PATCH") {
      const out = [];
      for (const r of rows.filter(match)) {
        Object.assign(r, input);
        if (table === "proposal_requests") {
          r.contacted_by = id;
          r.contacted_by_name =
            id === owner ? "owner@example.invalid" : "Test team";
          r.contacted_at = now;
        }
        out.push(r);
      }
      return reply(out);
    }
    if (req.method === "DELETE") {
      const out = rows.filter(match);
      if (table === "crm_customers") customers = rows.filter((r) => !match(r));
      if (table === "proposal_requests") {
        requests = rows.filter((r) => !match(r));
        reads = reads.filter((r) => !out.some((v) => v.id === r.request_id));
      }
      return reply(out);
    }
    return reply({});
  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
});
(async () => {
  await new Promise((r) => backend.listen(3106, "127.0.0.1", r));
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3105",
    ],
    {
      env: {
        ...process.env,
        SUPABASE_URL: "http://127.0.0.1:3106",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3106",
      },
      stdio: "ignore",
    },
  );
  let browser;
  try {
    for (let i = 0; i < 120; i++) {
      try {
        if ((await fetch("http://127.0.0.1:3105/admin/ar/login")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_EXECUTABLE,
      args: ["--no-sandbox"],
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    await context.addCookies([
      {
        name: "indom-admin-session",
        value: "fixture-owner",
        url: "http://127.0.0.1:3105/admin",
      },
    ]);
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:3105/admin/ar/dashboard?tab=crm");
    await page.getByRole("button", { name: "إضافة عميل", exact: true }).click();
    const dialog = page.locator("dialog");
    await dialog.getByLabel("اسم العميل", { exact: true }).fill("عميل اختبار");
    await dialog.getByLabel("رقم الهاتف", { exact: true }).fill("01012345678");
    await dialog.getByLabel("اسم النشاط", { exact: true }).fill("شركة اختبار");
    await dialog
      .getByLabel("الخدمة المطلوبة", { exact: true })
      .fill("موقع إلكتروني");
    await dialog
      .getByLabel("إجمالي المبلغ المستحق", { exact: true })
      .fill("5000");
    await dialog
      .getByLabel("المقدم / إجمالي المدفوع", { exact: true })
      .fill("1500");
    await dialog
      .getByLabel("حالة العميل", { exact: true })
      .selectOption("follow_up");
    await dialog
      .getByLabel("موعد إعادة التواصل", { exact: true })
      .fill("2026-11-01");
    await dialog.getByLabel("ملاحظات", { exact: true }).fill("ملاحظات اختبار");
    await dialog
      .getByRole("button", { name: "حفظ العميل", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "عميل اختبار", exact: true })
      .waitFor();
    assert.equal(customers.length, 1);
    assert.equal(customers[0].remaining_amount, 3500);
    assert.equal(customers[0].stage, "follow_up");
    await page.reload();
    await page
      .getByRole("heading", { name: "عميل اختبار", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "تعديل / تسجيل دفعة", exact: true })
      .click();
    await dialog
      .getByLabel("المقدم / إجمالي المدفوع", { exact: true })
      .fill("2000");
    await dialog
      .getByRole("button", { name: "حفظ العميل", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    assert.equal(customers[0].remaining_amount, 3000);
    await page.screenshot({
      path: "/tmp/redom-crm-desktop.png",
      fullPage: true,
    });
    const nav = page.locator(".admin-sidebar nav");
    await nav.getByRole("button", { name: "العروض والمقترحات" }).click();
    await page
      .getByRole("button", { name: "فتح الطلب", exact: true })
      .waitFor();
    assert.equal(await page.locator(".admin-badge").textContent(), "1");
    assert.equal(reads.length, 0);
    await page.getByRole("button", { name: "فتح الطلب", exact: true }).click();
    await page.locator(".request-details").waitFor();
    await page.locator(".admin-badge").waitFor({ state: "hidden" });
    assert.equal(reads.length, 1);
    await page.getByRole("button", { name: "تم التواصل", exact: true }).click();
    await page.getByText("تم التواصل بواسطة:", { exact: false }).waitFor();
    assert.equal(requests[0].contacted_by, owner);
    await page
      .getByRole("button", { name: "إضافة للعملاء المحتملين", exact: true })
      .click();
    await page
      .getByText("تم حفظ العميل كعميل محتمل في CRM.", { exact: true })
      .waitFor();
    assert.equal(customers.length, 2);
    await page
      .getByRole("button", { name: "إضافة للعملاء المحتملين", exact: true })
      .click();
    assert.equal(customers.length, 2);
    await nav
      .getByRole("button", { name: "الفريق والصلاحيات", exact: true })
      .click();
    await page.getByRole("button", { name: "إضافة حساب", exact: true }).click();
    await dialog.getByLabel("اسم الموظف", { exact: true }).fill("Test team");
    await dialog
      .getByLabel("البريد الإلكتروني", { exact: true })
      .fill("team@example.invalid");
    await dialog
      .getByLabel("كلمة المرور (10 أحرف على الأقل)", { exact: true })
      .fill("Fixture-password-only");
    await dialog.getByLabel("العملاء والمتابعات", { exact: true }).check();
    await dialog.getByLabel("العروض والمقترحات", { exact: true }).check();
    await dialog
      .getByRole("button", { name: "حفظ الحساب", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Test team", exact: true })
      .waitFor();
    assert.deepEqual(team[0].permissions, ["crm", "proposals"]);
    await page.screenshot({
      path: "/tmp/redom-team-desktop.png",
      fullPage: true,
    });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "overflow " + width,
      );
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.getByRole("button", { name: "إضافة حساب", exact: true }).click();
    await page.screenshot({
      path: "/tmp/redom-team-mobile.png",
      fullPage: true,
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.keyboard.press("Escape");
    await page.getByRole("link", { name: "EN", exact: true }).click();
    await page
      .getByRole("heading", { name: "Team & permissions", exact: true })
      .waitFor();
    assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
    const staffContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await staffContext.addCookies([
      {
        name: "indom-admin-session",
        value: "fixture-staff",
        url: "http://127.0.0.1:3105/admin",
      },
    ]);
    const staffPage = await staffContext.newPage();
    await staffPage.goto("http://127.0.0.1:3105/admin/en/dashboard?tab=team");
    await staffPage
      .getByRole("heading", { name: "Customers & follow-ups", exact: true })
      .waitFor();
    assert.equal(
      await staffPage.locator(".admin-sidebar nav button").count(),
      2,
    );
    assert.equal(
      await staffPage
        .locator(".admin-sidebar nav")
        .getByRole("button", { name: "Team & permissions" })
        .count(),
      0,
    );
    await staffPage
      .locator(".admin-sidebar nav")
      .getByRole("button", { name: "Proposals" })
      .click();
    await staffPage.locator(".admin-badge").waitFor();
    assert.equal(await staffPage.locator(".admin-badge").textContent(), "1");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page
      .locator(".admin-sidebar nav")
      .getByRole("button", { name: "Team & permissions", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Edit permissions / disable account",
        exact: true,
      })
      .click();
    await dialog.getByLabel("Account active", { exact: true }).uncheck();
    await dialog
      .getByRole("button", { name: "Save account", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    await staffPage.reload();
    await staffPage.waitForURL("**/login");
    await page
      .locator(".admin-sidebar nav")
      .getByRole("button", { name: "Proposals", exact: true })
      .click();
    page.once("dialog", (d) => d.dismiss());
    await page
      .getByRole("button", { name: "Delete request", exact: true })
      .click();
    assert.equal(requests.length, 1);
    page.once("dialog", (d) => d.accept());
    await page
      .getByRole("button", { name: "Delete request", exact: true })
      .click();
    await page.getByText("No requests yet.", { exact: true }).waitFor();
    assert.equal(requests.length, 0);
    assert.deepEqual(errors, []);
    console.log(
      "PASS local browser contracts: CRM create/edit/reload, deposit balance, follow-up, explicit unread opening, contact attribution, idempotent CRM conversion, team creation/permissions, denied tabs, disabled staff redirect, delete cancellation/success, AR/EN, 320/390/768 layouts.",
    );
  } finally {
    await browser?.close();
    server.kill();
    backend.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
  backend.close();
});
