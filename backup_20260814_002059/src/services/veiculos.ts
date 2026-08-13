import { supabase } from "../supabaseClient";

export async function listarVeiculos() {
  return await supabase
    .from("veiculos")
    .select("*, condominos(nome)")
    .order("matricula");
}

export async function obterVeiculo(id) {
  return await supabase
    .from("veiculos")
    .select("*, condominos(nome)")
    .eq("id", id)
    .single();
}

export async function criarVeiculo(data) {
  return await supabase.from("veiculos").insert(data);
}

export async function atualizarVeiculo(id, data) {
  return await supabase.from("veiculos").update(data).eq("id", id);
}

export async function removerVeiculo(id) {
  return await supabase.from("veiculos").delete().eq("id", id);
}
