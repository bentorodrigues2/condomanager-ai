
import { supabase } from "../supabase/supabaseClient";

export async function get_fornecedores() {
    const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) throw error;
    return data;
}

export async function add_fornecedores(payload: any) {
    const { data, error } = await supabase
        .from("fornecedores")
        .insert(payload)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function update_fornecedores(id: string, payload: any) {
    const { data, error } = await supabase
        .from("fornecedores")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
}

export async function delete_fornecedores(id: string) {
    const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}
