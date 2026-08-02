
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../supabase/supabaseNodeClient.cjs");

// Gerar relatÃ³rio financeiro do condomÃ­nio
router.get("/condominio/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: fin, error } = await supabase
    .from("vw_financas_condominio")
    .select("*")
    .eq("condominio_id", id)
    .maybeSingle();

  if (error || !fin) return res.status(500).json({ error });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(22).text("RelatÃ³rio Financeiro do CondomÃ­nio", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`CondomÃ­nio: ${fin.nome}`);
  doc.text(`Total Despesas: ${fin.total_despesas}â‚¬`);
  doc.text(`Total Pagamentos: ${fin.total_pagamentos}â‚¬`);
  doc.text(`Saldo: ${fin.saldo}â‚¬`);

  doc.end();
  doc.pipe(res);
});

// RelatÃ³rio da fraÃ§Ã£o
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: fin, error } = await supabase
    .from("vw_financas_fracao")
    .select("*")
    .eq("fracao_id", id)
    .maybeSingle();

  if (error || !fin) return res.status(500).json({ error });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(22).text("RelatÃ³rio Financeiro da FraÃ§Ã£o", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`FraÃ§Ã£o: ${fin.identificador}`);
  doc.text(`Total Pago: ${fin.total_pago}â‚¬`);
  doc.text(`Total Devido: ${fin.total_devido}â‚¬`);
  doc.text(`Saldo: ${fin.saldo}â‚¬`);

  doc.end();
  doc.pipe(res);
});

// RelatÃ³rio do proprietÃ¡rio
router.get("/proprietario/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: fin, error } = await supabase
    .from("vw_financas_proprietario")
    .select("*")
    .eq("proprietario_id", id)
    .maybeSingle();

  if (error || !fin) return res.status(500).json({ error });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(22).text("RelatÃ³rio Financeiro do ProprietÃ¡rio", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`ProprietÃ¡rio: ${fin.nome}`);
  doc.text(`Total Pago: ${fin.total_pago}â‚¬`);
  doc.text(`Total Devido: ${fin.total_devido}â‚¬`);
  doc.text(`Saldo: ${fin.saldo}â‚¬`);

  doc.end();
  doc.pipe(res);
});

module.exports = router;

