
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// Dashboard do condomínio
router.get("/condominio/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_condominio")
    .select("*")
    .eq("condominio_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Dashboard da fração
router.get("/fracao/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_fracao")
    .select("*")
    .eq("fracao_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Dashboard do proprietário
router.get("/proprietario/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vw_financas_proprietario")
    .select("*")
    .eq("proprietario_id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });
  res.json(data);
});

module.exports = router;
