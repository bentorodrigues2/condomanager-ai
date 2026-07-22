
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");
const requireGestor = require("../middleware/requireGestor");
const requireOwner = require("../middleware/requireOwner");

const { supabase } = require("../../src/supabase/supabaseNodeClient.cjs");

// LISTAR
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("assembleias")
    .select("*");

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// CRIAR (admin + gestor)
router.post("/", requireAuth, requireGestor, async (req, res) => {
  const { condominio_id, data, titulo, descricao } = req.body;

  const { data: inserted, error } = await supabase
    .from("assembleias")
    .insert([{ condominio_id, data, titulo, descricao }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// OBTER POR ID
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("assembleias")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// EDITAR (admin + gestor)
router.put("/:id", requireAuth, requireGestor, async (req, res) => {
  const { id } = req.params;
  const { data, titulo, descricao } = req.body;

  const { data: updated, error } = await supabase
    .from("assembleias")
    .update({ data, titulo, descricao })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(updated);
});

// APAGAR (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("assembleias")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ status: "apagado" });
});

// VOTAR (owner)
router.post("/:id/votar", requireAuth, requireOwner, async (req, res) => {
  const { id } = req.params;
  const { voto, proprietario_id } = req.body;

  const { data: inserted, error } = await supabase
    .from("votacoes")
    .insert([{ assembleia_id: id, voto, proprietario_id }])
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error });

  res.json(inserted);
});

// LISTAR VOTOS
router.get("/:id/votos", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("votacoes")
    .select("*")
    .eq("assembleia_id", id);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

module.exports = router;
