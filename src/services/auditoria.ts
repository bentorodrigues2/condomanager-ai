
import { supabase } from "../supabase/supabaseClient";

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
