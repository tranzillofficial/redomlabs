"use server";
import { requireSection } from "../../../../lib/admin-auth";
import { contactAdminClient } from "../../../../lib/contact-service";
import {
  supabaseUrl,
  supabasePublicKey,
} from "../../../../lib/supabase-config";
import { cookies } from "next/headers";
import { adminCookie } from "../../../../lib/admin-auth";
import {
  adminSections,
  type AdminSection,
} from "../../../../lib/admin-permissions";
export type StaffAccount = {
  user_id: string;
  name: string;
  email: string;
  permissions: AdminSection[];
  active: boolean;
};
export async function loadStaff() {
  try {
    const client = await contactAdminClient();
    const { data, error } = await client
      .from("admin_staff")
      .select("user_id,name,email,permissions,active")
      .order("created_at");
    if (error) throw error;
    return { data: data as StaffAccount[], error: false };
  } catch {
    return { data: [] as StaffAccount[], error: true };
  }
}
export async function saveStaff(input: {
  user_id?: string;
  name: string;
  email?: string;
  password?: string;
  permissions: AdminSection[];
  active: boolean;
}) {
  try {
    await requireSection();
    if (
      !input ||
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.length > 100 ||
      !Array.isArray(input.permissions) ||
      input.permissions.some((p) => !adminSections.includes(p)) ||
      typeof input.active !== "boolean"
    )
      return false;
    const token = (await cookies()).get(adminCookie)?.value;
    const result = await fetch(`${supabaseUrl}/functions/v1/admin-team`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabasePublicKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    return result.ok && (await result.json()).success === true;
  } catch {
    return false;
  }
}
