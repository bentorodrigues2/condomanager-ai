
import { supabase } from "../supabaseClient.ts";

export async function get_pagamentos() {
    const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_pagamentos(payload: any) {
    const { data, error } = await supabase
        .from("pagamentos")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_pagamentos(id: string, payload: any) {
    const { data, error } = await supabase
        .from("pagamentos")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_pagamentos(id: string) {
    const { error } = await supabase
        .from("pagamentos")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarPagamentos() {
  return await supabase.from("pagamentos").select("*");
}

export async function obterPagamento(id: any) {
  return await supabase.from("pagamentos").select("*").eq("id", id).single();
}

export async function criarPagamento(data: any) {
  return await supabase.from("pagamentos").insert(data);
}

export async function atualizarPagamento(id: any, data: any) {
  return await supabase.from("pagamentos").update(data).eq("id", id);
}

export async function removerPagamento(id: any) {
  return await supabase.from("pagamentos").delete().eq("id", id);
}
