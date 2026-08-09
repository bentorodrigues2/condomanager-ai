
import { supabase } from "../supabaseClient";

export async function loadUserPreferences(userId) {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}
