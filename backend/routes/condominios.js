
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");
const requireOwner = require("../middleware/requireOwner");
const requireViewer = require("../middleware/requireViewer");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("condominios")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { nome, morada } = req.body;

  const { data, error } = await supabase
    .from("condominios")
    .insert([{ nome, morada }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("condominios")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { nome, morada } = req.body;

  const { data, error } = await supabase
    .from("condominios")
    .update({ nome, morada })
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
    .from("condominios")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

module.exports = router;
