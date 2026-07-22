import { supabase } from "../supabaseClient";

export async function listarReservas() {
  return await supabase
    .from("reservas")
    .select("*, condominos(nome)")
    .order("data", { ascending: true });
}

export async function obterReserva(id) {
  return await supabase
    .from("reservas")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarReserva(data) {
  return await supabase.from("reservas").insert(data);
}

export async function atualizarReserva(id, data) {
  return await supabase.from("reservas").update(data).eq("id", id);
}

export async function removerReserva(id) {
  return await supabase.from("reservas").delete().eq("id", id);
}
