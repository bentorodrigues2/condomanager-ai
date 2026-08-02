
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireGestor = require("../middleware/requireGestor");
const { supabase } = require("../supabase/supabaseNodeClient.cjs");

// Gerar quotas para todas as fraÃ§Ãµes de um condomÃ­nio
router.post("/gerar/:condominio_id", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id } = req.params;
  const { periodo, valor } = req.body;

  // Obter fraÃ§Ãµes do condomÃ­nio
  const { data: fracoes, error: errF } = await supabase
    .from("fracoes")
    .select("id")
    .eq("condominio_id", condominio_id);

  if (errF) return res.status(500).json({ error: errF });

  const quotas = fracoes.map(f => ({
    fracao_id: f.id,
    condominio_id,
    periodo,
    valor,
    estado: "pendente"
  }));

  const { data, error } = await supabase
    .from("quotas")
    .insert(quotas)
    .select();

  if (error) return res.status(500).json({ error });

  res.json({ status: "quotas_geradas", data });
});

// Obter quotas de uma fraÃ§Ã£o
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("quotas")
    .select("*")
    .eq("fracao_id", id)
    .order("periodo", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;

