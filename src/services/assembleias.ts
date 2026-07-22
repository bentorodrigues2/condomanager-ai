
import { supabase } from "../supabase/supabaseClient";

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
