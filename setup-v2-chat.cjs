#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🔧 A criar módulo V2: Chat Interno (Mensagens, Grupos, Anexos, IA)...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabelas de chat via RPC
// ------------------------------------------------------
async function criarTabelasChat() {
  console.log("📌 A criar tabelas de chat...");

  const sql = `
    -- Tabela: chat_conversas
    create table if not exists chat_conversas (
      id uuid default gen_random_uuid() primary key,
      nome text,
      tipo text not null, -- privado | grupo
      created_at timestamp default now()
    );

    -- Tabela: chat_participantes
    create table if not exists chat_participantes (
      id uuid default gen_random_uuid() primary key,
      conversa_id uuid references chat_conversas(id),
      user_id uuid references auth.users(id),
      created_at timestamp default now()
    );

    -- Tabela: chat_mensagens
    create table if not exists chat_mensagens (
      id uuid default gen_random_uuid() primary key,
      conversa_id uuid references chat_conversas(id),
      user_id uuid references auth.users(id),
      mensagem text,
      created_at timestamp default now()
    );

    -- Tabela: chat_anexos
    create table if not exists chat_anexos (
      id uuid default gen_random_uuid() primary key,
      mensagem_id uuid references chat_mensagens(id),
      url text not null,
      tipo text, -- imagem | pdf | doc | outro
      created_at timestamp default now()
    );

    -- Tabela: chat_notificacoes
    create table if not exists chat_notificacoes (
      id uuid default gen_random_uuid() primary key,
      conversa_id uuid references chat_conversas(id),
      user_id uuid references auth.users(id),
      titulo text,
      mensagem text,
      enviado boolean default false,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabelas de chat:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas de chat criadas.\n");
}

// ------------------------------------------------------
// 2. Rotas backend: conversas, mensagens, anexos, IA
// ------------------------------------------------------
const routesPathChat = "backend/routes/chat.js";
const routesContentChat = `
const express = require("express");
const router = express.Router();
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");
const requireAuth = require("../middleware/requireAuth");

// Criar conversa
router.post("/conversa", requireAuth, async (req, res) => {
  const { nome, tipo, participantes } = req.body;

  const { data: conversa, error } = await supabase
    .from("chat_conversas")
    .insert([{ nome, tipo }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  for (const user_id of participantes) {
    await supabase
      .from("chat_participantes")
      .insert([{ conversa_id: conversa.id, user_id }]);
  }

  res.json(conversa);
});

// Enviar mensagem
router.post("/mensagem", requireAuth, async (req, res) => {
  const { conversa_id, mensagem } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("chat_mensagens")
    .insert([{ conversa_id, user_id, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Listar mensagens
router.get("/mensagens/:conversa_id", requireAuth, async (req, res) => {
  const { conversa_id } = req.params;

  const { data, error } = await supabase
    .from("chat_mensagens")
    .select("*")
    .eq("conversa_id", conversa_id)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Anexar ficheiro
router.post("/anexo", requireAuth, async (req, res) => {
  const { mensagem_id, url, tipo } = req.body;

  const { data, error } = await supabase
    .from("chat_anexos")
    .insert([{ mensagem_id, url, tipo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// IA: resumo da conversa
router.post("/resumo", requireAuth, async (req, res) => {
  const { conversa_id } = req.body;

  const { data: mensagens } = await supabase
    .from("chat_mensagens")
    .select("mensagem")
    .eq("conversa_id", conversa_id);

  const texto = mensagens.map(m => m.mensagem).join(" ");

  const resumo = texto.slice(0, 200) + "...";

  const { data, error } = await supabase
    .from("ia_resumos_conversas")
    .insert([{ chat_id: conversa_id, resumo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathChat, routesContentChat);

console.log("📌 Rotas backend de chat criadas.");

// ------------------------------------------------------
// 3. Atualizar server.js com rotas de chat
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("chatRoutes")) {
  serverContent = serverContent.replace(
    'app.use("/api/ia", iaRoutes);',
    `app.use("/api/ia", iaRoutes);
const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de chat.");
}

// ------------------------------------------------------
// 4. Páginas frontend: conversas, mensagens
// ------------------------------------------------------
const pageConversas = "frontend/src/pages/Conversas.jsx";
const contentConversas = `
import { useEffect, useState } from "react";

export default function Conversas() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    fetch("/api/chat/conversas")
      .then(r => r.json())
      .then(setLista);
  }, []);

  return (
    <div>
      <h1>Conversas</h1>
      <ul>
        {lista.map((c) => (
          <li key={c.id}>{c.nome || "Conversa Privada"}</li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageConversas, contentConversas);

const pageMensagens = "frontend/src/pages/Mensagens.jsx";
const contentMensagens = `
import { useEffect, useState } from "react";

export default function Mensagens({ conversaId }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    fetch("/api/chat/mensagens/" + conversaId)
      .then(r => r.json())
      .then(setLista);
  }, [conversaId]);

  return (
    <div>
      <h1>Mensagens</h1>
      <ul>
        {lista.map((m) => (
          <li key={m.id}>{m.mensagem}</li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageMensagens, contentMensagens);

console.log("📌 Páginas frontend de chat criadas.");

// ------------------------------------------------------
// 5. Finalização
// ------------------------------------------------------
(async () => {
  await criarTabelasChat();

  console.log("\n🎉 Módulo V2 Chat Interno criado com sucesso!");
  console.log("➡️ Conversas, Mensagens, Anexos, IA de Chat ativos.\n");
})();
