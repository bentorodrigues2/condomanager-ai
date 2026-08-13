import { supabase } from "../supabaseClient";

export async function listarSeguros() {
  return await supabase
    .from("seguros")
    .select("*, fornecedores(nome)")
    .order("data_inicio", { ascending: false });
}

export async function obterSeguro(id) {
  return await supabase
    .from("seguros")
    .select("*, fornecedores(nome)")
    .eq("id", id)
    .single();
}

export async function criarSeguro(data) {
  return await supabase.from("seguros").insert(data);
}

export async function atualizarSeguro(id, data) {
  return await supabase.from("seguros").update(data).eq("id", id);
}

export async function removerSeguro(id) {
  return await supabase.from("seguros").delete().eq("id", id);
}
