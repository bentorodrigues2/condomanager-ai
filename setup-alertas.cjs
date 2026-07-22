#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Sistema de Alertas & Lembretes...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabela alertas
// ------------------------------------------------------
async function criarTabela() {
  console.log("📌 A criar tabela 'alertas'...");

  const sql = `
    create table if not exists alertas (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id),
      tipo text not null, -- quota_atraso | assembleia | documento | pagamento | sistema
      titulo text not null,
      mensagem text not null,
      enviado boolean default false,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'alertas' criada.\n");
}

// ------------------------------------------------------
// 2. Criar rota backend
// ------------------------------------------------------
const routesPath = "backend/routes/alertas.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Obter alertas do utilizador
router.get("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("alertas")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Criar alerta manual (gestor)
router.post("/criar", requireAuth, async (req, res) => {
  const { user_id, tipo, titulo, mensagem } = req.body;

  const { data, error } = await supabase
    .from("alertas")
    .insert([{ user_id, tipo, titulo, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/alertas.js");

// ------------------------------------------------------
// 3. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("alertas")) {
  serverContent = serverContent.replace(
    'app.use("/api/notificacoes", notificacoesRoutes);',
    `app.use("/api/notificacoes", notificacoesRoutes);
const alertasRoutes = require("./routes/alertas");
app.use("/api/alertas", alertasRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de alertas.");
}

// ------------------------------------------------------
// 4. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Alertas.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Alertas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("alertas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Alertas</h1>

      <ul>
        {lista.map((a) => (
          <li key={a.id}>
            <strong>{a.titulo}</strong> — {a.mensagem}
            <br />
            <small>{a.enviado ? "Enviado" : "Pendente"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Alertas.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();

  console.log("\n🎉 Módulo 'Alertas & Lembretes' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
