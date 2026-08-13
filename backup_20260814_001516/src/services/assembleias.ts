
import { supabase } from "../supabaseClient.ts";

export async function get_assembleias() {
    const { data, error } = await supabase
        .from("assembleias")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_assembleias(payload: any) {
    const { data, error } = await supabase
        .from("assembleias")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_assembleias(id: string, payload: any) {
    const { data, error } = await supabase
        .from("assembleias")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_assembleias(id: string) {
    const { error } = await supabase
        .from("assembleias")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarAssembleias() {
  return await supabase.from("assembleias").select("*");
}

export async function obterAssembleia(id: any) {
  return await supabase.from("assembleias").select("*").eq("id", id).single();
}

export async function criarAssembleia(data: any) {
  return await supabase.from("assembleias").insert(data);
}

export async function atualizarAssembleia(id: any, data: any) {
  return await supabase.from("assembleias").update(data).eq("id", id);
}

export async function removerAssembleia(id: any) {
  return await supabase.from("assembleias").delete().eq("id", id);
}
