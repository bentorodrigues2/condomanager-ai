import { supabase } from "../supabaseClient";

export async function listarInventario() {
  return await supabase
    .from("inventario")
    .select("*, fornecedores(nome)")
    .order("nome");
}

export async function obterItemInventario(id) {
  return await supabase
    .from("inventario")
    .select("*, fornecedores(nome)")
    .eq("id", id)
    .single();
}

export async function criarItemInventario(data) {
  return await supabase.from("inventario").insert(data);
}

export async function atualizarItemInventario(id, data) {
  return await supabase.from("inventario").update(data).eq("id", id);
}

export async function removerItemInventario(id) {
  return await supabase.from("inventario").delete().eq("id", id);
}
