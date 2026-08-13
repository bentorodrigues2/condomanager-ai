import { supabase } from "../supabaseClient";

export async function listarMensagens() {
  return await supabase
    .from("mensagens")
    .select("*, condominos(nome)")
    .order("data", { ascending: false });
}

export async function obterMensagem(id) {
  return await supabase
    .from("mensagens")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarMensagem(data) {
  return await supabase.from("mensagens").insert(data);
}

export async function atualizarMensagem(id, data) {
  return await supabase.from("mensagens").update(data).eq("id", id);
}

export async function removerMensagem(id) {
  return await supabase.from("mensagens").delete().eq("id", id);
}
