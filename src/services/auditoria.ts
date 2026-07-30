
import { supabase } from "../supabaseClient.ts";

export async function get_auditoria() {
    const { data, error } = await supabase
        .from("auditoria")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_auditoria(payload: any) {
    const { data, error } = await supabase
        .from("auditoria")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_auditoria(id: string, payload: any) {
    const { data, error } = await supabase
        .from("auditoria")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_auditoria(id: string) {
    const { error } = await supabase
        .from("auditoria")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarAuditoria() {
  return await supabase.from("auditoria").select("*");
}

export async function obterAuditoria(id: any) {
  return await supabase.from("auditoria").select("*").eq("id", id).single();
}

export async function criarAuditoria(data: any) {
  return await supabase.from("auditoria").insert(data);
}

export async function atualizarAuditoria(id: any, data: any) {
  return await supabase.from("auditoria").update(data).eq("id", id);
}

export async function removerAuditoria(id: any) {
  return await supabase.from("auditoria").delete().eq("id", id);
}
