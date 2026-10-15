"use server";
import { contactAdminClient } from "../../../../lib/contact-service";
import {currentAccess} from "../../../../lib/admin-auth";
import type { CRMCustomer } from "../../../../lib/crm-types";
const uuid = (v: string) =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export async function loadCRM(page = 0, search = "", stage = "all") {
  try {
    if (
      !Number.isInteger(page) ||
      page < 0 ||
      typeof search !== "string" ||
      search.length > 200 ||
      !["all", "customer", "potential", "follow_up"].includes(stage)
    )
      throw Error();
    const client = await contactAdminClient("crm");
    const {data,error}=await client.rpc('crm_safe_list',{page_number:page,search_term:search,stage_filter:stage});
    if(error)throw error;
    return {data:data.data as CRMCustomer[],count:data.count as number,error:false};
  } catch {
    return { data: [] as CRMCustomer[], count: 0, error: true };
  }
}
export async function saveCRM(row: CRMCustomer) {
  try {
    if (
      !row ||
      !uuid(row.id) ||
      !["customer", "potential", "follow_up"].includes(row.stage) ||
      !["EGP", "USD", "SAR", "AED", "GBP", "EUR"].includes(row.currency)
    )
      return false;
    for (const [key, max] of [
      ["name", 100],
      ["phone", 40],
      ["business_name", 200],
      ["service_name", 300],
      ["notes", 4000],
    ] as const)
      if (typeof row[key] !== "string" || row[key].length > max) return false;
    if (
      !row.name.trim() ||
      !row.service_name.trim() ||
      !/^[+0-9 ()-]{7,40}$/.test(row.phone) ||
      row.phone.replace(/\D/g, "").length < 7
    )
      return false;
    const cents = (v: number) =>
      Number.isFinite(v) &&
      v >= 0 &&
      v <= 999999999999.99 &&
      Math.abs(v * 100 - Math.round(v * 100)) < 0.001;
    if (
      !cents(row.total_amount) ||
      !cents(row.paid_amount) ||
      row.paid_amount > row.total_amount
    )
      return false;
    if (
      row.follow_up_date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(row.follow_up_date) ||
        !Number.isFinite(Date.parse(row.follow_up_date)))
    )
      return false;
    if (row.proposal_request_id && !uuid(row.proposal_request_id)) return false;
    const client = await contactAdminClient("crm");
    const access=await currentAccess();
    if(!access?.owner&&!access?.permissions.includes('finance')){
      const {error}=await client.rpc('crm_safe_save',{payload:row});return !error;
    }
    const { error } = await client
      .from("crm_customers")
      .upsert({
        id: row.id,
        name: row.name.trim(),
        phone: row.phone.trim(),
        business_name: row.business_name.trim(),
        service_name: row.service_name.trim(),
        notes: row.notes.trim(),
        total_amount: row.total_amount,
        paid_amount: row.paid_amount,
        currency: row.currency,
        stage: row.stage,
        follow_up_date: row.follow_up_date || null,
        proposal_request_id: row.proposal_request_id || null,
        updated_at: new Date().toISOString(),
      });
    return !error;
  } catch {
    return false;
  }
}
export async function deleteCRM(id: string) {
  try {
    if (!uuid(id)) return false;
    const client = await contactAdminClient("crm");
    const { data, error } = await client
      .from("crm_customers")
      .delete()
      .eq("id", id)
      .select("id");
    return !error && data?.length === 1;
  } catch {
    return false;
  }
}
export async function proposalToCRM(id: string) {
  try {
    if (!uuid(id)) return false;
    await contactAdminClient("crm");
    const client = await contactAdminClient("proposals");
    const { data: r, error } = await client
      .from("proposal_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !r) return false;
    const {error:insert}=await client.rpc('crm_convert_request',{request_id:id});return !insert;
  } catch {
    return false;
  }
}
