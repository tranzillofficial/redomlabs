"use client";
import { useEffect, useRef, useState } from "react";
import {
  loadStaff,
  saveStaff,
  type StaffAccount,
} from "../app/(admin)/admin/[locale]/team-actions";
import { adminSections, sectionLabels } from "../lib/admin-permissions";
export function AdminTeam({ ar }: { ar: boolean }) {
  const t = (a: string, b: string) => (ar ? a : b);
  const [rows, setRows] = useState<StaffAccount[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [editing, setEditing] = useState<StaffAccount | null>(null),
    [password, setPassword] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  async function load() {
    const r = await loadStaff();
    setRows(r.data);
    setError(
      r.error
        ? t("تعذر تحميل حسابات الفريق.", "Unable to load team accounts.")
        : "",
    );
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (editing) dialog.current?.showModal();
  }, [editing]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    const ok = await saveStaff({
      ...editing,
      user_id: editing.user_id || undefined,
      password: editing.user_id ? undefined : password,
    });
    setBusy(false);
    if (ok) {
      setEditing(null);
      setPassword("");
      await load();
    } else
      setError(
        t(
          "تعذر الحفظ. تحقق من البيانات، أو أن البريد مستخدم بالفعل.",
          "Unable to save. Check the details or whether this email is already in use.",
        ),
      );
  }
  return (
    <section className="admin-card">
      <div className="card-heading">
        <h2>{t("حسابات الفريق والصلاحيات", "Team accounts & permissions")}</h2>
        <button
          className="button"
          onClick={() => {
            setError("");
            setPassword("");
            setEditing({
              user_id: "",
              name: "",
              email: "",
              permissions: [],
              active: true,
            });
          }}
        >
          {t("إضافة حساب", "Add account")}
        </button>
      </div>
      <p>
        {t(
          "حدد الأقسام التي يقدر كل موظف يفتحها ويديرها. إدارة حسابات الفريق متاحة للمسؤول الرئيسي فقط.",
          "Choose which sections each team member can access and manage. Only the owner manages team accounts.",
        )}
      </p>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>{t("جارٍ التحميل…", "Loading…")}</p>
      ) : !rows.length ? (
        <p>{t("لم تضف حسابات فريق بعد.", "No team accounts yet.")}</p>
      ) : (
        <div className="crm-grid">
          {rows.map((r) => (
            <article className="crm-customer" key={r.user_id}>
              <div className="card-heading">
                <h3>{r.name}</h3>
                <span className="crm-chip">
                  {r.active ? t("نشط", "Active") : t("موقوف", "Disabled")}
                </span>
              </div>
              <p dir="ltr">{r.email}</p>
              <div className="team-permissions">
                {r.permissions.map((p) => (
                  <span key={p} className="crm-chip">
                    {sectionLabels[p][ar ? "ar" : "en"]}
                  </span>
                ))}
              </div>
              <button
                className="admin-secondary"
                onClick={() => {
                  setError("");
                  setEditing({ ...r });
                }}
              >
                {t(
                  "تعديل الصلاحيات / إيقاف الحساب",
                  "Edit permissions / disable account",
                )}
              </button>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <dialog
          ref={dialog}
          className="crm-dialog"
          onCancel={(e) => {
            if (busy) e.preventDefault();
            else {
              setEditing(null);
              setPassword("");
            }
          }}
        >
          <form onSubmit={submit}>
            <div className="card-heading">
              <h2>
                {editing.user_id
                  ? t("تعديل حساب الفريق", "Edit team account")
                  : t("حساب فريق جديد", "New team account")}
              </h2>
              <button
                type="button"
                disabled={busy}
                className="admin-secondary"
                onClick={() => {
                  setEditing(null);
                  setPassword("");
                }}
              >
                {t("إغلاق", "Close")}
              </button>
            </div>
            <div className="crm-fields">
              <label>
                {t("اسم الموظف", "Team member name")}
                <input
                  required
                  maxLength={100}
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </label>
              <label>
                {t("البريد الإلكتروني", "Email")}
                <input
                  type="email"
                  required
                  readOnly={!!editing.user_id}
                  maxLength={254}
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </label>
              {!editing.user_id && (
                <label>
                  {t(
                    "كلمة المرور (10 أحرف على الأقل)",
                    "Password (at least 10 characters)",
                  )}
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    maxLength={200}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              )}
            </div>
            <fieldset className="team-fieldset">
              <legend>{t("الأقسام والصلاحيات المسموح بها", "Allowed sections & permissions")}</legend>
              {adminSections.map((p) => (
                <label className="team-check" key={p}>
                  <input
                    type="checkbox"
                    checked={editing.permissions.includes(p)}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        permissions: e.target.checked
                          ? [...editing.permissions, p]
                          : editing.permissions.filter((v) => v !== p),
                      })
                    }
                  />
                  {sectionLabels[p][ar ? "ar" : "en"]}
                </label>
              ))}
            </fieldset>
            {editing.user_id && (
              <label className="team-check">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) =>
                    setEditing({ ...editing, active: e.target.checked })
                  }
                />
                {t("الحساب نشط", "Account active")}
              </label>
            )}
            {error && <p role="alert">{error}</p>}
            <button
              className="button"
              disabled={
                busy || !editing.permissions.some(p=>p!=="finance")
              }
            >
              {busy
                ? t("جارٍ الحفظ…", "Saving…")
                : t("حفظ الحساب", "Save account")}
            </button>
          </form>
        </dialog>
      )}
    </section>
  );
}
