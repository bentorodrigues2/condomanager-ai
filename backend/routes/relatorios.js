
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Gerar relatório financeiro do condomínio
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

  doc.fontSize(22).text("Relatório Financeiro do Condomínio", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Condomínio: ${fin.nome}`);
  doc.text(`Total Despesas: ${fin.total_despesas}€`);
  doc.text(`Total Pagamentos: ${fin.total_pagamentos}€`);
  doc.text(`Saldo: ${fin.saldo}€`);

  doc.end();
  doc.pipe(res);
});

// Relatório da fração
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

  doc.fontSize(22).text("Relatório Financeiro da Fração", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Fração: ${fin.identificador}`);
  doc.text(`Total Pago: ${fin.total_pago}€`);
  doc.text(`Total Devido: ${fin.total_devido}€`);
  doc.text(`Saldo: ${fin.saldo}€`);

  doc.end();
  doc.pipe(res);
});

// Relatório do proprietário
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

  doc.fontSize(22).text("Relatório Financeiro do Proprietário", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Proprietário: ${fin.nome}`);
  doc.text(`Total Pago: ${fin.total_pago}€`);
  doc.text(`Total Devido: ${fin.total_devido}€`);
  doc.text(`Saldo: ${fin.saldo}€`);

  doc.end();
  doc.pipe(res);
});

module.exports = router;
