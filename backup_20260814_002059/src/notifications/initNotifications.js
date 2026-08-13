
import { registerServiceWorker } from "./registerServiceWorker";
import { requestNotificationPermission } from "./requestPermission";
import { subscribeUser } from "./subscribeUser";
import { loadUserPreferences } from "./loadUserPreferences";
import { supabase } from "../supabaseClient";

export async function initNotifications(user) {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log("Notificações não autorizadas pelo utilizador.");
      return;
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      console.log("Service Worker não disponível.");
      return;
    }

    await subscribeUser(registration, user.id);

    const prefs = await loadUserPreferences(user.id);

    if (!prefs) {
      await supabase.from("notification_preferences").insert({
        user_id: user.id
      });
    }

    console.log("🔔 Notificações WebPush ativadas para o utilizador:", user.email);
  } catch (err) {
    console.error("Erro ao inicializar notificações:", err);
  }
}
