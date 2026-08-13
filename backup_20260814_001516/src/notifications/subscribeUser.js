
import { supabase } from "../supabaseClient";

export async function subscribeUser(registration, userId) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
  });

  await supabase.from("webpush_subscriptions").upsert({
    user_id: userId,
    subscription: subscription.toJSON()
  });
}
