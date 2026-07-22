
const express = require("express");
const router = express.Router();
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");
const requireAuth = require("../middleware/requireAuth");

// Criar conversa
router.post("/conversa", requireAuth, async (req, res) => {
  const { nome, tipo, participantes } = req.body;

  const { data: conversa, error } = await supabase
    .from("chat_conversas")
    .insert([{ nome, tipo }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  for (const user_id of participantes) {
    await supabase
      .from("chat_participantes")
      .insert([{ conversa_id: conversa.id, user_id }]);
  }

  res.json(conversa);
});

// Enviar mensagem
router.post("/mensagem", requireAuth, async (req, res) => {
  const { conversa_id, mensagem } = req.body;
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("chat_mensagens")
    .insert([{ conversa_id, user_id, mensagem }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// Listar mensagens
router.get("/mensagens/:conversa_id", requireAuth, async (req, res) => {
  const { conversa_id } = req.params;

  const { data, error } = await supabase
    .from("chat_mensagens")
    .select("*")
    .eq("conversa_id", conversa_id)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Anexar ficheiro
router.post("/anexo", requireAuth, async (req, res) => {
  const { mensagem_id, url, tipo } = req.body;

  const { data, error } = await supabase
    .from("chat_anexos")
    .insert([{ mensagem_id, url, tipo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

// IA: resumo da conversa
router.post("/resumo", requireAuth, async (req, res) => {
  const { conversa_id } = req.body;

  const { data: mensagens } = await supabase
    .from("chat_mensagens")
    .select("mensagem")
    .eq("conversa_id", conversa_id);

  const texto = mensagens.map(m => m.mensagem).join(" ");

  const resumo = texto.slice(0, 200) + "...";

  const { data, error } = await supabase
    .from("ia_resumos_conversas")
    .insert([{ chat_id: conversa_id, resumo }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data[0]);
});

module.exports = router;
