
import { supabase } from "../supabaseClient.ts";

export async function get_documentos() {
    const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_documentos(payload: any) {
    const { data, error } = await supabase
        .from("documentos")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_documentos(id: string, payload: any) {
    const { data, error } = await supabase
        .from("documentos")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_documentos(id: string) {
    const { error } = await supabase
        .from("documentos")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarDocumentos() {
  return await supabase.from("documentos").select("*");
}

export async function obterDocumento(id: any) {
  return await supabase.from("documentos").select("*").eq("id", id).single();
}

export async function criarDocumento(data: any) {
  return await supabase.from("documentos").insert(data);
}

export async function atualizarDocumento(id: any, data: any) {
  return await supabase.from("documentos").update(data).eq("id", id);
}

export async function removerDocumento(id: any) {
  return await supabase.from("documentos").delete().eq("id", id);
}
