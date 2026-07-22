
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Listar reservas
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("reservas_espacos")
    .select("*")
    .order("data", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar reserva
router.post("/", requireAuth, async (req, res) => {
  const { condominio_id, fracao_id, proprietario_id, espaco, data, hora_inicio, hora_fim } = req.body;

  const { data: resp, error } = await supabase
    .from("reservas_espacos")
    .insert([{ condominio_id, fracao_id, proprietario_id, espaco, data, hora_inicio, hora_fim }])
    .select();

  if (error) return res.status(500).json({ error });
  res.json(resp[0]);
});

// Atualizar estado
router.post("/estado/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const { data, error } = await supabase
    .from("reservas_espacos")
    .update({ estado })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

module.exports = router;
