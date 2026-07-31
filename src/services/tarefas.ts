
import { supabase } from "../supabaseClient.ts";

export async function get_tarefas() {
    const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_tarefas(payload: any) {
    const { data, error } = await supabase
        .from("tarefas")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_tarefas(id: string, payload: any) {
    const { data, error } = await supabase
        .from("tarefas")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_tarefas(id: string) {
    const { error } = await supabase
        .from("tarefas")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}


export async function listarTarefas() {
  return await supabase.from("tarefas").select("*");
}

export async function obterTarefa(id: any) {
  return await supabase.from("tarefas").select("*").eq("id", id).single();
}

export async function criarTarefa(data: any) {
  return await supabase.from("tarefas").insert(data);
}

export async function atualizarTarefa(id: any, data: any) {
  return await supabase.from("tarefas").update(data).eq("id", id);
}

export async function removerTarefa(id: any) {
  return await supabase.from("tarefas").delete().eq("id", id);
}
