import { supabase } from "../supabaseClient";

export async function listarUtilizadores() {
  return await supabase
    .from("utilizadores")
    .select("*, condominos(nome)")
    .order("nome");
}

export async function obterUtilizador(id) {
  return await supabase
    .from("utilizadores")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarUtilizador(data) {
  return await supabase.from("utilizadores").insert(data);
}

export async function atualizarUtilizador(id, data) {
  return await supabase.from("utilizadores").update(data).eq("id", id);
}

export async function removerUtilizador(id) {
  return await supabase.from("utilizadores").delete().eq("id", id);
}
