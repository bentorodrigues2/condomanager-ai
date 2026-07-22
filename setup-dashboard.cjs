#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Dashboard Financeiro...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar views financeiras (versão compatível com o teu schema real)
// ------------------------------------------------------
async function criarViews() {
  console.log("📌 A criar views financeiras...");

  const sql = `
    -- VIEW: Finanças do Condomínio
    create or replace view vw_financas_condominio as
    select
      c.id as condominio_id,
      c.nome,
      coalesce(sum(d.valor), 0) as total_despesas,
      coalesce(sum(p.valor), 0) as total_pagamentos,
      coalesce(sum(p.valor), 0) - coalesce(sum(d.valor), 0) as saldo
    from condominios c
    left join despesas d on d.condominio_id = c.id
    left join pagamentos p on p.despesa_id = d.id
    group by c.id;

    -- VIEW: Finanças da Fração
    create or replace view vw_financas_fracao as
    select
      f.id as fracao_id,
      f.codigo as identificador,
      coalesce(sum(p.valor), 0) as total_pago,
      coalesce(sum(d.valor), 0) as total_devido,
      coalesce(sum(p.valor), 0) - coalesce(sum(d.valor), 0) as saldo
    from fracoes f
    left join pagamentos p on p.fracao_id = f.id
    left join despesas d on d.condominio_id = f.condominio_id
    group by f.id;

    -- VIEW: Finanças do Proprietário
    create or replace view vw_financas_proprietario as
    select
      pr.id as proprietario_id,
      pr.nome,
      coalesce(sum(p.valor), 0) as total_pago,
      coalesce(sum(d.valor), 0) as total_devido,
      coalesce(sum(p.valor), 0) - coalesce(sum(d.valor), 0) as saldo
    from proprietarios pr
    left join pagamentos p on p.proprietario_id = pr.id
    left join despesas d on d.id = p.despesa_id
    group by pr.id;
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar views:", error);
    process.exit(1);
  }

  console.log("✅ Views criadas.\n");
}

// ------------------------------------------------------
// 2. Criar rotas backend
// ------------------------------------------------------
const routesPath = "backend/routes/dashboard.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Dashboard do condomínio
router.get("/condominio/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_condominio")
    .select("*")
    .eq("condominio_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Dashboard da fração
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_fracao")
    .select("*")
    .eq("fracao_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Dashboard do proprietário
router.get("/proprietario/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_proprietario")
    .select("*")
    .eq("proprietario_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/dashboard.js");

// ------------------------------------------------------
// 3. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("dashboard")) {
  serverContent = serverContent.replace(
    'app.use("/api/pagamentos", pagamentosRoutes);',
    `app.use("/api/pagamentos", pagamentosRoutes);
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de dashboard.");
}

// ------------------------------------------------------
// 4. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Dashboard.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { supabase } = useAuth();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    supabase
      .from("vw_financas_condominio")
      .select("*")
      .then(({ data }) => setDados(data?.[0] || null));
  }, []);

  if (!dados) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Dashboard Financeiro</h1>

      <p><strong>Total Despesas:</strong> {dados.total_despesas}€</p>
      <p><strong>Total Pagamentos:</strong> {dados.total_pagamentos}€</p>
      <p><strong>Saldo:</strong> {dados.saldo}€</p>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Dashboard.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarViews();

  console.log("\n🎉 Módulo 'Dashboard Financeiro' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
