
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

  doc.fontSize(14).text(`Período: ${c.periodo}`);
  doc.text(`Valor: ${c.valor}€`);
  doc.text(`Estado: ${c.estado}`);

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
