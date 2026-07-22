#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Notificações Inteligentes...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabela notificacoes
// ------------------------------------------------------
async function criarTabela() {
  console.log("📌 A criar tabela 'notificacoes'...");

  const sql = `
    create table if not exists notificacoes (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      tipo text not null, -- quota_atraso | pagamento_registado | assembleia | documento | sistema
      titulo text not null,
      mensagem text not null,
      lida boolean default false,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'notificacoes' criada.\n");
}

// ------------------------------------------------------
// 2. Criar rota backend
// ------------------------------------------------------
const routesPath = "backend/routes/notificacoes.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Obter notificações do utilizador
router.get("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Marcar como lida
router.post("/ler/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Criar notificação (usado internamente)
router.post("/criar", requireAuth, async (req, res) => {
  const { user_id, tipo, titulo, mensagem } = req.body;

  const { data, error } = await supabase
    .from("notificacoes")
    .insert([{ user_id, tipo, titulo, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/notificacoes.js");

// ------------------------------------------------------
// 3. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("notificacoes")) {
  serverContent = serverContent.replace(
    'app.use("/api/quotas", quotasRoutes);',
    `app.use("/api/quotas", quotasRoutes);
const notificacoesRoutes = require("./routes/notificacoes");
app.use("/api/notificacoes", notificacoesRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de notificações.");
}

// ------------------------------------------------------
// 4. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Notificacoes.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Notificacoes() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("notificacoes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Notificações</h1>

      <ul>
        {lista.map((n) => (
          <li key={n.id}>
            <strong>{n.titulo}</strong> — {n.mensagem}
            <br />
            <small>{n.lida ? "Lida" : "Por ler"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Notificacoes.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();

  console.log("\n🎉 Módulo 'Notificações Inteligentes' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
