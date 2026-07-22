
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("fracoes")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, identificador, area, permilagem, proprietario_id } = req.body;

  const { data, error } = await supabase
    .from("fracoes")
    .insert([{ condominio_id, identificador, area, permilagem, proprietario_id }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("fracoes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { identificador, area, permilagem, proprietario_id } = req.body;

  const { data, error } = await supabase
    .from("fracoes")
    .update({ identificador, area, permilagem, proprietario_id })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// APAGAR (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("fracoes")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
