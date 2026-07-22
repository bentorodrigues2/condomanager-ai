#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Quotas Automáticas...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabela quotas
// ------------------------------------------------------
async function criarTabela() {
  console.log("📌 A criar tabela 'quotas'...");

  const sql = `
    create table if not exists quotas (
      id uuid default gen_random_uuid() primary key,
      fracao_id uuid references fracoes(id) on delete cascade,
      condominio_id uuid references condominios(id),
      periodo text not null, -- ex: 2026-01, 2026-T1
      valor numeric not null,
      estado text default 'pendente', -- pendente | pago
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'quotas' criada.\n");
}

// ------------------------------------------------------
// 2. Criar rota backend
// ------------------------------------------------------
const routesPath = "backend/routes/quotas.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Gerar quotas para todas as frações de um condomínio
router.post("/gerar/:condominio_id", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id } = req.params;
  const { periodo, valor } = req.body;

  // Obter frações do condomínio
  const { data: fracoes, error: errF } = await supabase
    .from("fracoes")
    .select("id")
    .eq("condominio_id", condominio_id);

  if (errF) return res.status(500).json({ error: errF });

  const quotas = fracoes.map(f => ({
    fracao_id: f.id,
    condominio_id,
    periodo,
    valor,
    estado: "pendente"
  }));

  const { data, error } = await supabase
    .from("quotas")
    .insert(quotas)
    .select();

  if (error) return res.status(500).json({ error });

  res.json({ status: "quotas_geradas", data });
});

// Obter quotas de uma fração
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("quotas")
    .select("*")
    .eq("fracao_id", id)
    .order("periodo", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/quotas.js");

// ------------------------------------------------------
// 3. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("quotas")) {
  serverContent = serverContent.replace(
    'app.use("/api/relatorios", relatoriosRoutes);',
    `app.use("/api/relatorios", relatoriosRoutes);
const quotasRoutes = require("./routes/quotas");
app.use("/api/quotas", quotasRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de quotas.");
}

// ------------------------------------------------------
// 4. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Quotas.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Quotas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("quotas")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Quotas</h1>

      <ul>
        {lista.map((q) => (
          <li key={q.id}>
            {q.periodo} — {q.valor}€ — {q.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Quotas.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();

  console.log("\n🎉 Módulo 'Quotas Automáticas' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
