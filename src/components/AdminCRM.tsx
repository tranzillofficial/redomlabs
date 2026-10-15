"use client";
import { useEffect, useRef, useState } from "react";
import {
  loadCRM,
  saveCRM,
  deleteCRM,
} from "../app/(admin)/admin/[locale]/crm-actions";
import {customerTotals} from "../app/(admin)/admin/[locale]/expense-actions";
import type { CRMCustomer, CustomerStage } from "../lib/crm-types";
export function AdminCRM({ ar, financial=false }: { ar: boolean; financial?: boolean }) {
  const t = (a: string, b: string) => (ar ? a : b);
  const [rows, setRows] = useState<CRMCustomer[]>([]),
    [page, setPage] = useState(0),
    [count, setCount] = useState(0),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [filter, setFilter] = useState("all"),
    [search, setSearch] = useState(""),
    [debounced, setDebounced] = useState(""),
    [editing, setEditing] = useState<CRMCustomer | null>(null),
    [busy, setBusy] = useState(false);
  const [totals,setTotals]=useState<{currency:string;total:number;paid:number;remaining:number}[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const stages: Record<CustomerStage, string> = {
    customer: t("عملاء حاليون", "Customers"),
    potential: t("عملاء محتملون", "Potential customers"),
    follow_up: t("إعادة تواصل", "Follow-up"),
  };
  async function load() {
    setLoading(true);
    const r = await loadCRM(page, debounced, filter);
    setRows(r.data);
    if(financial)setTotals(await customerTotals());
    setCount(r.count);
    setError(
      r.error ? t("تعذر تحميل العملاء.", "Unable to load customers.") : "",
    );
    setLoading(false);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      setDebounced(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    load();
  }, [page, debounced, filter]);
  useEffect(() => {
    if (editing) dialog.current?.showModal();
  }, [editing]);
  function add() {
    setEditing({
      id: crypto.randomUUID(),
      name: "",
      phone: "",
      business_name: "",
      service_name: "",
      total_amount: 0,
      paid_amount: 0,
      remaining_amount: 0,
      currency: "EGP",
      stage: "customer",
      follow_up_date: null,
      notes: "",
      proposal_request_id: null,
      created_at: "",
      updated_at: "",
    });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const ok = await saveCRM(editing);
    setBusy(false);
    if (ok) {
      setEditing(null);
      setError("");
      await load();
    } else
      setError(
        t(
          "تعذر الحفظ. راجع البيانات والمبلغ المدفوع.",
          "Unable to save. Check the details and paid amount.",
        ),
      );
  }
  const visible = rows;
  return (
    <>
      <section className="admin-card">
        <div className="card-heading">
          <h2>{t("سجل العملاء والخدمات", "Customer services")}</h2>
          <button className="button" onClick={add}>
            {t("إضافة عميل", "Add customer")}
          </button>
        </div>
        {financial&&<div className="crm-grid">{totals.map(r=><article className="crm-customer" key={r.currency}><h3>{r.currency}</h3><dl className="crm-amounts">{[[t('إجمالي المستحق','Total due'),r.total],[t('إجمالي الداخل / المدفوع','Total received / paid'),r.paid],[t('المتبقي','Remaining'),r.remaining]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{Number(value).toLocaleString(ar?'ar-EG':'en-GB',{minimumFractionDigits:2})}</dd></div>)}</dl></article>)}</div>}
        <div className="crm-toolbar">
          <input
            aria-label={t("البحث عن عميل", "Search customers")}
            placeholder={t(
              "اسم العميل، الهاتف، النشاط أو الخدمة",
              "Name, phone, business or service",
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label={t("حالة العميل", "Customer stage")}
            value={filter}
            onChange={(e) => {
              setPage(0);
              setFilter(e.target.value);
            }}
          >
            <option value="all">{t("كل الحالات", "All stages")}</option>
            {Object.entries(stages).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button className="admin-secondary" onClick={load}>
            {t("تحديث", "Refresh")}
          </button>
        </div>
        {financial&&<p className="admin-description">
          {t(
            "المدفوع يشمل المقدم وأي دفعات لاحقة. المتبقي يُحسب تلقائيًا.",
            "Paid includes the deposit and subsequent payments. Remaining is calculated automatically.",
          )}
        </p>}
        {error && (
          <p role="alert" className="admin-status">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status">{t("جارٍ التحميل…", "Loading…")}</p>
        ) : !visible.length ? (
          <p>{t("لا يوجد عملاء بهذه البيانات.", "No matching customers.")}</p>
        ) : (
          <div className="crm-grid">
            {visible.map((r) => (
              <article className="crm-customer" key={r.id}>
                <div className="card-heading">
                  <h3>{r.name}</h3>
                  <span className="crm-chip">{stages[r.stage]}</span>
                </div>
                <a href={`tel:${r.phone.replace(/[^+0-9]/g, "")}`} dir="ltr">
                  {r.phone}
                </a>
                <p>{r.business_name || "—"}</p>
                <strong>{r.service_name}</strong>
                {financial&&<dl className="crm-amounts">
                  {[
                    [t("الإجمالي", "Total"), r.total_amount],
                    [t("المدفوع / المقدم", "Paid / deposit"), r.paid_amount],
                    [t("المتبقي", "Remaining"), r.remaining_amount],
                  ].map(([label, n]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>
                        {Number(n).toLocaleString(ar ? "ar-EG" : "en-GB")}{" "}
                        {r.currency}
                      </dd>
                    </div>
                  ))}
                </dl>}
                {r.follow_up_date && (
                  <p className="crm-follow-up">
                    {t("موعد المتابعة: ", "Follow-up: ")}
                    {new Date(
                      r.follow_up_date + "T12:00:00",
                    ).toLocaleDateString(ar ? "ar-EG" : "en-GB")}
                  </p>
                )}
                {r.notes && <p className="crm-notes">{r.notes}</p>}
                <div className="project-editor-actions">
                  <button
                    className="admin-secondary"
                    onClick={() => {
                      setError("");
                      setEditing({
                        ...r,
                        total_amount: Number(r.total_amount),
                        paid_amount: Number(r.paid_amount),
                      });
                    }}
                  >
                    {financial?t("تعديل / تسجيل دفعة", "Edit / record payment"):t("تعديل", "Edit")}
                  </button>
                  {financial&&<button
                    className="admin-danger"
                    disabled={busy}
                    onClick={async () => {
                      if (
                        !confirm(
                          t("حذف سجل العميل؟", "Delete this customer record?"),
                        )
                      )
                        return;
                      setBusy(true);
                      const ok = await deleteCRM(r.id);
                      setBusy(false);
                      if (ok) await load();
                      else
                        setError(
                          t("تعذر حذف العميل.", "Unable to delete customer."),
                        );
                    }}
                  >
                    {t("حذف", "Delete")}
                  </button>}
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="crm-pagination">
          <button
            disabled={page === 0 || loading}
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
      {editing && (
        <dialog
          ref={dialog}
          className="crm-dialog"
          onCancel={(e) => {
            if (busy) e.preventDefault();
            else setEditing(null);
          }}
          onClose={() => {
            if (!busy) setEditing(null);
          }}
        >
          <form onSubmit={save}>
            <div className="card-heading">
              <h2>
                {t("بيانات العميل والخدمة", "Customer & service details")}
              </h2>
              <button
                type="button"
                className="admin-secondary"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                {t("إغلاق", "Close")}
              </button>
            </div>
            <div className="crm-fields">
              {(
                [
                  ["name", t("اسم العميل", "Customer name"), true],
                  ["phone", t("رقم الهاتف", "Phone number"), true],
                  ["business_name", t("اسم النشاط", "Business name"), false],
                  [
                    "service_name",
                    t("الخدمة المطلوبة", "Requested service"),
                    true,
                  ],
                ] as const
              ).map(([key, label, required]) => (
                <label key={key}>
                  {label}
                  <input
                    required={required}
                    type={key === "phone" ? "tel" : "text"}
                    maxLength={
                      key === "service_name"
                        ? 300
                        : key === "business_name"
                          ? 200
                          : key === "phone"
                            ? 40
                            : 100
                    }
                    value={editing[key]}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
              {financial&&<> <label>
                {t("إجمالي المبلغ المستحق", "Total due")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editing.total_amount}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      total_amount: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                {t("المقدم / إجمالي المدفوع", "Deposit / total paid")}
                <input
                  type="number"
                  min="0"
                  max={editing.total_amount}
                  step="0.01"
                  required
                  value={editing.paid_amount}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      paid_amount: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                {t("العملة", "Currency")}
                <select
                  aria-label={t("العملة", "Currency")}
                  value={editing.currency}
                  onChange={(e) =>
                    setEditing({ ...editing, currency: e.target.value })
                  }
                >
                  {["EGP", "USD", "SAR", "AED", "GBP", "EUR"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              </>}<label>
                {t("حالة العميل", "Customer stage")}
                <select
                  aria-label={t("حالة العميل", "Customer stage")}
                  value={editing.stage}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      stage: e.target.value as CustomerStage,
                    })
                  }
                >
                  {Object.entries(stages).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("موعد إعادة التواصل", "Follow-up date")}
                <input
                  type="date"
                  value={editing.follow_up_date || ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      follow_up_date: e.target.value || null,
                    })
                  }
                />
              </label>
            </div>
            <label>
              {t("ملاحظات", "Notes")}
              <textarea
                rows={3}
                maxLength={4000}
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
              />
            </label>
            {financial&&<p className="crm-balance">
              {t("المتبقي: ", "Remaining: ")}
              {(editing.total_amount - editing.paid_amount).toLocaleString(
                ar ? "ar-EG" : "en-GB",
              )}{" "}
              {editing.currency}
            </p>}
            {error && <p role="alert">{error}</p>}
            <button className="button" disabled={busy}>
              {busy
                ? t("جارٍ الحفظ…", "Saving…")
                : t("حفظ العميل", "Save customer")}
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
