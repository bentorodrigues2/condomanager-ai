import { supabase } from "../supabaseClient";

export async function listarAvisos() {
  return await supabase
    .from("avisos")
    .select("*")
    .order("data", { ascending: false });
}

export async function obterAviso(id) {
  return await supabase.from("avisos").select("*").eq("id", id).single();
}

export async function criarAviso(data) {
  return await supabase.from("avisos").insert(data);
}

export async function atualizarAviso(id, data) {
  return await supabase.from("avisos").update(data).eq("id", id);
}

export async function removerAviso(id) {
  return await supabase.from("avisos").delete().eq("id", id);
}
