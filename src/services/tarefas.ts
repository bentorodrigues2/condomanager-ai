
import { supabase } from "../supabase/supabaseClient";

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
