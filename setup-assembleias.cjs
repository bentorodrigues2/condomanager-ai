#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Assembleias...\n");

// ------------------------------------------------------
// 1. Criar tabelas no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabelas() {
  console.log("📌 A criar tabelas 'assembleias' e 'votacoes' no Supabase...");

  const sql = `
    create table if not exists assembleias (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id) on delete cascade,
      data date not null,
      titulo text not null,
      descricao text,
      created_at timestamp default now()
    );

    create table if not exists votacoes (
      id uuid default gen_random_uuid() primary key,
      assembleia_id uuid references assembleias(id) on delete cascade,
      proprietario_id uuid references proprietarios(id),
      voto text not null,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabelas:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas criadas.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS (VERSÃO CORRIGIDA)
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS...");

  const sql = `
    alter table assembleias enable row level security;
    alter table votacoes enable row level security;

    drop policy if exists "admin total" on assembleias;
    drop policy if exists "gestor total" on assembleias;
    drop policy if exists "owner viewer leitura" on assembleias;

    drop policy if exists "admin total" on votacoes;
    drop policy if exists "gestor total" on votacoes;
    drop policy if exists "owner pode votar" on votacoes;
    drop policy if exists "viewer leitura" on votacoes;

    create policy "admin total"
      on assembleias
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on assembleias
      for all
      using ( check_role('gestor') );

    create policy "owner viewer leitura"
      on assembleias
      for select
      using ( check_role('owner') or check_role('viewer') );

    create policy "admin total"
      on votacoes
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on votacoes
      for all
      using ( check_role('gestor') );

    -- CORRIGIDO: INSERT TEM DE SER COM WITH CHECK
    create policy "owner pode votar"
      on votacoes
      for insert
      with check ( check_role('owner') );

    create policy "viewer leitura"
      on votacoes
      for select
      using ( check_role('viewer') or check_role('owner') );
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
const routesPath = "backend/routes/assembleias.js";
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
    .from("assembleias")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, data, titulo, descricao } = req.body;

  const { data: inserted, error } = await supabase
    .from("assembleias")
    .insert([{ condominio_id, data, titulo, descricao }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("assembleias")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { data, titulo, descricao } = req.body;

  const { data: updated, error } = await supabase
    .from("assembleias")
    .update({ data, titulo, descricao })
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
    .from("assembleias")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

// VOTAR (owner)
router.post("/:id/votar", requireAuth, requireOwner, async (req, res) => {
  const { id } = req.params;
  const { voto, proprietario_id } = req.body;

  const { data: inserted, error } = await supabase
    .from("votacoes")
    .insert([{ assembleia_id: id, voto, proprietario_id }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// LISTAR VOTOS
router.get("/:id/votos", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("votacoes")
    .select("*")
    .eq("assembleia_id", id);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/assembleias.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("assembleias")) {
  serverContent = serverContent.replace(
    'app.use("/api/despesas", despesasRoutes);',
    `app.use("/api/despesas", despesasRoutes);
const assembleiasRoutes = require("./routes/assembleias");
app.use("/api/assembleias", assembleiasRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de assembleias.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Assembleias.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Assembleias() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("assembleias")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Assembleias</h1>

      <ul>
        {lista.map((a) => (
          <li key={a.id}>
            {a.titulo} — {a.data}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Assembleias.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabelas();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Assembleias' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
