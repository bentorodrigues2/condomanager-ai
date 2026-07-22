
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
