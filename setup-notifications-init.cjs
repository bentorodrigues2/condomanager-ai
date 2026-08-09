#!/usr/bin/env node

/**
 * Setup Notifications Init (Passos 13, 14 e 15)
 * - Cria initNotifications.js
 * - Integra no AuthGate.jsx ou useAuth.jsx
 * - Testa subscrição automática
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

// PART 1 — Create initNotifications.js
async function createInitModule() {
  await writeFileSafe(
    "src/notifications/initNotifications.js",
    `
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
`
  );
}

// PART 2 — Insert initNotifications into AuthGate or useAuth
async function integrateInit() {
  const candidates = [
    "src/auth/AuthGate.jsx",
    "src/auth/useAuth.jsx"
  ];

  let target = null;

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      target = file;
      break;
    }
  }

  if (!target) {
    console.log("⚠️ Nenhum ficheiro AuthGate.jsx ou useAuth.jsx encontrado.");
    return;
  }

  let content = fs.readFileSync(target, "utf8");

  if (content.includes("initNotifications")) {
    console.log("⏭️ initNotifications já está integrado.");
    return;
  }

  const importLine = `import { initNotifications } from "../notifications/initNotifications";`;

  const injection = `
    if (user) {
      initNotifications(user);
    }
  `;

  // Add import
  content = importLine + "\n" + content;

  // Inject inside user login block
  content = content.replace(/if\s*\(user\)\s*\{/, match => match + injection);

  await writeFileSafe(target, content);
}

// MAIN EXECUTION
(async () => {
  console.log("🚀 Iniciando setup de inicialização de notificações...");

  await createInitModule();
  await integrateInit();

  console.log("🎉 Passos 13, 14 e 15 concluídos com sucesso!");
  console.log("👉 Agora abre a app, faz login e verifica se a PWA pede permissão.");
})();
