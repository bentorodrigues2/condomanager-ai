import { supabase } from "../supabaseClient";

export async function listarAnimais() {
  return await supabase
    .from("animais")
    .select("*, condominos(nome)")
    .order("nome");
}

export async function obterAnimal(id) {
  return await supabase
    .from("animais")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarAnimal(data) {
  return await supabase.from("animais").insert(data);
}

export async function atualizarAnimal(id, data) {
  return await supabase.from("animais").update(data).eq("id", id);
}

export async function removerAnimal(id) {
  return await supabase.from("animais").delete().eq("id", id);
}
