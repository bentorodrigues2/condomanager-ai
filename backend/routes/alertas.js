
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Obter alertas do utilizador
router.get("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("alertas")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Criar alerta manual (gestor)
router.post("/criar", requireAuth, async (req, res) => {
  const { user_id, tipo, titulo, mensagem } = req.body;

  const { data, error } = await supabase
    .from("alertas")
    .insert([{ user_id, tipo, titulo, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
