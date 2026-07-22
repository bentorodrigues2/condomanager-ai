import { supabase } from "../supabaseClient";

export async function listarLimpezas() {
  return await supabase
    .from("limpezas")
    .select("*")
    .order("data", { ascending: false });
}

export async function obterLimpeza(id) {
  return await supabase.from("limpezas").select("*").eq("id", id).single();
}

export async function criarLimpeza(data) {
  return await supabase.from("limpezas").insert(data);
}

export async function atualizarLimpeza(id, data) {
  return await supabase.from("limpezas").update(data).eq("id", id);
}

export async function removerLimpeza(id) {
  return await supabase.from("limpezas").delete().eq("id", id);
}
