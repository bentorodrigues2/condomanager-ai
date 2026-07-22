#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Proprietários...\n");

// ------------------------------------------------------
// 1. Criar tabela no Supabase
// ------------------------------------------------------
const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

async function criarTabela() {
  console.log("📌 A criar tabela 'proprietarios' no Supabase...");

  const sql = `
    create table if not exists proprietarios (
      id uuid default gen_random_uuid() primary key,
      nome text not null,
      email text not null,
      telefone text,
      user_id uuid,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });

  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'proprietarios' criada.\n");
}

// ------------------------------------------------------
// 2. Criar políticas RLS
// ------------------------------------------------------
async function criarPolicies() {
  console.log("📌 A criar políticas RLS para 'proprietarios'...");

  const sql = `
    alter table proprietarios enable row level security;

    drop policy if exists "admin total" on proprietarios;
    drop policy if exists "gestor total" on proprietarios;
    drop policy if exists "owner só vê o próprio" on proprietarios;
    drop policy if exists "viewer leitura" on proprietarios;

    create policy "admin total"
      on proprietarios
      for all
      using ( check_role('admin') );

    create policy "gestor total"
      on proprietarios
      for all
      using ( check_role('gestor') );

    create policy "owner só vê o próprio"
      on proprietarios
      for select
      using ( auth.uid() = user_id );

    create policy "viewer leitura"
      on proprietarios
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
const routesPath = "backend/routes/proprietarios.js";
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
    .from("proprietarios")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { nome, email, telefone, user_id } = req.body;

  const { data, error } = await supabase
    .from("proprietarios")
    .insert([{ nome, email, telefone, user_id }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("proprietarios")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  const { data, error } = await supabase
    .from("proprietarios")
    .update({ nome, email, telefone })
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
    .from("proprietarios")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/proprietarios.js");

// ------------------------------------------------------
// 4. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("proprietarios")) {
  serverContent = serverContent.replace(
    'app.use("/api/fracoes", fracoesRoutes);',
    `app.use("/api/fracoes", fracoesRoutes);
const proprietariosRoutes = require("./routes/proprietarios");
app.use("/api/proprietarios", proprietariosRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de proprietarios.");
}

// ------------------------------------------------------
// 5. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Proprietarios.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Proprietarios() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("proprietarios")
      .select("*")
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Proprietários</h1>

      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.nome} — {p.email} — {p.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Proprietarios.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();
  await criarPolicies();

  console.log("\n🎉 Módulo 'Proprietários' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
