#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Pagamentos...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'pagamentos' no Supabase...");

  const sql = `
    create table if not exists pagamentos (
      id uuid default gen_random_uuid() primary key,
      fracao_id uuid references fracoes(id) on delete cascade,
      proprietario_id uuid references proprietarios(id),
      despesa_id uuid references despesas(id),
      valor numeric not null,
      data date not null,
      metodo text,
      estado text default 'pago',
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'pagamentos' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'pagamentos'...");

  const sql = `
    alter table pagamentos enable row level security;

    drop policy if exists "admin total" on pagamentos;
    drop policy if exists "gestor total" on pagamentos;
    drop policy if exists "owner só vê os seus" on pagamentos;
    drop policy if exists "viewer leitura" on pagamentos;

    create policy "admin total"
      on pagamentos
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on pagamentos
      for all
      using ( check_role('gestor') );

    create policy "owner só vê os seus"
      on pagamentos
      for select
      using ( auth.uid() = proprietario_id );

    create policy "viewer leitura"
      on pagamentos
      for select
      using ( check_role('viewer') );
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
const routesPath = "backend/routes/pagamentos.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");
const requireOwner = require("../middleware/requireOwner");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("pagamentos")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { fracao_id, proprietario_id, despesa_id, valor, data, metodo, estado } = req.body;

  const { data: inserted, error } = await supabase
    .from("pagamentos")
    .insert([{ fracao_id, proprietario_id, despesa_id, valor, data, metodo, estado }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { valor, data, metodo, estado } = req.body;

  const { data: updated, error } = await supabase
    .from("pagamentos")
    .update({ valor, data, metodo, estado })
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
    .from("pagamentos")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/pagamentos.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("pagamentos")) {
  serverContent = serverContent.replace(
    'app.use("/api/documentos", documentosRoutes);',
    `app.use("/api/documentos", documentosRoutes);
const pagamentosRoutes = require("./routes/pagamentos");
app.use("/api/pagamentos", pagamentosRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de pagamentos.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Pagamentos.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Pagamentos() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("pagamentos")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Pagamentos</h1>

      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.valor}€ — {p.data} — {p.metodo} — {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Pagamentos.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Pagamentos' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
