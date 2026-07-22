#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n🔧 A criar módulo V2: Operacional (Tickets, Reservas, Fornecedores, Documentos)...\n");

const { supabase } = require("./src/supabase/supabaseNodeClient.cjs");

// ------------------------------------------------------
// 1. Criar tabelas operacionais via RPC
// ------------------------------------------------------
async function criarTabelasOperacionais() {
  console.log("📌 A criar tabelas operacionais...");

  const sql = `
    -- Tabela: fornecedores
    create table if not exists fornecedores (
      id uuid default gen_random_uuid() primary key,
      nome text not null,
      contacto text,
      email text,
      telefone text,
      tipo text, -- eletricista, canalizador, limpeza, etc.
      ativo boolean default true,
      created_at timestamp default now()
    );

    -- Tabela: tickets_manutencao
    create table if not exists tickets_manutencao (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id),
      fracao_id uuid references fracoes(id),
      proprietario_id uuid references proprietarios(id),
      fornecedor_id uuid references fornecedores(id),
      titulo text not null,
      descricao text,
      estado text default 'novo', -- novo | em_curso | concluido | cancelado
      prioridade text default 'normal', -- baixa | normal | alta
      created_at timestamp default now()
    );

    -- Tabela: reservas_espacos
    create table if not exists reservas_espacos (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id),
      fracao_id uuid references fracoes(id),
      proprietario_id uuid references proprietarios(id),
      espaco text not null, -- sala, piscina, churrasqueira, etc.
      data date not null,
      hora_inicio time not null,
      hora_fim time not null,
      estado text default 'pendente', -- pendente | aprovado | rejeitado
      created_at timestamp default now()
    );

    -- Tabela: documentos_operacionais
    create table if not exists documentos_operacionais (
      id uuid default gen_random_uuid() primary key,
      condominio_id uuid references condominios(id),
      fornecedor_id uuid references fornecedores(id),
      tipo text not null, -- contrato, relatório, fatura, etc.
      nome text not null,
      url text,
      created_at timestamp default now()
    );
  `;

  const { error } = await supabase.rpc("execute_sql", { sql });
  if (error) {
    console.error("❌ Erro ao criar tabelas operacionais:", error);
    process.exit(1);
  }

  console.log("✅ Tabelas operacionais criadas.\n");
}

