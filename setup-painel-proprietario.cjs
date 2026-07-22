#!/usr/bin/env node

const fs = require("fs");

console.log("\n🔧 A criar módulo REAL: Painel do Proprietário...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar rota backend agregada
// ------------------------------------------------------
const routesPath = "backend/routes/painelProprietario.js";
const routesContent = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Painel completo do proprietário
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  // Dados do proprietário
  const { data: proprietario, error: errP } = await supabase
    .from("proprietarios")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (errP || !proprietario) return res.status(500).json({ error: errP });

  // Frações do proprietário
  const { data: fracoes, error: errF } = await supabase
    .from("fracoes")
    .select("*")
    .eq("proprietario_id", id);

  if (errF) return res.status(500).json({ error: errF });

  const fracaoIds = fracoes.map(f => f.id);

  // Quotas
  const { data: quotas } = await supabase
    .from("quotas")
    .select("*")
    .in("fracao_id", fracaoIds);

  // Cobranças
  const { data: cobrancas } = await supabase
    .from("cobrancas")
    .select("*")
    .in("fracao_id", fracaoIds);

  // Pagamentos
  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("*")
    .in("fracao_id", fracaoIds);

  // Documentos
  const { data: documentos } = await supabase
    .from("documentos")
    .select("*")
    .eq("proprietario_id", id);

  // Assembleias
  const { data: assembleias } = await supabase
    .from("assembleias")
    .select("*");

  // Notificações
  const { data: notificacoes } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("user_id", proprietario.user_id);

  // Alertas
  const { data: alertas } = await supabase
    .from("alertas")
    .select("*")
    .eq("user_id", proprietario.user_id);

  res.json({
    proprietario,
    fracoes,
    quotas,
    cobrancas,
    pagamentos,
    documentos,
    assembleias,
    notificacoes,
    alertas
  });
});

module.exports = router;
`;

fs.writeFileSync(routesPath, routesContent);
console.log("📌 Rotas backend criadas: backend/routes/painelProprietario.js");

// ------------------------------------------------------
// 2. Ligar rotas ao server.js
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("painelProprietario")) {
  serverContent = serverContent.replace(
    'app.use("/api/cobrancas", cobrancasRoutes);',
    `app.use("/api/cobrancas", cobrancasRoutes);
const painelProprietarioRoutes = require("./routes/painelProprietario");
app.use("/api/proprietario/painel", painelProprietarioRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com painel do proprietário.");
}

// ------------------------------------------------------
// 3. Criar página frontend
// ------------------------------------------------------
const pagePath = "frontend/src/pages/PainelProprietario.jsx";
const pageContent = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function PainelProprietario() {
  const { supabase, user } = useAuth();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("proprietarios")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        const resp = await fetch("/api/proprietario/painel/" + data.id);
        const json = await resp.json();
        setDados(json);
      });
  }, [user]);

  if (!dados) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Painel do Proprietário</h1>

      <h2>As suas Frações</h2>
      <ul>
        {dados.fracoes.map(f => (
          <li key={f.id}>{f.codigo}</li>
        ))}
      </ul>

      <h2>Quotas</h2>
      <ul>
        {dados.quotas.map(q => (
          <li key={q.id}>{q.periodo} — {q.valor}€ — {q.estado}</li>
        ))}
      </ul>

      <h2>Cobranças</h2>
      <ul>
        {dados.cobrancas.map(c => (
          <li key={c.id}>{c.periodo} — {c.valor}€ — {c.estado}</li>
        ))}
      </ul>

      <h2>Pagamentos</h2>
      <ul>
        {dados.pagamentos.map(p => (
          <li key={p.id}>{p.data} — {p.valor}€</li>
        ))}
      </ul>

      <h2>Documentos</h2>
      <ul>
        {dados.documentos.map(d => (
          <li key={d.id}>{d.nome}</li>
        ))}
      </ul>

      <h2>Notificações</h2>
      <ul>
        {dados.notificacoes.map(n => (
          <li key={n.id}>{n.titulo} — {n.mensagem}</li>
        ))}
      </ul>

      <h2>Alertas</h2>
      <ul>
        {dados.alertas.map(a => (
          <li key={a.id}>{a.titulo} — {a.mensagem}</li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pagePath, pageContent);
console.log("📌 Página PainelProprietario.jsx criada.");

// ------------------------------------------------------
// Finalização
// ------------------------------------------------------
(async () => {
  console.log("\n🎉 Módulo 'Painel do Proprietário' criado com sucesso!");
  console.log("➡️ Sistema CondoManager AI v1.0 COMPLETO.\n");
})();
