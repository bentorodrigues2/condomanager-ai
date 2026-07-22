
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
