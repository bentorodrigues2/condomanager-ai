#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Frações...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'fracoes' no Supabase...");

  const sql = `
    create table if not exists fracoes (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id) on delete cascade,
      identificador text not null,
      area numeric,
      permilagem numeric,
      proprietario_id uuid,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'fracoes' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'fracoes'...");

  const sql = `
    alter table fracoes enable row level security;

    drop policy if exists "admin total" on fracoes;
    drop policy if exists "gestor total" on fracoes;
    drop policy if exists "owner só vê as suas" on fracoes;
    drop policy if exists "viewer leitura" on fracoes;

    create policy "admin total"
      on fracoes
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on fracoes
      for all
      using ( check_role('gestor') );

    create policy "owner só vê as suas"
      on fracoes
      for select
      using ( auth.uid() = proprietario_id );

    create policy "viewer leitura"
      on fracoes
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
const routesPath = "backend/routes/fracoes.js";
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
    .from("fracoes")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, identificador, area, permilagem, proprietario_id } = req.body;

  const { data, error } = await supabase
    .from("fracoes")
    .insert([{ condominio_id, identificador, area, permilagem, proprietario_id }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("fracoes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { identificador, area, permilagem, proprietario_id } = req.body;

  const { data, error } = await supabase
    .from("fracoes")
    .update({ identificador, area, permilagem, proprietario_id })
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
    .from("fracoes")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/fracoes.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("fracoes")) {
  serverContent = serverContent.replace(
    "app.use(\"/api/condominios\", condominiosRoutes);",
    `app.use("/api/condominios", condominiosRoutes);
const fracoesRoutes = require("./routes/fracoes");
app.use("/api/fracoes", fracoesRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de fracoes.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Fracoes.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Fracoes() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("fracoes")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Frações</h1>

      <ul>
        {lista.map((f) => (
          <li key={f.id}>
            {f.identificador} — Área: {f.area} — Permilagem: {f.permilagem}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Fracoes.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Frações' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