// ------------------------------------------------------
// 2. Rotas backend: fornecedores, tickets, reservas, documentos
// ------------------------------------------------------
const routesPathFornecedores = "backend/routes/fornecedores.js";
const routesContentFornecedores = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar fornecedores
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar fornecedor
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { nome, contacto, email, telefone, tipo } = req.body;

  const { data, error } = await supabase
    .from("fornecedores")
    .insert([{ nome, contacto, email, telefone, tipo }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathFornecedores, routesContentFornecedores);

const routesPathTickets = "backend/routes/tickets.js";
const routesContentTickets = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar tickets de manutenção
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("tickets_manutencao")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar ticket
router.post("/", requireAuth, async (req, res) => {
  const { condominio_id, fracao_id, proprietario_id, fornecedor_id, titulo, descricao, prioridade } = req.body;

  const { data, error } = await supabase
    .from("tickets_manutencao")
    .insert([{ condominio_id, fracao_id, proprietario_id, fornecedor_id, titulo, descricao, prioridade }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

// Atualizar estado
router.post("/estado/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const { data, error } = await supabase
    .from("tickets_manutencao")
    .update({ estado })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathTickets, routesContentTickets);

const routesPathReservas = "backend/routes/reservas.js";
const routesContentReservas = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar reservas
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("reservas_espacos")
    .select("*")
    .order("data", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar reserva
router.post("/", requireAuth, async (req, res) => {
  const { condominio_id, fracao_id, proprietario_id, espaco, data, hora_inicio, hora_fim } = req.body;

  const { data: resp, error } = await supabase
    .from("reservas_espacos")
    .insert([{ condominio_id, fracao_id, proprietario_id, espaco, data, hora_inicio, hora_fim }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(resp[0]);
});

// Atualizar estado
router.post("/estado/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const { data, error } = await supabase
    .from("reservas_espacos")
    .update({ estado })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathReservas, routesContentReservas);

const routesPathDocsOp = "backend/routes/documentosOperacionais.js";
const routesContentDocsOp = `
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar documentos operacionais
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("documentos_operacionais")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar documento operacional
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, fornecedor_id, tipo, nome, url } = req.body;

  const { data, error } = await supabase
    .from("documentos_operacionais")
    .insert([{ condominio_id, fornecedor_id, tipo, nome, url }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
`;

fs.writeFileSync(routesPathDocsOp, routesContentDocsOp);

console.log("📌 Rotas backend operacionais criadas.");

// ------------------------------------------------------
// 3. Atualizar server.js com novas rotas
// ------------------------------------------------------
const serverPath = "backend/server.js";
let serverContent = fs.readFileSync(serverPath, "utf8");

if (!serverContent.includes("fornecedoresRoutes")) {
  serverContent = serverContent.replace(
    'app.use("/api/proprietario/painel", painelProprietarioRoutes);',
    `app.use("/api/proprietario/painel", painelProprietarioRoutes);
const fornecedoresRoutes = require("./routes/fornecedores");
app.use("/api/fornecedores", fornecedoresRoutes);
const ticketsRoutes = require("./routes/tickets");
app.use("/api/tickets", ticketsRoutes);
const reservasRoutes = require("./routes/reservas");
app.use("/api/reservas", reservasRoutes);
const documentosOperacionaisRoutes = require("./routes/documentosOperacionais");
app.use("/api/documentos-operacionais", documentosOperacionaisRoutes);`
  );

  fs.writeFileSync(serverPath, serverContent);
  console.log("📌 server.js atualizado com rotas operacionais.");
}

// ------------------------------------------------------
// 4. Páginas frontend básicas
// ------------------------------------------------------
const pageFornecedores = "frontend/src/pages/Fornecedores.jsx";
const contentFornecedores = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Fornecedores() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("fornecedores")
      .select("*")
      .order("nome", { ascending: true })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Fornecedores</h1>
      <ul>
        {lista.map((f) => (
          <li key={f.id}>
            {f.nome} — {f.tipo} — {f.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageFornecedores, contentFornecedores);

const pageTickets = "frontend/src/pages/Tickets.jsx";
const contentTickets = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Tickets() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("tickets_manutencao")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Tickets de Manutenção</h1>
      <ul>
        {lista.map((t) => (
          <li key={t.id}>
            {t.titulo} — {t.estado} — {t.prioridade}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageTickets, contentTickets);

const pageReservas = "frontend/src/pages/Reservas.jsx";
const contentReservas = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Reservas() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("reservas_espacos")
      .select("*")
      .order("data", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Reservas de Espaços</h1>
      <ul>
        {lista.map((r) => (
          <li key={r.id}>
            {r.espaco} — {r.data} — {r.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageReservas, contentReservas);

const pageDocsOp = "frontend/src/pages/DocumentosOperacionais.jsx";
const contentDocsOp = `
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function DocumentosOperacionais() {
  const { supabase } = useAuth();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    supabase
      .from("documentos_operacionais")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista(data || []));
  }, []);

  return (
    <div>
      <h1>Documentos Operacionais</h1>
      <ul>
        {lista.map((d) => (
          <li key={d.id}>
            {d.tipo} — {d.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

fs.writeFileSync(pageDocsOp, contentDocsOp);

console.log("📌 Páginas frontend operacionais criadas.");

// ------------------------------------------------------
// 5. Finalização
// ------------------------------------------------------
(async () => {
  await criarTabelasOperacionais();

  console.log("\n🎉 Módulo V2 Operacional criado com sucesso!");
  console.log("➡️ Tickets, Reservas, Fornecedores, Documentos operacionais ativos.\n");
})();
