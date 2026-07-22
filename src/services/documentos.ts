
import { supabase } from "../supabase/supabaseClient";

export async function get_documentos() {
    const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_documentos(payload: any) {
    const { data, error } = await supabase
        .from("documentos")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_documentos(id: string, payload: any) {
    const { data, error } = await supabase
        .from("documentos")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_documentos(id: string) {
    const { error } = await supabase
        .from("documentos")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
