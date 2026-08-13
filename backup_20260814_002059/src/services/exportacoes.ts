import { supabase } from "../supabaseClient";

export async function listarExportacoes() {
  return await supabase
    .from("exportacoes")
    .select("*")
    .order("data", { ascending: false });
}

export async function obterExportacao(id) {
  return await supabase.from("exportacoes").select("*").eq("id", id).single();
}

export async function criarExportacao(data) {
  return await supabase.from("exportacoes").insert(data);
}

export async function atualizarExportacao(id, data) {
  return await supabase.from("exportacoes").update(data).eq("id", id);
}

export async function removerExportacao(id) {
  return await supabase.from("exportacoes").delete().eq("id", id);
}
