import "server-only";
import { cache } from "react";
import {
  adminSections,
  type AdminSection,
  type AdminAccess,
} from "./admin-permissions";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabasePublicKey } from "./supabase-config";
export const adminCookie = "indom-admin-session";
export function authClient() {
  return createClient(supabaseUrl, supabasePublicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        }),
    },
  });
}
export async function accessForUser(
  user: import("@supabase/supabase-js").User,
  token: string,
): Promise<AdminAccess | null> {
  if (user.app_metadata.indom_admin === true)
    return {
      id: user.id,
      name: user.email || "Admin",
      owner: true,
      permissions: [...adminSections],
    };
  const client = createClient(supabaseUrl, supabasePublicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        }),
    },
  });
  const { data, error } = await client
    .from("admin_staff")
    .select("name,permissions,active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (
    error ||
    !data?.active ||
    !Array.isArray(data.permissions) ||
    !adminSections.some((p) => p!=="finance"&&data.permissions.includes(p))
  )
    return null;
  return {
    id: user.id,
    name: data.name,
    owner: false,
    permissions: adminSections.filter((p) => data.permissions.includes(p)),
  };
}
export const currentAdmin = cache(async () => {
  const token = (await cookies()).get(adminCookie)?.value;
  if (!token) return null;
  try {
    const { data, error } = await authClient().auth.getUser(token);
    return !error && data.user && (await accessForUser(data.user, token))
      ? data.user
      : null;
  } catch {
    return null;
  }
});
export const currentAccess = cache(async () => {
  const user = await currentAdmin(),
    token = (await cookies()).get(adminCookie)?.value;
  return user && token ? accessForUser(user, token) : null;
});
export async function requireSection(section?: AdminSection) {
  const access = await currentAccess();
  if (
    !access ||
    (!access.owner && (!section || !access.permissions.includes(section)))
  )
    throw Error("Unauthorized");
  return access;
}
