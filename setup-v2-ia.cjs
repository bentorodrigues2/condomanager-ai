#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🔧 A criar módulo V2: IA Avançada (Financeira, Operacional, Documentos, Conversas)...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabelas IA via RPC
// ------------------------------------------------------
async function criarTabelasIA() {
  console.log("📌 A criar tabelas IA...");

  const sql = `
    -- Tabela: ia_logs
    create table if not exists ia_logs (
      id uuid default gen_random_uuid() primary key,
      tipo text not null, -- financeiro | operacional | documentos | conversas
      entrada text not null,
      saida text,
      created_at timestamp default now()
    );

    -- Tabela: ia_previsoes_financeiras
    create table if not exists ia_previsoes_financeiras (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id),
      mes text not null,
      previsao_despesas numeric,
      previsao_saldo numeric,
      risco_atraso numeric,
      created_at timestamp default now()
    );

    -- Tabela: ia_sugestoes_operacionais
    create table if not exists ia_sugestoes_operacionais (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id),
      tipo text not null, -- fornecedor | assembleia | manutencao
      sugestao text not null,
      created_at timestamp default now()
    );

    -- Tabela: ia_resumos_documentos
    create table if not exists ia_resumos_documentos (
      id uuid default gen_random_uuid() primary key,
      documento_id uuid references documentos(id),
      resumo text,
      created_at timestamp default now()
    );

    -- Tabela: ia_resumos_conversas
    create table if not exists ia_resumos_conversas (
      id uuid default gen_random_uuid() primary key,
      chat_id uuid,
      resumo text,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabelas IA:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas IA criadas.\n");
}

// ------------------------------------------------------
// 2. Rotas backend IA
// ------------------------------------------------------
const routesPathIA = "backend/routes/ia.js";
const routesContentIA = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// IA Financeira: previsão
router.post("/financeiro/prever", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, mes } = req.body;

  // Dados base
  const { data: despesas } = await supabase
    .from("despesas")
    .select("valor")
    .eq("condominio_id", condominio_id);

  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("valor")
    .eq("condominio_id", condominio_id);

  const totalDespesas = despesas?.reduce((a, b) => a + Number(b.valor), 0) || 0;
  const totalPagamentos = pagamentos?.reduce((a, b) => a + Number(b.valor), 0) || 0;

  const previsaoSaldo = totalPagamentos - totalDespesas;
  const riscoAtraso = totalDespesas > totalPagamentos ? 0.7 : 0.2;

  const { data, error } = await supabase
    .from("ia_previsoes_financeiras")
    .insert([{ condominio_id, mes, previsao_despesas: totalDespesas, previsao_saldo: previsaoSaldo, risco_atraso: riscoAtraso }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// IA Operacional: sugestões
router.post("/operacional/sugerir", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, tipo } = req.body;

  let sugestao = "Nenhuma sugestão disponível.";

  if (tipo === "fornecedor") sugestao = "Recomenda-se contratar fornecedor com histórico de resposta rápida.";
  if (tipo === "assembleia") sugestao = "Sugere-se marcar assembleia no início do mês para maior participação.";
  if (tipo === "manutencao") sugestao = "Sugere-se revisão preventiva trimestral das áreas comuns.";

  const { data, error } = await supabase
    .from("ia_sugestoes_operacionais")
    .insert([{ condominio_id, tipo, sugestao }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// IA Documentos: resumo
router.post("/documentos/resumir", requireAuth, requireGestor, async (req, res) => {
  const { documento_id, texto } = req.body;

  const resumo = texto.slice(0, 200) + "...";

  const { data, error } = await supabase
    .from("ia_resumos_documentos")
    .insert([{ documento_id, resumo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// IA Conversas: resumo
router.post("/conversas/resumir", requireAuth, async (req, res) => {
  const { chat_id, mensagens } = req.body;

  const resumo = mensagens.slice(0, 3).join(" | ") + " ...";

  const { data, error } = await supabase
    .from("ia_resumos_conversas")
    .insert([{ chat_id, resumo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathIA, routesContentIA);

console.log("📌 Rotas backend IA criadas.");

// ------------------------------------------------------
// 3. Atualizar server.js com rotas IA
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("iaRoutes")) {
  serverContent = serverContent.replace(
    'app.use("/api/push", pushRoutes);',
    `app.use("/api/push", pushRoutes);
const iaRoutes = require("./routes/ia");
app.use("/api/ia", iaRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas IA.");
}

// ------------------------------------------------------
// 4. Páginas frontend IA
// ------------------------------------------------------
const pageIAFinanceiro = "frontend/src/pages/IAFinanceiro.jsx";
const contentIAFinanceiro = `
import { useState } from "react";

export default function IAFinanceiro() {
  const [resultado, setResultado] = useState(null);

  async function prever() {
    const resp = await fetch("/api/ia/financeiro/prever", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condominio_id: "1", mes: "2026-07" })
    });

    const json = await resp.json();
    setResultado(json);
  }

  return (
    <div>
      <h1>IA Financeira</h1>
      <button onClick={prever}>Gerar Previsão</button>
      {resultado && (
        <pre>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
}
`;

fs.writeFileSync(pageIAFinanceiro, contentIAFinanceiro);

const pageIAOperacional = "frontend/src/pages/IAOperacional.jsx";
const contentIAOperacional = `
import { useState } from "react";

export default function IAOperacional() {
  const [resultado, setResultado] = useState(null);

  async function sugerir() {
    const resp = await fetch("/api/ia/operacional/sugerir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condominio_id: "1", tipo: "manutencao" })
    });

    const json = await resp.json();
    setResultado(json);
  }

  return (
    <div>
      <h1>IA Operacional</h1>
      <button onClick={sugerir}>Gerar Sugestão</button>
      {resultado && (
        <pre>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
}
`;

fs.writeFileSync(pageIAOperacional, contentIAOperacional);

console.log("📌 Páginas frontend IA criadas.");

// ------------------------------------------------------
// 5. Finalização
// ------------------------------------------------------
(async () => {
  await criarTabelasIA();

  console.log("\n🎉 Módulo V2 IA criado com sucesso!");
  console.log("➡️ IA Financeira, Operacional, Documentos e Conversas ativas.\n");
})();
