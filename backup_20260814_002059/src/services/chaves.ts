import { supabase } from "../supabaseClient";

export async function listarChaves() {
  return await supabase
    .from("chaves")
    .select("*, condominos(nome)")
    .order("tipo");
}

export async function obterChave(id) {
  return await supabase
    .from("chaves")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarChave(data) {
  return await supabase.from("chaves").insert(data);
}

export async function atualizarChave(id, data) {
  return await supabase.from("chaves").update(data).eq("id", id);
}

export async function removerChave(id) {
  return await supabase.from("chaves").delete().eq("id", id);
}
