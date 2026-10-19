import { createClient } from "npm:@supabase/supabase-js@2.117.2";
const sections = [
  "overview",
  "automation",
  "products",
  "work",
  "crm",
  "sales",
  "expenses",
  "finance",
  "proposals",
  "inquiries",
  "forms",
  "settings",
];
const response = (status: number, code: string) =>
  new Response(JSON.stringify({ success: status === 200, code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
Deno.serve(async (req) => {
  if (req.method !== "POST") return response(405, "method");
  const bearer = req.headers.get("Authorization") || "";
  if (!bearer.startsWith("Bearer ")) return response(401, "unauthorized");
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  try {
    const { data: auth, error: authError } = await client.auth.getUser(
      bearer.slice(7),
    );
    if (authError || auth.user?.app_metadata.indom_admin !== true)
      return response(403, "unauthorized");
    const content = await req.text();
    if (content.length > 8000) return response(400, "invalid");
    const input = JSON.parse(content);
    if (
      !input ||
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.length > 100 ||
      !Array.isArray(input.permissions) ||
      input.permissions.length > sections.length ||
      !input.permissions.some((p:unknown) => typeof p==="string"&&p!=="finance") ||
      input.permissions.some(
        (p: unknown) => typeof p !== "string" || !sections.includes(p),
      ) ||
      typeof input.active !== "boolean"
    )
      return response(400, "invalid");
    const payload = {
      name: input.name.trim(),
      permissions: [...new Set(input.permissions)],
      active: input.active,
    };
    if (input.user_id) {
      if (
        typeof input.user_id !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(input.user_id) ||
        input.user_id === auth.user.id
      )
        return response(400, "invalid");
      const { data: target, error: targetError } =
        await client.auth.admin.getUserById(input.user_id);
      if (
        targetError ||
        !target.user ||
        target.user.app_metadata.indom_admin === true
      )
        return response(403, "invalid");
      const { data: staff, error: staffError } = await client
        .from("admin_staff")
        .select("user_id")
        .eq("user_id", input.user_id)
        .single();
      if (staffError || !staff) return response(404, "missing");
      const { error } = await client
        .from("admin_staff")
        .update(payload)
        .eq("user_id", input.user_id);
      return response(error ? 500 : 200, error ? "database" : "saved");
    }
    if (
      typeof input.email !== "string" ||
      input.email.length > 254 ||
      !/^\S+@\S+\.\S+$/.test(input.email) ||
      typeof input.password !== "string" ||
      input.password.length < 10 ||
      input.password.length > 200 ||
      !input.active ||
      !payload.permissions.length
    )
      return response(400, "invalid");
    // No email is sent: owner creates a password and shares access independently.
    const { data: created, error: createError } =
      await client.auth.admin.createUser({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        email_confirm: true,
        app_metadata: { redom_staff: true },
      });
    if (createError || !created.user) return response(400, "account");
    const { error } = await client
      .from("admin_staff")
      .insert({
        ...payload,
        user_id: created.user.id,
        email: created.user.email,
      });
    if (error) {
      await client.auth.admin.deleteUser(created.user.id);
      return response(500, "database");
    }
    return response(200, "saved");
  } catch {
    return response(500, "failed");
  }
});
