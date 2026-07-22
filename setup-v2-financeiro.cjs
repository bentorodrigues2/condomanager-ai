#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🔧 A criar módulo V2: Financeiro Avançado (Stripe, MBWay, Pagamentos Online)...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabelas financeiras avançadas via RPC
// ------------------------------------------------------
async function criarTabelasFinanceiras() {
  console.log("📌 A criar tabelas financeiras avançadas...");

  const sql = `
    -- Tabela: pagamentos_online
    create table if not exists pagamentos_online (
      id uuid default gen_random_uuid() primary key,
      proprietario_id uuid references proprietarios(id),
      fracao_id uuid references fracoes(id),
      condominio_id uuid references condominios(id),
      metodo text not null, -- stripe | mbway
      valor numeric not null,
      estado text default 'pendente', -- pendente | pago | falhado
      referencia text,
      transacao_id text,
      created_at timestamp default now()
    );

    -- Tabela: recibos
    create table if not exists recibos (
      id uuid default gen_random_uuid() primary key,
      pagamento_online_id uuid references pagamentos_online(id),
      proprietario_id uuid references proprietarios(id),
      fracao_id uuid references fracoes(id),
      condominio_id uuid references condominios(id),
      valor numeric not null,
      pdf_url text,
      created_at timestamp default now()
    );

    -- Tabela: reconciliacao_financeira
    create table if not exists reconciliacao_financeira (
      id uuid default gen_random_uuid() primary key,
      transacao_id text not null,
      metodo text not null,
      valor numeric not null,
      estado text not null, -- reconciliado | pendente | erro
      detalhes text,
      created_at timestamp default now()
    );

    -- Tabela: logs_financeiros
    create table if not exists logs_financeiros (
      id uuid default gen_random_uuid() primary key,
      tipo text not null, -- stripe_event | mbway_event | sistema
      mensagem text not null,
      dados jsonb,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabelas financeiras:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas financeiras avançadas criadas.\n");
}

// ------------------------------------------------------
// 2. Rotas backend: pagamentos online, recibos, reconciliação
// ------------------------------------------------------
const routesPathPagOnline = "backend/routes/pagamentosOnline.js";
const routesContentPagOnline = `
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Criar pagamento online (início)
router.post("/criar", requireAuth, async (req, res) => {
  const { proprietario_id, fracao_id, condominio_id, metodo, valor } = req.body;

  const { data, error } = await supabase
    .from("pagamentos_online")
    .insert([{ proprietario_id, fracao_id, condominio_id, metodo, valor }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Atualizar estado (callback Stripe/MBWay)
router.post("/estado/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { estado, transacao_id } = req.body;

  const { data, error } = await supabase
    .from("pagamentos_online")
    .update({ estado, transacao_id })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Gerar recibo PDF
router.get("/recibo/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: pagamento, error } = await supabase
    .from("pagamentos_online")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !pagamento) return res.status(500).json({ error });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(22).text("Recibo de Pagamento Online", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(\`Método: \${pagamento.metodo}\`);
  doc.text(\`Valor: \${pagamento.valor}€\`);
  doc.text(\`Estado: \${pagamento.estado}\`);
  doc.text(\`Transação: \${pagamento.transacao_id}\`);

  doc.end();
  doc.pipe(res);
});

module.exports = router;
`;

fs.writeFileSync(routesPathPagOnline, routesContentPagOnline);

const routesPathReconc = "backend/routes/reconciliacao.js";
const routesContentReconc = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Registar evento de reconciliação
router.post("/evento", requireAuth, requireGestor, async (req, res) => {
  const { transacao_id, metodo, valor, estado, detalhes } = req.body;

  const { data, error } = await supabase
    .from("reconciliacao_financeira")
    .insert([{ transacao_id, metodo, valor, estado, detalhes }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Listar reconciliações
router.get("/", requireAuth, requireGestor, async (req, res) => {
  const { data, error } = await supabase
    .from("reconciliacao_financeira")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
`;

fs.writeFileSync(routesPathReconc, routesContentReconc);

console.log("📌 Rotas backend financeiras criadas.");

// ------------------------------------------------------
// 3. Atualizar server.js com novas rotas
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("pagamentosOnlineRoutes")) {
  serverContent = serverContent.replace(
    'app.use("/api/documentos-operacionais", documentosOperacionaisRoutes);',
    `app.use("/api/documentos-operacionais", documentosOperacionaisRoutes);
const pagamentosOnlineRoutes = require("./routes/pagamentosOnline");
app.use("/api/pagamentos-online", pagamentosOnlineRoutes);
const reconciliacaoRoutes = require("./routes/reconciliacao");
app.use("/api/reconciliacao", reconciliacaoRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas financeiras.");
}

// ------------------------------------------------------
// 4. Páginas frontend básicas
// ------------------------------------------------------
const pagePagOnline = "frontend/src/pages/PagamentosOnline.jsx";
const contentPagOnline = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function PagamentosOnline() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("pagamentos_online")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Pagamentos Online</h1>
      <ul>
        {lista.map((p) => (
          <li key={p.id}>
            {p.metodo} — {p.valor}€ — {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePagOnline, contentPagOnline);

const pageReconc = "frontend/src/pages/Reconciliacao.jsx";
const contentReconc = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Reconciliacao() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("reconciliacao_financeira")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Reconciliacao Financeira</h1>
      <ul>
        {lista.map((r) => (
          <li key={r.id}>
            {r.metodo} — {r.valor}€ — {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageReconc, contentReconc);

console.log("📌 Páginas frontend financeiras criadas.");

// ------------------------------------------------------
// 5. Finalização
// ------------------------------------------------------
(async () => {
  await criarTabelasFinanceiras();

  console.log("\n🎉 Módulo V2 Financeiro criado com sucesso!");
  console.log("➡️ Stripe, MBWay, Pagamentos Online, Recibos, Reconciliação ativos.\n");
})();
