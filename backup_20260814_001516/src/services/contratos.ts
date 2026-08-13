import { supabase } from "../supabaseClient";

export async function listarContratos() {
  return await supabase
    .from("contratos")
    .select("*, fornecedores(nome)")
    .order("data_inicio", { ascending: false });
}

export async function obterContrato(id) {
  return await supabase
    .from("contratos")
    .select("*, fornecedores(nome)")
    .eq("id", id)
    .single();
}

export async function criarContrato(data) {
  return await supabase.from("contratos").insert(data);
}

export async function atualizarContrato(id, data) {
  return await supabase.from("contratos").update(data).eq("id", id);
}

export async function removerContrato(id) {
  return await supabase.from("contratos").delete().eq("id", id);
}
