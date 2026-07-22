#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🔧 A criar módulo V2: Mobile (React Native + Push Notifications)...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabelas mobile via RPC
// ------------------------------------------------------
async function criarTabelasMobile() {
  console.log("📌 A criar tabelas mobile...");

  const sql = `
    -- Tabela: dispositivos_mobile
    create table if not exists dispositivos_mobile (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      expo_push_token text not null,
      plataforma text, -- ios | android
      created_at timestamp default now()
    );

    -- Tabela: notificacoes_push
    create table if not exists notificacoes_push (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      titulo text not null,
      mensagem text not null,
      enviado boolean default false,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabelas mobile:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas mobile criadas.\n");
}

// ------------------------------------------------------
// 2. Criar pasta mobile (React Native + Expo)
// ------------------------------------------------------
function criarEstruturaMobile() {
  console.log("📌 A criar estrutura base da app mobile...");

  if (!fs.existsSync("mobile")) {
    fs.mkdirSync("mobile");
  }

  const appJson = `
{
  "expo": {
    "name": "CondoManagerAI",
    "slug": "condomanager-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "plugins": [],
    "sdkVersion": "50.0.0",
    "platforms": ["ios", "android"],
    "extra": {
      "supabaseUrl": "",
      "supabaseAnonKey": ""
    }
  }
}
`;

  fs.writeFileSync("mobile/app.json", appJson);

  const appJs = `
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>CondoManager AI Mobile</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;

  fs.writeFileSync("mobile/App.js", appJs);

  console.log("📌 Estrutura base da app mobile criada.");
}

// ------------------------------------------------------
// 3. Rotas backend: push notifications
// ------------------------------------------------------
const routesPathPush = "backend/routes/push.js";
const routesContentPush = `
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Registar dispositivo mobile
router.post("/registrar", requireAuth, async (req, res) => {
  const { expo_push_token, plataforma } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("dispositivos_mobile")
    .insert([{ user_id, expo_push_token, plataforma }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Enviar push notification
router.post("/enviar", requireAuth, async (req, res) => {
  const { user_id, titulo, mensagem } = req.body;

  const { data: dispositivos } = await supabase
    .from("dispositivos_mobile")
    .select("*")
    .eq("user_id", user_id);

  if (!dispositivos || dispositivos.length === 0)
    return res.status(404).json({ error: "Nenhum dispositivo registado." });

  for (const d of dispositivos) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: d.expo_push_token,
        sound: "default",
        title: titulo,
        body: mensagem,
      }),
    });
  }

  await supabase
    .from("notificacoes_push")
    .insert([{ user_id, titulo, mensagem, enviado: true }]);

  res.json({ status: "push_enviado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPathPush, routesContentPush);

console.log("📌 Rotas backend mobile criadas.");

// ------------------------------------------------------
// 4. Atualizar server.js com rotas mobile
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("pushRoutes")) {
  serverContent = serverContent.replace(
    'app.use("/api/reconciliacao", reconciliacaoRoutes);',
    `app.use("/api/reconciliacao", reconciliacaoRoutes);
const pushRoutes = require("./routes/push");
app.use("/api/push", pushRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas mobile.");
}

// ------------------------------------------------------
// 5. Finalização
// ------------------------------------------------------
(async () => {
  criarEstruturaMobile();
  await criarTabelasMobile();

  console.log("\n🎉 Módulo V2 Mobile criado com sucesso!");
  console.log("➡️ App React Native + Push Notifications + Tabelas Mobile ativas.\n");
})();
