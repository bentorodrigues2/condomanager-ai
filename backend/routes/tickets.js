
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar tickets de manutenção
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("tickets_manutencao")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar ticket
router.post("/", requireAuth, async (req, res) => {
  const { condominio_id, fracao_id, proprietario_id, fornecedor_id, titulo, descricao, prioridade } = req.body;

  const { data, error } = await supabase
    .from("tickets_manutencao")
    .insert([{ condominio_id, fracao_id, proprietario_id, fornecedor_id, titulo, descricao, prioridade }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

// Atualizar estado
router.post("/estado/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const { data, error } = await supabase
    .from("tickets_manutencao")
    .update({ estado })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
