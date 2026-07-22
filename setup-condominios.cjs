#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Condominios...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'condominios' no Supabase...");

  const sql = `
    create table if not exists condominios (
      id uuid default gen_random_uuid() primary key,
      nome text not null,
      morada text not null,
      gestor_id uuid,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'condominios' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'condominios'...");

  const sql = `
    alter table condominios enable row level security;

    drop policy if exists "admin total" on condominios;
    drop policy if exists "gestor pode tudo" on condominios;
    drop policy if exists "owner viewer leitura" on condominios;

    create policy "admin total"
      on condominios
      for all
      using ( check_role('admin') );

    create policy "gestor pode tudo"
      on condominios
      for all
      using ( check_role('gestor') );

    create policy "owner viewer leitura"
      on condominios
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
const routesPath = "backend/routes/condominios.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");
const requireOwner = require("../middleware/requireOwner");
const requireViewer = require("../middleware/requireViewer");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("condominios")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { nome, morada } = req.body;

  const { data, error } = await supabase
    .from("condominios")
    .insert([{ nome, morada }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("condominios")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { nome, morada } = req.body;

  const { data, error } = await supabase
    .from("condominios")
    .update({ nome, morada })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// APAGAR (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("condominios")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/condominios.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("condominios")) {
  serverContent = serverContent.replace(
    "app.use(\"/api\", protectedRoutes);",
    `app.use("/api", protectedRoutes);
const condominiosRoutes = require("./routes/condominios");
app.use("/api/condominios", condominiosRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de condominios.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Condominios.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Condominios() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("condominios")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Condomínios</h1>

      <ul>
        {lista.map((c) => (
          <li key={c.id}>
            {c.nome} — {c.morada}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Condominios.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Condomínios' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
