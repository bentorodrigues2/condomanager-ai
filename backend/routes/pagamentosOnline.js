
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

  doc.fontSize(14).text(`Método: ${pagamento.metodo}`);
  doc.text(`Valor: ${pagamento.valor}€`);
  doc.text(`Estado: ${pagamento.estado}`);
  doc.text(`Transação: ${pagamento.transacao_id}`);

  doc.end();
  doc.pipe(res);
});

module.exports = router;
