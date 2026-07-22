
import { supabase } from "../supabase/supabaseClient";

export async function get_incidencias() {
    const { data, error } = await supabase
        .from("incidencias")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_incidencias(payload: any) {
    const { data, error } = await supabase
        .from("incidencias")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_incidencias(id: string, payload: any) {
    const { data, error } = await supabase
        .from("incidencias")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_incidencias(id: string) {
    const { error } = await supabase
        .from("incidencias")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
