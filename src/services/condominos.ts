
import { supabase } from "../supabase/supabaseClient";

export async function get_condominos() {
    const { data, error } = await supabase
        .from("condominos")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_condominos(payload: any) {
    const { data, error } = await supabase
        .from("condominos")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_condominos(id: string, payload: any) {
    const { data, error } = await supabase
        .from("condominos")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_condominos(id: string) {
    const { error } = await supabase
        .from("condominos")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
