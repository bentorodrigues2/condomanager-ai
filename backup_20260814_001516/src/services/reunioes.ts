import { supabase } from "../supabaseClient";

export async function listarReunioes() {
  return await supabase
    .from("reunioes")
    .select("*")
    .order("data", { ascending: false });
}

export async function obterReuniao(id) {
  return await supabase.from("reunioes").select("*").eq("id", id).single();
}

export async function criarReuniao(data) {
  return await supabase.from("reunioes").insert(data);
}

export async function atualizarReuniao(id, data) {
  return await supabase.from("reunioes").update(data).eq("id", id);
}

export async function removerReuniao(id) {
  return await supabase.from("reunioes").delete().eq("id", id);
}
