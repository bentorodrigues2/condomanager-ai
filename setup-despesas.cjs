#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Despesas...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'despesas' no Supabase...");

  const sql = `
    create table if not exists despesas (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id) on delete cascade,
      descricao text not null,
      valor numeric not null,
      data date not null,
      categoria text,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'despesas' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'despesas'...");

  const sql = `
    alter table despesas enable row level security;

    drop policy if exists "admin total" on despesas;
    drop policy if exists "gestor total" on despesas;
    drop policy if exists "owner viewer leitura" on despesas;

    create policy "admin total"
      on despesas
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on despesas
      for all
      using ( check_role('gestor') );

    create policy "owner viewer leitura"
      on despesas
      for select
      using ( check_role('owner') or check_role('viewer') );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar policies:", error);
    process.exit(1);
  }

  console.log("✅ Policies criadas.\n");
}

// ------------------------------------------------------
// 3. Criar rotas backend
// ------------------------------------------------------
const routesPath = "backend/routes/despesas.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("despesas")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, descricao, valor, data, categoria } = req.body;

  const { data: inserted, error } = await supabase
    .from("despesas")
    .insert([{ condominio_id, descricao, valor, data, categoria }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("despesas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria } = req.body;

  const { data: updated, error } = await supabase
    .from("despesas")
    .update({ descricao, valor, data, categoria })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(updated);
});

// APAGAR (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("despesas")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/despesas.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("despesas")) {
  serverContent = serverContent.replace(
    'app.use("/api/proprietarios", proprietariosRoutes);',
    `app.use("/api/proprietarios", proprietariosRoutes);
const despesasRoutes = require("./routes/despesas");
app.use("/api/despesas", despesasRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de despesas.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Despesas.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Despesas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("despesas")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Despesas</h1>

      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            {d.descricao} — {d.valor}€ — {d.data} — {d.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Despesas.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Despesas' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
