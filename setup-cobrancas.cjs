#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Automação de Cobranças...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabela cobrancas
// ------------------------------------------------------
async function criarTabela() {
  console.log("📌 A criar tabela 'cobrancas'...");

  const sql = `
    create table if not exists cobrancas (
      id uuid default gen_random_uuid() primary key,
      fracao_id uuid references fracoes(id),
      proprietario_id uuid references proprietarios(id),
      condominio_id uuid references condominios(id),
      periodo text not null,
      valor numeric not null,
      estado text default 'pendente', -- pendente | pago | enviado
      pdf_url text,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabela:", error);
    process.exit(1);
  }

  console.log("✅ Tabela 'cobrancas' criada.\n");
}

// ------------------------------------------------------
// 2. Criar rota backend
// ------------------------------------------------------
const routesPath = "backend/routes/cobrancas.js";
const routesContent = `
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Gerar cobrança automática para quotas pendentes
router.post("/gerar/:condominio_id", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id } = req.params;
  const { periodo } = req.body;

  // Obter quotas pendentes
  const { data: quotas, error: errQ } = await supabase
    .from("quotas")
    .select("fracao_id, valor")
    .eq("condominio_id", condominio_id)
    .eq("estado", "pendente")
    .eq("periodo", periodo);

  if (errQ) return res.status(500).json({ error: errQ });

  // Obter proprietários das frações
  const fracaoIds = quotas.map(q => q.fracao_id);

  const { data: fracoes, error: errF } = await supabase
    .from("fracoes")
    .select("id, proprietario_id")
    .in("id", fracaoIds);

  if (errF) return res.status(500).json({ error: errF });

  // Criar cobranças
  const cobrancas = quotas.map(q => {
    const fr = fracoes.find(f => f.id === q.fracao_id);
    return {
      fracao_id: q.fracao_id,
      proprietario_id: fr?.proprietario_id,
      condominio_id,
      periodo,
      valor: q.valor,
      estado: "pendente"
    };
  });

  const { data, error } = await supabase
    .from("cobrancas")
    .insert(cobrancas)
    .select();

  if (error) return res.status(500).json({ error });

  res.json({ status: "cobrancas_geradas", data });
});

// Gerar PDF de cobrança
router.get("/pdf/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: c, error } = await supabase
    .from("cobrancas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !c) return res.status(500).json({ error });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(22).text("Aviso de Cobrança", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(\`Período: \${c.periodo}\`);
  doc.text(\`Valor: \${c.valor}€\`);
  doc.text(\`Estado: \${c.estado}\`);

  doc.end();
  doc.pipe(res);
});

// Obter cobranças da fração
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("cobrancas")
    .select("*")
    .eq("fracao_id", id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/cobrancas.js");

// ------------------------------------------------------
// 3. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("cobrancas")) {
  serverContent = serverContent.replace(
    'app.use("/api/alertas", alertasRoutes);',
    `app.use("/api/alertas", alertasRoutes);
const cobrancasRoutes = require("./routes/cobrancas");
app.use("/api/cobrancas", cobrancasRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas de cobranças.");
}

// ------------------------------------------------------
// 4. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/Cobrancas.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Cobrancas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("cobrancas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Cobranças</h1>

      <ul>
        {lista.map((c) => (
          <li key={c.id}>
            {c.periodo} — {c.valor}€ — {c.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página Cobrancas.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  await criarTabela();

  console.log("\n🎉 Módulo 'Automação de Cobranças' criado com sucesso!");
  console.log("➡️ Backend + Supabase + Frontend totalmente integrados.\n");
})();
