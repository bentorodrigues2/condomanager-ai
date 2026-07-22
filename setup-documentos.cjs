#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Documentos...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'documentos' no Supabase...");

  const sql = `
    create table if not exists documentos (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id) on delete cascade,
      fracao_id uuid references fracoes(id) on delete set null,
      assembleia_id uuid references assembleias(id) on delete set null,
      nome text not null,
      tipo text not null,
      url text not null,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'documentos' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'documentos'...");

  const sql = `
    alter table documentos enable row level security;

    drop policy if exists "admin total" on documentos;
    drop policy if exists "gestor total" on documentos;
    drop policy if exists "owner viewer leitura" on documentos;

    create policy "admin total"
      on documentos
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on documentos
      for all
      using ( check_role('gestor') );

    create policy "owner viewer leitura"
      on documentos
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
const routesPath = "backend/routes/documentos.js";
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
    .from("documentos")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, fracao_id, assembleia_id, nome, tipo, url } = req.body;

  const { data: inserted, error } = await supabase
    .from("documentos")
    .insert([{ condominio_id, fracao_id, assembleia_id, nome, tipo, url }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("documentos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// APAGAR (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("documentos")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/documentos.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("documentos")) {
  serverContent = serverContent.replace(
    'app.use("/api/assembleias", assembleiasRoutes);',
    `app.use("/api/assembleias", assembleiasRoutes);
const documentosRoutes = require("./routes/documentos");
app.use("/api/documentos", documentosRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de documentos.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Documentos.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Documentos() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("documentos")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Documentos</h1>

      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            <strong>{d.nome}</strong> — {d.tipo}
            <br />
            <a href={d.url} target="_blank">Abrir documento</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Documentos.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Documentos' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
