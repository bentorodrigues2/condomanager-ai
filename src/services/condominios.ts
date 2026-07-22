
import { supabase } from "../supabase/supabaseClient";

export async function get_condominios() {
    const { data, error } = await supabase
        .from("condominios")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_condominios(payload: any) {
    const { data, error } = await supabase
        .from("condominios")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_condominios(id: string, payload: any) {
    const { data, error } = await supabase
        .from("condominios")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_condominios(id: string) {
    const { error } = await supabase
        .from("condominios")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
