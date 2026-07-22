
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Registar evento de reconciliação
router.post("/evento", requireAuth, requireGestor, async (req, res) => {
  const { transacao_id, metodo, valor, estado, detalhes } = req.body;

  const { data, error } = await supabase
    .from("reconciliacao_financeira")
    .insert([{ transacao_id, metodo, valor, estado, detalhes }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Listar reconciliações
router.get("/", requireAuth, requireGestor, async (req, res) => {
  const { data, error } = await supabase
    .from("reconciliacao_financeira")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
