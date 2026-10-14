"use client";
import { useEffect, useState } from "react";
import {
  getProposalRequestsAction,
  openProposalRequestAction,
  contactProposalRequestAction,
  deleteProposalRequestAction,
} from "../app/(admin)/admin/[locale]/proposal-actions";
import { proposalToCRM } from "../app/(admin)/admin/[locale]/crm-actions";
import type { ProposalRequest } from "../lib/proposal-request-types";
import { businessTypes, catalogTotals } from "../lib/proposal-catalog";
export function AdminProposalInbox({
  ar,
  canCRM,
}: {
  ar: boolean;
  canCRM: boolean;
}) {
  const t = (a: string, b: string) => (ar ? a : b);
  const [rows, setRows] = useState<ProposalRequest[]>([]),
    [page, setPage] = useState(0),
    [count, setCount] = useState(0),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [opened, setOpened] = useState<string | null>(null),
    [notice, setNotice] = useState("");
  function changed() {
    window.dispatchEvent(new Event("proposal-inbox-change"));
  }
  async function load() {
    setLoading(true);
    const r = await getProposalRequestsAction(page);
    setRows(r.data);
    setCount(r.count);
    setError(
      r.success ? "" : t("تعذر تحميل الطلبات.", "Unable to load requests."),
    );
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [page]);
  async function perform(task: () => Promise<boolean>) {
    setBusy(true);
    setError("");
    const ok = await task();
    if (ok) {
      await load();
      changed();
    } else
      setError(
        t(
          "تعذر تنفيذ العملية. حاول مجددًا.",
          "Unable to complete this action. Try again.",
        ),
      );
    setBusy(false);
    return ok;
  }
  return (
    <section className="admin-card" style={{ marginTop: 24 }}>
      <div className="card-heading">
        <h2>{t("طلبات عروض مخصصة", "Custom quote requests")}</h2>
        <button className="admin-secondary" onClick={load} disabled={busy}>
          {t("تحديث", "Refresh")}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {loading ? (
        <p role="status">{t("جارٍ التحميل…", "Loading…")}</p>
      ) : !rows.length ? (
        <p>{t("لا توجد طلبات حتى الآن.", "No requests yet.")}</p>
      ) : (
        rows.map((r) => (
          <article
            className={`contact-inquiry ${!r.read ? "request-unread" : ""}`}
            key={r.id}
          >
            <div className="card-heading">
              <h3>{r.contact_name}</h3>
              {!r.read && <span className="crm-chip">{t("جديد", "New")}</span>}
            </div>
            <a href={`tel:${r.phone.replace(/[^+0-9]/g, "")}`} dir="ltr">
              {r.phone}
            </a>
            <p>
              {r.proposal_slug} ·{" "}
              {
                businessTypes.find((b) => b.id === r.business_type)?.[
                  ar ? "ar" : "en"
                ]
              }{" "}
              · {new Date(r.created_at).toLocaleString(ar ? "ar-EG" : "en-GB")}
            </p>
            {r.contacted_at ? (
              <p className="crm-contacted">
                {t("تم التواصل بواسطة: ", "Contacted by: ")}
                <strong>{r.contacted_by_name || "—"}</strong> ·{" "}
                {new Date(r.contacted_at).toLocaleString(
                  ar ? "ar-EG" : "en-GB",
                )}
              </p>
            ) : (
              <p>{t("لم يتم التواصل بعد", "Not contacted yet")}</p>
            )}
            <button
              disabled={busy}
              className="admin-secondary"
              aria-expanded={opened === r.id}
              onClick={async () => {
                if (opened === r.id) {
                  setOpened(null);
                  return;
                }
                if (r.read) {
                  setOpened(r.id);
                  return;
                }
                if (await perform(() => openProposalRequestAction(r.id)))
                  setOpened(r.id);
              }}
            >
              {opened === r.id
                ? t("إغلاق التفاصيل", "Close details")
                : t("فتح الطلب", "Open request")}
            </button>
            {opened === r.id && (
              <div className="request-details">
                <ul>
                  {r.sections.map((s) => (
                    <li key={s.id}>
                      {ar ? s.title : s.titleEn || s.title} —{" "}
                      {s.startingPrice === undefined
                        ? t("حسب النطاق", "Quoted to scope")
                        : Number(s.startingPrice).toLocaleString(
                            ar ? "ar-EG" : "en-GB",
                          ) +
                          " " +
                          r.currency}{" "}
                      (
                      {s.billing === "annual"
                        ? t("سنوي", "Annual")
                        : s.billing === "monthly"
                          ? t("شهري", "Monthly")
                          : t("مرة واحدة", "One-time")}
                      )
                    </li>
                  ))}
                </ul>
                <p className="crm-notes">{r.notes}</p>
                <p>
                  {t(
                    "تقدير الخدمات المحددة، وليس مبلغًا متفقًا عليه.",
                    "Selected-service estimate, not an agreed amount.",
                  )}
                </p>
                {(["once", "annual", "monthly"] as const).map((k, i) => (
                  <p key={k}>
                    {
                      [
                        t("مرة واحدة", "One-time"),
                        t("سنوي", "Annual"),
                        t("شهري", "Monthly"),
                      ][i]
                    }
                    :{" "}
                    {catalogTotals(r.sections)[k].toLocaleString(
                      ar ? "ar-EG" : "en-GB",
                    )}{" "}
                    {r.currency}
                  </p>
                ))}
              </div>
            )}
            <div className="project-editor-actions">
              {!r.contacted_at && (
                <button
                  className="button"
                  disabled={busy}
                  onClick={() =>
                    perform(() => contactProposalRequestAction(r.id))
                  }
                >
                  {t("تم التواصل", "Mark contacted")}
                </button>
              )}
              {canCRM && (
                <button
                  className="admin-secondary"
                  disabled={busy}
                  onClick={async () => {
                    if (await perform(() => proposalToCRM(r.id)))
                      setNotice(
                        t(
                          "تم حفظ العميل كعميل محتمل في CRM.",
                          "Saved as a potential customer in CRM.",
                        ),
                      );
                  }}
                >
                  {t("إضافة للعملاء المحتملين", "Add to potential customers")}
                </button>
              )}
              <button
                className="admin-danger"
                disabled={busy}
                onClick={() => {
                  if (
                    confirm(
                      t("حذف طلب عرض السعر؟", "Delete this quote request?"),
                    )
                  )
                    perform(() => deleteProposalRequestAction(r.id));
                }}
              >
                {t("حذف الطلب", "Delete request")}
              </button>
            </div>
          </article>
        ))
      )}
      <div className="crm-pagination">
        <button
          disabled={!page || loading}
          className="admin-secondary"
          onClick={() => setPage((p) => p - 1)}
        >
          {t("السابق", "Previous")}
        </button>
        <span>
          {page + 1} / {Math.max(1, Math.ceil(count / 50))}
        </span>
        <button
          disabled={(page + 1) * 50 >= count || loading}
          className="admin-secondary"
          onClick={() => setPage((p) => p + 1)}
        >
          {t("التالي", "Next")}
        </button>
      </div>
    </section>
  );
}
