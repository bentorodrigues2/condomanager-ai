
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Obter notificações do utilizador
router.get("/", requireAuth, async (req, res) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Marcar como lida
router.post("/ler/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Criar notificação (usado internamente)
router.post("/criar", requireAuth, async (req, res) => {
  const { user_id, tipo, titulo, mensagem } = req.body;

  const { data, error } = await supabase
    .from("notificacoes")
    .insert([{ user_id, tipo, titulo, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
