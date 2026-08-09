
import { supabase } from "../supabaseClient";

export async function saveUserPreferences(userId, prefs) {
  await supabase.from("notification_preferences").upsert({
    user_id: userId,
    ...prefs,
    updated_at: new Date().toISOString()
  });
}
