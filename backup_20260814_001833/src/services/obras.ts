import { supabase } from "../supabaseClient";

export async function listarObras() {
  return await supabase
    .from("obras")
    .select("*")
    .order("data", { ascending: false });
}

export async function obterObra(id) {
  return await supabase.from("obras").select("*").eq("id", id).single();
}

export async function criarObra(data) {
  return await supabase.from("obras").insert(data);
}

export async function atualizarObra(id, data) {
  return await supabase.from("obras").update(data).eq("id", id);
}

export async function removerObra(id) {
  return await supabase.from("obras").delete().eq("id", id);
}
