
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
