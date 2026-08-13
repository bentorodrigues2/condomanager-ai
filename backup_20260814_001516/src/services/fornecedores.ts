
import { supabase } from "../supabaseClient.ts";

export async function get_fornecedores() {
    const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_fornecedores(payload: any) {
    const { data, error } = await supabase
        .from("fornecedores")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_fornecedores(id: string, payload: any) {
    const { data, error } = await supabase
        .from("fornecedores")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_fornecedores(id: string) {
    const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarFornecedores() {
  return await supabase.from("fornecedores").select("*");
}

export async function obterFornecedor(id: any) {
  return await supabase.from("fornecedores").select("*").eq("id", id).single();
}

export async function criarFornecedor(data: any) {
  return await supabase.from("fornecedores").insert(data);
}

export async function atualizarFornecedor(id: any, data: any) {
  return await supabase.from("fornecedores").update(data).eq("id", id);
}

export async function removerFornecedor(id: any) {
  return await supabase.from("fornecedores").delete().eq("id", id);
}
