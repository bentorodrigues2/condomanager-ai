import { supabase } from "../supabaseClient";

export async function getFractions(buildingId) {
  if (buildingId) {
    return await supabase
      .from("fractions")
      .select("*")
      .eq("building_id", buildingId)
      .order("code");
  }
  return await supabase.from("fractions").select("*").order("code");
}

export async function getFraction(id) {
  return await supabase.from("fractions").select("*").eq("id", id).single();
}

export async function createFraction(data) {
  return await supabase.from("fractions").insert(data);
}

export async function updateFraction(id, data) {
  return await supabase.from("fractions").update(data).eq("id", id);
}

export async function deleteFraction(id) {
  return await supabase.from("fractions").delete().eq("id", id);
}