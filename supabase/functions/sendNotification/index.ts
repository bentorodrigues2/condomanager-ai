
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.json();
  const { user_id, type, category, title, message } = body;

  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (type === "optional" && prefs[`optional_${category}`] !== true) {
    return new Response("Notificação ignorada", { status: 200 });
  }

  const { data: sub } = await supabase
    .from("webpush_subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (!sub) return new Response("Sem subscrição", { status: 404 });

  await fetch("https://pushpad.xyz/api/v1/projects/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("PUSHPAD_API_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subscription: sub.subscription,
      title,
      body: message
    })
  });

  return new Response("OK", { status: 200 });
});
