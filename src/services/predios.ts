import { supabase } from "../supabaseClient";

export async function listarPredios() {
  return await supabase.from("predios").select("*").order("nome");
}

export async function obterPredio(id) {
  return await supabase.from("predios").select("*").eq("id", id).single();
}

export async function criarPredio(data) {
  return await supabase.from("predios").insert(data);
}

export async function atualizarPredio(id, data) {
  return await supabase.from("predios").update(data).eq("id", id);
}

export async function removerPredio(id) {
  return await supabase.from("predios").delete().eq("id", id);
}
