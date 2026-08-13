import { supabase } from "../supabaseClient";

export async function listarIncidentes() {
  return await supabase
    .from("incidentes")
    .select("*, fracoes(numero), condominos(nome)")
    .order("data", { ascending: false });
}

export async function obterIncidente(id) {
  return await supabase
    .from("incidentes")
    .select("*, fracoes(numero), condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarIncidente(data) {
  return await supabase.from("incidentes").insert(data);
}

export async function atualizarIncidente(id, data) {
  return await supabase.from("incidentes").update(data).eq("id", id);
}

export async function removerIncidente(id) {
  return await supabase.from("incidentes").delete().eq("id", id);
}
