
import { supabase } from "../supabaseClient.ts";

export async function get_fracoes() {
    const { data, error } = await supabase
        .from("fracoes")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_fracoes(payload: any) {
    const { data, error } = await supabase
        .from("fracoes")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_fracoes(id: string, payload: any) {
    const { data, error } = await supabase
        .from("fracoes")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_fracoes(id: string) {
    const { error } = await supabase
        .from("fracoes")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarFracoes() {
  return await supabase.from("fracoes").select("*");
}

export async function obterFracao(id: any) {
  return await supabase.from("fracoes").select("*").eq("id", id).single();
}

export async function criarFracao(data: any) {
  return await supabase.from("fracoes").insert(data);
}

export async function atualizarFracao(id: any, data: any) {
  return await supabase.from("fracoes").update(data).eq("id", id);
}

export async function removerFracao(id: any) {
  return await supabase.from("fracoes").delete().eq("id", id);
}
