#!/usr/bin/env node

/**
 * Setup Notifications Module (Part 1)
 * Creates all files needed for WebPush notifications.
 * Asks before overwriting existing files.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Ask user before overwriting
function askOverwrite(file) {
  return new Promise((resolve) => {
    if (!fs.existsSync(file)) return resolve(true);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`⚠️ O ficheiro ${file} já existe. Queres sobrescrever? (s/n): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "s");
    });
  });
}

// Write file with overwrite confirmation
async function writeFileSafe(filePath, content) {
  const allow = await askOverwrite(filePath);
  if (!allow) {
    console.log(`⏭️ Ignorado: ${filePath}`);
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`✅ Criado: ${filePath}`);
}
// PART 2 — Service Worker + Client Scripts

async function createServiceWorker() {
  await writeFileSafe(
    "public/sw.js",
    `
self.addEventListener("push", event => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge.png",
    data: data
  });
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/notifications")
  );
});
`
  );

  await writeFileSafe(
    "src/notifications/registerServiceWorker.js",
    `
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  }
  return null;
}
`
  );

  await writeFileSafe(
    "src/notifications/requestPermission.js",
    `
export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  return permission === "granted";
}
`
  );

  await writeFileSafe(
    "src/notifications/subscribeUser.js",
    `
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
`
  );
}
// PART 3 — Migrations

async function createMigrations() {
  await writeFileSafe(
    "supabase/migrations/20260809_notifications.sql",
    `
create table if not exists notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,

  critical_occurrences boolean not null default true,
  critical_documents boolean not null default true,
  critical_assemblies boolean not null default true,

  optional_finances boolean not null default false,
  optional_reservations boolean not null default false,
  optional_cleaning boolean not null default false,
  optional_general boolean not null default false,

  updated_at timestamp with time zone default now()
);
`
  );

  await writeFileSafe(
    "supabase/migrations/20260809_webpush.sql",
    `
create table if not exists webpush_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subscription jsonb not null,
  updated_at timestamp with time zone default now()
);
`
  );
}
// PART 4 — Edge Function

async function createEdgeFunction() {
  await writeFileSafe(
    "supabase/functions/sendNotification/index.ts",
    `
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

  if (type === "optional" && prefs[\`optional_\${category}\`] !== true) {
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
      Authorization: \`Bearer \${Deno.env.get("PUSHPAD_API_KEY")}\`,
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
`
  );
}
// PART 5 — React UI

async function createReactUI() {
  await writeFileSafe(
    "src/components/NotificationSettings.jsx",
    `
import { useEffect, useState } from "react";
import { loadUserPreferences } from "../notifications/loadUserPreferences";
import { saveUserPreferences } from "../notifications/saveUserPreferences";
import { useAuth } from "../auth/useAuth";

export default function NotificationSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    loadUserPreferences(user.id).then(setPrefs);
  }, []);

  const update = async (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    await saveUserPreferences(user.id, newPrefs);
  };

  if (!prefs) return <p>A carregar…</p>;

  return (
    <div>
      <h2>Notificações Críticas</h2>
      <p>Ocorrências urgentes (sempre ativo)</p>
      <p>Assembleias (sempre ativo)</p>
      <p>Documentos importantes (sempre ativo)</p>

      <h2>Notificações Opcionais</h2>

      {[
        ["optional_finances", "Finanças"],
        ["optional_reservations", "Reservas"],
        ["optional_cleaning", "Limpeza"],
        ["optional_general", "Gerais"]
      ].map(([key, label]) => (
        <div key={key}>
          <label>
            {label}
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={(e) => update(key, e.target.checked)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
`
  );

  await writeFileSafe(
    "src/notifications/loadUserPreferences.js",
    `
import { supabase } from "../supabaseClient";

export async function loadUserPreferences(userId) {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}
`
  );

  await writeFileSafe(
    "src/notifications/saveUserPreferences.js",
    `
import { supabase } from "../supabaseClient";

export async function saveUserPreferences(userId, prefs) {
  await supabase.from("notification_preferences").upsert({
    user_id: userId,
    ...prefs,
    updated_at: new Date().toISOString()
  });
}
`
  );
}
// PART 6 — Insert Route

async function insertRoute() {
  const routerFile = "src/router/AppRouter.jsx";

  if (!fs.existsSync(routerFile)) {
    console.log("⚠️ Router não encontrado em src/router/AppRouter.jsx");
    return;
  }

  let content = fs.readFileSync(routerFile, "utf8");

  if (content.includes("/settings/notifications")) {
    console.log("⏭️ Rota já existe, ignorado.");
    return;
  }

  const routeCode = `
        <Route path="/settings/notifications" element={<NotificationSettings />} />
  `;

  content = content.replace(
    /<Routes>/,
    `<Routes>\n${routeCode}`
  );

  await writeFileSafe(routerFile, content);
}

// MAIN EXECUTION
(async () => {
  console.log("🚀 Iniciando setup de notificações...");

  await createServiceWorker();
  await createMigrations();
  await createEdgeFunction();
  await createReactUI();
  await insertRoute();

  console.log("🎉 Módulo de notificações instalado com sucesso!");
})();
